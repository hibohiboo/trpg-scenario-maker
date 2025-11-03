import * as v from 'valibot';
/**
 * descriptionフィールドのスキーマ
 * nullの場合は空文字に変換する
 */
export const DescriptionSchema = v.pipe(
  v.nullable(v.string()),
  v.transform((value) => value ?? ''),
);

export const OptionalToStringSchema = v.pipe(
  v.optional(v.nullable(v.string())),
  v.transform((value) => value ?? ''),
);
