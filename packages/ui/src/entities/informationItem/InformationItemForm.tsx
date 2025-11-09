/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Button } from '../../shared/button';
import type { InformationItem } from './types';

export interface InformationItemFormProps {
  /** 編集対象の情報項目（新規作成時はundefined） */
  item?: InformationItem;
  /** 送信時のコールバック */
  onSubmit: (data: { title: string; description: string }) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 削除時のコールバック */
  onDelete?: (id: string) => void;
  /** 追加の子コンポーネント（Scene連携など） */
  children?: React.ReactNode;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';
const labelClassName = 'block text-sm font-medium text-gray-700';

/**
 * 情報項目作成・編集フォームコンポーネント（CRUD専用）
 * Scene連携などの追加機能は children として渡す
 */
export function InformationItemForm({
  item,
  onSubmit,
  onCancel,
  onDelete,
  children,
}: InformationItemFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  const submitLabel = item ? '更新' : '作成';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClassName}>
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClassName}
          rows={4}
        />
      </div>

      {/* 追加機能エリア（Scene連携など） */}
      {children && <div className="border-t pt-6">{children}</div>}

      <div className="flex gap-2 items-center">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            キャンセル
          </Button>
        )}
        <div className="flex-1" />
        {item && onDelete && (
          <Button
            type="button"
            onClick={() => onDelete(item.id)}
            variant="danger"
          >
            削除
          </Button>
        )}
      </div>
    </form>
  );
}
