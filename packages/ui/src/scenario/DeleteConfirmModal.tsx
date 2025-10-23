import { FiAlertTriangle } from 'react-icons/fi';
import type { Scenario } from './types';

export interface DeleteConfirmModalProps {
  /** 削除対象のシナリオ */
  scenario: Scenario;
  /** 削除確認時のコールバック */
  onConfirm: () => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
  /** 削除処理中かどうか */
  isDeleting?: boolean;
}

/**
 * 削除確認モーダルコンポーネント
 * シナリオ削除前の確認ダイアログ
 */
export function DeleteConfirmModal({
  scenario,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
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
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="text-red-600" size={24} />
          </div>
          <div className="flex-1">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              シナリオを削除しますか?
            </h3>
            <p className="text-gray-600 mb-2">
              以下のシナリオを削除しようとしています:
            </p>
            <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded">
              {scenario.title}
            </p>
            <p className="text-sm text-red-600 mt-2">
              この操作は取り消せません。
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? '削除中...' : '削除'}
          </button>
        </div>
      </div>
    </div>
  );
}
