import { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import Header from './components/Header';
import Settings from './components/Settings';
import FileUploader from './components/FileUploader';
import PreviewTable from './components/PreviewTable';
import DownloadButton from './components/DownloadButton';
import {
  type ProcessingOptions,
  type FileItem,
  processZipFiles,
  generateFlattenedZip,
} from './utils/zipUtils';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({
    delimiter: '-',
    includeHidden: false,
    includeMacSystem: false,
  });
  const [previewItems, setPreviewItems] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const updatePreview = useCallback(async () => {
    if (!file) return;
    try {
      const items = await processZipFiles(file, options);
      setPreviewItems(items);
    } catch (error) {
      console.error('Failed to process zip file:', error);
      alert('ZIPファイルの解析に失敗しました。');
      setFile(null);
      setPreviewItems([]);
    }
  }, [file, options]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleDownload = async () => {
    if (!file || previewItems.length === 0) return;

    setIsProcessing(true);
    try {
      const blob = await generateFlattenedZip(file, previewItems);
      saveAs(blob, 'flattened.zip');
    } catch (error) {
      console.error('Failed to generate zip:', error);
      alert('ZIPファイルの生成に失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />

        <Settings options={options} onChange={setOptions} />

        <FileUploader onFileSelect={setFile} selectedFileName={file?.name} />

        {previewItems.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4 ml-1">プレビュー (Dry-run)</h2>
            <PreviewTable items={previewItems} />
            <DownloadButton
              onClick={handleDownload}
              disabled={previewItems.filter(i => !i.isSkipped).length === 0}
              isLoading={isProcessing}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
