import { useState } from 'react';
import { ImageInput } from '../../entities/image';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';

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
    <Modal isOpen={isOpen} onClose={handleClose} title="画像を追加">
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
          <Button onClick={handleClose} disabled={uploading} variant="secondary">
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploading || !dataUrl}
            variant="primary"
          >
            {uploading ? 'アップロード中...' : '追加'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
