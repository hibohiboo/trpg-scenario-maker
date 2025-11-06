import { db } from './db/db';
import { createImageRepository } from './queries/imageRepository';
import { createScenarioRepository } from './queries/scenarioRepository';

export * from './db/db';
export * from './db/runMigrate';
export * from './queries/imageRepository';
export * from './queries/scenarioRepository';
export const imageRepository = createImageRepository(db);
export const scenarioRepository = createScenarioRepository(db);
