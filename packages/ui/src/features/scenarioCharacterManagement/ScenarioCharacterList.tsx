import { CharacterAvatar } from '../../entities/character';
import { Button } from '../../shared/button';
import { Loading } from '../../shared/loading';
import type { CharacterWithRole } from './types';

export interface ScenarioCharacterListProps {
  /** シナリオに登場するキャラクターのリスト */
  characters: CharacterWithRole[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** キャラクタークリック時のコールバック */
  onCharacterClick?: (character: CharacterWithRole) => void;
  /** キャラクター編集ボタンクリック時のコールバック */
  onEditCharacter?: (character: CharacterWithRole) => void;
  /** キャラクター削除ボタンクリック時のコールバック */
  onRemoveCharacter?: (characterId: string) => void;
  /** 新規キャラクター作成ボタンクリック時のコールバック */
  onCreateNew?: () => void;
  /** 既存キャラクター追加ボタンクリック時のコールバック */
  onAddExisting?: () => void;
  /** キャラクターIDごとのメイン画像URL */
  characterImages?: Record<string, string | null>;
}

/**
 * シナリオに登場するキャラクター一覧コンポーネント
 */
export function ScenarioCharacterList({
  characters,
  isLoading,
  onCharacterClick,
  onEditCharacter,
  onRemoveCharacter,
  onCreateNew,
  onAddExisting,
  characterImages = {},
}: ScenarioCharacterListProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">登場キャラクター</h3>
        <div className="flex gap-2">
          {onCreateNew && (
            <Button onClick={onCreateNew} variant="primary" size="sm">
              キャラクターを作成
            </Button>
          )}
          {onAddExisting && (
            <Button onClick={onAddExisting} variant="secondary" size="sm">
              既存から追加
            </Button>
          )}
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          登場キャラクターがありません
        </div>
      ) : (
        <div className="space-y-2">
          {characters.map((character) => (
            <div
              key={character.characterId}
              className="scenario-character-item flex items-start justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <button
                type="button"
                onClick={() => onCharacterClick?.(character)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-3">
                  <CharacterAvatar
                    imageUrl={characterImages[character.characterId] ?? null}
                    name={character.name}
                    size={40}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-bold text-lg">{character.name}</h3>
                      {character.role && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {character.role}
                        </span>
                      )}
                    </div>
                    {character.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {character.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <div className="flex gap-2 ml-2">
                {onEditCharacter && (
                  <Button
                    onClick={() => onEditCharacter(character)}
                    variant="ghost"
                    size="sm"
                  >
                    編集
                  </Button>
                )}
                {onRemoveCharacter && (
                  <Button
                    onClick={() => onRemoveCharacter(character.characterId)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
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
