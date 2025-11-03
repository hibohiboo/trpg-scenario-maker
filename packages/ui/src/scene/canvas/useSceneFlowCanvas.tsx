import type { SceneEvent } from '@trpg-scenario-maker/schema';
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
import type {
  InformationItem,
  InformationItemConnection,
  InformationToSceneConnection,
  SceneInformationConnection,
} from '../../informationItem/types';
import type { Scene, SceneConnection } from '../types';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements, scenesToNodes } from './index';

export interface SceneFlowCanvasProps {
  scenes: Scene[];
  connections: SceneConnection[];
  events?: Record<string, SceneEvent[]>;
  onNodesChange?: (nodes: Scene[]) => void;
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
  onConnectionDelete?: (id: string) => void;
  // 情報項目関連
  informationItems?: InformationItem[];
  informationConnections?: InformationItemConnection[];
  informationToSceneConnections?: InformationToSceneConnection[];
  sceneInformationConnections?: SceneInformationConnection[];
}

export const useSceneFlowCanvas = (props: SceneFlowCanvasProps) => {
  const {
    scenes,
    connections,
    events,
    onNodesChange: onNodesUpdate,
    onConnectionAdd,
    onConnectionDelete,
    informationItems = [],
    informationConnections = [],
    informationToSceneConnections = [],
    sceneInformationConnections = [],
  } = props;
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  // シーンノードの作成
  const sceneNodes: Node[] = scenesToNodes(scenes, undefined, events);

  // 情報項目ノードの作成
  const informationNodes: Node[] = informationItems.map((item, index) => ({
    id: `info-${item.id}`,
    type: 'informationItemNode',
    data: item,
    position: {
      x: 250 * ((index + scenes.length) % 3),
      y: 150 * Math.floor((index + scenes.length) / 3),
    },
  }));

  const initialNodes: Node[] = [...sceneNodes, ...informationNodes];

  // シーン間の接続エッジ
  const sceneEdges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }));

  // 情報項目同士の接続エッジ
  const informationEdges: Edge[] = informationConnections.map((conn) => ({
    id: `info-conn-${conn.id}`,
    source: `info-${conn.source}`,
    target: `info-${conn.target}`,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
  }));

  // 情報項目→シーンの接続エッジ
  const informationToSceneEdges: Edge[] = informationToSceneConnections.map(
    (conn) => ({
      id: `info-to-scene-${conn.id}`,
      source: `info-${conn.informationItemId}`,
      target: conn.sceneId,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
    }),
  );

  // シーン→情報項目の接続エッジ（獲得できる情報）
  const sceneToInformationEdges: Edge[] = sceneInformationConnections.map(
    (conn) => ({
      id: `scene-to-info-${conn.id}`,
      source: conn.sceneId,
      target: `info-${conn.informationItemId}`,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' },
    }),
  );

  const initialEdges: Edge[] = [
    ...sceneEdges,
    ...informationEdges,
    ...informationToSceneEdges,
    ...sceneToInformationEdges,
  ];

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
    const sceneNodes: Node[] = scenesToNodes(scenes, nodes, events);
    const informationNodes: Node[] = informationItems.map((item, index) => {
      const existingNode = nodes.find((n) => n.id === `info-${item.id}`);
      return {
        id: `info-${item.id}`,
        type: 'informationItemNode',
        data: item,
        position: existingNode?.position || {
          x: 250 * ((index + scenes.length) % 3),
          y: 150 * Math.floor((index + scenes.length) / 3),
        },
      };
    });
    setNodes([...sceneNodes, ...informationNodes]);
  }, [scenes, events, informationItems, setNodes]);

  useEffect(() => {
    const sceneEdges: Edge[] = connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    }));

    const informationEdges: Edge[] = informationConnections.map((conn) => ({
      id: `info-conn-${conn.id}`,
      source: `info-${conn.source}`,
      target: `info-${conn.target}`,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 2 },
    }));

    const informationToSceneEdges: Edge[] = informationToSceneConnections.map(
      (conn) => ({
        id: `info-to-scene-${conn.id}`,
        source: `info-${conn.informationItemId}`,
        target: conn.sceneId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
      }),
    );

    const sceneToInformationEdges: Edge[] = sceneInformationConnections.map(
      (conn) => ({
        id: `scene-to-info-${conn.id}`,
        source: conn.sceneId,
        target: `info-${conn.informationItemId}`,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' },
      }),
    );

    setEdges([
      ...sceneEdges,
      ...informationEdges,
      ...informationToSceneEdges,
      ...sceneToInformationEdges,
    ]);
  }, [
    connections,
    informationConnections,
    informationToSceneConnections,
    sceneInformationConnections,
    setEdges,
  ]);

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
