import {
  useSceneList,
  useSceneOperations,
  useSceneFormState,
} from '@/entities/scene';
import {
  useSceneEventOperations,
  sceneEventSlice,
} from '@/entities/sceneEvent';
import { useAppSelector } from '@/shared/lib/store';
import type { SceneEventType } from '@trpg-scenario-maker/ui';

/**
 * シナリオ詳細ページのシーン管理機能
 *
 * 責務:
 * - シーンのCRUD操作
 * - シーン間の接続管理
 * - シーンイベントの管理
 * - フォーム状態の管理
 */
export function useSceneManagement() {
  // シーンデータの取得
  const { scenes, connections, isLoading, error } = useSceneList();

  // シーン操作
  const {
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene: _handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
  } = useSceneOperations();

  // フォーム状態
  const {
    isFormOpen,
    editingScene,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,
  } = useSceneFormState();

  // イベント操作
  const { addEvent, updateEvent, removeEvent, moveEventUp, moveEventDown } =
    useSceneEventOperations();

  // イベントデータの取得
  const events = useAppSelector(
    (state) => state[sceneEventSlice.reducerPath].eventsBySceneId,
  );

  // 削除時の確認付きハンドラ
  const handleDeleteScene = async (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    const confirmed = window.confirm(
      `シーン「${scene.title}」を削除してもよろしいですか？\nこの操作は取り消せません。`,
    );
    if (confirmed) {
      await _handleDeleteScene(sceneId);
    }
  };

  // イベント操作のラッパー
  const handleAddEvent = async (
    sceneId: string,
    eventData: { type: SceneEventType; content: string },
  ) => {
    await addEvent(sceneId, eventData);
  };

  const handleUpdateEvent = async (
    sceneId: string,
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => {
    await updateEvent(sceneId, eventId, eventData);
  };

  const handleDeleteEvent = async (sceneId: string, eventId: string) => {
    await removeEvent(sceneId, eventId);
  };

  const handleMoveEventUp = async (sceneId: string, eventId: string) => {
    const sceneEvents = events[sceneId] || [];
    await moveEventUp(sceneId, sceneEvents, eventId);
  };

  const handleMoveEventDown = async (sceneId: string, eventId: string) => {
    const sceneEvents = events[sceneId] || [];
    await moveEventDown(sceneId, sceneEvents, eventId);
  };

  return {
    // データ
    scenes,
    connections,
    events,
    isLoading,
    error,

    // フォーム状態
    isFormOpen,
    editingScene,

    // シーン操作
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleOpenForm,
    handleCloseForm,
    handleEditScene,

    // 接続操作
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,

    // イベント操作
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleMoveEventUp,
    handleMoveEventDown,
  };
}
