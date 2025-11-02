import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import type { Relationship, Character } from './types';

export interface RelationshipListProps {
  /** 関係性のリスト */
  relationships: Relationship[];
  /** キャラクターのリスト（名前表示用） */
  characters: Character[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew?: (fromCharacterId?: string) => void;
  /** 編集ボタンクリック時のコールバック */
  onEdit?: (relationship: Relationship) => void;
  /** 削除ボタンクリック時のコールバック */
  onDelete?: (relationship: Relationship) => void;
}

/**
 * 関係性一覧コンポーネント
 */
export function RelationshipList({
  relationships,
  characters,
  isLoading,
  onCreateNew,
  onEdit,
  onDelete,
}: RelationshipListProps) {
  const getCharacterName = (characterId: string): string => {
    const character = characters.find((c) => c.id === characterId);
    return character?.name || '不明';
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">キャラクター関係性</h2>
        {onCreateNew && (
          <Button onClick={() => onCreateNew()} variant="primary">
            関係性を追加
          </Button>
        )}
      </div>

      {relationships.length === 0 ? (
        <div className="text-center py-8 text-gray-500">関係性がありません</div>
      ) : (
        <div className="space-y-2">
          {relationships.map((relationship) => (
            <div
              key={relationship.id}
              className="character-relation-item p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex-1">
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
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    onClick={() => onEdit(relationship)}
                    variant="secondary"
                    size="sm"
                  >
                    編集
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(relationship)}
                    variant="danger"
                    size="sm"
                  >
                    削除
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
