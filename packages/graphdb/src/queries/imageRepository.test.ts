import { generateUUID } from '@trpg-scenario-maker/utility';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterGraphRepository } from './characterRepository';
import { imageGraphRepository } from './imageRepository';

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

describe('imageGraphRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('画像ノードCRUD操作', () => {
    it('画像ノードを作成できる', async () => {
      // Arrange
      const imageId = generateUUID();

      // Act
      const result = await imageGraphRepository.createImageNode(imageId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(imageId);
    });

    it('画像ノードをIDで取得できる', async () => {
      // Arrange
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);

      // Act
      const result = await imageGraphRepository.findImageNodeById(imageId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(imageId);
    });

    it('全画像ノードを取得できる', async () => {
      // Arrange
      const imageId1 = generateUUID();
      const imageId2 = generateUUID();
      await imageGraphRepository.createImageNode(imageId1);
      await imageGraphRepository.createImageNode(imageId2);

      // Act
      const result = await imageGraphRepository.findAllImageNodes();

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(2);
      const foundImage1 = result.find(
        (img: { id: string }) => img.id === imageId1,
      );
      const foundImage2 = result.find(
        (img: { id: string }) => img.id === imageId2,
      );
      expect(foundImage1).toBeDefined();
      expect(foundImage2).toBeDefined();
    });

    it('画像ノードを削除できる', async () => {
      // Arrange
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);

      // Act
      await imageGraphRepository.deleteImageNode(imageId);

      // Assert
      const result = await imageGraphRepository.findImageNodeById(imageId);
      expect(result).toHaveLength(0);
    });
  });

  describe('キャラクターと画像の関連操作', () => {
    it('キャラクターに画像を関連付けできる', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ',
        description: 'テスト',
      });
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);

      // Act
      const result = await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId,
        isPrimary: true,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].characterId).toBe(character.id);
      expect(result[0].imageId).toBe(imageId);
      expect(result[0].isPrimary).toBe(true);
    });

    it('キャラクターの全画像を取得できる', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ2',
        description: 'テスト',
      });
      const imageId1 = generateUUID();
      const imageId2 = generateUUID();
      await imageGraphRepository.createImageNode(imageId1);
      await imageGraphRepository.createImageNode(imageId2);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId: imageId1,
        isPrimary: true,
      });
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId: imageId2,
        isPrimary: false,
      });

      // Act
      const result = await imageGraphRepository.findImagesByCharacterId(
        character.id,
      );

      // Assert
      expect(result).toHaveLength(2);
      // isPrimary=trueが最初に来る
      expect(result[0].imageId).toBe(imageId1);
      expect(result[0].isPrimary).toBe(true);
      expect(result[1].imageId).toBe(imageId2);
      expect(result[1].isPrimary).toBe(false);
    });

    it('キャラクターのメイン画像を取得できる', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ3',
        description: 'テスト',
      });
      const imageId1 = generateUUID();
      const imageId2 = generateUUID();
      await imageGraphRepository.createImageNode(imageId1);
      await imageGraphRepository.createImageNode(imageId2);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId: imageId1,
        isPrimary: false,
      });
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId: imageId2,
        isPrimary: true,
      });

      // Act
      const result = await imageGraphRepository.findPrimaryImageByCharacterId(
        character.id,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].imageId).toBe(imageId2);
      expect(result[0].isPrimary).toBe(true);
    });

    it('画像関連のisPrimaryを更新できる', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ4',
        description: 'テスト',
      });
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId,
        isPrimary: false,
      });

      // Act
      const result = await imageGraphRepository.updateImageLink({
        characterId: character.id,
        imageId,
        isPrimary: true,
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].isPrimary).toBe(true);
    });

    it('キャラクターから画像関連を削除できる', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ5',
        description: 'テスト',
      });
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId,
        isPrimary: true,
      });

      // Act
      await imageGraphRepository.unlinkImageFromCharacter({
        characterId: character.id,
        imageId,
      });

      // Assert
      const result = await imageGraphRepository.findImagesByCharacterId(
        character.id,
      );
      expect(result).toHaveLength(0);
    });

    it('画像を使用しているキャラクターを取得できる', async () => {
      // Arrange
      const character1 = await createTestCharacter({
        name: 'キャラA',
        description: 'テスト',
      });
      const character2 = await createTestCharacter({
        name: 'キャラB',
        description: 'テスト',
      });
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character1.id,
        imageId,
        isPrimary: true,
      });
      await imageGraphRepository.linkImageToCharacter({
        characterId: character2.id,
        imageId,
        isPrimary: false,
      });

      // Act
      const result =
        await imageGraphRepository.findCharactersByImageId(imageId);

      // Assert
      expect(result).toHaveLength(2);
      const foundChar1 = result.find(
        (r: { characterId: string }) => r.characterId === character1.id,
      );
      const foundChar2 = result.find(
        (r: { characterId: string }) => r.characterId === character2.id,
      );
      expect(foundChar1).toBeDefined();
      expect(foundChar1?.characterName).toBe('キャラA');
      expect(foundChar1?.isPrimary).toBe(true);
      expect(foundChar2).toBeDefined();
      expect(foundChar2?.characterName).toBe('キャラB');
      expect(foundChar2?.isPrimary).toBe(false);
    });

    it('画像ノードを削除すると関連も削除される', async () => {
      // Arrange
      const character = await createTestCharacter({
        name: 'テストキャラ6',
        description: 'テスト',
      });
      const imageId = generateUUID();
      await imageGraphRepository.createImageNode(imageId);
      await imageGraphRepository.linkImageToCharacter({
        characterId: character.id,
        imageId,
        isPrimary: true,
      });

      // Act
      await imageGraphRepository.deleteImageNode(imageId);

      // Assert
      const characterImages =
        await imageGraphRepository.findImagesByCharacterId(character.id);
      expect(characterImages).toHaveLength(0);
      const imageNode = await imageGraphRepository.findImageNodeById(imageId);
      expect(imageNode).toHaveLength(0);
    });
  });
});
