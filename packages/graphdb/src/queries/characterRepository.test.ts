import {
  parseToCharacterList,
  parseToRelationshipList,
} from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterRelationshipGraphRepository } from './characterRelationshipGraphRepository';
import { characterGraphRepository } from './characterRepository';

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

    it('キャラクターを更新できる', async () => {
      const characterId = uuidv4();
      await characterGraphRepository.create({
        id: characterId,
        name: '初期名',
        description: '初期説明',
      });

      const updateResult = await characterGraphRepository.update({
        id: characterId,
        name: '更新後の名前',
        description: '更新後の説明',
      });

      const [updated] = parseToCharacterList(updateResult);
      expect(updated.id).toBe(characterId);
      expect(updated.name).toBe('更新後の名前');
      expect(updated.description).toBe('更新後の説明');
    });

    it('キャラクターを削除できる', async () => {
      const characterId = uuidv4();
      await characterGraphRepository.create({
        id: characterId,
        name: '削除テスト',
        description: '削除されます',
      });

      await characterGraphRepository.delete(characterId);

      const result = await characterGraphRepository.findById(characterId);
      const characters = parseToCharacterList(result);
      expect(characters).toHaveLength(0);
    });

    it('全キャラクターを取得できる', async () => {
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
      const characters = parseToCharacterList(result);
      expect(characters.length).toBeGreaterThanOrEqual(2);

      const char1 = characters.find((c) => c.id === char1Id);
      const char2 = characters.find((c) => c.id === char2Id);

      expect(char1).toBeDefined();
      expect(char1?.name).toBe('キャラ1');
      expect(char2).toBeDefined();
      expect(char2?.name).toBe('キャラ2');
    });

    it('特殊文字を含む説明でキャラクターを作成できる', async () => {
      const characterId = uuidv4();
      const specialDescription = `特殊文字テスト: 'シングルクォート'
改行あり`;

      const result = await characterGraphRepository.create({
        id: characterId,
        name: "キャラ'名前'",
        description: specialDescription,
      });

      const [c] = parseToCharacterList(result);
      expect(c.description).toBe(specialDescription);
      expect(c.name).toBe("キャラ'名前'");
    });
  });

  describe('関係性操作', () => {
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
      const rel1Id = uuidv4();
      const rel1Result = await characterRelationshipGraphRepository.create({
        id: rel1Id,
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '友人',
      });

      // B→A の関係（双方向は別エッジ）
      const rel2Id = uuidv4();
      const rel2Result = await characterRelationshipGraphRepository.create({
        id: rel2Id,
        fromCharacterId: char2Id,
        toCharacterId: char1Id,
        relationshipName: '仲間',
      });

      const [rel1] = parseToRelationshipList(rel1Result);
      expect(rel1.id).toBe(rel1Id);
      expect(rel1.fromCharacterId).toBe(char1Id);
      expect(rel1.toCharacterId).toBe(char2Id);
      expect(rel1.relationshipName).toBe('友人');

      const [rel2] = parseToRelationshipList(rel2Result);
      expect(rel2.id).toBe(rel2Id);
      expect(rel2.fromCharacterId).toBe(char2Id);
      expect(rel2.toCharacterId).toBe(char1Id);
      expect(rel2.relationshipName).toBe('仲間');
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
      await characterRelationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: 'ライバル',
      });
      // char3 → char1
      await characterRelationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char3Id,
        toCharacterId: char1Id,
        relationshipName: '師匠',
      });

      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1Id);

      const [o] = parseToRelationshipList(result.outgoing);
      expect(o.toCharacterId).toBe(char2Id);
      expect(o.relationshipName).toBe('ライバル');

      const [i] = parseToRelationshipList(result.incoming);
      expect(i.fromCharacterId).toBe(char3Id);
      expect(i.relationshipName).toBe('師匠');
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

      const relId = uuidv4();
      await characterRelationshipGraphRepository.create({
        id: relId,
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '初期関係',
      });

      const updateResult = await characterRelationshipGraphRepository.update({
        id: relId,
        relationshipName: '更新後の関係',
      });

      const [updated] = parseToRelationshipList(updateResult);
      expect(updated.id).toBe(relId);
      expect(updated.fromCharacterId).toBe(char1Id);
      expect(updated.toCharacterId).toBe(char2Id);
      expect(updated.relationshipName).toBe('更新後の関係');
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

      const relId = uuidv4();
      await characterRelationshipGraphRepository.create({
        id: relId,
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '削除される関係',
      });

      await characterRelationshipGraphRepository.delete({
        id: relId,
      });

      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1Id);
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

      await characterRelationshipGraphRepository.create({
        id: uuidv4(),
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '関係1',
      });

      const allRelationships =
        await characterRelationshipGraphRepository.findAll();
      const all = parseToRelationshipList(allRelationships);
      expect(all.length).toBeGreaterThanOrEqual(1);

      const foundRelation = all.find(
        (r) => r.fromCharacterId === char1Id && r.toCharacterId === char2Id,
      );
      expect(foundRelation).toBeDefined();
      expect(foundRelation?.relationshipName).toBe('関係1');
    });

    it('同じキャラクターペア間に複数の関係性を作成できる', async () => {
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
        description: '相手役',
      });

      // 同じA→Bに対して複数の関係性を作成
      const rel1Id = uuidv4();
      const rel1Result = await characterRelationshipGraphRepository.create({
        id: rel1Id,
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: '友人',
      });

      const rel2Id = uuidv4();
      const rel2Result = await characterRelationshipGraphRepository.create({
        id: rel2Id,
        fromCharacterId: char1Id,
        toCharacterId: char2Id,
        relationshipName: 'ライバル',
      });

      // 1つ目の関係性
      const [rel1] = parseToRelationshipList(rel1Result);
      expect(rel1.id).toBe(rel1Id);
      expect(rel1.relationshipName).toBe('友人');

      // 2つ目の関係性
      const [rel2] = parseToRelationshipList(rel2Result);
      expect(rel2.id).toBe(rel2Id);
      expect(rel2.relationshipName).toBe('ライバル');

      // 全関係性を取得して両方存在することを確認
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1Id);
      const outgoing = parseToRelationshipList(result.outgoing);

      expect(outgoing).toHaveLength(2);
      expect(outgoing.find((r) => r.relationshipName === '友人')).toBeDefined();
      expect(outgoing.find((r) => r.relationshipName === 'ライバル')).toBeDefined();
    });
  });
});
