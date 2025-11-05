import {
  CharacterImageGallery,
  CharacterImageUploadModal,
} from '@trpg-scenario-maker/ui';
import { useState } from 'react';
import { useCharacterImages } from '../hooks/useCharacterImages';

interface CharacterImageManagerProps {
  characterId: string | null;
}

/**
 * キャラクター画像管理コンポーネント
 * 画像一覧表示とアップロード機能を統合
 */
export function CharacterImageManager({
  characterId,
}: CharacterImageManagerProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const {
    images,
    primaryImageId,
    loading,
    error,
    addImage,
    setPrimaryImage,
    deleteImage,
  } = useCharacterImages(characterId);

  const handleAddImage = () => {
    setIsUploadModalOpen(true);
  };

  const handleSubmit = async (dataUrl: string, isPrimary: boolean) => {
    setUploading(true);
    try {
      // 最初の画像は自動的にメイン画像にする
      const shouldBePrimary = images.length === 0 || isPrimary;
      await addImage(dataUrl, shouldBePrimary);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await setPrimaryImage(imageId);
    } catch (err) {
      console.error('Failed to set primary image:', err);
      alert('メイン画像の設定に失敗しました');
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId);
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('画像の削除に失敗しました');
    }
  };

  if (!characterId) {
    return (
      <div className="p-4 text-gray-500">
        キャラクターを選択してください
      </div>
    );
  }

  return (
    <>
      <CharacterImageGallery
        images={images}
        primaryImageId={primaryImageId}
        loading={loading}
        error={error}
        onSetPrimary={handleSetPrimary}
        onDelete={handleDelete}
        onAddImage={handleAddImage}
      />
      <CharacterImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleSubmit}
        hasExistingImages={images.length > 0}
        uploading={uploading}
      />
    </>
  );
}
