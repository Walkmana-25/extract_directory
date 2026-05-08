import React from 'react';
import type { FileItem } from '../utils/zipUtils';

interface PreviewTableProps {
  items: FileItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase sticky top-0">
            <tr>
              <th className="px-6 py-3 border-b">元のファイルパス</th>
              <th className="px-6 py-3 border-b">変換後のファイル名</th>
              <th className="px-6 py-3 border-b">状態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className={item.isSkipped ? 'bg-gray-50 text-gray-400' : 'text-gray-700'}>
                <td className="px-6 py-4 truncate max-w-xs" title={item.originalPath}>
                  {item.originalPath}
                </td>
                <td className="px-6 py-4 truncate max-w-xs" title={item.newPath}>
                  {item.isSkipped ? '-' : item.newPath}
                </td>
                <td className="px-6 py-4">
                  {item.isSkipped ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      除外 ({item.skipReason})
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      変換対象
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        合計: {items.length} 件 (変換対象: {items.filter((i) => !i.isSkipped).length} 件, 除外: {items.filter((i) => i.isSkipped).length} 件)
      </div>
    </div>
  );
};

export default PreviewTable;
