import { useState } from 'react';
import ImageInput from './ImageInput';

export interface CharacterImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dataUrl: string, isPrimary: boolean) => void;
  hasExistingImages: boolean;
  uploading?: boolean;
}

/**
 * キャラクター画像アップロードモーダル（プレゼンテーショナル）
 */
export function CharacterImageUploadModal({
  isOpen,
  onClose,
  onSubmit,
  hasExistingImages,
  uploading = false,
}: CharacterImageUploadModalProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!dataUrl) {
      alert('画像を選択してください');
      return;
    }

    onSubmit(dataUrl, isPrimary);
    setDataUrl('');
    setIsPrimary(false);
  };

  const handleClose = () => {
    if (!uploading) {
      setDataUrl('');
      setIsPrimary(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">画像を追加</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <ImageInput viewDataUrl={false} onChangeDataUrl={setDataUrl} />

          {hasExistingImages && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded"
                disabled={uploading}
              />
              <label htmlFor="isPrimary" className="text-sm">
                この画像をメイン画像に設定
              </label>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || !dataUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploading ? 'アップロード中...' : '追加'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
