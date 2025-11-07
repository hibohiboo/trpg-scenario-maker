import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../shared/button';
import type { Scenario } from './types';

export interface ScenarioCardProps {
  /** シナリオデータ */
  scenario: Scenario;
  /** 編集ボタンクリック時のコールバック */
  onEdit?: (scenario: Scenario) => void;
  /** 削除ボタンクリック時のコールバック */
  onDelete?: (scenario: Scenario) => void;
  /** クリック時のコールバック */
  onClick?: (scenario: Scenario) => void;
}

/**
 * シナリオカードコンポーネント
 * 1つのシナリオの概要を表示するカード
 */
export function ScenarioCard({
  scenario,
  onEdit,
  onDelete,
  onClick,
}: ScenarioCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(scenario);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(scenario);
  };

  const handleClick = () => {
    onClick?.(scenario);
  };

  return (
    <div
      className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {scenario.title}
        </h3>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              type="button"
              onClick={handleEdit}
              variant="ghost"
              size="sm"
              className="p-1! text-gray-600 hover:text-blue-600"
              aria-label="シナリオを編集"
            >
              <FiEdit2 size={18} />
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="p-1! text-gray-600 hover:text-red-600"
              aria-label="シナリオを削除"
            >
              <FiTrash2 size={18} />
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500 space-y-1">
        <div>更新日時: {format(scenario.updatedAt, 'yyyy/MM/dd HH:mm')}</div>
      </div>
    </div>
  );
}
