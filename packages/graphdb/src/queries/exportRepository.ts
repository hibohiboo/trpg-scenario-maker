import { executeQuery } from '../db';
import type { GraphNode, GraphRelationship } from '@trpg-scenario-maker/schema';

// === ノード取得関数（個別） ===

async function getScenarioNode(scenarioId: string): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})
    RETURN s.id AS id, s.title AS title
  `)) as Array<{ id: string; title: string }>;

  return result.map((row) => ({
    id: row.id,
    label: 'Scenario',
    properties: { title: row.title },
  }));
}

async function getSceneNodes(scenarioId: string): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)
    RETURN scene.id AS id, scene.title AS title, scene.description AS description, scene.isMasterScene AS isMasterScene
  `)) as Array<{
    id: string;
    title: string;
    description: string | null;
    isMasterScene: boolean;
  }>;

  return result.map((row) => ({
    id: row.id,
    label: 'Scene',
    properties: {
      title: row.title,
      description: row.description ?? '',
      isMasterScene: row.isMasterScene,
    },
  }));
}

async function getSceneEventNodes(scenarioId: string): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)-[:HAS_EVENT]->(event:SceneEvent)
    RETURN event.id AS id, event.type AS type, event.content AS content, event.sortOrder AS sortOrder
  `)) as Array<{
    id: string;
    type: string;
    content: string;
    sortOrder: number;
  }>;

  return result.map((row) => ({
    id: row.id,
    label: 'SceneEvent',
    properties: {
      type: row.type,
      content: row.content,
      sortOrder: row.sortOrder,
    },
  }));
}

async function getCharacterNodes(scenarioId: string): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (c:Character)-[:APPEARS_IN]->(s:Scenario {id: '${scenarioId}'})
    RETURN c.id AS id, c.name AS name, c.description AS description
  `)) as Array<{ id: string; name: string; description: string | null }>;

  return result.map((row) => ({
    id: row.id,
    label: 'Character',
    properties: {
      name: row.name,
      description: row.description ?? '',
    },
  }));
}

async function getImageNodes(scenarioId: string): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (c:Character)-[:APPEARS_IN]->(s:Scenario {id: '${scenarioId}'})
    MATCH (c)-[:HAS_IMAGE]->(img:Image)
    RETURN DISTINCT img.id AS id
  `)) as Array<{ id: string }>;

  return result.map((row) => ({
    id: row.id,
    label: 'Image',
    properties: {},
  }));
}

async function getInformationItemNodes(
  scenarioId: string,
): Promise<GraphNode[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_INFORMATION]->(info:InformationItem)
    RETURN info.id AS id, info.title AS title, info.description AS description, info.scenarioId AS scenarioId
  `)) as Array<{
    id: string;
    title: string;
    description: string | null;
    scenarioId: string;
  }>;

  return result.map((row) => ({
    id: row.id,
    label: 'InformationItem',
    properties: {
      title: row.title,
      description: row.description ?? '',
      scenarioId: row.scenarioId,
    },
  }));
}

/**
 * シナリオに関連する全ノードを取得
 */
async function getScenarioNodes(scenarioId: string): Promise<GraphNode[]> {
  const [
    scenarioNodes,
    sceneNodes,
    sceneEventNodes,
    characterNodes,
    imageNodes,
    informationNodes,
  ] = await Promise.all([
    getScenarioNode(scenarioId),
    getSceneNodes(scenarioId),
    getSceneEventNodes(scenarioId),
    getCharacterNodes(scenarioId),
    getImageNodes(scenarioId),
    getInformationItemNodes(scenarioId),
  ]);

  return [
    ...scenarioNodes,
    ...sceneNodes,
    ...sceneEventNodes,
    ...characterNodes,
    ...imageNodes,
    ...informationNodes,
  ];
}

// === リレーション取得関数（個別） ===

async function getHasSceneRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[r:HAS_SCENE]->(scene:Scene)
    RETURN s.id AS fromId, scene.id AS toId
  `)) as Array<{ fromId: string; toId: string }>;

  return result.map((row) => ({
    type: 'HAS_SCENE',
    from: row.fromId,
    to: row.toId,
    properties: {},
  }));
}

async function getNextSceneRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene1:Scene)-[r:NEXT_SCENE]->(scene2:Scene)
    RETURN scene1.id AS fromId, scene2.id AS toId
  `)) as Array<{ fromId: string; toId: string }>;

  return result.map((row) => ({
    type: 'NEXT_SCENE',
    from: row.fromId,
    to: row.toId,
    properties: {},
  }));
}

async function getHasEventRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)-[r:HAS_EVENT]->(event:SceneEvent)
    RETURN scene.id AS fromId, event.id AS toId
  `)) as Array<{ fromId: string; toId: string }>;

  return result.map((row) => ({
    type: 'HAS_EVENT',
    from: row.fromId,
    to: row.toId,
    properties: {},
  }));
}

async function getAppearsInRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (c:Character)-[r:APPEARS_IN]->(s:Scenario {id: '${scenarioId}'})
    RETURN c.id AS fromId, s.id AS toId, r.role AS role
  `)) as Array<{ fromId: string; toId: string; role: string | null }>;

  return result.map((row) => ({
    type: 'APPEARS_IN',
    from: row.fromId,
    to: row.toId,
    properties: { role: row.role ?? '' },
  }));
}

async function getRelatesInScenarioRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (c1:Character)-[r:RELATES_IN_SCENARIO {scenarioId: '${scenarioId}'}]->(c2:Character)
    RETURN c1.id AS fromId, c2.id AS toId, r.relationshipName AS relationshipName
  `)) as Array<{ fromId: string; toId: string; relationshipName: string }>;

  return result.map((row) => ({
    type: 'RELATES_IN_SCENARIO',
    from: row.fromId,
    to: row.toId,
    properties: {
      scenarioId,
      relationshipName: row.relationshipName,
    },
  }));
}

async function getHasImageRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (c:Character)-[:APPEARS_IN]->(s:Scenario {id: '${scenarioId}'})
    MATCH (c)-[r:HAS_IMAGE]->(img:Image)
    RETURN c.id AS fromId, img.id AS toId, r.isPrimary AS isPrimary
  `)) as Array<{ fromId: string; toId: string; isPrimary: boolean }>;

  return result.map((row) => ({
    type: 'HAS_IMAGE',
    from: row.fromId,
    to: row.toId,
    properties: { isPrimary: row.isPrimary },
  }));
}

async function getHasInformationRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[r:HAS_INFORMATION]->(info:InformationItem)
    RETURN s.id AS fromId, info.id AS toId
  `)) as Array<{ fromId: string; toId: string }>;

  return result.map((row) => ({
    type: 'HAS_INFORMATION',
    from: row.fromId,
    to: row.toId,
    properties: {},
  }));
}

async function getInformationRelatedToRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_INFORMATION]->(info1:InformationItem)-[r:INFORMATION_RELATED_TO]->(info2:InformationItem)
    RETURN info1.id AS fromId, info2.id AS toId, r.id AS relationshipId
  `)) as Array<{ fromId: string; toId: string; relationshipId: string }>;

  return result.map((row) => ({
    type: 'INFORMATION_RELATED_TO',
    from: row.fromId,
    to: row.toId,
    properties: { id: row.relationshipId },
  }));
}

async function getSceneHasInfoRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_SCENE]->(scene:Scene)-[r:SCENE_HAS_INFO]->(info:InformationItem)
    RETURN scene.id AS fromId, info.id AS toId, r.id AS relationshipId
  `)) as Array<{ fromId: string; toId: string; relationshipId: string }>;

  return result.map((row) => ({
    type: 'SCENE_HAS_INFO',
    from: row.fromId,
    to: row.toId,
    properties: { id: row.relationshipId },
  }));
}

async function getInfoPointsToSceneRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const result = (await executeQuery(`
    MATCH (s:Scenario {id: '${scenarioId}'})-[:HAS_INFORMATION]->(info:InformationItem)-[r:INFO_POINTS_TO_SCENE]->(scene:Scene)
    RETURN info.id AS fromId, scene.id AS toId, r.id AS relationshipId
  `)) as Array<{ fromId: string; toId: string; relationshipId: string }>;

  return result.map((row) => ({
    type: 'INFO_POINTS_TO_SCENE',
    from: row.fromId,
    to: row.toId,
    properties: { id: row.relationshipId },
  }));
}

/**
 * シナリオに関連する全リレーションを取得
 */
async function getScenarioRelationships(
  scenarioId: string,
): Promise<GraphRelationship[]> {
  const [
    hasSceneRels,
    nextSceneRels,
    hasEventRels,
    appearsInRels,
    relatesInScenarioRels,
    hasImageRels,
    hasInformationRels,
    infoRelatedToRels,
    sceneHasInfoRels,
    infoPointsToSceneRels,
  ] = await Promise.all([
    getHasSceneRelationships(scenarioId),
    getNextSceneRelationships(scenarioId),
    getHasEventRelationships(scenarioId),
    getAppearsInRelationships(scenarioId),
    getRelatesInScenarioRelationships(scenarioId),
    getHasImageRelationships(scenarioId),
    getHasInformationRelationships(scenarioId),
    getInformationRelatedToRelationships(scenarioId),
    getSceneHasInfoRelationships(scenarioId),
    getInfoPointsToSceneRelationships(scenarioId),
  ]);
  return [
    ...hasSceneRels,
    ...nextSceneRels,
    ...hasEventRels,
    ...appearsInRels,
    ...relatesInScenarioRels,
    ...hasImageRels,
    ...hasInformationRels,
    ...infoRelatedToRels,
    ...sceneHasInfoRels,
    ...infoPointsToSceneRels,
  ];
}

/**
 * シナリオ全体のGraphDBデータをエクスポート
 */
export const exportScenarioGraph = async (scenarioId: string) => {
  const nodes = await getScenarioNodes(scenarioId);
  const relationships = await getScenarioRelationships(scenarioId);
  return { nodes, relationships };
};
