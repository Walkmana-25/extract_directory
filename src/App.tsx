import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Settings from './components/Settings';
import FileUploader from './components/FileUploader';
import PreviewTable from './components/PreviewTable';
import DownloadButton from './components/DownloadButton';
import ProgressBar from './components/ProgressBar';
import {
  type ProcessingOptions,
  type FileItem,
  processZipFiles,
} from './utils/zipUtils';
import type { WorkerMessage, WorkerProgressMessage, WorkerDoneMessage, WorkerErrorMessage } from './workers/zip.worker';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({
    delimiter: '-',
    includeHidden: false,
    includeMacSystem: false,
  });
  const [previewItems, setPreviewItems] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{
    currentFile: string;
    processedCount: number;
    totalCount: number;
  } | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const runUpdate = async () => {
      if (!file) {
        if (!isCancelled) {
          setPreviewItems([]);
        }
        return;
      }

      try {
        const items = await processZipFiles(file, options);
        if (!isCancelled) {
          setPreviewItems(items);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to process zip file:', error);
          alert('ZIPファイルの解析に失敗しました。');
          setFile(null);
          setPreviewItems([]);
        }
      }
    };

    void runUpdate();

    return () => {
      isCancelled = true;
    };
  }, [file, options]);

  const handleDownload = async () => {
    if (!file || previewItems.length === 0) return;

    try {
      // @ts-expect-error - File System Access API might not be in the types yet
      const handle = await window.showSaveFilePicker({
        suggestedName: 'flattened.zip',
        types: [{
          description: 'ZIP archive',
          accept: { 'application/zip': ['.zip'] },
        }],
      });

      const writableStream = await handle.createWritable();
      setIsProcessing(true);
      setProgress({ currentFile: '準備中...', processedCount: 0, totalCount: previewItems.filter(i => !i.isSkipped).length });

      // Create worker
      const worker = new Worker(new URL('./workers/zip.worker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent<WorkerProgressMessage | WorkerDoneMessage | WorkerErrorMessage>) => {
        const data = event.data;
        if (data.type === 'PROGRESS') {
          setProgress({
            currentFile: data.currentFile,
            processedCount: data.processedCount,
            totalCount: data.totalCount,
          });
        } else if (data.type === 'DONE') {
          setIsProcessing(false);
          setProgress(null);
          worker.terminate();
          workerRef.current = null;
          alert('ZIPファイルの生成が完了しました。');
        } else if (data.type === 'ERROR') {
          setIsProcessing(false);
          setProgress(null);
          worker.terminate();
          workerRef.current = null;
          alert(`エラーが発生しました: ${data.error}`);
        }
      };

      const message: WorkerMessage = {
        type: 'START',
        file,
        processedItems: previewItems,
        writableStream,
      };

      // Transfer the writableStream to the worker
      worker.postMessage(message, [writableStream]);

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Failed to generate zip:', error);
      alert('ZIPファイルの生成に失敗しました。');
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />

        <Settings options={options} onChange={setOptions} />

        <FileUploader onFileSelect={setFile} selectedFileName={file?.name} />

        {isProcessing && progress && (
          <ProgressBar
            currentFile={progress.currentFile}
            processedCount={progress.processedCount}
            totalCount={progress.totalCount}
          />
        )}

        {previewItems.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4 ml-1">プレビュー (Dry-run)</h2>
            <PreviewTable items={previewItems} />
            <DownloadButton
              onClick={handleDownload}
              disabled={isProcessing || previewItems.filter(i => !i.isSkipped).length === 0}
              isLoading={isProcessing}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
