import { useEffect, useState } from 'react';
import { imageGraphApi } from '../api/imageGraphApi';
import { imageRdbApi } from '../api/imageRdbApi';

/**
 * キャラクターIDから画像IDを取得
 */
async function fetchImageIds(characterIds: string[]) {
  const imageIdPromises = characterIds.map(async (characterId) => {
    const result = await imageGraphApi.getPrimaryImageByCharacterId(characterId);
    return { characterId, imageId: result?.imageId || null };
  });

  return Promise.all(imageIdPromises);
}

/**
 * 画像IDリストから画像マップを作成
 */
function buildImageMap(
  imageIdResults: Array<{ characterId: string; imageId: string | null }>,
  images: Array<{ id: string; dataUrl: string }>,
): Record<string, string | null> {
  const imageMap: Record<string, string | null> = {};

  imageIdResults.forEach((result) => {
    if (result.imageId) {
      const image = images.find((img) => img.id === result.imageId);
      imageMap[result.characterId] = image?.dataUrl || null;
    } else {
      imageMap[result.characterId] = null;
    }
  });

  return imageMap;
}

/**
 * 複数キャラクターのメイン画像を取得するHook
 */
export const useMultipleCharacterImages = (characterIds: string[]) => {
  const [characterImages, setCharacterImages] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (characterIds.length === 0) {
      setCharacterImages({});
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const imageIdResults = await fetchImageIds(characterIds);

        const imageIds = imageIdResults
          .filter((result) => result.imageId)
          .map((result) => result.imageId!);

        if (imageIds.length === 0) {
          setCharacterImages({});
          setLoading(false);
          return;
        }

        const images = await imageRdbApi.getImagesByIds(imageIds);
        const imageMap = buildImageMap(imageIdResults, images);

        setCharacterImages(imageMap);
      } catch (err) {
        console.error('Failed to fetch character images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [characterIds]);

  return { characterImages, loading, error };
};
