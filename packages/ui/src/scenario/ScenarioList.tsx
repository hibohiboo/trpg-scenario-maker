import { FiPlus } from 'react-icons/fi';
import { ScenarioCard } from './ScenarioCard';
import type { Scenario } from './types';

export interface ScenarioListProps {
  /** シナリオのリスト */
  scenarios: Scenario[];
  /** 新規作成ボタンクリック時のコールバック */
  onCreateNew?: () => void;
  /** シナリオ編集時のコールバック */
  onEdit?: (scenario: Scenario) => void;
  /** シナリオ削除時のコールバック */
  onDelete?: (scenario: Scenario) => void;
  /** シナリオクリック時のコールバック */
  onClick?: (scenario: Scenario) => void;
  /** ローディング状態 */
  isLoading?: boolean;
}

function ScenarioListBody({
  scenarios,
  onCreateNew,
  onEdit,
  onDelete,
  onClick,
}: ScenarioListProps) {
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="mb-4">シナリオがまだありません</p>
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={20} />
            最初のシナリオを作成
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

/**
 * シナリオリストコンポーネント
 * シナリオの一覧を表示し、CRUD操作を提供
 */
export function ScenarioList(props: ScenarioListProps) {
  const { onCreateNew, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">シナリオ一覧</h2>
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={20} />
            新規作成
          </button>
        )}
      </div>
      <ScenarioListBody {...props} />
    </div>
  );
}
