import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { describe, it, expect, beforeEach } from 'vitest';
import { createImageRepository } from './imageRepository';

describe('ImageRepository', () => {
  let db: PGlite;
  let imageRepository: ReturnType<typeof createImageRepository>;

  beforeEach(async () => {
    db = new PGlite();
    const database = drizzle(db);

    // Create images table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data_url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    imageRepository = createImageRepository(database);
  });

  describe('create', () => {
    it('画像を作成してIDを返す', async () => {
      const testDataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const result = await imageRepository.create(testDataUrl);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('複数の画像を作成できる', async () => {
      const dataUrl1 = 'data:image/png;base64,test1';
      const dataUrl2 = 'data:image/png;base64,test2';

      const result1 = await imageRepository.create(dataUrl1);
      const result2 = await imageRepository.create(dataUrl2);

      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('findById', () => {
    it('IDで画像を取得できる', async () => {
      const testDataUrl = 'data:image/png;base64,testimage';
      const created = await imageRepository.create(testDataUrl);

      const found = await imageRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.dataUrl).toBe(testDataUrl);
      expect(found?.createdAt).toBeDefined();
    });

    it('存在しないIDの場合nullを返す', async () => {
      const result = await imageRepository.findById(
        '00000000-0000-0000-0000-000000000000',
      );

      expect(result).toBeNull();
    });
  });

  describe('findByIds', () => {
    it('複数のIDで画像を取得できる', async () => {
      const dataUrl1 = 'data:image/png;base64,image1';
      const dataUrl2 = 'data:image/png;base64,image2';
      const created1 = await imageRepository.create(dataUrl1);
      const created2 = await imageRepository.create(dataUrl2);

      const results = await imageRepository.findByIds([created1.id, created2.id]);

      expect(results).toHaveLength(2);
      expect(results.find((r) => r.id === created1.id)?.dataUrl).toBe(dataUrl1);
      expect(results.find((r) => r.id === created2.id)?.dataUrl).toBe(dataUrl2);
    });

    it('空配列の場合空配列を返す', async () => {
      const results = await imageRepository.findByIds([]);

      expect(results).toEqual([]);
    });

    it('存在しないIDの場合空配列を返す', async () => {
      const results = await imageRepository.findByIds([
        '00000000-0000-0000-0000-000000000000',
      ]);

      expect(results).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('画像を削除できる', async () => {
      const testDataUrl = 'data:image/png;base64,todelete';
      const created = await imageRepository.create(testDataUrl);

      await imageRepository.delete(created.id);

      const found = await imageRepository.findById(created.id);
      expect(found).toBeNull();
    });

    it('存在しないIDを削除してもエラーにならない', async () => {
      await expect(
        imageRepository.delete('00000000-0000-0000-0000-000000000000'),
      ).resolves.not.toThrow();
    });
  });
});
