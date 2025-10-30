import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import type { Character } from './types';

export interface CharacterListProps {
  /** キャラクターのリスト */
  characters: Character[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** キャラクタークリック時のコールバック */
  onCharacterClick?: (character: Character) => void;
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew?: () => void;
}

/**
 * キャラクター一覧コンポーネント
 */
export function CharacterList({
  characters,
  isLoading,
  onCharacterClick,
  onCreateNew,
}: CharacterListProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">キャラクター一覧</h3>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="primary" size="sm">
            新規作成
          </Button>
        )}
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          キャラクターがありません
        </div>
      ) : (
        <div className="space-y-2">
          {characters.map((character) => (
            <button
              key={character.id}
              type="button"
              onClick={() => onCharacterClick?.(character)}
              className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-bold text-lg">{character.name}</h3>
              {character.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {character.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
