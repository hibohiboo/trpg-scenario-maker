import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';

export const characterNodeWidth = 200;
export const characterNodeHeight = 100;

/**
 * キャラクターノードを自動整列する
 * @param nodes ノード一覧
 * @param edges エッジ一覧
 * @param direction レイアウト方向 ('TB': 縦方向, 'LR': 横方向)
 * @returns 整列後のノードとエッジ
 */
export const getLayoutedCharacterElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB',
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: characterNodeWidth,
      height: characterNodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - characterNodeWidth / 2,
        y: nodeWithPosition.y - characterNodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
