import { imageRepository } from '@trpg-scenario-maker/rdb';

/**
 * 画像のRDB操作ハンドラー
 */
export const imageRdbHandlers = [
  {
    type: 'image:rdb:create',
    handler: async (payload: unknown) => {
      const { dataUrl } = payload as { dataUrl: string };
      const result = await imageRepository.create(dataUrl);

      return { data: result };
    },
  },
  {
    type: 'image:rdb:getById',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      const result = await imageRepository.findById(id);
      const data =
        result == null
          ? null
          : // Redux stateで使用するため、Date型をISO文字列に変換
            { ...result, createdAt: result.createdAt?.toISOString() };

      return { data };
    },
  },
  {
    type: 'image:rdb:getByIds',
    handler: async (payload: unknown) => {
      const { ids } = payload as { ids: string[] };
      const results = await imageRepository.findByIds(ids);
      const data = results.map((r) => ({
        ...r,
        createdAt: r.createdAt?.toISOString(),
      }));
      return { data };
    },
  },
  {
    type: 'image:rdb:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
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
