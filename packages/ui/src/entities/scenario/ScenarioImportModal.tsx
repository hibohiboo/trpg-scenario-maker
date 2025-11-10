import { useCallback, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { Button } from '../../shared/button';

export interface ScenarioImportModalProps {
  /** インポート処理中かどうか */
  isImporting?: boolean;
  /** ファイル選択時のコールバック */
  onImport: (file: File) => Promise<void>;
  /** キャンセル時のコールバック */
  onCancel: () => void;
}

/**
 * シナリオインポートモーダルコンポーネント
 */
export function ScenarioImportModal({
  isImporting = false,
  onImport,
  onCancel,
}: ScenarioImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.name.endsWith('.zip')) {
        setSelectedFile(file);
      }
    },
    [],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (selectedFile) {
      await onImport(selectedFile);
    }
  }, [selectedFile, onImport]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="import-modal-title" className="text-xl font-bold">
            シナリオをインポート
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-sm text-gray-600 mb-2">
              ZIPファイルをドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-600 mb-4">または</p>
            <label htmlFor="file-input">
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                ファイルを選択
              </Button>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-700">
              <p className="font-semibold">選択されたファイル:</p>
              <p className="truncate">{selectedFile.name}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isImporting}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? 'インポート中...' : 'インポート'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
