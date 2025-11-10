import {
  createExportRepository,
  createImportRepository,
  db,
} from '@trpg-scenario-maker/rdb';
import {
  parseRDBData,
  parseRDBExportPayload,
  type RDBData,
} from '@trpg-scenario-maker/schema';

/**
 * RDBエクスポート/インポートハンドラー
 */
export const scenarioRdbExportHandlers = [
  {
    type: 'exportScenarioRdb',
    handler: async (payload: unknown) => {
      const { scenarioId, imageIds } = parseRDBExportPayload(payload);
      const exportRepo = createExportRepository(db);
      const data = await exportRepo.exportScenario(scenarioId, imageIds);
      return { success: true, data };
    },
  },
  {
    type: 'importScenarioRdb',
    handler: async (payload: unknown) => {
      const { scenario, images } = parseRDBData(payload);
      console.log('rdb ok');

      const importRepo = createImportRepository(db);
      await importRepo.importScenario({ scenario, images });
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
