import type { Scene, SceneConnection } from '@trpg-scenario-maker/ui';
import { useState, useEffect, useCallback } from 'react';
import { SceneApi } from '../api/sceneApi';

/**
 * シーン編集のロジックを管理するカスタムフック
 */
export function useSceneEditor(scenarioId: string) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [connections, setConnections] = useState<SceneConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // シーンとコネクションをロード
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [scenesData, connectionsData] = await Promise.all([
        SceneApi.getScenesByScenarioId(scenarioId),
        SceneApi.getConnectionsByScenarioId(scenarioId),
      ]);
      setScenes(scenesData);
      setConnections(connectionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'データの読み込みに失敗しました',
      );
    } finally {
      setIsLoading(false);
    }
  }, [scenarioId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // シーンを追加
  const handleAddScene = useCallback(
    async (scene: Omit<Scene, 'id'>) => {
      try {
        const newScene = await SceneApi.createScene(scenarioId, scene);
        setScenes((prev) => [...prev, newScene]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'シーンの追加に失敗しました',
        );
        throw err;
      }
    },
    [scenarioId],
  );

  // シーンを更新
  const handleUpdateScene = useCallback(
    async (id: string, updates: Partial<Scene>) => {
      try {
        const updatedScene = await SceneApi.updateScene(id, updates);
        setScenes((prev) =>
          prev.map((scene) => (scene.id === id ? updatedScene : scene)),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'シーンの更新に失敗しました',
        );
        throw err;
      }
    },
    [],
  );

  // シーンを削除
  const handleDeleteScene = useCallback(async (id: string) => {
    try {
      await SceneApi.deleteScene(id);
      setScenes((prev) => prev.filter((scene) => scene.id !== id));
      setConnections((prev) =>
        prev.filter((conn) => conn.source !== id && conn.target !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'シーンの削除に失敗しました',
      );
      throw err;
    }
  }, []);

  // コネクションを追加
  const handleAddConnection = useCallback(
    async (connection: Omit<SceneConnection, 'id'>) => {
      try {
        const newConnection = await SceneApi.createConnection(connection);
        setConnections((prev) => [...prev, newConnection]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '接続の追加に失敗しました',
        );
        throw err;
      }
    },
    [],
  );

  // コネクションを更新
  const handleUpdateConnection = useCallback(
    async (id: string, updates: Partial<SceneConnection>) => {
      // 現時点では接続の更新は順序のみ（必要に応じて実装）
      console.log('Connection update not implemented yet', id, updates);
    },
    [],
  );

  // コネクションを削除
  const handleDeleteConnection = useCallback(async (id: string) => {
    try {
      await SceneApi.deleteConnection(id);
      setConnections((prev) => prev.filter((conn) => conn.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '接続の削除に失敗しました');
      throw err;
    }
  }, []);

  return {
    scenes,
    connections,
    isLoading,
    error,
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAddConnection,
    handleUpdateConnection,
    handleDeleteConnection,
    reload: loadData,
  };
}
