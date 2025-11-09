import type { Scene, SceneConnection } from './types';

/**
 * シーンと接続情報のペア
 */
export interface SceneWithConnection {
  connection: SceneConnection;
  scene: Scene | undefined;
}

/**
 * 現在のシーンの次のシーン（接続先）を取得
 */
export function getNextScenes(
  sceneId: string,
  scenes: Scene[],
  connections: SceneConnection[],
): SceneWithConnection[] {
  return connections
    .filter((conn) => conn.source === sceneId)
    .map((conn) => ({
      connection: conn,
      scene: scenes.find((s) => s.id === conn.target),
    }))
    .filter((item) => item.scene !== undefined);
}

/**
 * 現在のシーンの前のシーン（接続元）を取得
 */
export function getPreviousScenes(
  sceneId: string,
  scenes: Scene[],
  connections: SceneConnection[],
): SceneWithConnection[] {
  return connections
    .filter((conn) => conn.target === sceneId)
    .map((conn) => ({
      connection: conn,
      scene: scenes.find((s) => s.id === conn.source),
    }))
    .filter((item) => item.scene !== undefined);
}

/**
 * 次のシーンとして選択可能なシーンを取得
 * - 現在のシーンを除外
 * - 既に次のシーンとして接続済みのシーンを除外
 * - 前のシーンを除外（ループ防止）
 */
export function getAvailableNextScenes(
  currentScene: Scene,
  allScenes: Scene[],
  nextScenes: SceneWithConnection[],
  previousScenes: SceneWithConnection[],
): Scene[] {
  return allScenes.filter(
    (s) =>
      s.id !== currentScene.id &&
      !nextScenes.some((ns) => ns.scene?.id === s.id) &&
      !previousScenes.some((ps) => ps.scene?.id === s.id),
  );
}

/**
 * 前のシーンとして選択可能なシーンを取得
 * - 現在のシーンを除外
 * - 既に前のシーンとして接続済みのシーンを除外
 * - 次のシーンを除外（ループ防止）
 */
export function getAvailablePreviousScenes(
  currentScene: Scene,
  allScenes: Scene[],
  nextScenes: SceneWithConnection[],
  previousScenes: SceneWithConnection[],
): Scene[] {
  return allScenes.filter(
    (s) =>
      s.id !== currentScene.id &&
      !previousScenes.some((ps) => ps.scene?.id === s.id) &&
      !nextScenes.some((ns) => ns.scene?.id === s.id),
  );
}
