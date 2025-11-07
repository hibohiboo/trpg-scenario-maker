import { Button } from '../../shared/button';
import type { Relationship, Character } from './types';

export interface DeleteRelationshipModalProps {
  /** 削除対象の関係性 */
  relationship: Relationship;
  /** キャラクターのリスト（名前表示用） */
  characters: Character[];
  /** 削除確認時のコールバック */
  onConfirm: () => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
  /** 削除中かどうか */
  isDeleting?: boolean;
}

/**
 * 関係性削除確認モーダルコンポーネント
 */
export function DeleteRelationshipModal({
  relationship,
  characters,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteRelationshipModalProps) {
  const getCharacterName = (characterId: string): string => {
    const character = characters.find((c) => c.id === characterId);
    return character?.name || '不明';
  };

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
      aria-labelledby="delete-modal-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <h2 id="delete-modal-title" className="text-xl font-bold mb-4">
          関係性を削除
        </h2>
        <p className="text-gray-700 mb-6">
          以下の関係性を削除してもよろしいですか？
        </p>
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {getCharacterName(relationship.fromCharacterId)}
            </span>
            <span className="text-gray-500">→</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {relationship.relationshipName}
            </span>
            <span className="text-gray-500">→</span>
            <span className="font-semibold">
              {getCharacterName(relationship.toCharacterId)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isDeleting}
          >
            キャンセル
          </Button>
          <Button onClick={onConfirm} variant="danger" disabled={isDeleting}>
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </div>
      </div>
    </div>
  );
}
