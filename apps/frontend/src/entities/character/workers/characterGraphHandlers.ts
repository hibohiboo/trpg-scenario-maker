import { characterGraphRepository } from '@trpg-scenario-maker/graphdb';
import { parseToCharacterList } from '@trpg-scenario-maker/schema';

/**
 * キャラクターのグラフDB操作ハンドラー
 */
export const characterGraphHandlers = [
  {
    type: 'character:graph:getList',
    handler: async () => {
      const result = await characterGraphRepository.findAll();
      return { data: parseToCharacterList(result) };
    },
  },
  {
    type: 'character:graph:getById',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      const result = await characterGraphRepository.findById(id);
      return { data: parseToCharacterList(result) };
    },
  },
  {
    type: 'character:graph:create',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
        name: string;
        description: string;
      };
      const result = await characterGraphRepository.create(params);
      return { data: parseToCharacterList(result) };
    },
  },
  {
    type: 'character:graph:update',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
        name: string;
        description: string;
      };
      const result = await characterGraphRepository.update(params);
      return { data: parseToCharacterList(result) };
    },
  },
  {
    type: 'character:graph:delete',
    handler: async (payload: unknown) => {
      const { id } = payload as { id: string };
      await characterGraphRepository.delete(id);
      return { success: true };
    },
  },
];
