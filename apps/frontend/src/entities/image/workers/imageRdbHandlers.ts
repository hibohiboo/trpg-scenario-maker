import { imageRepository } from '@trpg-scenario-maker/rdb';
import {
  parseCreateImagePayload,
  parseImageIdRdbPayload,
  parseImageIdsPayload,
  parseToImage,
  parseToImageList,
} from '@trpg-scenario-maker/schema';

/**
 * 画像のRDB操作ハンドラー
 */
export const imageRdbHandlers = [
  {
    type: 'image:rdb:create',
    handler: async (payload: unknown) => {
      const { dataUrl } = parseCreateImagePayload(payload);
      const { id } = await imageRepository.create(dataUrl);

      const data = parseToImage({
        id,
        dataUrl,
      });

      return { data };
    },
  },
  {
    type: 'image:rdb:getById',
    handler: async (payload: unknown) => {
      const { id } = parseImageIdRdbPayload(payload);
      const result = await imageRepository.findById(id);
      const data =
        result == null
          ? null
          : parseToImage({
              ...result,
              createdAt: result.createdAt?.toISOString(),
            });

      return { data };
    },
  },
  {
    type: 'image:rdb:getByIds',
    handler: async (payload: unknown) => {
      const { ids } = parseImageIdsPayload(payload);
      const results = await imageRepository.findByIds(ids);
      const data = parseToImageList(
        results.map((r) => ({
          ...r,
          createdAt: r.createdAt?.toISOString(),
        })),
      );
      return { data };
    },
  },
  {
    type: 'image:rdb:delete',
    handler: async (payload: unknown) => {
      const { id } = parseImageIdRdbPayload(payload);
      await imageRepository.delete(id);

      return { success: true };
    },
  },
] as const;

type ImageRdbHandler = (typeof imageRdbHandlers)[number];

export type ImageRdbHandlerMap = {
  [H in ImageRdbHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{
    data: infer D;
  }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
