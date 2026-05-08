import React from 'react';

interface ProgressBarProps {
  currentFile: string;
  processedCount: number;
  totalCount: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentFile, processedCount, totalCount }) => {
  const percentage = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">処理中: {processedCount} / {totalCount}</span>
        <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 truncate" title={currentFile}>
        {currentFile}
      </p>
    </div>
  );
};

export default ProgressBar;
