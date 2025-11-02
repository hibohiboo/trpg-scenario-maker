import { relationshipGraphRepository } from '@trpg-scenario-maker/graphdb';
import { parseToRelationshipList } from '@trpg-scenario-maker/schema';

/**
 * キャラクター関係性のグラフDB操作ハンドラー
 */
export const characterRelationGraphHandlers = [
  {
    type: 'characterRelation:graph:create',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
        fromCharacterId: string;
        toCharacterId: string;
        relationshipName: string;
      };
      const result = await relationshipGraphRepository.create(params);
      const [data] = parseToRelationshipList(result);
      if (!data) {
        throw new Error('Failed to create character relation');
      }
      return { data };
    },
  },
  {
    type: 'characterRelation:graph:update',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
        relationshipName: string;
      };
      const result = await relationshipGraphRepository.update(params);
      const [data] = parseToRelationshipList(result);
      if (!data) {
        throw new Error('Failed to update character relation');
      }
      return { data };
    },
  },
  {
    type: 'characterRelation:graph:delete',
    handler: async (payload: unknown) => {
      const params = payload as {
        id: string;
      };
      await relationshipGraphRepository.delete(params);
      return { success: true };
    },
  },
  {
    type: 'characterRelation:graph:getByCharacterId',
    handler: async (payload: unknown) => {
      const { characterId } = payload as { characterId: string };
      const result =
        await relationshipGraphRepository.findByCharacterId(characterId);
      return {
        data: {
          incoming: parseToRelationshipList(result?.incoming),
          outgoing: parseToRelationshipList(result?.outgoing),
        },
      };
    },
  },
  {
    type: 'characterRelation:graph:getAll',
    handler: async () => {
      const result = await relationshipGraphRepository.findAll();
      return { data: parseToRelationshipList(result) };
    },
  },
] as const;

type CharacterRelationGraphHandler =
  (typeof characterRelationGraphHandlers)[number];

export type CharacterRelationGraphHandlerMap = {
  [H in CharacterRelationGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
