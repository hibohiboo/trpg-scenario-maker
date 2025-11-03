import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import type { InformationItem } from './types';

export interface InformationItemListProps {
  /** 情報項目のリスト */
  items: InformationItem[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** 情報項目クリック時のコールバック */
  onItemClick?: (item: InformationItem) => void;
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew?: () => void;
  /** 削除ボタンクリック時のコールバック */
  onDelete?: (id: string) => void;
}

/**
 * 情報項目一覧コンポーネント
 */
export function InformationItemList({
  items,
  isLoading,
  onItemClick,
  onCreateNew,
  onDelete,
}: InformationItemListProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">情報項目一覧</h3>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="primary" size="sm">
            新規作成
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          情報項目がありません
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-md p-4 hover:bg-gray-50"
            >
              <div
                className="cursor-pointer"
                onClick={() => onItemClick?.(item)}
              >
                <h3 className="font-bold text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              {onDelete && (
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={() => onDelete(item.id)}
                    variant="danger"
                    size="sm"
                  >
                    削除
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
