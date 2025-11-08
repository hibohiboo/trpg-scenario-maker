import { InformationItemForm } from '../../entities/informationItem';
import { SceneConnectionSection } from './SceneConnectionSection';
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
  return (
    <InformationItemForm
      item={item}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    >
      {/* Scene連携エリア（編集時のみ表示） */}
      {item && (
        <SceneConnectionSection
          item={item}
          scenes={scenes}
          informationToSceneConnections={informationToSceneConnections}
          onAddSceneConnection={onAddSceneConnection}
          onRemoveSceneConnection={onRemoveSceneConnection}
        />
      )}
    </InformationItemForm>
  );
}
