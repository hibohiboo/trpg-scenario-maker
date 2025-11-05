import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/store';
import {
  fetchCharacterImagesAction,
  addImageAction,
  setPrimaryImageAction,
  deleteImageAction,
} from '../actions/imageActions';
import {
  selectImagesByCharacterId,
  selectPrimaryImageIdByCharacterId,
  selectLoadingByCharacterId,
  selectErrorByCharacterId,
} from '../model/imageSlice';

/**
 * キャラクターの画像管理Hook
 */
export const useCharacterImages = (characterId: string | null) => {
  const dispatch = useAppDispatch();

  // セレクターを使用して状態を取得
  const images = useSelector(selectImagesByCharacterId(characterId));
  const primaryImageId = useSelector(
    selectPrimaryImageIdByCharacterId(characterId),
  );
  const loading = useSelector(selectLoadingByCharacterId(characterId));
  const error = useSelector(selectErrorByCharacterId(characterId));

  // キャラクターの画像一覧を取得
  const fetchImages = useCallback(async () => {
    if (!characterId) {
      return;
    }

    await dispatch(fetchCharacterImagesAction({ characterId })).unwrap();
  }, [characterId, dispatch]);

  // 画像を追加
  const addImage = useCallback(
    async (dataUrl: string, isPrimary: boolean = false) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }

      await dispatch(
        addImageAction({
          characterId,
          dataUrl,
          isPrimary,
        }),
      ).unwrap();

      // 画像一覧を再取得
      await fetchImages();
    },
    [characterId, dispatch, fetchImages],
  );

  // メイン画像を設定
  const setPrimaryImage = useCallback(
    async (imageId: string) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }
      console.log('main', primaryImageId, imageId);
      await dispatch(
        setPrimaryImageAction({
          characterId,
          imageId,
          currentPrimaryImageId: primaryImageId,
        }),
      ).unwrap();

      // 画像一覧を再取得
      await fetchImages();
    },
    [characterId, primaryImageId, dispatch, fetchImages],
  );

  // 画像を削除
  const deleteImage = useCallback(
    async (imageId: string) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }

      await dispatch(
        deleteImageAction({
          characterId,
          imageId,
        }),
      ).unwrap();

      // 画像一覧を再取得
      await fetchImages();
    },
    [characterId, dispatch, fetchImages],
  );

  // 初回読み込み
  useEffect(() => {
    fetchImages().catch((err) => {
      console.error('Failed to fetch images on mount:', err);
    });
  }, [fetchImages]);

  return {
    images,
    primaryImageId,
    loading,
    error,
    addImage,
    setPrimaryImage,
    deleteImage,
    refetch: fetchImages,
  };
};
