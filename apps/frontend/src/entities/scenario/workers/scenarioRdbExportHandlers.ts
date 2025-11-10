import { createExportRepository, createImportRepository, db } from '@trpg-scenario-maker/rdb';
import type { RDBData } from '@trpg-scenario-maker/schema';

/**
 * RDBエクスポート/インポートハンドラー
 */
export const scenarioRdbExportHandlers = [
  {
    type: 'exportScenarioRdb',
    handler: async (payload: unknown) => {
      const { scenarioId, imageIds } = payload as {
        scenarioId: string;
        imageIds: string[];
      };
      if (!scenarioId) {
        throw new Error('scenarioId is required');
      }
      if (!Array.isArray(imageIds)) {
        throw new Error('imageIds must be an array');
      }

      const exportRepo = createExportRepository(db);
      const data = await exportRepo.exportScenario(scenarioId, imageIds);
      return { success: true, data };
    },
  },
  {
    type: 'importScenarioRdb',
    handler: async (payload: unknown) => {
      const { scenario, images } = payload as {
        scenario: unknown;
        images: unknown[];
      };
      if (!scenario) {
        throw new Error('scenario is required');
      }
      if (!Array.isArray(images)) {
        throw new Error('images must be an array');
      }

      const importRepo = createImportRepository(db);
      await importRepo.importScenario({ scenario, images } as never);
      return { success: true, data: { message: 'Scenario RDB data imported' } };
    },
  },
] as const;

type ScenarioRdbExportHandler = (typeof scenarioRdbExportHandlers)[number];

export type ScenarioRdbExportHandlerMap = {
  [H in ScenarioRdbExportHandler as H['type']]: H['type'] extends 'exportScenarioRdb'
    ? RDBData
    : H['type'] extends 'importScenarioRdb'
      ? { message: string }
      : never;
};
