import { executeQuery } from '../db';
import { escapeCypherString } from '../utils/escapeCypherString';
import type { GraphNode, GraphRelationship } from '@trpg-scenario-maker/schema';

/**
 * ノードを一括挿入
 */
async function importNodes(nodes: GraphNode[]): Promise<void> {
  for (const node of nodes) {
    await importNode(node);
  }
}

/**
 * 単一ノードをインポート
 */
async function importNode(node: GraphNode): Promise<void> {
  const { id, label, properties } = node;

  switch (label) {
    case 'Scenario': {
      const title = escapeCypherString(String(properties.title ?? ''));
      await executeQuery(`
        CREATE (n:Scenario {id: '${id}', title: '${title}'})
      `);
      break;
    }

    case 'Scene': {
      const title = escapeCypherString(String(properties.title ?? ''));
      const description = escapeCypherString(
        String(properties.description ?? ''),
      );
      const isMasterScene = Boolean(properties.isMasterScene ?? false);
      await executeQuery(`
        CREATE (n:Scene {
          id: '${id}',
          title: '${title}',
          description: '${description}',
          isMasterScene: ${isMasterScene}
        })
      `);
      break;
    }

    case 'SceneEvent': {
      const type = escapeCypherString(String(properties.type ?? ''));
      const content = escapeCypherString(String(properties.content ?? ''));
      const sortOrder = Number(properties.sortOrder ?? 0);
      await executeQuery(`
        CREATE (n:SceneEvent {
          id: '${id}',
          type: '${type}',
          content: '${content}',
          sortOrder: ${sortOrder}
        })
      `);
      break;
    }

    case 'Character': {
      const name = escapeCypherString(String(properties.name ?? ''));
      const description = escapeCypherString(
        String(properties.description ?? ''),
      );
      await executeQuery(`
        CREATE (n:Character {
          id: '${id}',
          name: '${name}',
          description: '${description}'
        })
      `);
      break;
    }

    case 'Image': {
      await executeQuery(`
        CREATE (n:Image {id: '${id}'})
      `);
      break;
    }

    case 'InformationItem': {
      const title = escapeCypherString(String(properties.title ?? ''));
      const description = escapeCypherString(
        String(properties.description ?? ''),
      );
      const scenarioId = String(properties.scenarioId ?? '');
      await executeQuery(`
        CREATE (n:InformationItem {
          id: '${id}',
          title: '${title}',
          description: '${description}',
          scenarioId: '${scenarioId}'
        })
      `);
      break;
    }

    default:
      console.warn(`Unknown node label: ${label}`);
  }
}

/**
 * リレーションを一括挿入
 */
async function importRelationships(
  relationships: GraphRelationship[],
): Promise<void> {
  for (const rel of relationships) {
    await importRelationship(rel);
  }
}

/**
 * 単一リレーションをインポート
 */
async function importRelationship(rel: GraphRelationship): Promise<void> {
  const { type, from, to, properties } = rel;

  switch (type) {
    case 'HAS_SCENE':
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:HAS_SCENE]->(b)
      `);
      break;

    case 'NEXT_SCENE':
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:NEXT_SCENE]->(b)
      `);
      break;

    case 'HAS_EVENT':
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:HAS_EVENT]->(b)
      `);
      break;

    case 'APPEARS_IN': {
      const role = escapeCypherString(String(properties.role ?? ''));
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:APPEARS_IN {role: '${role}'}]->(b)
      `);
      break;
    }

    case 'RELATES_IN_SCENARIO': {
      const relationshipName = escapeCypherString(
        String(properties.relationshipName ?? ''),
      );
      const scenarioId = String(properties.scenarioId ?? '');
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:RELATES_IN_SCENARIO {
          scenarioId: '${scenarioId}',
          relationshipName: '${relationshipName}'
        }]->(b)
      `);
      break;
    }

    case 'HAS_IMAGE': {
      const isPrimary = Boolean(properties.isPrimary ?? false);
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:HAS_IMAGE {isPrimary: ${isPrimary}}]->(b)
      `);
      break;
    }

    case 'HAS_INFORMATION':
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:HAS_INFORMATION]->(b)
      `);
      break;

    case 'INFORMATION_RELATED_TO': {
      const relationshipId = String(properties.id ?? '');
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:INFORMATION_RELATED_TO {id: '${relationshipId}'}]->(b)
      `);
      break;
    }

    case 'SCENE_HAS_INFO': {
      const relationshipId = String(properties.id ?? '');
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:SCENE_HAS_INFO {id: '${relationshipId}'}]->(b)
      `);
      break;
    }

    case 'INFO_POINTS_TO_SCENE': {
      const relationshipId = String(properties.id ?? '');
      await executeQuery(`
        MATCH (a {id: '${from}'}), (b {id: '${to}'})
        CREATE (a)-[:INFO_POINTS_TO_SCENE {id: '${relationshipId}'}]->(b)
      `);
      break;
    }

    default:
      console.warn(`Unknown relationship type: ${type}`);
  }
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
