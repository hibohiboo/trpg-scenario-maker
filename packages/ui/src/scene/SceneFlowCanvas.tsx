import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import type { Scene, SceneConnection } from './types';

interface SceneFlowCanvasProps {
  scenes: Scene[];
  connections: SceneConnection[];
  onNodesChange?: (nodes: Scene[]) => void;
  onConnectionAdd?: (connection: Omit<SceneConnection, 'id'>) => void;
  onConnectionDelete?: (id: string) => void;
}

export function SceneFlowCanvas({
  scenes,
  connections,
  onNodesChange: onNodesUpdate,
  onConnectionAdd,
  onConnectionDelete,
}: SceneFlowCanvasProps) {
  // ReactFlowのNode形式に変換
  const initialNodes: Node[] = scenes.map((scene, index) => ({
    id: scene.id,
    type: scene.isMasterScene ? 'input' : 'default',
    data: { label: scene.title },
    position: { x: 250 * (index % 3), y: 150 * Math.floor(index / 3) },
    style: scene.isMasterScene
      ? {
          backgroundColor: '#dcfce7',
          border: '2px solid #16a34a',
          borderRadius: '8px',
          padding: '10px',
        }
      : undefined,
  }));

  // ReactFlowのEdge形式に変換
  const initialEdges: Edge[] = connections.map((conn) => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    label: conn.order ? `順序: ${conn.order}` : undefined,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // propsが変更されたらノードとエッジを更新
  useEffect(() => {
    const newNodes: Node[] = scenes.map((scene, index) => {
      // 既存のノードの位置を保持
      const existingNode = nodes.find((n) => n.id === scene.id);
      return {
        id: scene.id,
        type: scene.isMasterScene ? 'input' : 'default',
        data: { label: scene.title },
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
    setNodes(newNodes);
  }, [scenes, setNodes]);

  useEffect(() => {
    const newEdges: Edge[] = connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      label: conn.order ? `順序: ${conn.order}` : undefined,
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

      // エッジ削除の検出
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

      // ノードの位置変更を検出して親コンポーネントに通知
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

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
