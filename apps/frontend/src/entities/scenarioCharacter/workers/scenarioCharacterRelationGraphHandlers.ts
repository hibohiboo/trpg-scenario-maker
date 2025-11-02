import { scenarioCharacterRelationshipRepository } from '@trpg-scenario-maker/graphdb';
import { parseToScenarioCharacterRelationshipList } from '@trpg-scenario-maker/schema';

/**
 * シナリオ内キャラクター関係性のグラフDB操作ハンドラー
 */
export const scenarioCharacterRelationGraphHandlers = [
  {
    type: 'scenarioCharacterRelation:graph:create',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        fromCharacterId: string;
        toCharacterId: string;
        relationshipName: string;
      };
      const result =
        await scenarioCharacterRelationshipRepository.create(params);
      const [data] = parseToScenarioCharacterRelationshipList(result);
      if (!data) {
        throw new Error('Failed to create scenario character relation');
      }
      return { data };
    },
  },
  {
    type: 'scenarioCharacterRelation:graph:update',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        fromCharacterId: string;
        toCharacterId: string;
        relationshipName: string;
      };
      const result =
        await scenarioCharacterRelationshipRepository.update(params);
      const [data] = parseToScenarioCharacterRelationshipList(result);
      if (!data) {
        throw new Error('Failed to update scenario character relation');
      }
      return { data };
    },
  },
  {
    type: 'scenarioCharacterRelation:graph:delete',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        fromCharacterId: string;
        toCharacterId: string;
      };
      await scenarioCharacterRelationshipRepository.delete(params);
      return { success: true };
    },
  },
  {
    type: 'scenarioCharacterRelation:graph:getByScenarioId',
    handler: async (payload: unknown) => {
      const { scenarioId } = payload as { scenarioId: string };
      const result =
        await scenarioCharacterRelationshipRepository.findByScenarioId(
          scenarioId,
        );
      return { data: parseToScenarioCharacterRelationshipList(result) };
    },
  },
  {
    type: 'scenarioCharacterRelation:graph:getByScenarioAndCharacterId',
    handler: async (payload: unknown) => {
      const params = payload as {
        scenarioId: string;
        characterId: string;
      };
      const result =
        await scenarioCharacterRelationshipRepository.findByScenarioAndCharacterId(
          params,
        );
      return {
        data: {
          incoming: parseToScenarioCharacterRelationshipList(result.incoming),
          outgoing: parseToScenarioCharacterRelationshipList(result.outgoing),
        },
      };
    },
  },
] as const;

type ScenarioCharacterRelationGraphHandler =
  (typeof scenarioCharacterRelationGraphHandlers)[number];

export type ScenarioCharacterRelationGraphHandlerMap = {
  [H in ScenarioCharacterRelationGraphHandler as H['type']]: ReturnType<
    H['handler']
  > extends Promise<{ data: infer D }>
    ? D
    : ReturnType<H['handler']> extends Promise<{ success: boolean }>
      ? void
      : never;
};
