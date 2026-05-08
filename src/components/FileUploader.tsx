import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFileName }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
          onFileSelect(file);
        } else {
          alert('ZIPファイルを選択してください。');
        }
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-500 transition-colors bg-gray-50 mb-6 cursor-pointer relative"
    >
      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center">
        {selectedFileName ? (
          <>
            <FileText size={48} className="text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-900">{selectedFileName}</p>
            <p className="text-sm text-gray-500 mt-2">クリックまたはドラッグ＆ドロップで変更</p>
          </>
        ) : (
          <>
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900">
              ZIPファイルをドラッグ＆ドロップ
            </p>
            <p className="text-sm text-gray-500 mt-2">または、クリックしてファイルを選択</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
