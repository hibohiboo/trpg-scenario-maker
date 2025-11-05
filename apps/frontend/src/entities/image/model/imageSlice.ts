import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Image } from '@trpg-scenario-maker/schema';
import {
  fetchCharacterImagesAction,
  addImageAction,
  setPrimaryImageAction,
  deleteImageAction,
} from '../actions/imageActions';

/**
 * キャラクター画像の状態
 */
export interface CharacterImageState {
  /** 画像一覧（キャラクターIDをキーとする） */
  imagesByCharacterId: Record<string, Image[]>;
  /** メイン画像ID（キャラクターIDをキーとする） */
  primaryImageIdByCharacterId: Record<string, string | null>;
  /** ロード中フラグ（キャラクターIDをキーとする） */
  loadingByCharacterId: Record<string, boolean>;
  /** エラーメッセージ（キャラクターIDをキーとする） */
  errorByCharacterId: Record<string, string | null>;
}

const initialState: CharacterImageState = {
  imagesByCharacterId: {},
  primaryImageIdByCharacterId: {},
  loadingByCharacterId: {},
  errorByCharacterId: {},
};

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    /**
     * エラーをクリア
     */
    clearError: (state, action: PayloadAction<{ characterId: string }>) => {
      state.errorByCharacterId[action.payload.characterId] = null;
    },
    /**
     * キャラクターの画像状態をクリア
     */
    clearCharacterImages: (state, action: PayloadAction<{ characterId: string }>) => {
      delete state.imagesByCharacterId[action.payload.characterId];
      delete state.primaryImageIdByCharacterId[action.payload.characterId];
      delete state.loadingByCharacterId[action.payload.characterId];
      delete state.errorByCharacterId[action.payload.characterId];
    },
  },
  extraReducers: (builder) => {
    // 画像一覧取得
    builder
      .addCase(fetchCharacterImagesAction.pending, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = true;
        state.errorByCharacterId[characterId] = null;
      })
      .addCase(fetchCharacterImagesAction.fulfilled, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
        state.imagesByCharacterId[characterId] = action.payload.images;
        state.primaryImageIdByCharacterId[characterId] = action.payload.primaryImageId;
      })
      .addCase(fetchCharacterImagesAction.rejected, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
        state.errorByCharacterId[characterId] =
          action.error.message || 'Failed to fetch images';
      });

    // 画像追加
    builder
      .addCase(addImageAction.pending, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = true;
        state.errorByCharacterId[characterId] = null;
      })
      .addCase(addImageAction.fulfilled, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
      })
      .addCase(addImageAction.rejected, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
        state.errorByCharacterId[characterId] =
          action.error.message || 'Failed to add image';
      });

    // メイン画像設定
    builder
      .addCase(setPrimaryImageAction.pending, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = true;
        state.errorByCharacterId[characterId] = null;
      })
      .addCase(setPrimaryImageAction.fulfilled, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
      })
      .addCase(setPrimaryImageAction.rejected, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
        state.errorByCharacterId[characterId] =
          action.error.message || 'Failed to set primary image';
      });

    // 画像削除
    builder
      .addCase(deleteImageAction.pending, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = true;
        state.errorByCharacterId[characterId] = null;
      })
      .addCase(deleteImageAction.fulfilled, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
      })
      .addCase(deleteImageAction.rejected, (state, action) => {
        const { characterId } = action.meta.arg;
        state.loadingByCharacterId[characterId] = false;
        state.errorByCharacterId[characterId] =
          action.error.message || 'Failed to delete image';
      });
  },
});

export const { clearError, clearCharacterImages } = imageSlice.actions;

/**
 * セレクター
 */
const stateSelector = (state: RootState) => state[imageSlice.reducerPath];

/**
 * キャラクターの画像一覧を取得
 */
export const selectImagesByCharacterId = (characterId: string | null) =>
  createSelector(stateSelector, (state) =>
    characterId ? state.imagesByCharacterId[characterId] || [] : [],
  );

/**
 * キャラクターのメイン画像IDを取得
 */
export const selectPrimaryImageIdByCharacterId = (characterId: string | null) =>
  createSelector(stateSelector, (state) =>
    characterId ? state.primaryImageIdByCharacterId[characterId] || null : null,
  );

/**
 * キャラクターのローディング状態を取得
 */
export const selectLoadingByCharacterId = (characterId: string | null) =>
  createSelector(stateSelector, (state) =>
    characterId ? state.loadingByCharacterId[characterId] || false : false,
  );

/**
 * キャラクターのエラーを取得
 */
export const selectErrorByCharacterId = (characterId: string | null) =>
  createSelector(stateSelector, (state) =>
    characterId ? state.errorByCharacterId[characterId] || null : null,
  );
