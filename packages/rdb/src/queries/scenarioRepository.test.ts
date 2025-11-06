import { PGlite } from '@electric-sql/pglite';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { drizzle } from 'drizzle-orm/pglite';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { createScenarioRepository } from './scenarioRepository';

describe('scenarioRepository', () => {
  let testClient: PGlite;
  let testDb: ReturnType<typeof drizzle>;
  let repository: ReturnType<typeof createScenarioRepository>;

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
    `);

    // DI経由でリポジトリを作成
    repository = createScenarioRepository(testDb);
  });

  afterEach(async () => {
    // 各テスト後にテーブルをクリア
    await testClient.exec('TRUNCATE TABLE scenarios;');
  });

  describe('count', () => {
    it('シナリオが0件の場合、0を返す', async () => {
      const count = await repository.count();
      expect(count).toBe(0);
    });

    it('シナリオが作成された後、正しい件数を返す', async () => {
      await repository.create({
        id: generateUUID(),
        title: 'テストシナリオ1',
      });
      await repository.create({
        id: generateUUID(),
        title: 'テストシナリオ2',
      });

      const count = await repository.count();
      expect(count).toBe(2);
    });
  });

  describe('findAll', () => {
    it('シナリオが0件の場合、空配列を返す', async () => {
      const scenarios = await repository.findAll();
      expect(scenarios).toEqual([]);
    });

    it('全シナリオを更新日時の降順で取得できる', async () => {
      const scenario1 = await repository.create({
        id: generateUUID(),
        title: 'シナリオ1',
      });

      // 少し待機して更新日時を異なるものにする
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      const scenario2 = await repository.create({
        id: generateUUID(),
        title: 'シナリオ2',
      });

      const scenarios = await repository.findAll();
      expect(scenarios).toHaveLength(2);
      // 新しいものが先頭に来る
      expect(scenarios[0].id).toBe(scenario2.id);
      expect(scenarios[1].id).toBe(scenario1.id);
    });
  });

  describe('create', () => {
    it('新しいシナリオを作成できる', async () => {
      const newScenario = {
        id: generateUUID(),
        title: 'テストシナリオ',
      };

      const result = await repository.create(newScenario);

      expect(result).toBeDefined();
      expect(result.id).toBe(newScenario.id);
      expect(result.title).toBe(newScenario.title);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('既存のシナリオを更新できる', async () => {
      // まずシナリオを作成
      const newScenario = {
        id: generateUUID(),
        title: '更新前のタイトル',
      };
      const created = await repository.create(newScenario);

      // 少し待機して更新日時が確実に異なるようにする
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // 更新
      const updated = await repository.update(created.id, {
        title: '更新後のタイトル',
      });

      expect(updated).toBeDefined();
      expect(updated.title).toBe('更新後のタイトル');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime(),
      );
    });
  });

  describe('delete', () => {
    it('シナリオを削除できる', async () => {
      // まずシナリオを作成
      const newScenario = {
        id: generateUUID(),
        title: '削除対象シナリオ',
      };
      const created = await repository.create(newScenario);

      // 削除前に存在確認
      const beforeDelete = await repository.findAll();
      const exists = beforeDelete.some((s) => s.id === created.id);
      expect(exists).toBe(true);

      // 削除
      await repository.delete(created.id);

      // 削除後に存在しないことを確認
      const afterDelete = await repository.findAll();
      const notExists = !afterDelete.some((s) => s.id === created.id);
      expect(notExists).toBe(true);
    });
  });
});
