import { parseGraphDBData } from '@trpg-scenario-maker/schema';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { characterGraphRepository } from './characterRepository';
import { exportScenarioGraph } from './exportRepository';
import { imageGraphRepository } from './imageRepository';
import { importScenarioGraph } from './importRepository';
import { informationItemRepository } from './informationItemRepository';
import { scenarioCharacterRelationshipRepository } from './scenarioCharacterRelationshipRepository';
import { scenarioCharacterRepository } from './scenarioCharacterRepository';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneEventRepository } from './sceneEventRepository';
import { sceneGraphRepository } from './sceneRepository';
import type { GraphNode, GraphRelationship } from '@trpg-scenario-maker/schema';

describe('exportRepository / importRepository', () => {
  beforeAll(async () => {
    await initializeDatabase();
    const { nodes, relationships } = graphDbSchemas;
    const schemas = [...nodes, ...relationships];
    await Promise.all(schemas.map((schema) => executeQuery(schema.query)));
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('空のシナリオをエクスポートできる', async () => {
    const scenarioId = generateUUID();
    await scenarioGraphRepository.create({
      id: scenarioId,
      title: '空のシナリオ',
    });

    const exported = await exportScenarioGraph(scenarioId);

    // スキーマ検証
    expect(() => parseGraphDBData(exported)).not.toThrow();

    expect(exported.nodes.length).toBe(1); // Scenarioノードのみ
    expect(exported.relationships.length).toBe(0);

    const scenarioNode = exported.nodes[0];
    expect(scenarioNode.label).toBe('Scenario');
    expect(scenarioNode.id).toBe(scenarioId);
    expect(scenarioNode.properties.title).toBe('空のシナリオ');
  });

  it('シーンを含むシナリオをエクスポートできる', async () => {
    const scenarioId = generateUUID();
    await scenarioGraphRepository.create({
      id: scenarioId,
      title: 'テストシナリオ',
    });

    const scene1Id = generateUUID();
    await sceneGraphRepository.createScene({
      scenarioId,
      id: scene1Id,
      title: 'シーン1',
      description: 'テスト説明',
      isMasterScene: true,
    });

    const exported = await exportScenarioGraph(scenarioId);

    // スキーマ検証
    expect(() => parseGraphDBData(exported)).not.toThrow();

    // ノード検証
    expect(exported.nodes.length).toBe(2); // Scenario + Scene
    const scenarioNode = exported.nodes.find((n) => n.label === 'Scenario');
    const sceneNode = exported.nodes.find((n) => n.label === 'Scene');

    expect(scenarioNode).toBeDefined();
    expect(sceneNode).toBeDefined();
    expect(sceneNode?.properties.title).toBe('シーン1');
    expect(sceneNode?.properties.isMasterScene).toBe(true);

    // リレーション検証
    expect(exported.relationships.length).toBeGreaterThan(0);
    const hasSceneRel = exported.relationships.find(
      (r) => r.type === 'HAS_SCENE',
    );
    expect(hasSceneRel).toBeDefined();
    expect(hasSceneRel?.from).toBe(scenarioId);
    expect(hasSceneRel?.to).toBe(scene1Id);
  });

  it('全ノードタイプと全リレーションタイプを含むシナリオをエクスポートできる', async () => {
    // Arrange: 包括的なシナリオデータを作成
    const ids = await createComprehensiveScenario();

    // Act: エクスポート実行
    const exported = await exportScenarioGraph(ids.scenarioId);

    // Assert: スキーマ検証
    expect(() => parseGraphDBData(exported)).not.toThrow();

    // Assert: 全ノードタイプの存在確認
    assertAllNodeTypesExist(exported, ids);

    // Assert: 全リレーションタイプの存在確認
    assertAllRelationshipTypesExist(exported, ids);
  });
  it('エクスポート→インポートで往復できる', async () => {
    // シナリオ作成
    const { scenarioId: originalScenarioId } =
      await createComprehensiveScenario();

    // エクスポート
    const exported = await exportScenarioGraph(originalScenarioId);

    // スキーマ検証
    expect(() => parseGraphDBData(exported)).not.toThrow();

    // 新しいIDでインポート
    const newScenarioId = generateUUID();

    const remappedNodes = exported.nodes.map((node) => ({
      ...node,
      id: node.id === originalScenarioId ? newScenarioId : node.id,
    }));

    const remappedRelationships = exported.relationships.map((rel) => ({
      ...rel,
      from: rel.from === originalScenarioId ? newScenarioId : rel.from,
      to: rel.to === originalScenarioId ? newScenarioId : rel.to,
    }));

    // インポート
    await importScenarioGraph(remappedNodes, remappedRelationships);

    // 再エクスポートして検証
    const reExported = await exportScenarioGraph(newScenarioId);

    // スキーマ検証
    expect(() => parseGraphDBData(reExported)).not.toThrow();

    expect(reExported.nodes.length).toBe(10);
    expect(reExported.nodes[0].id).toBe(newScenarioId);
    expect(reExported.nodes[0].properties.title).toBe('包括的テストシナリオ');
    expect(reExported.relationships.length).toBe(18);
  });
});

// === ヘルパー関数 ===

/**
 * 全ノードタイプと全リレーションタイプを含む包括的なシナリオを作成
 */
async function createComprehensiveScenario() {
  // 1. Scenarioノード作成
  const scenarioId = generateUUID();
  await scenarioGraphRepository.create({
    id: scenarioId,
    title: '包括的テストシナリオ',
  });

  // 2. Sceneノード作成（2つ）
  const scene1Id = generateUUID();
  const scene2Id = generateUUID();
  await sceneGraphRepository.createScene({
    scenarioId,
    id: scene1Id,
    title: 'シーン1',
    description: '最初のシーン',
    isMasterScene: true,
  });
  await sceneGraphRepository.createScene({
    scenarioId,
    id: scene2Id,
    title: 'シーン2',
    description: '次のシーン',
    isMasterScene: false,
  });

  // 3. NEXT_SCENEリレーション作成
  await sceneGraphRepository.createConnection({
    source: scene1Id,
    target: scene2Id,
  });

  // 4. SceneEventノード作成
  const eventId = generateUUID();
  await sceneEventRepository.createEvent({
    sceneId: scene1Id,
    id: eventId,
    type: 'dialogue',
    content: 'テスト会話',
    sortOrder: 0,
  });

  // 5. Characterノード作成（2つ）
  const char1Id = generateUUID();
  const char2Id = generateUUID();
  await characterGraphRepository.create({
    id: char1Id,
    name: 'キャラクター1',
    description: 'テストキャラ1',
  });
  await characterGraphRepository.create({
    id: char2Id,
    name: 'キャラクター2',
    description: 'テストキャラ2',
  });

  // 6. APPEARS_INリレーション作成
  await scenarioCharacterRepository.addCharacterToScenario({
    scenarioId,
    characterId: char1Id,
    role: '主人公',
  });
  await scenarioCharacterRepository.addCharacterToScenario({
    scenarioId,
    characterId: char2Id,
    role: '敵',
  });

  // 7. RELATES_IN_SCENARIOリレーション作成
  await scenarioCharacterRelationshipRepository.create({
    scenarioId,
    fromCharacterId: char1Id,
    toCharacterId: char2Id,
    relationshipName: '敵対',
  });

  // 8. Imageノード + HAS_IMAGEリレーション作成
  const imageId = generateUUID();
  await imageGraphRepository.createImageNode(imageId);
  await imageGraphRepository.linkImageToCharacter({
    characterId: char1Id,
    imageId,
    isPrimary: true,
  });

  // 9. InformationItemノード作成（2つ）
  const info1Id = generateUUID();
  const info2Id = generateUUID();
  await informationItemRepository.createInformationItem({
    scenarioId,
    id: info1Id,
    title: '情報1',
    description: '重要な情報',
  });
  await informationItemRepository.createInformationItem({
    scenarioId,
    id: info2Id,
    title: '情報2',
    description: '関連情報',
  });

  // 10. INFORMATION_RELATED_TOリレーション作成
  const infoRelId = generateUUID();
  await informationItemRepository.createInformationConnection({
    id: infoRelId,
    source: info1Id,
    target: info2Id,
  });

  // 11. SCENE_HAS_INFOリレーション作成
  const sceneInfoRelId = generateUUID();
  await informationItemRepository.createSceneInformationConnection({
    id: sceneInfoRelId,
    sceneId: scene1Id,
    informationItemId: info1Id,
  });

  // 12. INFO_POINTS_TO_SCENEリレーション作成
  const infoSceneRelId = generateUUID();
  await informationItemRepository.createInformationToSceneConnection({
    id: infoSceneRelId,
    informationItemId: info2Id,
    sceneId: scene2Id,
  });

  return {
    scenarioId,
    scene1Id,
    scene2Id,
    eventId,
    char1Id,
    char2Id,
    imageId,
    info1Id,
    info2Id,
    infoRelId,
    sceneInfoRelId,
    infoSceneRelId,
  };
}

/**
 * 全ノードタイプの存在を確認
 */
function assertAllNodeTypesExist(
  exported: { nodes: GraphNode[]; relationships: GraphRelationship[] },
  ids: Record<string, string>,
) {
  // Scenarioノード
  const scenarioNode = exported.nodes.find((n) => n.label === 'Scenario');
  expect(scenarioNode).toBeDefined();
  expect(scenarioNode?.id).toBe(ids.scenarioId);
  expect(scenarioNode?.properties.title).toBe('包括的テストシナリオ');

  // Sceneノード（2つ）
  const sceneNodes = exported.nodes.filter((n) => n.label === 'Scene');
  expect(sceneNodes).toHaveLength(2);
  expect(sceneNodes.map((n) => n.id)).toContain(ids.scene1Id);
  expect(sceneNodes.map((n) => n.id)).toContain(ids.scene2Id);

  // SceneEventノード
  const eventNode = exported.nodes.find((n) => n.label === 'SceneEvent');
  expect(eventNode).toBeDefined();
  expect(eventNode?.id).toBe(ids.eventId);

  // Characterノード（2つ）
  const characterNodes = exported.nodes.filter((n) => n.label === 'Character');
  expect(characterNodes).toHaveLength(2);
  expect(characterNodes.map((n) => n.id)).toContain(ids.char1Id);
  expect(characterNodes.map((n) => n.id)).toContain(ids.char2Id);

  // Imageノード
  const imageNode = exported.nodes.find((n) => n.label === 'Image');
  expect(imageNode).toBeDefined();
  expect(imageNode?.id).toBe(ids.imageId);

  // InformationItemノード（2つ）
  const infoNodes = exported.nodes.filter((n) => n.label === 'InformationItem');
  expect(infoNodes).toHaveLength(2);
  expect(infoNodes.map((n) => n.id)).toContain(ids.info1Id);
  expect(infoNodes.map((n) => n.id)).toContain(ids.info2Id);
}

/**
 * 全リレーションタイプの存在を確認
 */
function assertAllRelationshipTypesExist(
  exported: { nodes: GraphNode[]; relationships: GraphRelationship[] },
  ids: Record<string, string>,
) {
  // HAS_SCENEリレーション（2つ）
  const hasSceneRels = exported.relationships.filter(
    (r) => r.type === 'HAS_SCENE',
  );
  expect(hasSceneRels).toHaveLength(2);
  expect(hasSceneRels.some((r) => r.to === ids.scene1Id)).toBe(true);
  expect(hasSceneRels.some((r) => r.to === ids.scene2Id)).toBe(true);

  // NEXT_SCENEリレーション
  const nextSceneRel = exported.relationships.find(
    (r) => r.type === 'NEXT_SCENE',
  );
  expect(nextSceneRel).toBeDefined();
  expect(nextSceneRel?.from).toBe(ids.scene1Id);
  expect(nextSceneRel?.to).toBe(ids.scene2Id);

  // HAS_EVENTリレーション
  const hasEventRel = exported.relationships.find(
    (r) => r.type === 'HAS_EVENT',
  );
  expect(hasEventRel).toBeDefined();
  expect(hasEventRel?.from).toBe(ids.scene1Id);
  expect(hasEventRel?.to).toBe(ids.eventId);

  // APPEARS_INリレーション（2つ）
  const appearsInRels = exported.relationships.filter(
    (r) => r.type === 'APPEARS_IN',
  );
  expect(appearsInRels).toHaveLength(2);
  expect(appearsInRels.some((r) => r.from === ids.char1Id)).toBe(true);
  expect(appearsInRels.some((r) => r.from === ids.char2Id)).toBe(true);

  // RELATES_IN_SCENARIOリレーション
  const relatesRel = exported.relationships.find(
    (r) => r.type === 'RELATES_IN_SCENARIO',
  );
  expect(relatesRel).toBeDefined();
  expect(relatesRel?.from).toBe(ids.char1Id);
  expect(relatesRel?.to).toBe(ids.char2Id);
  expect(relatesRel?.properties.relationshipName).toBe('敵対');

  // HAS_IMAGEリレーション
  const hasImageRel = exported.relationships.find(
    (r) => r.type === 'HAS_IMAGE',
  );
  expect(hasImageRel).toBeDefined();
  expect(hasImageRel?.from).toBe(ids.char1Id);
  expect(hasImageRel?.to).toBe(ids.imageId);
  expect(hasImageRel?.properties.isPrimary).toBe(true);

  // HAS_INFORMATIONリレーション（2つ）
  const hasInfoRels = exported.relationships.filter(
    (r) => r.type === 'HAS_INFORMATION',
  );
  expect(hasInfoRels).toHaveLength(2);
  expect(hasInfoRels.some((r) => r.to === ids.info1Id)).toBe(true);
  expect(hasInfoRels.some((r) => r.to === ids.info2Id)).toBe(true);

  // INFORMATION_RELATED_TOリレーション
  const infoRelatedRel = exported.relationships.find(
    (r) => r.type === 'INFORMATION_RELATED_TO',
  );
  expect(infoRelatedRel).toBeDefined();
  expect(infoRelatedRel?.from).toBe(ids.info1Id);
  expect(infoRelatedRel?.to).toBe(ids.info2Id);

  // SCENE_HAS_INFOリレーション
  const sceneHasInfoRel = exported.relationships.find(
    (r) => r.type === 'SCENE_HAS_INFO',
  );
  expect(sceneHasInfoRel).toBeDefined();
  expect(sceneHasInfoRel?.from).toBe(ids.scene1Id);
  expect(sceneHasInfoRel?.to).toBe(ids.info1Id);

  // INFO_POINTS_TO_SCENEリレーション
  const infoPointsRel = exported.relationships.find(
    (r) => r.type === 'INFO_POINTS_TO_SCENE',
  );
  expect(infoPointsRel).toBeDefined();
  expect(infoPointsRel?.from).toBe(ids.info2Id);
  expect(infoPointsRel?.to).toBe(ids.scene2Id);
}
