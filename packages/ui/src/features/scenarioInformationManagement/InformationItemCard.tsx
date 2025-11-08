import { Button } from '../../shared/button';
import type { InformationItem } from '../../entities/informationItem/types';

export interface InformationItemCardProps {
  /** 情報項目 */
  item: InformationItem;
  /** クリック時のコールバック */
  onClick?: (item: InformationItem) => void;
  /** 削除時のコールバック */
  onDelete?: (id: string) => void;
}

/**
 * 情報項目カード表示コンポーネント
 */
export function InformationItemCard({
  item,
  onClick,
  onDelete,
}: InformationItemCardProps) {
  return (
    <div className="border border-gray-300 rounded-md p-4 hover:bg-gray-50">
      <div
        className={onClick ? 'cursor-pointer' : ''}
        onClick={() => onClick?.(item)}
      >
        <h3 className="font-bold text-lg">{item.title}</h3>
        {item.description && (
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        )}
      </div>
      {onDelete && (
        <div className="mt-2 flex justify-end">
          <Button onClick={() => onDelete(item.id)} variant="danger" size="sm">
            削除
          </Button>
        </div>
      )}
    </div>
  );
}
