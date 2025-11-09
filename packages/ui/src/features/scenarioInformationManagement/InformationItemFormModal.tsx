import { useState } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';

export interface InformationItemFormModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** 情報項目作成コールバック */
  onSubmit: (params: {
    title: string;
    description: string;
  }) => Promise<void>;
}

/**
 * 情報項目作成モーダル
 */
export function InformationItemFormModal({
  isOpen,
  onClose,
  onSubmit,
}: InformationItemFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert('タイトルを入力してください');
      return;
    }

    await onSubmit({ title, description });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="情報項目を作成">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="information-item-title"
            className="block text-sm font-medium mb-1"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="information-item-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="information-item-description"
            className="block text-sm font-medium mb-1"
          >
            説明
          </label>
          <textarea
            id="information-item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="説明を入力（省略可）"
            rows={3}
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
