import type { SceneEvent, SceneEventType } from '@trpg-scenario-maker/schema';
import { useState, type FormEvent } from 'react';
import type { Scene, SceneConnection } from '../types';
import { useSceneConnections } from './useSceneConnections';

export interface SceneFormProps {
  scene?: Scene;
  scenes?: Scene[];
  connections?: SceneConnection[];
  events?: SceneEvent[];
  onSubmit: (scene: Omit<Scene, 'id'>) => void;
  onCancel?: () => void;
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

  const submitLabel = scene ? '更新' : '作成';
  return {
    ...props,
    ...stateVM,
    ...connectVM,
    handleSubmit,
    submitLabel,
    scene,
  };
};
