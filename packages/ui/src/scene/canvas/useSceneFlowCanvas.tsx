import {
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Connection,
  addEdge,
  type OnEdgesChange,
  type OnNodesChange,
  type Edge,
  type Node,
} from '@xyflow/react';
import { useState, useCallback, useEffect } from 'react';
import type { Scene, SceneConnection } from '../types';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements, scenesToNodes } from './index';

export interface SceneFlowCanvasProps {
  scenes: Scene[];
  connections: SceneConnection[];
  onNodesChange?: (nodes: Scene[]) => void;
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
  onConnectionDelete?: (id: string) => void;
}

export const useSceneFlowCanvas = (props: SceneFlowCanvasProps) => {
  const {
    scenes,
    connections,
    onNodesChange: onNodesUpdate,
    onConnectionAdd,
    onConnectionDelete,
  } = props;
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  const initialNodes: Node[] = scenesToNodes(scenes);

  const initialEdges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges],
  );

  useEffect(() => {
    const newNodes: Node[] = scenesToNodes(scenes, nodes);
    setNodes(newNodes);
  }, [scenes, setNodes]);

  useEffect(() => {
    const newEdges: Edge[] = connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    }));
    setEdges(newEdges);
  }, [connections, setEdges]);

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const newEdge = {
        source: connection.source,
        target: connection.target,
      };

      setEdges((eds) => addEdge(connection, eds));
      onConnectionAdd?.(newEdge);
    },
    [setEdges, onConnectionAdd],
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);

      changes.forEach((change) => {
        if (change.type === 'remove') {
          onConnectionDelete?.(change.id);
        }
      });
    },
    [onEdgesChange, onConnectionDelete],
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      const updatedNodes = nodes.map((node) => {
        const change = changes.find(
          (c) => c.type === 'position' && c.id === node.id,
        );
        if (change && change.type === 'position' && change.position) {
          return { ...node, position: change.position };
        }
        return node;
      });

      const updatedScenes: Scene[] = updatedNodes.map((node) => {
        const originalScene = scenes.find((s) => s.id === node.id);
        return {
          id: node.id,
          title: node.data.label as string,
          description: originalScene?.description || '',
          isMasterScene: originalScene?.isMasterScene || false,
        };
      });

      onNodesUpdate?.(updatedScenes);
    },
    [onNodesChange, nodes, scenes, onNodesUpdate],
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const scene = scenes.find((s) => s.id === node.id);
      if (scene) {
        setSelectedScene(scene);
      }
    },
    [scenes],
  );

  const handleCloseSidebar = useCallback(() => {
    setSelectedScene(null);
  }, []);

  // 選択中のシーンの情報を最新のscenesから更新
  useEffect(() => {
    if (selectedScene) {
      const updatedScene = scenes.find((s) => s.id === selectedScene.id);
      if (updatedScene) {
        setSelectedScene(updatedScene);
      }
    }
  }, [scenes, selectedScene]);

  return {
    selectedScene,
    nodes,
    edges,
    onLayout,
    handleConnect,
    handleEdgesChange,
    handleNodesChange,
    handleNodeClick,
    handleCloseSidebar,
  };
};
