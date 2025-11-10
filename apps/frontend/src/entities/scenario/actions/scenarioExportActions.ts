import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  parseRDBData,
  type GraphDBData,
  type RDBData,
} from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { scenarioApi } from '../api/scenarioApi';
import { scenarioGraphApi } from '../api/scenarioGraphApi';
import { readScenarioAction } from './scenarioActions';

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
    dispatch(
      exportScenarioGraphAction({ scenarioId: payload.scenarioId }),
    ).unwrap(),
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
  const payloadData = parseRDBData(payload);
  await scenarioApi.importScenario(payloadData);
  console.log('import rdb');
});

/**
 * シナリオの完全データ（GraphDB + RDB）をインポート
 */
export const importScenarioAction = createAsyncThunk<
  void,
  { graphData: GraphDBData; rdbData: RDBData }
>('scenario/import', async (payload, { dispatch }) => {
  const { title } = payload.rdbData.scenario;
  const scenario = {
    id: generateUUID(),
    title: `${title}のコピー`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const images = payload.rdbData.images.map((d) => ({
    ...d,
    id: generateUUID(),
    originalId: d.id,
  }));
  const nodes = payload.graphData.nodes.map((n) => {
    const base = { ...n, originalId: n.id };
    if (n.label === 'Scenario') {
      return { ...base, id: scenario.id };
    }
    if (n.label === 'Image') {
      return { ...base, id: images.find((i) => i.originalId === n.id)?.id };
    }
    return { ...base, id: generateUUID() };
  });
  const relationships = payload.graphData.relationships.map((r) => {
    const from = nodes.find((n) => n.originalId === r.from)?.id;
    const to = nodes.find((n) => n.originalId === r.to)?.id;
    let ret = { ...r, from, to };
    if (r.properties.id) {
      ret = {
        ...ret,
        properties: { ...ret.properties, id: generateUUID() },
      };
    }
    if (r.properties.scenarioId) {
      ret = {
        ...ret,
        properties: { ...ret.properties, scenarioId: scenario.id },
      };
    }
    return ret;
  });

  // RDBとGraphDBを並行してインポート
  await Promise.all([
    dispatch(
      importScenarioRdbAction({
        scenario,
        images,
      }),
    ).unwrap(),
    dispatch(
      importScenarioGraphAction({
        nodes: nodes.map((n) => ({ ...n, originalId: undefined })),
        relationships,
      }),
    ).unwrap(),
  ]);
  await dispatch(readScenarioAction());
});
