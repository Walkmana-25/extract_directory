import React from 'react';
import { Archive } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-center mb-4 text-blue-600">
        <Archive size={48} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ZIPファイル階層フラット化ツール</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        アップロードしたZIPファイルのディレクトリ構造をすべてフラットにします。
        ブラウザ上ですべての処理を行うため、サーバーにファイルが送信されることはありません。
      </p>
    </header>
  );
};

export default Header;
