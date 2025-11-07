import { createAsyncThunk } from '@reduxjs/toolkit';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import { scenarioCharacterGraphApi } from '../api/scenarioCharacterGraphApi';
import { scenarioCharacterRelationGraphApi } from '../api/scenarioCharacterRelationGraphApi';
import type {
  ScenarioCharacter,
  ScenarioCharacterRelationship,
} from '@trpg-scenario-maker/schema';

/**
 * キャラクターをシナリオに追加
 */
export const addCharacterToScenarioAction = createAsyncThunk<
  ScenarioCharacter,
  { scenarioId: string; characterId: string; role?: string }
>('scenarioCharacter/addToScenario', async (payload) => {
  const scenarioCharacter =
    await scenarioCharacterGraphApi.addToScenario(payload);
  await graphdbWorkerClient.save();
  return scenarioCharacter;
});

/**
 * シナリオからキャラクターを削除
 */
export const removeCharacterFromScenarioAction = createAsyncThunk<
  { scenarioId: string; characterId: string },
  { scenarioId: string; characterId: string }
>('scenarioCharacter/removeFromScenario', async (payload) => {
  await scenarioCharacterGraphApi.removeFromScenario(payload);
  await graphdbWorkerClient.save();
  return payload;
});

/**
 * シナリオ内でのキャラクターの役割を更新
 */
export const updateCharacterRoleAction = createAsyncThunk<
  ScenarioCharacter,
  { scenarioId: string; characterId: string; role: string }
>('scenarioCharacter/updateRole', async (payload) => {
  const scenarioCharacter = await scenarioCharacterGraphApi.updateRole(payload);
  await graphdbWorkerClient.save();
  return scenarioCharacter;
});

/**
 * シナリオに登場するキャラクター一覧を取得
 */
export const readScenarioCharactersAction = createAsyncThunk<
  ScenarioCharacter[],
  { scenarioId: string }
>('scenarioCharacter/readList', async (payload) =>
  scenarioCharacterGraphApi.getByScenarioId(payload.scenarioId),
);

/**
 * シナリオ内の関係性を作成
 */
export const createScenarioCharacterRelationAction = createAsyncThunk<
  ScenarioCharacterRelationship,
  {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }
>('scenarioCharacterRelation/create', async (payload) => {
  const relation = await scenarioCharacterRelationGraphApi.create(payload);
  await graphdbWorkerClient.save();
  return relation;
});

/**
 * シナリオ内の関係性を更新
 */
export const updateScenarioCharacterRelationAction = createAsyncThunk<
  ScenarioCharacterRelationship,
  {
    scenarioId: string;
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  }
>('scenarioCharacterRelation/update', async (payload) => {
  const relation = await scenarioCharacterRelationGraphApi.update(payload);
  await graphdbWorkerClient.save();
  return relation;
});

/**
 * シナリオ内の関係性を削除
 */
export const deleteScenarioCharacterRelationAction = createAsyncThunk<
  { scenarioId: string; fromCharacterId: string; toCharacterId: string },
  { scenarioId: string; fromCharacterId: string; toCharacterId: string }
>('scenarioCharacterRelation/delete', async (payload) => {
  await scenarioCharacterRelationGraphApi.delete(payload);
  await graphdbWorkerClient.save();
  return payload;
});

/**
 * シナリオ内の全関係性を取得
 */
export const readScenarioCharacterRelationsAction = createAsyncThunk<
  ScenarioCharacterRelationship[],
  { scenarioId: string }
>('scenarioCharacterRelation/readList', async (payload) =>
  scenarioCharacterRelationGraphApi.getByScenarioId(payload.scenarioId),
);
