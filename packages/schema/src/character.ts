import * as v from 'valibot';
import { DescriptionSchema } from './common';

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
