import { useState, type FormEvent, useMemo } from 'react';
import { useSceneConnections } from './useSceneConnections';
import type {
  InformationItem,
  SceneInformationConnection,
} from '../../informationItem/types';
import type { Scene, SceneConnection } from '../types';
import type { SceneEvent, SceneEventType } from '@trpg-scenario-maker/schema';

export interface SceneFormProps {
  scene?: Scene;
  scenes?: Scene[];
  connections?: SceneConnection[];
  events?: SceneEvent[];
  onSubmit: (scene: Omit<Scene, 'id'>) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  onConnectionDelete?: (connectionId: string) => void;
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
  onEventAdd?: (eventData: { type: SceneEventType; content: string }) => void;
  onEventUpdate?: (
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void;
  onEventDelete?: (eventId: string) => void;
  onEventMoveUp?: (eventId: string) => void;
  onEventMoveDown?: (eventId: string) => void;
  // 情報項目関連
  informationItems?: InformationItem[];
  sceneInformationConnections?: SceneInformationConnection[];
  onAddSceneInformation?: (informationItemId: string) => void;
  onRemoveSceneInformation?: (connectionId: string) => void;
}

export const useSceneState = (scene?: Scene) => {
  const [title, setTitle] = useState(scene?.title || '');
  const [description, setDescription] = useState(scene?.description || '');
  const [isMasterScene, setIsMasterScene] = useState(
    scene?.isMasterScene || false,
  );
  return {
    title,
    setTitle,
    description,
    setDescription,
    isMasterScene,
    setIsMasterScene,
  };
};

export const useSceneForm = (props: SceneFormProps) => {
  const {
    scene,
    scenes = [],
    connections = [],
    onConnectionAdd,
    onSubmit,
    informationItems = [],
    sceneInformationConnections = [],
  } = props;

  const connectVM = useSceneConnections({
    scene,
    scenes,
    connections,
    onConnectionAdd,
  });

  const stateVM = useSceneState(scene);

  const { title, description, isMasterScene } = stateVM;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, isMasterScene });
  };

  // このシーンに関連付けられている情報項目
  const connectedInformationItems = useMemo(() => {
    if (!scene) return [];
    const connectedIds = sceneInformationConnections
      .filter((conn) => conn.sceneId === scene.id)
      .map((conn) => conn.informationItemId);
    return informationItems.filter((item) => connectedIds.includes(item.id));
  }, [scene, sceneInformationConnections, informationItems]);

  // まだ関連付けられていない情報項目
  const availableInformationItems = useMemo(() => {
    if (!scene) return [];
    const connectedIds = sceneInformationConnections
      .filter((conn) => conn.sceneId === scene.id)
      .map((conn) => conn.informationItemId);
    return informationItems.filter((item) => !connectedIds.includes(item.id));
  }, [scene, sceneInformationConnections, informationItems]);

  const submitLabel = scene ? '更新' : '作成';
  return {
    ...props,
    ...stateVM,
    ...connectVM,
    handleSubmit,
    submitLabel,
    scene,
    connectedInformationItems,
    availableInformationItems,
  };
};
