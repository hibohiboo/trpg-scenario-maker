import {
  exportScenarioGraph,
  importScenarioGraph,
} from '@trpg-scenario-maker/graphdb';
import type { GraphDBData } from '@trpg-scenario-maker/schema';

export const scenarioExportHandlers = [
  {
    type: 'exportScenarioGraph',
    handler: async (payload: unknown) => {
      const { scenarioId } = payload as { scenarioId: string };
      if (!scenarioId) {
        throw new Error('scenarioId is required');
      }

      const data = await exportScenarioGraph(scenarioId);
      return { success: true, data };
    },
  },
  {
    type: 'importScenarioGraph',
    handler: async (payload: unknown) => {
      const { nodes, relationships } = payload as {
        nodes: unknown[];
        relationships: unknown[];
      };
      if (!nodes || !relationships) {
        throw new Error('nodes and relationships are required');
      }

      await importScenarioGraph(nodes as never, relationships as never);
      return { success: true, data: { message: 'Scenario graph imported' } };
    },
  },
] as const;

type ScenarioExportHandler = (typeof scenarioExportHandlers)[number];

export type ScenarioExportHandlerMap = {
  [H in ScenarioExportHandler as H['type']]: H['type'] extends 'exportScenarioGraph'
    ? GraphDBData
    : H['type'] extends 'importScenarioGraph'
      ? { message: string }
      : never;
};
