import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Character } from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import { characterGraphApi } from '../api/characterGraphApi';
import {
  closeCreateModal,
  closeDeleteModal,
  closeEditModal,
} from '../model/characterSlice';

export const createCharacterAction = createAsyncThunk<
  Character,
  { name: string; description: string },
  { dispatch: AppDispatch }
>('character/create', async (payload, { dispatch }) => {
  const newCharacter = await characterGraphApi.create({
    id: generateUUID(),
    name: payload.name,
    description: payload.description,
  });
  dispatch(closeCreateModal());
  await graphdbWorkerClient.save();
  return newCharacter;
});

export const updateCharacterAction = createAsyncThunk<
  Character,
  { id: string; name: string; description: string },
  { dispatch: AppDispatch }
>('character/update', async (payload, { dispatch }) => {
  const updatedCharacter = await characterGraphApi.update(payload);
  dispatch(closeEditModal());

  await graphdbWorkerClient.save();
  return updatedCharacter;
});

export const deleteCharacterAction = createAsyncThunk<
  string,
  { id: string },
  { dispatch: AppDispatch }
>('character/delete', async (payload, { dispatch }) => {
  await characterGraphApi.delete(payload.id);
  dispatch(closeDeleteModal());

  await graphdbWorkerClient.save();
  return payload.id;
});

export const readCharacterListAction = createAsyncThunk<Character[], void>(
  'character/readList',
  async () => characterGraphApi.getList(),
);
