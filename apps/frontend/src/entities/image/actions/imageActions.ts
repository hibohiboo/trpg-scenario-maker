import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Image } from '@trpg-scenario-maker/schema';
import { graphdbWorkerClient } from '@/workers/graphdbWorkerClient';
import { imageGraphApi } from '../api/imageGraphApi';
import { imageRdbApi } from '../api/imageRdbApi';

/**
 * キャラクターの画像一覧を取得
 */
export const fetchCharacterImagesAction = createAsyncThunk<
  {
    images: Image[];
    primaryImageId: string | null;
  },
  { characterId: string }
>('image/fetchCharacterImages', async ({ characterId }) => {
  // GraphDBからキャラクターの画像ID一覧を取得
  const imageLinks = await imageGraphApi.getImagesByCharacterId(characterId);

  if (imageLinks.length === 0) {
    return {
      images: [],
      primaryImageId: null,
    };
  }

  // RDBから画像データを取得
  const imageIds = imageLinks.map((link) => link.imageId);
  const imageData = await imageRdbApi.getImagesByIds(imageIds);

  // isPrimaryフラグをマージし、createdAtをシリアライズ可能な形式に変換
  const imagesWithPrimary = imageData.map((img) => {
    const link = imageLinks.find((l) => l.imageId === img.id);
    return {
      ...img,
      createdAt: img.createdAt,
      isPrimary: link?.isPrimary || false,
    };
  });

  // isPrimary順でソート
  imagesWithPrimary.sort(
    (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
  );

  return {
    images: imagesWithPrimary,
    primaryImageId: imageLinks.find((link) => link.isPrimary)?.imageId || null,
  };
});

/**
 * 画像を追加
 */
export const addImageAction = createAsyncThunk<
  void,
  { characterId: string; dataUrl: string; isPrimary?: boolean }
>('image/addImage', async ({ characterId, dataUrl, isPrimary = false }) => {
  // メイン画像として追加する場合、既存のメイン画像をfalseに
  if (isPrimary) {
    const imageLinks = await imageGraphApi.getImagesByCharacterId(characterId);
    const currentPrimaryImage = imageLinks.find((link) => link.isPrimary);

    if (currentPrimaryImage) {
      await imageGraphApi.updateLink({
        characterId,
        imageId: currentPrimaryImage.imageId,
        isPrimary: false,
      });
    }
  }

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

  // GraphDBデータを保存（RDBは自動保存）
  await graphdbWorkerClient.save();
});

/**
 * メイン画像を設定
 */
export const setPrimaryImageAction = createAsyncThunk<
  void,
  { characterId: string; imageId: string; currentPrimaryImageId: string | null }
>(
  'image/setPrimaryImage',
  async ({ characterId, imageId, currentPrimaryImageId }) => {
    // 既存のメイン画像をfalseに
    if (currentPrimaryImageId && currentPrimaryImageId !== imageId) {
      await imageGraphApi.updateLink({
        characterId,
        imageId: currentPrimaryImageId,
        isPrimary: false,
      });
    }

    // 新しい画像をメインに設定
    await imageGraphApi.updateLink({
      characterId,
      imageId,
      isPrimary: true,
    });

    // データを保存
    await graphdbWorkerClient.save();
  },
);

/**
 * 画像を削除
 */
export const deleteImageAction = createAsyncThunk<
  void,
  { characterId: string; imageId: string }
>('image/deleteImage', async ({ characterId, imageId }) => {
  // 削除前に、この画像がメイン画像かどうか確認
  const imageLinks = await imageGraphApi.getImagesByCharacterId(characterId);
  const deletedImageLink = imageLinks.find((link) => link.imageId === imageId);
  const wasMainImage = deletedImageLink?.isPrimary || false;

  // キャラクターとの関連を削除
  await imageGraphApi.unlinkFromCharacter({
    characterId,
    imageId,
  });

  // メイン画像を削除した場合、残りの画像の最初の1つをメイン画像に設定
  if (wasMainImage) {
    const remainingImages = imageLinks.filter(
      (link) => link.imageId !== imageId,
    );
    if (remainingImages.length > 0) {
      // 最初の画像をメイン画像に設定
      await imageGraphApi.updateLink({
        characterId,
        imageId: remainingImages[0].imageId,
        isPrimary: true,
      });
    }
  }

  // 他のキャラクターが使用していないか確認
  const characters = await imageGraphApi.getCharactersByImageId(imageId);

  // 誰も使用していなければ画像ノードとデータを削除
  if (characters.length === 0) {
    await imageGraphApi.deleteNode(imageId);
    await imageRdbApi.deleteImage(imageId);
  }

  // GraphDBデータを保存（RDBは自動保存）
  await graphdbWorkerClient.save();
});
