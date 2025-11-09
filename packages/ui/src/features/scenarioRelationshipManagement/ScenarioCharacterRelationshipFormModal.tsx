import { useState } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';
import type { CharacterWithRole } from '../scenarioCharacterManagement';

export interface ScenarioCharacterRelationshipFormModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** シナリオに登場するキャラクターリスト */
  characters: CharacterWithRole[];
  /** 閉じるコールバック */
  onClose: () => void;
  /** 関係性追加コールバック */
  onSubmit: (params: {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }) => Promise<void>;
}

/**
 * シナリオキャラクター関係性追加モーダル
 */
export function ScenarioCharacterRelationshipFormModal({
  isOpen,
  characters,
  onClose,
  onSubmit,
}: ScenarioCharacterRelationshipFormModalProps) {
  const [fromCharacterId, setFromCharacterId] = useState('');
  const [toCharacterId, setToCharacterId] = useState('');
  const [relationshipName, setRelationshipName] = useState('');
  const handleClose = () => {
    setFromCharacterId('');
    setToCharacterId('');
    setRelationshipName('');
    onClose();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCharacterId || !toCharacterId || !relationshipName) {
      alert('すべての項目を入力してください');
      return;
    }

    if (fromCharacterId === toCharacterId) {
      alert('同じキャラクターに対して関係性を作成することはできません');
      return;
    }

    await onSubmit({ fromCharacterId, toCharacterId, relationshipName });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="関係性を追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="from-character"
            className="block text-sm font-medium mb-1"
          >
            関係元キャラクター
          </label>
          <select
            id="from-character"
            value={fromCharacterId}
            onChange={(e) => setFromCharacterId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {characters.map((char) => (
              <option key={char.characterId} value={char.characterId}>
                {char.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="to-character"
            className="block text-sm font-medium mb-1"
          >
            関係先キャラクター
          </label>
          <select
            id="to-character"
            value={toCharacterId}
            onChange={(e) => setToCharacterId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {characters.map((char) => (
              <option key={char.characterId} value={char.characterId}>
                {char.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="relationship-name"
            className="block text-sm font-medium mb-1"
          >
            関係名
          </label>
          <input
            id="relationship-name"
            type="text"
            value={relationshipName}
            onChange={(e) => setRelationshipName(e.target.value)}
            placeholder="関係名を入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={handleClose} variant="secondary">
            キャンセル
          </Button>
          <Button type="submit" variant="primary">
            追加
          </Button>
        </div>
      </form>
    </Modal>
  );
}
