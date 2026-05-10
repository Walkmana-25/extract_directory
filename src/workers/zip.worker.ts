import { ZipReader, ZipWriter, BlobReader, BlobWriter, configure } from '@zip.js/zip.js';

configure({ useWebWorkers: false, useCompressionStream: false });

export interface WorkerMessage {
  type: 'START';
  file: File;
  processedItems: { originalPath: string; newPath: string; isSkipped: boolean }[];
  writableStream: WritableStream;
  filenameEncoding?: string;
}

export interface WorkerProgressMessage {
  type: 'PROGRESS';
  currentFile: string;
  processedCount: number;
  totalCount: number;
}

export interface WorkerDoneMessage {
  type: 'DONE';
}

export interface WorkerErrorMessage {
  type: 'ERROR';
  error: string;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, file, processedItems, writableStream } = event.data;

  if (type === 'START') {
    const { filenameEncoding } = event.data;
    let zipReader: ZipReader<Blob> | undefined;
    let zipWriter: ZipWriter<WritableStream> | undefined;
    try {
      zipReader = new ZipReader(new BlobReader(file), { filenameEncoding });
      const entries = await zipReader.getEntries();

      // Create a map for faster entry lookup
      const entryMap = new Map(entries.map(e => [e.filename, e]));

      zipWriter = new ZipWriter(writableStream, {
        useCompressionStream: false,
        useWebWorkers: false,
        bufferedWrite: true,
      });

      const totalCount = processedItems.filter((i) => !i.isSkipped).length;
      let processedCount = 0;

      for (const item of processedItems) {
        if (item.isSkipped) continue;

        const entry = entryMap.get(item.originalPath);
        if (entry && !entry.directory) {
          self.postMessage({
            type: 'PROGRESS',
            currentFile: item.newPath,
            processedCount,
            totalCount,
          } as WorkerProgressMessage);

          // Use DataDescriptor: false to avoid using some stream features that might trigger pipeThrough
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const blob = await (entry as any).getData(new BlobWriter());
          await zipWriter.add(item.newPath, new BlobReader(blob));
          processedCount++;
        }
      }

      await zipWriter.close();
      await zipReader.close();

      self.postMessage({ type: 'DONE' } as WorkerDoneMessage);
    } catch (error) {
      if (zipWriter) {
        try { await zipWriter.close(); } catch { /* ignore */ }
      }
      if (zipReader) {
        try { await zipReader.close(); } catch { /* ignore */ }
      }
      self.postMessage({
        type: 'ERROR',
        error: error instanceof Error ? error.message : String(error),
      } as WorkerErrorMessage);
    }
  }
};
