import { Button } from '../../shared/button';
import type { InformationItem, InformationToSceneConnection } from '../../informationItem/types';
import type { Scene } from '../../scene/types';

interface SceneConnectionSectionProps {
  item: InformationItem;
  scenes: Scene[];
  informationToSceneConnections: InformationToSceneConnection[];
  onAddSceneConnection?: (sceneId: string) => void;
  onRemoveSceneConnection?: (connectionId: string) => void;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';

/**
 * 情報項目のScene連携セクション
 */
export function SceneConnectionSection({
  item,
  scenes,
  informationToSceneConnections,
  onAddSceneConnection,
  onRemoveSceneConnection,
}: SceneConnectionSectionProps) {
  // 編集中の情報項目が指し示すシーンのリスト
  const connectedScenes = informationToSceneConnections
    .filter((conn) => conn.informationItemId === item.id)
    .map((conn) => {
      const scene = scenes.find((s) => s.id === conn.sceneId);
      return { connection: conn, scene };
    })
    .filter((i) => i.scene !== undefined);

  const handleSceneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sceneId = e.target.value;
    if (sceneId && onAddSceneConnection) {
      onAddSceneConnection(sceneId);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">指し示すシーン</h3>

      {/* 既存の関連一覧 */}
      {connectedScenes.length > 0 ? (
        <div className="space-y-2 mb-4">
          {connectedScenes.map(({ connection, scene }) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-3 border border-gray-300 rounded-lg information-to-scene-connection-item"
            >
              <span className="font-semibold">{scene?.title}</span>
              {onRemoveSceneConnection && (
                <Button
                  type="button"
                  onClick={() => onRemoveSceneConnection(connection.id)}
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
      ) : (
        <p className="text-gray-500 text-sm mb-4">
          指し示すシーンが設定されていません
        </p>
      )}

      {/* シーン追加フォーム */}
      {onAddSceneConnection && scenes.length > 0 && (
        <div>
          <select
            value=""
            onChange={handleSceneSelect}
            className={inputClassName}
          >
            <option value="">シーンを選択</option>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
