import {
  parseToScenarioCharacterList,
  parseToScenarioCharacterRelationshipList,
} from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterGraphRepository } from './characterRepository';
import { scenarioCharacterRelationshipRepository } from './scenarioCharacterRelationshipRepository';
import { scenarioCharacterRepository } from './scenarioCharacterRepository';
import { scenarioGraphRepository } from './scenarioRepository';

/**
 * テスト用シナリオを作成するヘルパー関数
 */
const createTestScenario = async (params: { title: string }) => {
  const id = uuidv4();
  await scenarioGraphRepository.create({
    id,
    title: params.title,
  });
  return { id, ...params };
};

/**
 * テスト用キャラクターを作成するヘルパー関数
 */
const createTestCharacter = async (params: {
  name: string;
  description: string;
}) => {
  const id = uuidv4();
  await characterGraphRepository.create({
    id,
    name: params.name,
    description: params.description,
  });
  return { id, ...params };
};

describe('scenarioCharacterRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('シナリオ×キャラクター関係管理', () => {
    it('キャラクターをシナリオに追加できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ1' });
      const character = await createTestCharacter({
        name: 'テストキャラ1',
        description: '説明1',
      });

      // Act
      const result = await scenarioCharacterRepository.addCharacterToScenario({
        scenarioId: scenario.id,
        characterId: character.id,
        role: '主人公',
      });

      // Assert
      const [sc] = parseToScenarioCharacterList(result);
      expect(sc.scenarioId).toBe(scenario.id);
      expect(sc.characterId).toBe(character.id);
      expect(sc.role).toBe('主人公');
    });

    it('シナリオに登場するキャラクター一覧を取得できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ2' });
      const char1 = await createTestCharacter({
        name: 'キャラ1',
        description: '説明1',
      });
      const char2 = await createTestCharacter({
        name: 'キャラ2',
        description: '説明2',
      });

      await scenarioCharacterRepository.addCharacterToScenario({
        scenarioId: scenario.id,
        characterId: char1.id,
        role: '主人公',
      });
      await scenarioCharacterRepository.addCharacterToScenario({
        scenarioId: scenario.id,
        characterId: char2.id,
        role: '敵',
      });

      // Act
      const result =
        await scenarioCharacterRepository.findCharactersByScenarioId(
          scenario.id,
        );

      // Assert
      const characters = parseToScenarioCharacterList(result);
      expect(characters.length).toBe(2);
      expect(characters.map((c) => c.characterId).sort()).toEqual(
        [char1.id, char2.id].sort(),
      );
    });

    it('キャラクターの役割を更新できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ3' });
      const character = await createTestCharacter({
        name: 'テストキャラ3',
        description: '説明3',
      });
      await scenarioCharacterRepository.addCharacterToScenario({
        scenarioId: scenario.id,
        characterId: character.id,
        role: '村人',
      });

      // Act
      const result = await scenarioCharacterRepository.updateCharacterRole({
        scenarioId: scenario.id,
        characterId: character.id,
        role: '協力者',
      });

      // Assert
      const [sc] = parseToScenarioCharacterList(result);
      expect(sc.role).toBe('協力者');
    });

    it('シナリオからキャラクターを削除できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ4' });
      const character = await createTestCharacter({
        name: 'テストキャラ4',
        description: '説明4',
      });
      await scenarioCharacterRepository.addCharacterToScenario({
        scenarioId: scenario.id,
        characterId: character.id,
        role: '主人公',
      });

      // Act
      await scenarioCharacterRepository.removeCharacterFromScenario({
        scenarioId: scenario.id,
        characterId: character.id,
      });

      // Assert
      const result =
        await scenarioCharacterRepository.findCharactersByScenarioId(
          scenario.id,
        );
      const characters = parseToScenarioCharacterList(result);
      expect(characters.length).toBe(0);
    });
  });

  describe('シナリオ内キャラクター関係性管理', () => {
    it('シナリオ内の関係性を作成できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ5' });
      const char1 = await createTestCharacter({
        name: 'キャラA',
        description: '説明A',
      });
      const char2 = await createTestCharacter({
        name: 'キャラB',
        description: '説明B',
      });

      // Act
      const result = await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });

      // Assert
      const [rel] = parseToScenarioCharacterRelationshipList(result);
      expect(rel.scenarioId).toBe(scenario.id);
      expect(rel.fromCharacterId).toBe(char1.id);
      expect(rel.toCharacterId).toBe(char2.id);
      expect(rel.relationshipName).toBe('友人');
    });

    it('シナリオ内の関係性を更新できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ6' });
      const char1 = await createTestCharacter({
        name: 'キャラC',
        description: '説明C',
      });
      const char2 = await createTestCharacter({
        name: 'キャラD',
        description: '説明D',
      });
      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });

      // Act
      const result = await scenarioCharacterRelationshipRepository.update({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '敵対者',
      });

      // Assert
      const [rel] = parseToScenarioCharacterRelationshipList(result);
      expect(rel.relationshipName).toBe('敵対者');
    });

    it('シナリオ内の全関係性を取得できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ7' });
      const char1 = await createTestCharacter({
        name: 'キャラE',
        description: '説明E',
      });
      const char2 = await createTestCharacter({
        name: 'キャラF',
        description: '説明F',
      });
      const char3 = await createTestCharacter({
        name: 'キャラG',
        description: '説明G',
      });

      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char2.id,
        toCharacterId: char3.id,
        relationshipName: '師匠',
      });

      // Act
      const result =
        await scenarioCharacterRelationshipRepository.findByScenarioId(
          scenario.id,
        );

      // Assert
      const relationships = parseToScenarioCharacterRelationshipList(result);
      expect(relationships.length).toBe(2);
    });

    it('シナリオ内の関係性を削除できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ8' });
      const char1 = await createTestCharacter({
        name: 'キャラH',
        description: '説明H',
      });
      const char2 = await createTestCharacter({
        name: 'キャラI',
        description: '説明I',
      });
      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });

      // Act
      await scenarioCharacterRelationshipRepository.delete({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
      });

      // Assert
      const result =
        await scenarioCharacterRelationshipRepository.findByScenarioId(
          scenario.id,
        );
      const relationships = parseToScenarioCharacterRelationshipList(result);
      expect(relationships.length).toBe(0);
    });

    it('シナリオ内の特定キャラクターの関係性を取得できる', async () => {
      // Arrange
      const scenario = await createTestScenario({ title: 'テストシナリオ9' });
      const char1 = await createTestCharacter({
        name: 'キャラJ',
        description: '説明J',
      });
      const char2 = await createTestCharacter({
        name: 'キャラK',
        description: '説明K',
      });
      const char3 = await createTestCharacter({
        name: 'キャラL',
        description: '説明L',
      });

      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char1.id,
        toCharacterId: char2.id,
        relationshipName: '友人',
      });
      await scenarioCharacterRelationshipRepository.create({
        scenarioId: scenario.id,
        fromCharacterId: char3.id,
        toCharacterId: char1.id,
        relationshipName: '師匠',
      });

      // Act
      const result =
        await scenarioCharacterRelationshipRepository.findByScenarioAndCharacterId(
          {
            scenarioId: scenario.id,
            characterId: char1.id,
          },
        );

      // Assert
      const outgoing = parseToScenarioCharacterRelationshipList(
        result.outgoing,
      );
      const incoming = parseToScenarioCharacterRelationshipList(
        result.incoming,
      );
      expect(outgoing.length).toBe(1);
      expect(outgoing[0].toCharacterId).toBe(char2.id);
      expect(incoming.length).toBe(1);
      expect(incoming[0].fromCharacterId).toBe(char3.id);
    });
  });
});
