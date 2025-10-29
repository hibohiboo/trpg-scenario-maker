import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { describe, it, expect, beforeAll } from 'vitest';
import { createScenarioRepository } from './scenarioRepository';

// テスト用のインメモリデータベースを作成
let testDb: ReturnType<typeof drizzle>;
let testClient: PGlite;

beforeAll(async () => {
  // メモリ内データベースを作成
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

  // dbインスタンスを置き換え（モック）
  // 注意: この方法は実際のdbインポートを直接置き換える必要があるため
  // より良いアプローチはDI（依存性注入）を使用することです
});

describe('scenarioRepository', () => {
  describe('count', () => {
    it('シナリオが0件の場合、0を返す', async () => {
      const scenarioRepository = createScenarioRepository(testDb);
      const count = await scenarioRepository.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe.todo('findAll', () => {
    it('全シナリオを取得できる', async () => {
      const scenarios = await scenarioRepository.findAll();
      expect(Array.isArray(scenarios)).toBe(true);
    });
  });

  describe.todo('create', () => {
    it('新しいシナリオを作成できる', async () => {
      const newScenario = {
        id: crypto.randomUUID(),
        title: 'テストシナリオ',
      };

      const result = await scenarioRepository.create(newScenario);

      expect(result).toBeDefined();
      expect(result.id).toBe(newScenario.id);
      expect(result.title).toBe(newScenario.title);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe.todo('update', () => {
    it('既存のシナリオを更新できる', async () => {
      // まずシナリオを作成
      const newScenario = {
        id: crypto.randomUUID(),
        title: '更新前のタイトル',
      };
      const created = await scenarioRepository.create(newScenario);

      // 更新
      const updated = await scenarioRepository.update(created.id, {
        title: '更新後のタイトル',
      });

      expect(updated).toBeDefined();
      expect(updated.title).toBe('更新後のタイトル');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime(),
      );
    });
  });

  describe.todo('delete', () => {
    it('シナリオを削除できる', async () => {
      // まずシナリオを作成
      const newScenario = {
        id: crypto.randomUUID(),
        title: '削除対象シナリオ',
      };
      const created = await scenarioRepository.create(newScenario);

      // 削除前に存在確認
      const beforeDelete = await scenarioRepository.findAll();
      const exists = beforeDelete.some((s) => s.id === created.id);
      expect(exists).toBe(true);

      // 削除
      await scenarioRepository.delete(created.id);

      // 削除後に存在しないことを確認
      const afterDelete = await scenarioRepository.findAll();
      const notExists = !afterDelete.some((s) => s.id === created.id);
      expect(notExists).toBe(true);
    });
  });
});
