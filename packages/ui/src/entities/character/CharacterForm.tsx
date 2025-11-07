import { Button } from '../../shared/button';

export interface CharacterFormProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 名前 */
  name: string;
  /** 説明 */
  description: string;
  /** 送信中かどうか */
  isSubmitting?: boolean;
  /** モーダルを閉じる */
  onClose: () => void;
  /** 名前変更 */
  onNameChange: (name: string) => void;
  /** 説明変更 */
  onDescriptionChange: (description: string) => void;
  /** フォーム送信 */
  onSubmit: () => void;
}

/**
 * キャラクター作成モーダルコンポーネント
 */
export function CharacterForm({
  isOpen,
  name,
  description,
  isSubmitting,
  onClose,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}: CharacterFormProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-create-modal-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <h2
          id="character-create-modal-title"
          className="text-xl font-bold mb-4"
        >
          キャラクターを作成
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="character-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名前
            </label>
            <input
              id="character-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="名前を入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="character-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              説明
            </label>
            <textarea
              id="character-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="説明を入力"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || !name}
              variant="primary"
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
