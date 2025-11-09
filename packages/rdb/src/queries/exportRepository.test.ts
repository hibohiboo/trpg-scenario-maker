import { PGlite } from '@electric-sql/pglite';
import { parseRDBData } from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { drizzle } from 'drizzle-orm/pglite';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';

import { createExportRepository } from './exportRepository';
import { createImageRepository } from './imageRepository';
import { createImportRepository } from './importRepository';
import { createScenarioRepository } from './scenarioRepository';

describe('RDB exportRepository / importRepository', () => {
  let testClient: PGlite;
  let testDb: ReturnType<typeof drizzle>;
  let scenarioRepo: ReturnType<typeof createScenarioRepository>;
  let imageRepo: ReturnType<typeof createImageRepository>;
  let exportRepo: ReturnType<typeof createExportRepository>;
  let importRepo: ReturnType<typeof createImportRepository>;

  beforeAll(async () => {
    // テスト用のインメモリデータベースを作成
    testClient = new PGlite();
    testDb = drizzle(testClient);

    // テーブルを作成
    await testClient.exec(`
      CREATE TABLE IF NOT EXISTS scenarios (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data_url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // リポジトリ初期化
    scenarioRepo = createScenarioRepository(testDb);
    imageRepo = createImageRepository(testDb);
    exportRepo = createExportRepository(testDb);
    importRepo = createImportRepository(testDb);
  });

  afterEach(async () => {
    // 各テスト後にデータをクリーンアップ
    await testClient.exec('DELETE FROM images');
    await testClient.exec('DELETE FROM scenarios');
  });

  it('画像なしのシナリオをエクスポートできる', async () => {
    // Arrange: シナリオ作成
    const scenarioId = generateUUID();
    await scenarioRepo.create({
      id: scenarioId,
      title: 'テストシナリオ',
    });

    // Act: エクスポート
    const exported = await exportRepo.exportScenario(scenarioId, []);

    // Assert: スキーマ検証
    expect(() => parseRDBData(exported)).not.toThrow();

    // Assert: データ検証
    expect(exported.scenario.id).toBe(scenarioId);
    expect(exported.scenario.title).toBe('テストシナリオ');
    expect(exported.images).toHaveLength(0);
  });

  it('画像を含むシナリオをエクスポートできる', async () => {
    // Arrange: シナリオ + 画像作成
    const scenarioId = generateUUID();
    await scenarioRepo.create({
      id: scenarioId,
      title: '画像付きシナリオ',
    });

    const image1 = await imageRepo.create('data:image/png;base64,iVBORw0KGg==');
    const image2 = await imageRepo.create('data:image/png;base64,AAAA==');

    // Act: エクスポート
    const exported = await exportRepo.exportScenario(scenarioId, [
      image1.id,
      image2.id,
    ]);

    // Assert: スキーマ検証
    expect(() => parseRDBData(exported)).not.toThrow();

    // Assert: データ検証
    expect(exported.scenario.id).toBe(scenarioId);
    expect(exported.images).toHaveLength(2);
    expect(exported.images.map((i) => i.id)).toContain(image1.id);
    expect(exported.images.map((i) => i.id)).toContain(image2.id);
  });

  it('エクスポート→インポートで往復できる', async () => {
    // Arrange: シナリオ + 画像作成
    const originalScenarioId = generateUUID();
    await scenarioRepo.create({
      id: originalScenarioId,
      title: '往復テストシナリオ',
    });

    const image = await imageRepo.create('data:image/png;base64,TEST==');

    // Act: エクスポート
    const exported = await exportRepo.exportScenario(originalScenarioId, [
      image.id,
    ]);

    // Assert: スキーマ検証
    expect(() => parseRDBData(exported)).not.toThrow();

    // Arrange: 元データ削除
    await imageRepo.delete(image.id);
    await scenarioRepo.delete(originalScenarioId);

    // Act: インポート
    await importRepo.importScenario(exported);

    // Assert: 再取得して検証
    const reimportedScenario = (await scenarioRepo.findAll()).find(
      (s) => s.id === originalScenarioId,
    );
    const reimportedImage = await imageRepo.findById(image.id);

    expect(reimportedScenario).toBeDefined();
    expect(reimportedScenario?.title).toBe('往復テストシナリオ');
    expect(reimportedImage).toBeDefined();
    expect(reimportedImage?.dataUrl).toBe('data:image/png;base64,TEST==');
  });
});
