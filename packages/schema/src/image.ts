import * as v from 'valibot';

/**
 * 画像スキーマ
 */
export const ImageSchema = v.object({
  /** 画像ID */
  id: v.string(),
  /** Data URL (base64エンコード画像) */
  dataUrl: v.string(),
  /** 作成日時 */
  createdAt: v.optional(v.string()),
});

/**
 * キャラクター画像関連スキーマ
 */
export const CharacterImageSchema = v.object({
  /** キャラクターID */
  characterId: v.string(),
  /** 画像ID */
  imageId: v.string(),
  /** メイン画像かどうか */
  isPrimary: v.boolean(),
});

/**
 * 画像の型
 */
export type Image = v.InferOutput<typeof ImageSchema>;

/**
 * キャラクター画像関連の型
 */
export type CharacterImage = v.InferOutput<typeof CharacterImageSchema>;

/**
 * 画像をパース
 */
export const parseToImage = (data: unknown): Image => {
  return v.parse(ImageSchema, data);
};

/**
 * 画像リストをパース
 */
export const parseToImageList = (data: unknown): Image[] => {
  return v.parse(v.array(ImageSchema), data);
};

/**
 * キャラクター画像関連をパース
 */
export const parseToCharacterImage = (data: unknown): CharacterImage => {
  return v.parse(CharacterImageSchema, data);
};

/**
 * キャラクター画像関連リストをパース
 */
export const parseToCharacterImageList = (data: unknown): CharacterImage[] => {
  return v.parse(v.array(CharacterImageSchema), data);
};
