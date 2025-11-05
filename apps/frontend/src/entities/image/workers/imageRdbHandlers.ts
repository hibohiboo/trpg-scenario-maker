import { createImageRepository } from '@trpg-scenario-maker/rdb';
import { parseToImage, parseToImageList } from '@trpg-scenario-maker/schema';
import { getRdbDatabase } from '@/workers/rdb/rdbDatabase';

/**
 * 画像のRDB操作ハンドラー
 */
export const imageRdbHandlers = [
  {
    type: 'image:rdb:create',
    handler: async (payload: unknown) => {
      const { dataUrl } = payload as { dataUrl: string };
      const database = getRdbDatabase();
      const repository = createImageRepository(database);
      const result = await repository.create(dataUrl);

      return { data: result };
    },
  },
  {
    type: 'image:rdb:getById',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      const database = getRdbDatabase();
      const repository = createImageRepository(database);
      const result = await repository.findById(id);

      return { data: result };
    },
  },
  {
    type: 'image:rdb:getByIds',
    handler: async (payload: unknown) => {
      const { ids } = payload as { ids: string[] };
      const database = getRdbDatabase();
      const repository = createImageRepository(database);
      const result = await repository.findByIds(ids);

      return { data: result };
    },
  },
  {
    type: 'image:rdb:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      const database = getRdbDatabase();
      const repository = createImageRepository(database);
      await repository.delete(id);

      return { success: true };
    },
  },
] as const;

type ImageRdbHandler = (typeof imageRdbHandlers)[number];

export type ImageRdbHandlerMap = {
  [H in ImageRdbHandler as H['type']]: ReturnType<H['handler']> extends Promise<{
    data: infer D;
  }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
