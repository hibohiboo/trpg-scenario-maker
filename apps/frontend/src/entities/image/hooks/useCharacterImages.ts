import type { Image } from '@trpg-scenario-maker/schema';
import { useState, useEffect, useCallback } from 'react';
import { imageGraphApi } from '../api/imageGraphApi';
import { imageRdbApi } from '../api/imageRdbApi';

/**
 * キャラクターの画像管理Hook
 */
export const useCharacterImages = (characterId: string | null) => {
  const [images, setImages] = useState<Image[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // キャラクターの画像一覧を取得
  const fetchImages = useCallback(async () => {
    if (!characterId) {
      setImages([]);
      setPrimaryImageId(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // GraphDBからキャラクターの画像ID一覧を取得
      const imageLinks = await imageGraphApi.getImagesByCharacterId(characterId);

      if (imageLinks.length === 0) {
        setImages([]);
        setPrimaryImageId(null);
        return;
      }

      // RDBから画像データを取得
      const imageIds = imageLinks.map((link) => link.imageId);
      const imageData = await imageRdbApi.getImagesByIds(imageIds);

      // isPrimaryフラグをマージ
      const imagesWithPrimary = imageData.map((img) => {
        const link = imageLinks.find((l) => l.imageId === img.id);
        return {
          ...img,
          isPrimary: link?.isPrimary || false,
        };
      });

      // isPrimary順でソート
      imagesWithPrimary.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

      setImages(imagesWithPrimary);
      setPrimaryImageId(
        imageLinks.find((link) => link.isPrimary)?.imageId || null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      console.error('Failed to fetch character images:', err);
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  // 画像を追加
  const addImage = useCallback(
    async (dataUrl: string, isPrimary: boolean = false) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }

      setLoading(true);
      setError(null);

      try {
        // RDBに画像データを保存
        const { id: imageId } = await imageRdbApi.createImage(dataUrl);

        // GraphDBに画像ノードを作成
        await imageGraphApi.createNode(imageId);

        // キャラクターと画像を関連付け
        await imageGraphApi.linkToCharacter({
          characterId,
          imageId,
          isPrimary,
        });

        // 画像一覧を再取得
        await fetchImages();

        return imageId;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add image');
        console.error('Failed to add image:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [characterId, fetchImages],
  );

  // メイン画像を設定
  const setPrimaryImage = useCallback(
    async (imageId: string) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }

      setLoading(true);
      setError(null);

      try {
        // 既存のメイン画像をfalseに
        if (primaryImageId && primaryImageId !== imageId) {
          await imageGraphApi.updateLink({
            characterId,
            imageId: primaryImageId,
            isPrimary: false,
          });
        }

        // 新しい画像をメインに設定
        await imageGraphApi.updateLink({
          characterId,
          imageId,
          isPrimary: true,
        });

        // 画像一覧を再取得
        await fetchImages();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to set primary image',
        );
        console.error('Failed to set primary image:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [characterId, primaryImageId, fetchImages],
  );

  // 画像を削除
  const deleteImage = useCallback(
    async (imageId: string) => {
      if (!characterId) {
        throw new Error('Character ID is required');
      }

      setLoading(true);
      setError(null);

      try {
        // キャラクターとの関連を削除
        await imageGraphApi.unlinkFromCharacter({
          characterId,
          imageId,
        });

        // 他のキャラクターが使用していないか確認
        const characters = await imageGraphApi.getCharactersByImageId(imageId);

        // 誰も使用していなければ画像ノードとデータを削除
        if (characters.length === 0) {
          await imageGraphApi.deleteNode(imageId);
          await imageRdbApi.deleteImage(imageId);
        }

        // 画像一覧を再取得
        await fetchImages();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete image');
        console.error('Failed to delete image:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [characterId, fetchImages],
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
