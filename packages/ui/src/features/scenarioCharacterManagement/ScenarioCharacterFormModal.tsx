import { useState } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';

export interface ScenarioCharacterFormModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** キャラクター作成コールバック */
  onSubmit: (params: {
    name: string;
    description: string;
    role: string;
  }) => Promise<void>;
}

/**
 * シナリオキャラクター作成モーダル
 */
export function ScenarioCharacterFormModal({
  isOpen,
  onClose,
  onSubmit,
}: ScenarioCharacterFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const handleClose = () => {
    setName('');
    setDescription('');
    setRole('');
    onClose();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert('キャラクター名を入力してください');
      return;
    }

    await onSubmit({ name, description, role });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="キャラクターを作成">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="character-name"
            className="block text-sm font-medium mb-1"
          >
            キャラクター名 <span className="text-red-500">*</span>
          </label>
          <input
            id="character-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="character-description"
            className="block text-sm font-medium mb-1"
          >
            キャラクター説明
          </label>
          <textarea
            id="character-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="説明を入力（省略可）"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="character-role"
            className="block text-sm font-medium mb-1"
          >
            役割
          </label>
          <input
            id="character-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="役割を入力（省略可）"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={handleClose} variant="secondary">
            キャンセル
          </Button>
          <Button type="submit" variant="primary">
            作成
          </Button>
        </div>
      </form>
    </Modal>
  );
}
