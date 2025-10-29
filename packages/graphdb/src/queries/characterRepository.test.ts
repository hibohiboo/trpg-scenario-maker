import { parseToCharacterList } from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterGraphRepository } from './characterRepository';
import { relationshipGraphRepository } from './relationshipRepository';

describe('characterGraphRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('キャラクターCRUD操作', () => {
    it('キャラクターを作成できる', async () => {
      const characterId = uuidv4();
      const result = await characterGraphRepository.create({
        id: characterId,
        name: 'テストキャラクター',
        description: 'これはテストキャラクターです',
      });

      const [c] = parseToCharacterList(result);
      expect(c.id).toBe(characterId);
      expect(c.name).toBe('テストキャラクター');
      expect(c.description).toBe('これはテストキャラクターです');
    });

    it.todo('キャラクターを更新できる', async () => {
      const characterId = uuidv4();
      await characterGraphRepository.create({
        id: characterId,
        name: '初期名',
        description: '初期説明',
      });

      await characterGraphRepository.update({
        id: characterId,
        name: '更新後の名前',
        description: '更新後の説明',
      });

      const result = await characterGraphRepository.findById(characterId);
      expect(result).toBeDefined();
      expect(result?.name).toBe('更新後の名前');
      expect(result?.description).toBe('更新後の説明');
    });

    it.todo('キャラクターを削除できる', async () => {
      const characterId = uuidv4();
      await characterGraphRepository.create({
        id: characterId,
        name: '削除テスト',
        description: '削除されます',
      });

      await characterGraphRepository.delete(characterId);

      const result = await characterGraphRepository.findById(characterId);
      expect(result).toBeUndefined();
    });

    it.todo('全キャラクターを取得できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'キャラ1',
        description: '説明1',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'キャラ2',
        description: '説明2',
      });

      const result = await characterGraphRepository.findAll();
      expect(result.length).toBeGreaterThanOrEqual(2);

      const char1 = result.find((c) => c.id === char1Id);
      const char2 = result.find((c) => c.id === char2Id);

      expect(char1).toBeDefined();
      expect(char1?.name).toBe('キャラ1');
      expect(char2).toBeDefined();
      expect(char2?.name).toBe('キャラ2');
    });

    it.todo('特殊文字を含む説明でキャラクターを作成できる', async () => {
      const characterId = uuidv4();
      const specialDescription = `特殊文字テスト: 'シングルクォート'
改行あり`;

      const result = await characterGraphRepository.create({
        id: characterId,
        name: "キャラ'名前'",
        description: specialDescription,
      });

      expect(result?.description).toBe(specialDescription);
      expect(result?.name).toBe("キャラ'名前'");
    });
  });

  describe.todo('関係性操作', () => {
    it('双方向の関係性を作成できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'アリス',
        description: '主人公',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'ボブ',
        description: 'サブキャラクター',
      });

      // A→B の関係
      const rel1 = await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '友人',
      });

      // B→A の関係（双方向は別エッジ）
      const rel2 = await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char2Id,
        toCharacterId: char1Id,
        relationshipName: '仲間',
      });

      expect(rel1).toBeDefined();
      expect(rel1?.relationshipName).toBe('友人');
      expect(rel2).toBeDefined();
      expect(rel2?.relationshipName).toBe('仲間');
    });

    it('キャラクターの全関係性を取得できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();
      const char3Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'キャラA',
        description: 'テスト',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'キャラB',
        description: 'テスト',
      });

      await characterGraphRepository.create({
        id: char3Id,
        name: 'キャラC',
        description: 'テスト',
      });

      // char1 → char2
      await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: 'ライバル',
      });

      // char3 → char1
      await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char3Id,
        toCharacterId: char1Id,
        relationshipName: '師匠',
      });

      const result =
        await relationshipGraphRepository.findByCharacterId(char1Id);

      expect(result.outgoing).toHaveLength(1);
      expect(result.outgoing[0].toCharacterId).toBe(char2Id);
      expect(result.outgoing[0].relationshipName).toBe('ライバル');

      expect(result.incoming).toHaveLength(1);
      expect(result.incoming[0].fromCharacterId).toBe(char3Id);
      expect(result.incoming[0].relationshipName).toBe('師匠');
    });

    it('関係性を更新できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'キャラX',
        description: 'テスト',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'キャラY',
        description: 'テスト',
      });

      await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '初期関係',
      });

      const updated = await relationshipGraphRepository.update({
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '更新後の関係',
      });

      expect(updated).toBeDefined();
      expect(updated?.relationshipName).toBe('更新後の関係');
    });

    it('関係性を削除できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'キャラP',
        description: 'テスト',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'キャラQ',
        description: 'テスト',
      });

      await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '削除される関係',
      });

      await relationshipGraphRepository.delete({
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
      });

      const result =
        await relationshipGraphRepository.findByCharacterId(char1Id);
      expect(result.outgoing).toHaveLength(0);
    });

    it('全関係性を取得できる', async () => {
      const char1Id = uuidv4();
      const char2Id = uuidv4();

      await characterGraphRepository.create({
        id: char1Id,
        name: 'キャラM',
        description: 'テスト',
      });

      await characterGraphRepository.create({
        id: char2Id,
        name: 'キャラN',
        description: 'テスト',
      });

      await relationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '関係1',
      });

      const allRelationships = await relationshipGraphRepository.findAll();
      expect(allRelationships.length).toBeGreaterThanOrEqual(1);

      const foundRelation = allRelationships.find(
        (r) => r.fromCharacterId === char1Id && r.toCharacterId === char2Id,
      );
      expect(foundRelation).toBeDefined();
      expect(foundRelation?.relationshipName).toBe('関係1');
    });
  });
});
