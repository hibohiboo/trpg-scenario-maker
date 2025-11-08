/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';
import { SceneConnectionSection } from './SceneConnectionSection';
import type { InformationItem, InformationToSceneConnection } from '../../informationItem/types';
import type { Scene } from '../../scene/types';

export interface InformationItemEditModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 編集対象の情報項目 */
  item: InformationItem | null;
  /** 閉じるコールバック */
  onClose: () => void;
  /** 情報項目更新コールバック */
  onSubmit: (params: {
    id: string;
    title: string;
    description: string;
  }) => Promise<void>;
  /** シーン一覧（指し示すシーン選択用） */
  scenes?: Scene[];
  /** 情報項目→シーン関連一覧 */
  informationToSceneConnections?: InformationToSceneConnection[];
  /** 指し示すシーン追加時のコールバック */
  onAddSceneConnection?: (sceneId: string) => void;
  /** 指し示すシーン削除時のコールバック */
  onRemoveSceneConnection?: (connectionId: string) => void;
}

/**
 * 情報項目編集モーダル（Scene連携機能付き）
 */
export function InformationItemEditModal({
  isOpen,
  item,
  onClose,
  onSubmit,
  scenes = [],
  informationToSceneConnections = [],
  onAddSceneConnection,
  onRemoveSceneConnection,
}: InformationItemEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 情報項目が変更されたら状態を更新
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
    }
  }, [item]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    if (!title) {
      alert('タイトルを入力してください');
      return;
    }

    await onSubmit({
      id: item.id,
      title,
      description,
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="情報項目を編集">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="edit-information-item-title"
            className="block text-sm font-medium mb-1"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="edit-information-item-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="edit-information-item-description"
            className="block text-sm font-medium mb-1"
          >
            説明
          </label>
          <textarea
            id="edit-information-item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="説明を入力（省略可）"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Scene連携エリア */}
        {item && (
          <div className="border-t border-gray-200 pt-4">
            <SceneConnectionSection
              item={item}
              scenes={scenes}
              informationToSceneConnections={informationToSceneConnections}
              onAddSceneConnection={onAddSceneConnection}
              onRemoveSceneConnection={onRemoveSceneConnection}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={handleClose} variant="secondary">
            キャンセル
          </Button>
          <Button type="submit" variant="primary">
            更新
          </Button>
        </div>
      </form>
    </Modal>
  );
}
