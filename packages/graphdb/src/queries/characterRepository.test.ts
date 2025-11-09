import {
  parseToCharacterList,
  parseToRelationshipList,
  parseToCharacterWithImagesList,
} from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterRelationshipGraphRepository } from './characterRelationshipGraphRepository';
import { characterGraphRepository } from './characterRepository';

/**
 * テスト用キャラクターを作成するヘルパー関数
 */
const createTestCharacter = async (params: {
  name: string;
  description: string;
}) => {
  const id = generateUUID();
  await characterGraphRepository.create({
    id,
    name: params.name,
    description: params.description,
  });
  return { id, ...params };
};

/**
 * テスト用関係性を作成するヘルパー関数
 */
const createTestRelationship = async (params: {
  fromCharacterId: string;
  toCharacterId: string;
  relationshipName: string;
}) => {
  const id = generateUUID();
  await characterRelationshipGraphRepository.create({
    id,
    ...params,
  });
  return { id, ...params };
};

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
      // Arrange
      const characterId = generateUUID();
      const characterData = {
        id: characterId,
        name: 'テストキャラクター',
        description: 'これはテストキャラクターです',
      };

      // Act
      const result = await characterGraphRepository.create(characterData);

      // Assert
      const [c] = parseToCharacterList(result);
      expect(c.id).toBe(characterId);
      expect(c.name).toBe('テストキャラクター');
      expect(c.description).toBe('これはテストキャラクターです');
    });

    it('キャラクターを更新できる', async () => {
      // Arrange
      const characterId = generateUUID();
      await characterGraphRepository.create({
        id: characterId,
        name: '初期名',
        description: '初期説明',
      });
      const updateData = {
        id: characterId,
        name: '更新後の名前',
        description: '更新後の説明',
      };

      // Act
      const updateResult = await characterGraphRepository.update(updateData);

      // Assert
      const [updated] = parseToCharacterList(updateResult);
      expect(updated.id).toBe(characterId);
      expect(updated.name).toBe('更新後の名前');
      expect(updated.description).toBe('更新後の説明');
    });

    it('キャラクターを削除できる', async () => {
      // Arrange
      const characterId = generateUUID();
      await characterGraphRepository.create({
        id: characterId,
        name: '削除テスト',
        description: '削除されます',
      });

      // Act
      await characterGraphRepository.delete(characterId);

      // Assert
      const result = await characterGraphRepository.findById(characterId);
      const characters = parseToCharacterList(result);
      expect(characters).toHaveLength(0);
    });

    it('全キャラクターを取得できる', async () => {
      const char1Id = generateUUID();
      const char2Id = generateUUID();

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
      const characterId = generateUUID();
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
      // Arrange
      const char1 = await createTestCharacter({
        name: 'アリス',
        description: '主人公',
      });
      const char2 = await createTestCharacter({
        name: 'ボブ',
        description: 'サブキャラクター',
      });

      // Act
      const rel1 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      const rel2 = await createTestRelationship({
        fromCharacterId: char2.id,
        toCharacterId: char1.id,
        relationshipName: '仲間',
      });

      // Assert
      expect(rel1.fromCharacterId).toBe(char1.id);
      expect(rel1.toCharacterId).toBe(char2.id);
      expect(rel1.relationshipName).toBe('友人');

      expect(rel2.fromCharacterId).toBe(char2.id);
      expect(rel2.toCharacterId).toBe(char1.id);
      expect(rel2.relationshipName).toBe('仲間');
    });

    it('キャラクターの全関係性を取得できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'キャラA',
        description: 'テスト',
      });
      const char2 = await createTestCharacter({
        name: 'キャラB',
        description: 'テスト',
      });
      const char3 = await createTestCharacter({
        name: 'キャラC',
        description: 'テスト',
      });

      await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: 'ライバル',
      });
      await createTestRelationship({
        fromCharacterId: char3.id,
        toCharacterId: char1.id,
        relationshipName: '師匠',
      });

      // Act
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1.id);

      // Assert
      const [outgoing] = parseToRelationshipList(result.outgoing);
      expect(outgoing.toCharacterId).toBe(char2.id);
      expect(outgoing.relationshipName).toBe('ライバル');

      const [incoming] = parseToRelationshipList(result.incoming);
      expect(incoming.fromCharacterId).toBe(char3.id);
      expect(incoming.relationshipName).toBe('師匠');
    });

    it('関係性を更新できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'キャラX',
        description: 'テスト',
      });
      const char2 = await createTestCharacter({
        name: 'キャラY',
        description: 'テスト',
      });
      const relationship = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '初期関係',
      });

      // Act
      const updateResult = await characterRelationshipGraphRepository.update({
        id: relationship.id,
        relationshipName: '更新後の関係',
      });

      // Assert
      const [updated] = parseToRelationshipList(updateResult);
      expect(updated.id).toBe(relationship.id);
      expect(updated.fromCharacterId).toBe(char1.id);
      expect(updated.toCharacterId).toBe(char2.id);
      expect(updated.relationshipName).toBe('更新後の関係');
    });

    it('関係性を削除できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'キャラP',
        description: 'テスト',
      });
      const char2 = await createTestCharacter({
        name: 'キャラQ',
        description: 'テスト',
      });
      const relationship = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '削除される関係',
      });

      // Act
      await characterRelationshipGraphRepository.delete({
        id: relationship.id,
      });

      // Assert
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1.id);
      expect(result.outgoing).toHaveLength(0);
    });

    it('全関係性を取得できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'キャラM',
        description: 'テスト',
      });
      const char2 = await createTestCharacter({
        name: 'キャラN',
        description: 'テスト',
      });
      await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '関係1',
      });

      // Act
      const allRelationships =
        await characterRelationshipGraphRepository.findAll();

      // Assert
      const all = parseToRelationshipList(allRelationships);
      expect(all.length).toBeGreaterThanOrEqual(1);

      const foundRelation = all.find(
        (r) => r.fromCharacterId === char1.id && r.toCharacterId === char2.id,
      );
      expect(foundRelation).toBeDefined();
      expect(foundRelation?.relationshipName).toBe('関係1');
    });

    it('同じキャラクターペア間に複数の関係性を作成できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'アリス',
        description: '主人公',
      });
      const char2 = await createTestCharacter({
        name: 'ボブ',
        description: '相手役',
      });

      // Act
      const rel1 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      const rel2 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: 'ライバル',
      });

      // Assert
      expect(rel1.id).toBeDefined();
      expect(rel1.relationshipName).toBe('友人');
      expect(rel2.id).toBeDefined();
      expect(rel2.relationshipName).toBe('ライバル');

      // 全関係性を取得して両方存在することを確認
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1.id);
      const outgoing = parseToRelationshipList(result.outgoing);

      expect(outgoing).toHaveLength(2);
      expect(outgoing.find((r) => r.relationshipName === '友人')).toBeDefined();
      expect(
        outgoing.find((r) => r.relationshipName === 'ライバル'),
      ).toBeDefined();
    });

    it('同じキャラクターペア間の複数関係性から特定の関係性のみを更新できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'アリス',
        description: '主人公',
      });
      const char2 = await createTestCharacter({
        name: 'ボブ',
        description: '相手役',
      });

      const rel1 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      const rel2 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: 'ライバル',
      });

      // Act - rel1のみを更新
      const updateResult = await characterRelationshipGraphRepository.update({
        id: rel1.id,
        relationshipName: '親友',
      });

      // Assert
      const [updated] = parseToRelationshipList(updateResult);
      expect(updated.id).toBe(rel1.id);
      expect(updated.relationshipName).toBe('親友');

      // 全関係性を取得して検証
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1.id);
      const outgoing = parseToRelationshipList(result.outgoing);

      expect(outgoing).toHaveLength(2);
      expect(outgoing.find((r) => r.id === rel1.id)?.relationshipName).toBe(
        '親友',
      );
      expect(outgoing.find((r) => r.id === rel2.id)?.relationshipName).toBe(
        'ライバル',
      );
    });

    it('同じキャラクターペア間の複数関係性から特定の関係性のみを削除できる', async () => {
      // Arrange
      const char1 = await createTestCharacter({
        name: 'アリス',
        description: '主人公',
      });
      const char2 = await createTestCharacter({
        name: 'ボブ',
        description: '相手役',
      });

      const rel1 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      const rel2 = await createTestRelationship({
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: 'ライバル',
      });

      // Act - rel1のみを削除
      await characterRelationshipGraphRepository.delete({
        id: rel1.id,
      });

      // Assert
      const result =
        await characterRelationshipGraphRepository.findByCharacterId(char1.id);
      const outgoing = parseToRelationshipList(result.outgoing);

      // rel2は残っている
      expect(outgoing).toHaveLength(1);
      expect(outgoing[0].id).toBe(rel2.id);
      expect(outgoing[0].relationshipName).toBe('ライバル');

      // rel1は削除されている
      expect(outgoing.find((r) => r.id === rel1.id)).toBeUndefined();
    });
  });

  describe('メイン画像ID取得', () => {
    it('メイン画像IDを含むキャラクター情報を取得できる', async () => {
      // Arrange
      const characterId = generateUUID();
      const imageId = generateUUID();

      // キャラクター作成
      await characterGraphRepository.create({
        id: characterId,
        name: '画像テストキャラ',
        description: '画像付きキャラクター',
      });

      // 画像ノード作成
      await executeQuery(`
        CREATE (i:Image {id: '${imageId}'})
      `);

      // HAS_IMAGEリレーション作成
      await executeQuery(`
        MATCH (c:Character {id: '${characterId}'})
        MATCH (i:Image {id: '${imageId}'})
        CREATE (c)-[:HAS_IMAGE {isPrimary: true}]->(i)
      `);

      // Act
      const result = await characterGraphRepository.findByIdWithPrimaryImage(characterId);

      // Assert
      const [char] = parseToCharacterWithImagesList(result);
      expect(char.id).toBe(characterId);
      expect(char.name).toBe('画像テストキャラ');
      expect(char.primaryImageId).toBe(imageId);
    });

    it('メイン画像がない場合はprimaryImageIdが空文字列になる', async () => {
      // Arrange
      const characterId = generateUUID();

      await characterGraphRepository.create({
        id: characterId,
        name: '画像なしキャラ',
        description: '画像なし',
      });

      // Act
      const result = await characterGraphRepository.findByIdWithPrimaryImage(characterId);

      // Assert
      const [char] = parseToCharacterWithImagesList(result);
      expect(char.id).toBe(characterId);
      expect(char.primaryImageId).toBe('');
    });

    it('全キャラクターをメイン画像IDと共に取得できる', async () => {
      // Arrange
      const char1Id = generateUUID();
      const char2Id = generateUUID();
      const image1Id = generateUUID();

      // キャラクター作成
      await characterGraphRepository.create({
        id: char1Id,
        name: '画像ありキャラ',
        description: 'メイン画像あり',
      });
      await characterGraphRepository.create({
        id: char2Id,
        name: '画像なしキャラ',
        description: 'メイン画像なし',
      });

      // 画像ノードとリレーション作成（char1のみ）
      await executeQuery(`
        CREATE (i:Image {id: '${image1Id}'})
      `);
      await executeQuery(`
        MATCH (c:Character {id: '${char1Id}'})
        MATCH (i:Image {id: '${image1Id}'})
        CREATE (c)-[:HAS_IMAGE {isPrimary: true}]->(i)
      `);

      // Act
      const result = await characterGraphRepository.findAllWithPrimaryImage();

      // Assert
      const characters = parseToCharacterWithImagesList(result);
      expect(characters.length).toBeGreaterThanOrEqual(2);

      const char1 = characters.find((c) => c.id === char1Id);
      const char2 = characters.find((c) => c.id === char2Id);

      expect(char1).toBeDefined();
      expect(char1?.primaryImageId).toBe(image1Id);

      expect(char2).toBeDefined();
      expect(char2?.primaryImageId).toBe('');
    });

    it('isPrimaryがfalseの画像はメイン画像として取得されない', async () => {
      // Arrange
      const characterId = generateUUID();
      const image1Id = generateUUID();
      const image2Id = generateUUID();

      await characterGraphRepository.create({
        id: characterId,
        name: '複数画像キャラ',
        description: 'メイン画像とサブ画像',
      });

      // 2つの画像ノード作成
      await executeQuery(`
        CREATE (i1:Image {id: '${image1Id}'}),
               (i2:Image {id: '${image2Id}'})
      `);

      // isPrimary: falseの画像
      await executeQuery(`
        MATCH (c:Character {id: '${characterId}'})
        MATCH (i:Image {id: '${image1Id}'})
        CREATE (c)-[:HAS_IMAGE {isPrimary: false}]->(i)
      `);

      // isPrimary: trueの画像
      await executeQuery(`
        MATCH (c:Character {id: '${characterId}'})
        MATCH (i:Image {id: '${image2Id}'})
        CREATE (c)-[:HAS_IMAGE {isPrimary: true}]->(i)
      `);

      // Act
      const result = await characterGraphRepository.findByIdWithPrimaryImage(characterId);

      // Assert
      const [char] = parseToCharacterWithImagesList(result);
      expect(char.primaryImageId).toBe(image2Id);
    });
  });
});
