import { useState } from 'react';
import { useCharacterImages } from '../hooks/useCharacterImages';
import { CharacterImageGallery } from './CharacterImageGallery';
import { CharacterImageUploadModal } from './CharacterImageUploadModal';

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

  const handleUpload = async (dataUrl: string, isPrimary: boolean) => {
    await addImage(dataUrl, isPrimary);
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
        onUpload={handleUpload}
        hasExistingImages={images.length > 0}
      />
    </>
  );
}
