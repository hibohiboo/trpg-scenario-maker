import { createAsyncThunk } from '@reduxjs/toolkit';
import { scenarioApi } from '../api/scenarioApi';
import { scenarioGraphApi } from '../api/scenarioGraphApi';
import type { GraphDBData, RDBData } from '@trpg-scenario-maker/schema';

/**
 * シナリオに関連する画像IDを取得
 */
export const getScenarioImageIdsAction = createAsyncThunk<
  string[],
  { scenarioId: string }
>('scenario/getImageIds', async (payload) => {
  const graphData = await scenarioGraphApi.exportScenario(payload.scenarioId);
  // GraphDBデータから画像IDを抽出
  const imageIds = graphData.nodes
    .filter((node) => node.label === 'Image')
    .map((node) => node.id);
  return imageIds;
});

/**
 * シナリオのGraphDBデータをエクスポート
 */
export const exportScenarioGraphAction = createAsyncThunk<
  GraphDBData,
  { scenarioId: string }
>('scenario/exportGraph', async (payload) => {
  const data = await scenarioGraphApi.exportScenario(payload.scenarioId);
  return data;
});

/**
 * シナリオのRDBデータをエクスポート
 */
export const exportScenarioRdbAction = createAsyncThunk<
  RDBData,
  { scenarioId: string; imageIds: string[] }
>('scenario/exportRdb', async (payload) => {
  const data = await scenarioApi.exportScenario({
    scenarioId: payload.scenarioId,
    imageIds: payload.imageIds,
  });
  return data;
});

/**
 * シナリオの完全データ（GraphDB + RDB）をエクスポート
 */
export const exportScenarioAction = createAsyncThunk<
  { graphData: GraphDBData; rdbData: RDBData },
  { scenarioId: string; imageIds: string[] }
>('scenario/export', async (payload, { dispatch }) => {
  // GraphDBとRDBを並行してエクスポート
  const [graphData, rdbData] = await Promise.all([
    dispatch(exportScenarioGraphAction({ scenarioId: payload.scenarioId }))
      .unwrap(),
    dispatch(
      exportScenarioRdbAction({
        scenarioId: payload.scenarioId,
        imageIds: payload.imageIds,
      }),
    ).unwrap(),
  ]);

  return { graphData, rdbData };
});

/**
 * シナリオのGraphDBデータをインポート
 */
export const importScenarioGraphAction = createAsyncThunk<
  void,
  { nodes: unknown[]; relationships: unknown[] }
>('scenario/importGraph', async (payload) => {
  await scenarioGraphApi.importScenario({
    nodes: payload.nodes,
    relationships: payload.relationships,
  });
  await scenarioGraphApi.save();
});

/**
 * シナリオのRDBデータをインポート
 */
export const importScenarioRdbAction = createAsyncThunk<
  void,
  { scenario: unknown; images: unknown[] }
>('scenario/importRdb', async (payload) => {
  await scenarioApi.importScenario({
    scenario: payload.scenario,
    images: payload.images,
  });
});

/**
 * シナリオの完全データ（GraphDB + RDB）をインポート
 */
export const importScenarioAction = createAsyncThunk<
  void,
  { graphData: GraphDBData; rdbData: RDBData }
>('scenario/import', async (payload, { dispatch }) => {
  // RDBとGraphDBを並行してインポート
  await Promise.all([
    dispatch(
      importScenarioRdbAction({
        scenario: payload.rdbData.scenario,
        images: payload.rdbData.images,
      }),
    ).unwrap(),
    dispatch(
      importScenarioGraphAction({
        nodes: payload.graphData.nodes,
        relationships: payload.graphData.relationships,
      }),
    ).unwrap(),
  ]);
});
