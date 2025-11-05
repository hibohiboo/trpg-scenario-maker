import { db } from './db/db';
import { createScenarioRepository } from './queries/scenarioRepository';
import { createImageRepository } from './queries/imageRepository';

export * from './queries/scenarioRepository';
export * from './queries/imageRepository';

export * from './db/db';
export * from './db/runMigrate';
export const scenarioRepository = createScenarioRepository(db);
export const imageRepository = createImageRepository(db);
