# ZIP Flattener

ZIP Flattener is a browser-based utility that flattens the directory structure of a ZIP file. It converts nested directory paths into single filenames using a customizable delimiter (e.g., `folder/subfolder/file.txt` becomes `folder-subfolder-file.txt`), making it easier to manage files from deeply nested archives.

## Features

- **Entirely Client-Side**: All processing happens in your browser. Your files are never uploaded to a server, ensuring privacy and speed.
- **Customizable Delimiter**: Choose the character used to join directory names (default is `-`).
- **Encoding Support**: Support for different filename encodings, including Shift-JIS for Japanese filenames.
- **Smart Filtering**: Optionally exclude macOS system files (like `__MACOSX` or `.DS_Store`) and hidden files.
- **Live Preview**: See a dry-run of how files will be renamed before you download the processed ZIP.
- **Modern Web APIs**: Uses the File System Access API for efficient saving where supported, with a fallback for other browsers.
- **Large File Support**: Designed to handle large archives efficiently using web workers and streaming.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **ZIP Manipulation**: [@zip.js/zip.js](https://gildas-lormeau.github.io/zip.js/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zip-flattener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
