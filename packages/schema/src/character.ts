import * as v from 'valibot';
import { DescriptionSchema, OptionalToStringSchema } from './common';
import { ImageSchema } from './image';

/**
 * キャラクタースキーマ
 */
export const CharacterSchema = v.object({
  /** キャラクターID */
  id: v.string(),
  /** キャラクター名 */
  name: v.string(),
  /** 説明 */
  description: DescriptionSchema,
  /** メイン画像ID */
  primaryImageId: OptionalToStringSchema,
});

/**
 * 画像配列を含むキャラクタースキーマ
 */
export const CharacterWithImagesSchema = v.object({
  /** キャラクターID */
  id: v.string(),
  /** キャラクター名 */
  name: v.string(),
  /** 説明 */
  description: DescriptionSchema,
  /** メイン画像ID */
  primaryImageId: OptionalToStringSchema,
  /** 画像配列 */
  images: v.optional(v.array(ImageSchema)),
});

/**
 * キャラクター作成・更新用の入力データスキーマ
 */
export const CharacterFormDataSchema = v.object({
  /** キャラクター名 */
  name: v.string(),
  /** 説明 */
  description: v.string(),
});

/**
 * キャラクターの型
 */
export type Character = v.InferOutput<typeof CharacterSchema>;

/**
 * キャラクター作成・更新用の入力データ型
 */
export type CharacterFormData = v.InferOutput<typeof CharacterFormDataSchema>;

/**
 * パース時にCharacter型に変換するスキーマ
 */
export const parseToCharacter = (data: unknown): Character => {
  return v.parse(CharacterSchema, data);
};

export const parseToCharacterList = (data: unknown) => {
  return v.parse(v.array(CharacterSchema), data);
};
