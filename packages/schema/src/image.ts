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

// === Payload Schemas ===

/**
 * 画像ノード作成ペイロードスキーマ
 */
export const CreateImageNodePayloadSchema = v.object({
  imageId: v.string(),
});

/**
 * 画像リンク作成/更新ペイロードスキーマ
 */
export const ImageLinkPayloadSchema = v.object({
  characterId: v.string(),
  imageId: v.string(),
  isPrimary: v.boolean(),
});

/**
 * 画像リンク削除ペイロードスキーマ
 */
export const UnlinkImagePayloadSchema = v.object({
  characterId: v.string(),
  imageId: v.string(),
});

/**
 * 画像ID取得ペイロードスキーマ
 */
export const ImageIdPayloadSchema = v.object({
  imageId: v.string(),
});

/**
 * キャラクターID取得ペイロードスキーマ
 */
export const CharacterIdForImagePayloadSchema = v.object({
  characterId: v.string(),
});

// === Payload Parse Functions ===

export const parseCreateImageNodePayload = (data: unknown) => {
  return v.parse(CreateImageNodePayloadSchema, data);
};

export const parseImageLinkPayload = (data: unknown) => {
  return v.parse(ImageLinkPayloadSchema, data);
};

export const parseUnlinkImagePayload = (data: unknown) => {
  return v.parse(UnlinkImagePayloadSchema, data);
};

export const parseImageIdPayload = (data: unknown) => {
  return v.parse(ImageIdPayloadSchema, data);
};

export const parseCharacterIdForImagePayload = (data: unknown) => {
  return v.parse(CharacterIdForImagePayloadSchema, data);
};

// === GraphDB Response Schemas ===

/**
 * 画像ノードスキーマ
 */
export const ImageNodeSchema = v.object({
  id: v.string(),
});

/**
 * キャラクター画像リンクスキーマ
 */
export const CharacterImageLinkSchema = v.object({
  characterId: v.string(),
  imageId: v.string(),
  isPrimary: v.boolean(),
});

/**
 * 画像のキャラクター情報スキーマ
 */
export const ImageCharacterInfoSchema = v.object({
  characterId: v.string(),
  characterName: v.string(),
  isPrimary: v.boolean(),
});

/**
 * キャラクターの画像情報スキーマ
 */
export const CharacterImageInfoSchema = v.object({
  imageId: v.string(),
  isPrimary: v.boolean(),
});

// === GraphDB Response Parse Functions ===

export const parseImageNodeList = (data: unknown) => {
  return v.parse(v.array(ImageNodeSchema), data);
};

export const parseCharacterImageLinkList = (data: unknown) => {
  return v.parse(v.array(CharacterImageLinkSchema), data);
};

export const parseImageCharacterInfoList = (data: unknown) => {
  return v.parse(v.array(ImageCharacterInfoSchema), data);
};

export const parseCharacterImageInfoList = (data: unknown) => {
  return v.parse(v.array(CharacterImageInfoSchema), data);
};
