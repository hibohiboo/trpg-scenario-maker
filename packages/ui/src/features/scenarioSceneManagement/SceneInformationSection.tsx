import { Button } from '../../shared/button';
import type { InformationItem, SceneInformationConnection } from '../../informationItem/types';

export interface SceneInformationSectionProps {
  /** シーンで獲得できる情報項目のID一覧 */
  connectedInformationItems: InformationItem[];
  /** 利用可能な情報項目一覧 */
  availableInformationItems: InformationItem[];
  /** 情報項目削除時のコールバック */
  onRemoveInformationItem: (connectionId: string) => void;
  /** 情報項目追加時のコールバック */
  onAddInformationItem: (informationItemId: string) => void;
  /** シーン→情報項目接続一覧 */
  sceneInformationConnections: SceneInformationConnection[];
  /** 入力フィールドのクラス名 */
  inputClassName: string;
}

/**
 * シーンで獲得できる情報セクション
 */
export function SceneInformationSection({
  connectedInformationItems,
  availableInformationItems,
  onRemoveInformationItem,
  onAddInformationItem,
  sceneInformationConnections,
  inputClassName,
}: SceneInformationSectionProps) {
  const handleAddInformationItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const informationItemId = e.target.value;
    if (informationItemId) {
      onAddInformationItem(informationItemId);
    }
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">獲得できる情報</h3>

      {/* 既存の接続一覧 */}
      {connectedInformationItems.length > 0 ? (
        <div className="space-y-2 mb-4">
          {connectedInformationItems.map((item) => {
            const connection = sceneInformationConnections.find(
              (conn) => conn.informationItemId === item.id
            );
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border border-gray-300 rounded-lg scene-information-item"
              >
                <div>
                  <span className="font-semibold">{item.title}</span>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
                {connection && (
                  <Button
                    type="button"
                    onClick={() => onRemoveInformationItem(connection.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    削除
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">
          獲得できる情報が設定されていません
        </p>
      )}

      {/* 情報項目追加フォーム */}
      {availableInformationItems.length > 0 && (
        <div>
          <select
            value=""
            onChange={handleAddInformationItem}
            className={inputClassName}
          >
            <option value="">情報項目を選択</option>
            {availableInformationItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
