import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Relationship } from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { characterRelationGraphApi } from '../api/characterRelationGraphApi';
import {
  closeRelationshipCreateModal,
  closeRelationshipDeleteModal,
  closeRelationshipEditModal,
} from '../model/relationshipSlice';

/**
 * 関係性作成アクション
 */
export const createRelationshipAction = createAsyncThunk<
  Relationship,
  {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  },
  { dispatch: AppDispatch }
>('relationship/create', async (payload, { dispatch }) => {
  const newRelationship = await characterRelationGraphApi.create({
    id: uuidv4(),
    fromCharacterId: payload.fromCharacterId,
    toCharacterId: payload.toCharacterId,
    relationshipName: payload.relationshipName,
  });
  dispatch(closeRelationshipCreateModal());
  return newRelationship;
});

/**
 * 関係性更新アクション
 */
export const updateRelationshipAction = createAsyncThunk<
  Relationship,
  {
    fromCharacterId: string;
    toCharacterId: string;
    relationshipName: string;
  },
  { dispatch: AppDispatch }
>('relationship/update', async (payload, { dispatch }) => {
  const updatedRelationship = await characterRelationGraphApi.update(payload);
  dispatch(closeRelationshipEditModal());
  return updatedRelationship;
});

/**
 * 関係性削除アクション
 */
export const deleteRelationshipAction = createAsyncThunk<
  { fromCharacterId: string; toCharacterId: string },
  { fromCharacterId: string; toCharacterId: string },
  { dispatch: AppDispatch }
>('relationship/delete', async (payload, { dispatch }) => {
  await characterRelationGraphApi.delete(payload);
  dispatch(closeRelationshipDeleteModal());
  return payload;
});

/**
 * キャラクター単位での関係性取得アクション
 */
export const readRelationshipsByCharacterIdAction = createAsyncThunk<
  {
    outgoing: Relationship[];
    incoming: Relationship[];
  },
  string
>('relationship/readByCharacterId', async (characterId) =>
  characterRelationGraphApi.getByCharacterId(characterId),
);

/**
 * 全関係性取得アクション
 */
export const readAllRelationshipsAction = createAsyncThunk<
  Relationship[],
  void
>('relationship/readAll', async () => characterRelationGraphApi.getAll());
