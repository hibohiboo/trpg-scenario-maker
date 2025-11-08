import { useState } from 'react';
import { Button } from '../../shared/button';
import { Modal } from '../../shared/modal';
import type { InformationItem } from '../../informationItem/types';

export interface InformationItemConnectionFormModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** 情報項目リスト */
  items: InformationItem[];
  /** 閉じるコールバック */
  onClose: () => void;
  /** 関連追加コールバック */
  onSubmit: (params: { source: string; target: string }) => Promise<void>;
}

/**
 * 情報項目関連追加モーダル
 */
export function InformationItemConnectionFormModal({
  isOpen,
  items,
  onClose,
  onSubmit,
}: InformationItemConnectionFormModalProps) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');

  const handleClose = () => {
    setSourceId('');
    setTargetId('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceId || !targetId) {
      alert('すべての項目を選択してください');
      return;
    }

    if (sourceId === targetId) {
      alert('同じ情報項目に対して関連を作成することはできません');
      return;
    }

    await onSubmit({ source: sourceId, target: targetId });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="関連を追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="source-item"
            className="block text-sm font-medium mb-1"
          >
            関連元情報項目
          </label>
          <select
            id="source-item"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="target-item"
            className="block text-sm font-medium mb-1"
          >
            関連先情報項目
          </label>
          <select
            id="target-item"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">選択してください</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
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
