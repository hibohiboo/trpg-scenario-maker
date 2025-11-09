import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateUUID } from '@trpg-scenario-maker/utility';
import { initializeDatabase, closeDatabase, executeQuery } from '../db';
import { graphDbSchemas } from '../schemas';
import { scenarioGraphRepository } from './scenarioRepository';
import { sceneGraphRepository } from './sceneRepository';
import { exportScenarioGraph } from './exportRepository';
import { importScenarioGraph } from './importRepository';

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

  it('エクスポート→インポートで往復できる', async () => {
    // シナリオ作成
    const originalScenarioId = generateUUID();
    await scenarioGraphRepository.create({
      id: originalScenarioId,
      title: '元のシナリオ',
    });

    // エクスポート
    const exported = await exportScenarioGraph(originalScenarioId);

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

    expect(reExported.nodes.length).toBe(1);
    expect(reExported.nodes[0].id).toBe(newScenarioId);
    expect(reExported.nodes[0].properties.title).toBe('元のシナリオ');
  });
});
