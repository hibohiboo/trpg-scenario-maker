import {
  parseInformationItemListSchema,
  parseInformationItemConnectionListSchema,
  parseSceneInformationConnectionListSchema,
  parseInformationToSceneConnectionListSchema,
} from '@trpg-scenario-maker/schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { informationItemRepository } from './informationItemRepository';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneGraphRepository } from './sceneRepository';

describe('informationItemRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // ヘルパーメソッド: シナリオを作成
  const createTestScenario = async () => {
    const scenarioId = uuidv4();
    await scenarioGraphRepository.create({
      id: scenarioId,
      title: 'テストシナリオ',
    });
    return scenarioId;
  };

  // ヘルパーメソッド: シーンを作成
  const createTestScene = async (scenarioId: string) => {
    const sceneId = uuidv4();
    await sceneGraphRepository.createScene({
      scenarioId,
      id: sceneId,
      title: 'テストシーン',
      description: 'シーン説明',
      isMasterScene: false,
    });
    return sceneId;
  };

  // ヘルパーメソッド: 情報項目を作成
  const createTestInformationItem = async (scenarioId: string, title = '手がかり') => {
    const itemId = uuidv4();
    await informationItemRepository.createInformationItem({
      scenarioId,
      id: itemId,
      title,
      description: '説明',
    });
    return itemId;
  };

  it('情報項目を作成・取得・更新・削除できる', async () => {
    const scenarioId = await createTestScenario();

    // 情報項目を作成
    const itemId = uuidv4();
    const createResult = await informationItemRepository.createInformationItem({
      scenarioId,
      id: itemId,
      title: '重要な手がかり',
      description: 'これは重要な情報です',
    });

    const [created] = parseInformationItemListSchema(createResult);
    expect(created?.id).toBe(itemId);
    expect(created?.title).toBe('重要な手がかり');
    expect(created?.description).toBe('これは重要な情報です');

    // 情報項目を取得
    const getResult = await informationItemRepository.getInformationItemsByScenarioId(scenarioId);
    const items = parseInformationItemListSchema(getResult);
    expect(items).toHaveLength(1);
    expect(items[0]?.id).toBe(itemId);

    // 情報項目を更新
    const updateResult = await informationItemRepository.updateInformationItem({
      id: itemId,
      title: '更新された手がかり',
    });

    const [updated] = parseInformationItemListSchema(updateResult);
    expect(updated?.title).toBe('更新された手がかり');

    // 情報項目を削除
    await informationItemRepository.deleteInformationItem(itemId);
    const afterDelete = await informationItemRepository.getInformationItemsByScenarioId(scenarioId);
    expect(afterDelete).toHaveLength(0);
  });

  it('情報項目同士の関連を作成・取得・削除できる', async () => {
    const scenarioId = await createTestScenario();
    const item1Id = await createTestInformationItem(scenarioId, '情報1');
    const item2Id = await createTestInformationItem(scenarioId, '情報2');

    // 関連を作成
    const connectionId = uuidv4();
    const createResult = await informationItemRepository.createInformationConnection({
      id: connectionId,
      source: item1Id,
      target: item2Id,
    });

    const [created] = parseInformationItemConnectionListSchema(createResult);
    expect(created?.id).toBe(connectionId);
    expect(created?.source).toBe(item1Id);
    expect(created?.target).toBe(item2Id);

    // 関連を取得
    const getResult = await informationItemRepository.getInformationConnectionsByScenarioId(scenarioId);
    const connections = parseInformationItemConnectionListSchema(getResult);
    expect(connections).toHaveLength(1);
    expect(connections[0]?.id).toBe(connectionId);

    // 関連を削除
    await informationItemRepository.deleteInformationConnection(connectionId);
    const afterDelete = await informationItemRepository.getInformationConnectionsByScenarioId(scenarioId);
    expect(afterDelete).toHaveLength(0);
  });

  it('シーン→情報項目の関連を作成・取得・削除できる', async () => {
    const scenarioId = await createTestScenario();
    const sceneId = await createTestScene(scenarioId);
    const itemId = await createTestInformationItem(scenarioId);

    // シーン→情報項目の関連を作成
    const connectionId = uuidv4();
    const createResult = await informationItemRepository.createSceneInformationConnection({
      id: connectionId,
      sceneId,
      informationItemId: itemId,
    });

    const [created] = parseSceneInformationConnectionListSchema(createResult);
    expect(created?.id).toBe(connectionId);
    expect(created?.sceneId).toBe(sceneId);
    expect(created?.informationItemId).toBe(itemId);

    // 関連を取得
    const getResult = await informationItemRepository.getSceneInformationConnectionsBySceneId(sceneId);
    const connections = parseSceneInformationConnectionListSchema(getResult);
    expect(connections).toHaveLength(1);
    expect(connections[0]?.id).toBe(connectionId);

    // 関連を削除
    await informationItemRepository.deleteSceneInformationConnection(connectionId);
    const afterDelete = await informationItemRepository.getSceneInformationConnectionsBySceneId(sceneId);
    expect(afterDelete).toHaveLength(0);
  });

  it('情報項目→シーンの関連を作成・取得・削除できる', async () => {
    const scenarioId = await createTestScenario();
    const sceneId = await createTestScene(scenarioId);
    const itemId = await createTestInformationItem(scenarioId);

    // 情報項目→シーンの関連を作成
    const connectionId = uuidv4();
    const createResult = await informationItemRepository.createInformationToSceneConnection({
      id: connectionId,
      informationItemId: itemId,
      sceneId,
    });

    const [created] = parseInformationToSceneConnectionListSchema(createResult);
    expect(created?.id).toBe(connectionId);
    expect(created?.informationItemId).toBe(itemId);
    expect(created?.sceneId).toBe(sceneId);

    // 関連を取得
    const getResult = await informationItemRepository.getInformationToSceneConnectionsByInformationItemId(itemId);
    const connections = parseInformationToSceneConnectionListSchema(getResult);
    expect(connections).toHaveLength(1);
    expect(connections[0]?.id).toBe(connectionId);

    // 関連を削除
    await informationItemRepository.deleteInformationToSceneConnection(connectionId);
    const afterDelete = await informationItemRepository.getInformationToSceneConnectionsByInformationItemId(itemId);
    expect(afterDelete).toHaveLength(0);
  });
});
