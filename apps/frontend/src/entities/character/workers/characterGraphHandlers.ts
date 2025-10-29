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
      const [data] = parseToCharacterList(result);

      if (!data) {
        throw new Error(
          'Failed to create character: No result returned from database',
        );
      }

      return { data };
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
      const [data] = parseToCharacterList(result);
      if (data) {
        throw new Error(
          'Failed to update character: Character not found or no result returned',
        );
      }
      return { data };
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
] as const;

type CharacterGraphHandler = (typeof characterGraphHandlers)[number];

export type CharacterGraphHandlerMap = {
  [H in CharacterGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
