import type {
  SceneEvent,
  SceneEventType as SchemaSceneEventType,
} from '@trpg-scenario-maker/schema';
import type { SceneConnection, Scene } from '@trpg-scenario-maker/schema/scene';
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
} from '../informationItem/types';

export type { SceneConnection, Scene, SceneEvent };

export type SceneEventType = SchemaSceneEventType;

export interface SceneEditorProps {
  scenarioId: string;
  scenes: Scene[];
  connections: SceneConnection[];
  events?: Record<string, SceneEvent[]>;
  isFormOpen: boolean;
  editingScene: Scene | null;
  onAddScene: (scene: Omit<Scene, 'id'>) => void;
  onUpdateScene: (id: string, scene: Partial<Scene>) => void;
  onDeleteScene: (id: string) => void;
  onAddConnection: (connection: Omit<SceneConnection, 'id'>) => void;
  onUpdateConnection: (
    id: string,
    connection: Partial<SceneConnection>,
  ) => void;
  onDeleteConnection: (id: string) => void;
  onAddEvent?: (
    sceneId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void;
  onUpdateEvent?: (
    sceneId: string,
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void;
  onDeleteEvent?: (sceneId: string, eventId: string) => void;
  onMoveEventUp?: (sceneId: string, eventId: string) => void;
  onMoveEventDown?: (sceneId: string, eventId: string) => void;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onEditScene: (scene: Scene) => void;
  // 情報項目関連
  informationItems?: InformationItem[];
  informationConnections?: InformationItemConnection[];
  informationToSceneConnections?: InformationToSceneConnection[];
}
