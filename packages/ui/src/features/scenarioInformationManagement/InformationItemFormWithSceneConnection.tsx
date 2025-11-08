 
import { InformationItemForm } from '../../entities/informationItem';
import { Button } from '../../shared/button';
import type { InformationItemFormProps } from '../../entities/informationItem';
import type { InformationToSceneConnection } from '../../informationItem/types';
import type { Scene } from '../../scene/types';

export interface InformationItemFormWithSceneConnectionProps extends Omit<InformationItemFormProps, 'children'> {
  /** シーン一覧（指し示すシーン選択用） */
  scenes?: Scene[];
  /** 情報項目→シーン関連一覧 */
  informationToSceneConnections?: InformationToSceneConnection[];
  /** 指し示すシーン追加時のコールバック */
  onAddSceneConnection?: (sceneId: string) => void;
  /** 指し示すシーン削除時のコールバック */
  onRemoveSceneConnection?: (connectionId: string) => void;
}

const inputClassName =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500';

/**
 * 情報項目作成・編集フォームコンポーネント（Scene連携機能付き）
 * Entity層のInformationItemFormをラップし、Scene連携機能を追加
 */
export function InformationItemFormWithSceneConnection({
  item,
  onSubmit,
  onCancel,
  onDelete,
  scenes = [],
  informationToSceneConnections = [],
  onAddSceneConnection,
  onRemoveSceneConnection,
}: InformationItemFormWithSceneConnectionProps) {
  // 編集中の情報項目が指し示すシーンのリスト
  const connectedScenes = item
    ? informationToSceneConnections
        .filter((conn) => conn.informationItemId === item.id)
        .map((conn) => {
          const scene = scenes.find((s) => s.id === conn.sceneId);
          return { connection: conn, scene };
        })
        .filter((i) => i.scene !== undefined)
    : [];

  const handleSceneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sceneId = e.target.value;
    if (sceneId && onAddSceneConnection) {
      onAddSceneConnection(sceneId);
    }
  };

  return (
    <InformationItemForm
      item={item}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    >
      {/* Scene連携エリア（編集時のみ表示） */}
      {item && (
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
      )}
    </InformationItemForm>
  );
}
