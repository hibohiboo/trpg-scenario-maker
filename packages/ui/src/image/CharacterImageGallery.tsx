export interface ImageData {
  id: string;
  dataUrl: string;
  isPrimary?: boolean;
}

export interface CharacterImageGalleryProps {
  images: ImageData[];
  primaryImageId: string | null;
  loading: boolean;
  error: string | null;
  onSetPrimary: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onAddImage: () => void;
}

/**
 * キャラクターの画像ギャラリーコンポーネント（プレゼンテーショナル）
 */
export function CharacterImageGallery({
  images,
  primaryImageId,
  loading,
  error,
  onSetPrimary,
  onDelete,
  onAddImage,
}: CharacterImageGalleryProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">画像</h3>
        <button
          onClick={onAddImage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          画像を追加
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded">
          <p className="text-gray-500">画像が登録されていません</p>
          <button
            onClick={onAddImage}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            最初の画像を追加
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => {
            const isPrimary = image.id === primaryImageId;
            return (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden ${
                  isPrimary ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image.dataUrl}
                  alt="Character"
                  className="w-full h-48 object-cover"
                />
                {isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    メイン
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex gap-2">
                  {!isPrimary && (
                    <button
                      onClick={() => onSetPrimary(image.id)}
                      className="flex-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      メインに設定
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'この画像を削除してもよろしいですか？',
                        )
                      ) {
                        onDelete(image.id);
                      }
                    }}
                    className="flex-1 text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
