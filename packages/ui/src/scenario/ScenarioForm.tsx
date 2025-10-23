import type { ScenarioFormData } from './types';

export interface ScenarioFormProps {
  /** タイトルの値 */
  title: string;
  /** タイトル変更時のコールバック */
  onTitleChange: (title: string) => void;
  /** 送信時のコールバック */
  onSubmit: (data: ScenarioFormData) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 送信ボタンのラベル */
  submitLabel?: string;
  /** 送信中かどうか */
  isSubmitting?: boolean;
}

/**
 * シナリオフォームコンポーネント
 * シナリオの作成・編集フォーム（状態管理なし）
 */
export function ScenarioForm({
  title,
  onTitleChange,
  onSubmit,
  onCancel,
  submitLabel = '保存',
  isSubmitting = false,
}: ScenarioFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title: title.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="scenario-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          タイトル
        </label>
        <input
          id="scenario-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="シナリオのタイトルを入力"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '送信中...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
