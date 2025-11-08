import { Button } from '../../shared/button';
import { Loading } from '../../shared/loading';

export interface ScenarioCharacterRelation {
  scenarioId: string;
  fromCharacterId: string;
  fromCharacterName: string;
  toCharacterId: string;
  toCharacterName: string;
  relationshipName: string;
}

export interface ScenarioCharacterRelationshipListProps {
  /** シナリオ内のキャラクター関係性リスト */
  relations: ScenarioCharacterRelation[];
  /** ローディング状態 */
  isLoading?: boolean;
  /** 関係性追加ボタンクリック時のコールバック */
  onAddRelationship?: () => void;
  /** 関係性削除ボタンクリック時のコールバック */
  onRemoveRelationship?: (
    fromCharacterId: string,
    toCharacterId: string,
  ) => void;
}

/**
 * シナリオ内のキャラクター関係性一覧コンポーネント
 */
export function ScenarioCharacterRelationshipList({
  relations,
  isLoading,
  onAddRelationship,
  onRemoveRelationship,
}: ScenarioCharacterRelationshipListProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">キャラクター関係性</h3>
        {onAddRelationship && (
          <Button onClick={onAddRelationship} variant="primary" size="sm">
            関係性を追加
          </Button>
        )}
      </div>

      {relations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          登録されている関係性がありません
        </div>
      ) : (
        <div className="space-y-2">
          {relations.map((relation, index) => (
            <div
              key={`${relation.fromCharacterId}-${relation.toCharacterId}-${index}`}
              className="scenario-character-relation-item flex items-center justify-between p-4 border border-gray-300 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {relation.fromCharacterName}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {relation.relationshipName}
                </span>
                <span className="text-gray-500">→</span>
                <span className="font-semibold">
                  {relation.toCharacterName}
                </span>
              </div>
              {onRemoveRelationship && (
                <Button
                  onClick={() =>
                    onRemoveRelationship(
                      relation.fromCharacterId,
                      relation.toCharacterId,
                    )
                  }
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  削除
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
