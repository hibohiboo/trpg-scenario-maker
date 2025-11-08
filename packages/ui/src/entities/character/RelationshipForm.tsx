import { Button } from '../../shared/button';
import type { Character, RelationshipFormData } from './types';

export interface RelationshipFormProps {
  /** キャラクターのリスト */
  characters: Character[];
  /** 関係元キャラクターID */
  fromCharacterId: string;
  /** 関係先キャラクターID */
  toCharacterId: string;
  /** 関係名 */
  relationshipName: string;
  /** 関係元キャラクター変更時のコールバック */
  onFromCharacterChange: (characterId: string) => void;
  /** 関係先キャラクター変更時のコールバック */
  onToCharacterChange: (characterId: string) => void;
  /** 関係名変更時のコールバック */
  onRelationshipNameChange: (name: string) => void;
  /** フォーム送信時のコールバック */
  onSubmit: (data: RelationshipFormData) => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
  /** 送信ボタンのラベル */
  submitLabel?: string;
  /** 送信中かどうか */
  isSubmitting?: boolean;
  /** 編集モードかどうか（編集時はfrom/toを変更不可にする） */
  isEditMode?: boolean;
}

interface CharacterSelectProps {
  id: string;
  label: string;
  value: string;
  characters: Character[];
  onChange: (value: string) => void;
  disabled: boolean;
  excludeId?: string;
}

function CharacterSelect({
  id,
  label,
  value,
  characters,
  onChange,
  disabled,
  excludeId,
}: CharacterSelectProps) {
  const filteredCharacters = excludeId
    ? characters.filter((c) => c.id !== excludeId)
    : characters;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        required
      >
        <option value="">選択してください</option>
        {filteredCharacters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 関係性フォームコンポーネント
 */
// eslint-disable-next-line complexity
export function RelationshipForm({
  characters,
  fromCharacterId,
  toCharacterId,
  relationshipName,
  onFromCharacterChange,
  onToCharacterChange,
  onRelationshipNameChange,
  onSubmit,
  onCancel,
  submitLabel = '登録',
  isSubmitting = false,
  isEditMode = false,
}: RelationshipFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCharacterId || !toCharacterId || !relationshipName.trim()) {
      return;
    }
    onSubmit({
      fromCharacterId,
      toCharacterId,
      relationshipName: relationshipName.trim(),
    });
  };

  const isValid =
    fromCharacterId && toCharacterId && relationshipName.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CharacterSelect
        id="fromCharacter"
        label="関係元キャラクター"
        value={fromCharacterId}
        characters={characters}
        onChange={onFromCharacterChange}
        disabled={isEditMode}
      />

      <CharacterSelect
        id="toCharacter"
        label="関係先キャラクター"
        value={toCharacterId}
        characters={characters}
        onChange={onToCharacterChange}
        disabled={isEditMode}
        excludeId={fromCharacterId}
      />

      <div>
        <label
          htmlFor="relationshipName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          関係名
        </label>
        <input
          type="text"
          id="relationshipName"
          value={relationshipName}
          onChange={(e) => onRelationshipNameChange(e.target.value)}
          placeholder="例: 友人、師匠、ライバル"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? '処理中...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
