import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import type { Scene } from '../types';

export const nodeWidth = 172;
export const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB',
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
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
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const scenesToNodes = (
  scenes: Scene[],
  existingNodes?: Node[],
): Node<Scene>[] =>
  scenes.map((scene, index) => {
    const existingNode = existingNodes?.find((n) => n.id === scene.id);
    return {
      id: scene.id,
      type: 'sceneNode',
      data: scene,
      position: existingNode?.position || {
        x: 250 * (index % 3),
        y: 150 * Math.floor(index / 3),
      },
      style: scene.isMasterScene
        ? {
            backgroundColor: '#dcfce7',
            border: '2px solid #16a34a',
            borderRadius: '8px',
            padding: '10px',
          }
        : undefined,
    };
  });
