/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';
import type { CharacterWithRole } from './types';
import type { ReactNode } from 'react';

export interface ScenarioCharacterEditModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 編集対象のキャラクター */
  character: CharacterWithRole | null;
  /** 閉じるコールバック */
  onClose: () => void;
  /** キャラクター更新コールバック */
  onSubmit: (params: {
    characterId: string;
    name: string;
    description: string;
    role: string;
  }) => Promise<void>;
  /** 追加の子コンポーネント（画像管理など） */
  children?: ReactNode;
}

/**
 * シナリオキャラクター編集モーダル
 */
export function ScenarioCharacterEditModal({
  isOpen,
  character,
  onClose,
  onSubmit,
  children,
}: ScenarioCharacterEditModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');

  // キャラクター情報が変更されたら状態を更新
  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description || '');
      setRole(character.role || '');
    }
  }, [character]);
  const handleClose = () => {
    setName('');
    setDescription('');
    setRole('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!character) return;

    if (!name) {
      alert('キャラクター名を入力してください');
      return;
    }

    await onSubmit({
      characterId: character.characterId,
      name,
      description,
      role,
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="キャラクターを編集">
      <div>
        <label
          htmlFor="edit-character-name"
          className="block text-sm font-medium mb-1"
        >
          キャラクター名 <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-character-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="edit-character-description"
          className="block text-sm font-medium mb-1"
        >
          キャラクター説明
        </label>
        <textarea
          id="edit-character-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明を入力（省略可）"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="edit-character-role"
          className="block text-sm font-medium mb-1"
        >
          役割
        </label>
        <input
          id="edit-character-role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="役割を入力（省略可）"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* 画像管理エリア */}
      {children && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-sm font-medium mb-3">画像管理</h3>
          {children}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" onClick={handleClose} variant="secondary">
          キャンセル
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit}>
          更新
        </Button>
      </div>
    </Modal>
  );
}
