import React from 'react';
import type { FileItem } from '../utils/zipUtils';

interface PreviewTableProps {
  items: FileItem[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-gray-50 text-gray-700 uppercase sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 border-b w-1/2">元のファイルパス</th>
              <th className="px-6 py-3 border-b w-1/3">変換後のファイル名</th>
              <th className="px-6 py-3 border-b w-1/6">状態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className={item.isSkipped ? 'bg-gray-50 text-gray-400' : 'text-gray-700 hover:bg-gray-50'}>
                <td className="px-6 py-4 truncate" title={item.originalPath.normalize('NFC')}>
                  {item.originalPath.normalize('NFC')}
                </td>
                <td className="px-6 py-4 truncate" title={item.newPath}>
                  {item.isSkipped ? '-' : item.newPath}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.isSkipped ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600" title={item.skipReason}>
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
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex justify-between items-center">
        <span>
          合計: {items.length} 件 (変換対象: {items.filter((i) => !i.isSkipped).length} 件, 除外: {items.filter((i) => i.isSkipped).length} 件)
        </span>
      </div>
    </div>
  );
};

export default PreviewTable;
