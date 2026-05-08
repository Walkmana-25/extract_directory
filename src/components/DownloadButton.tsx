import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <div className="flex justify-center mt-8 pb-12">
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          flex items-center px-8 py-4 rounded-lg text-white font-bold text-lg transition-all
          ${
            disabled || isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            処理中...
          </>
        ) : (
          <>
            <Download className="mr-2" />
            ZIPを生成してダウンロード
          </>
        )}
      </button>
    </div>
  );
};

export default DownloadButton;
