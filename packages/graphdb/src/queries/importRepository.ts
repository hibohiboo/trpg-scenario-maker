import { executeQuery } from '../db';
import { escapeCypherString } from '../utils/escapeCypherString';
import type { GraphNode, GraphRelationship } from '@trpg-scenario-maker/schema';

// === ノード挿入関数（個別） ===

async function importScenarioNode(node: GraphNode): Promise<void> {
  const title = escapeCypherString(String(node.properties.title ?? ''));
  await executeQuery(`
    CREATE (n:Scenario {id: '${node.id}', title: '${title}'})
  `);
}

async function importSceneNode(node: GraphNode): Promise<void> {
  const title = escapeCypherString(String(node.properties.title ?? ''));
  const description = escapeCypherString(
    String(node.properties.description ?? ''),
  );
  const isMasterScene = Boolean(node.properties.isMasterScene ?? false);
  await executeQuery(`
    CREATE (n:Scene {
      id: '${node.id}',
      title: '${title}',
      description: '${description}',
      isMasterScene: ${isMasterScene}
    })
  `);
}

async function importSceneEventNode(node: GraphNode): Promise<void> {
  const type = escapeCypherString(String(node.properties.type ?? ''));
  const content = escapeCypherString(String(node.properties.content ?? ''));
  const sortOrder = Number(node.properties.sortOrder ?? 0);
  await executeQuery(`
    CREATE (n:SceneEvent {
      id: '${node.id}',
      type: '${type}',
      content: '${content}',
      sortOrder: ${sortOrder}
    })
  `);
}

async function importCharacterNode(node: GraphNode): Promise<void> {
  const name = escapeCypherString(String(node.properties.name ?? ''));
  const description = escapeCypherString(
    String(node.properties.description ?? ''),
  );
  await executeQuery(`
    CREATE (n:Character {
      id: '${node.id}',
      name: '${name}',
      description: '${description}'
    })
  `);
}

async function importImageNode(node: GraphNode): Promise<void> {
  await executeQuery(`
    CREATE (n:Image {id: '${node.id}'})
  `);
}

async function importInformationItemNode(node: GraphNode): Promise<void> {
  const title = escapeCypherString(String(node.properties.title ?? ''));
  const description = escapeCypherString(
    String(node.properties.description ?? ''),
  );
  const scenarioId = String(node.properties.scenarioId ?? '');
  await executeQuery(`
    CREATE (n:InformationItem {
      id: '${node.id}',
      title: '${title}',
      description: '${description}',
      scenarioId: '${scenarioId}'
    })
  `);
}

/**
 * 単一ノードをインポート
 */
async function importNode(node: GraphNode): Promise<void> {
  const { label } = node;

  switch (label) {
    case 'Scenario':
      await importScenarioNode(node);
      break;
    case 'Scene':
      await importSceneNode(node);
      break;
    case 'SceneEvent':
      await importSceneEventNode(node);
      break;
    case 'Character':
      await importCharacterNode(node);
      break;
    case 'Image':
      await importImageNode(node);
      break;
    case 'InformationItem':
      await importInformationItemNode(node);
      break;
    default:
      console.warn(`Unknown node label: ${label}`);
  }
}

/**
 * ノードを一括挿入
 */
async function importNodes(nodes: GraphNode[]): Promise<void> {
  await Promise.all(nodes.map((node) => importNode(node)));
}

// === リレーション挿入関数（個別） ===

async function importHasSceneRelationship(
  rel: GraphRelationship,
): Promise<void> {
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:HAS_SCENE]->(b)
  `);
}

async function importNextSceneRelationship(
  rel: GraphRelationship,
): Promise<void> {
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:NEXT_SCENE]->(b)
  `);
}

async function importHasEventRelationship(
  rel: GraphRelationship,
): Promise<void> {
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:HAS_EVENT]->(b)
  `);
}

async function importAppearsInRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const role = escapeCypherString(String(rel.properties.role ?? ''));
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:APPEARS_IN {role: '${role}'}]->(b)
  `);
}

async function importRelatesInScenarioRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const relationshipName = escapeCypherString(
    String(rel.properties.relationshipName ?? ''),
  );
  const scenarioId = String(rel.properties.scenarioId ?? '');
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:RELATES_IN_SCENARIO {
      scenarioId: '${scenarioId}',
      relationshipName: '${relationshipName}'
    }]->(b)
  `);
}

async function importHasImageRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const isPrimary = Boolean(rel.properties.isPrimary ?? false);
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:HAS_IMAGE {isPrimary: ${isPrimary}}]->(b)
  `);
}

async function importHasInformationRelationship(
  rel: GraphRelationship,
): Promise<void> {
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:HAS_INFORMATION]->(b)
  `);
}

async function importInformationRelatedToRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const relationshipId = String(rel.properties.id ?? '');
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:INFORMATION_RELATED_TO {id: '${relationshipId}'}]->(b)
  `);
}

async function importSceneHasInfoRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const relationshipId = String(rel.properties.id ?? '');
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:SCENE_HAS_INFO {id: '${relationshipId}'}]->(b)
  `);
}

async function importInfoPointsToSceneRelationship(
  rel: GraphRelationship,
): Promise<void> {
  const relationshipId = String(rel.properties.id ?? '');
  await executeQuery(`
    MATCH (a {id: '${rel.from}'}), (b {id: '${rel.to}'})
    CREATE (a)-[:INFO_POINTS_TO_SCENE {id: '${relationshipId}'}]->(b)
  `);
}

/**
 * 単一リレーションをインポート
 */
// eslint-disable-next-line complexity
async function importRelationship(rel: GraphRelationship): Promise<void> {
  const { type } = rel;

  switch (type) {
    case 'HAS_SCENE':
      await importHasSceneRelationship(rel);
      break;
    case 'NEXT_SCENE':
      await importNextSceneRelationship(rel);
      break;
    case 'HAS_EVENT':
      await importHasEventRelationship(rel);
      break;
    case 'APPEARS_IN':
      await importAppearsInRelationship(rel);
      break;
    case 'RELATES_IN_SCENARIO':
      await importRelatesInScenarioRelationship(rel);
      break;
    case 'HAS_IMAGE':
      await importHasImageRelationship(rel);
      break;
    case 'HAS_INFORMATION':
      await importHasInformationRelationship(rel);
      break;
    case 'INFORMATION_RELATED_TO':
      await importInformationRelatedToRelationship(rel);
      break;
    case 'SCENE_HAS_INFO':
      await importSceneHasInfoRelationship(rel);
      break;
    case 'INFO_POINTS_TO_SCENE':
      await importInfoPointsToSceneRelationship(rel);
      break;
    default:
      console.warn(`Unknown relationship type: ${type}`);
  }
}

/**
 * リレーションを一括挿入
 */
async function importRelationships(
  relationships: GraphRelationship[],
): Promise<void> {
  await Promise.all(relationships.map((rel) => importRelationship(rel)));
}

/**
 * シナリオ全体のGraphDBデータをインポート
 *
 * @param nodes - ノードデータ配列
 * @param relationships - リレーションデータ配列
 */
export const importScenarioGraph = async (
  nodes: GraphNode[],
  relationships: GraphRelationship[],
): Promise<void> => {
  // ノードを先にすべて挿入
  await importNodes(nodes);

  // リレーションを挿入
  await importRelationships(relationships);
};
