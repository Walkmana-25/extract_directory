import JSZip from 'jszip';

export interface ProcessingOptions {
  delimiter: string;
  includeHidden: boolean;
  includeMacSystem: boolean;
}

export interface FileItem {
  originalPath: string;
  newPath: string;
  isSkipped: boolean;
  skipReason?: string;
}

export const processZipFiles = async (
  zipFile: File,
  options: ProcessingOptions
): Promise<FileItem[]> => {
  const zip = await JSZip.loadAsync(zipFile);
  const items: FileItem[] = [];
  const usedNames = new Set<string>();

  // Extract all files (ignore directories which end with /)
  const entries = Object.entries(zip.files).filter(([_, entry]) => !entry.dir);

  for (const [path] of entries) {
    let isSkipped = false;
    let skipReason = '';

    // Check for macOS system files
    if (!options.includeMacSystem) {
      if (path.startsWith('__MACOSX/') || path.includes('.DS_Store')) {
        isSkipped = true;
        skipReason = 'macOS System File';
      }
    }

    // Check for hidden files
    if (!isSkipped && !options.includeHidden) {
      const fileName = path.split('/').pop() || '';
      if (fileName.startsWith('.')) {
        isSkipped = true;
        skipReason = 'Hidden File';
      }
    }

    let newPath = '';
    if (!isSkipped) {
      // Flatten path: A/B/C.jpg -> A-B-C.jpg
      const parts = path.split('/');
      newPath = parts.join(options.delimiter);

      // Handle collisions
      let finalPath = newPath;
      let counter = 1;
      const dotIndex = newPath.lastIndexOf('.');
      const name = dotIndex !== -1 ? newPath.substring(0, dotIndex) : newPath;
      const ext = dotIndex !== -1 ? newPath.substring(dotIndex) : '';

      while (usedNames.has(finalPath)) {
        finalPath = `${name} (${counter})${ext}`;
        counter++;
      }
      newPath = finalPath;
      usedNames.add(newPath);
    }

    items.push({
      originalPath: path,
      newPath,
      isSkipped,
      skipReason,
    });
  }

  return items;
};

export const generateFlattenedZip = async (
  originalZipFile: File,
  processedItems: FileItem[]
): Promise<Blob> => {
  const originalZip = await JSZip.loadAsync(originalZipFile);
  const newZip = new JSZip();

  for (const item of processedItems) {
    if (item.isSkipped) continue;

    const fileData = await originalZip.file(item.originalPath)?.async('blob');
    if (fileData) {
      newZip.file(item.newPath, fileData);
    }
  }

  return await newZip.generateAsync({ type: 'blob' });
};
