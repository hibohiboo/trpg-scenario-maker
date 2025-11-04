import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { CharacterGraphToolbar } from './CharacterGraphToolbar';
import { getLayoutedCharacterElements } from './characterGraphUtils';
import { CharacterNode } from './CharacterNode';
import type { CharacterWithRole, ScenarioCharacterRelationship } from './types';

const nodeTypes = {
  characterNode: CharacterNode,
};

export interface CharacterRelationshipGraphProps {
  /** キャラクター一覧 */
  characters: CharacterWithRole[];
  /** 関係性一覧 */
  relations: ScenarioCharacterRelationship[];
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * キャラクター関係性をReactFlowのノード形式に変換
 */
function convertToNodes(characters: CharacterWithRole[]): Node[] {
  return characters.map((character, index) => ({
    id: character.characterId,
    type: 'characterNode',
    position: {
      x: (index % 3) * 250,
      y: Math.floor(index / 3) * 200,
    },
    data: {
      name: character.name,
      role: character.role,
      description: character.description,
    },
  }));
}

/**
 * ハンドルIDを決定する
 */
function determineHandles(
  isBidirectional: boolean,
  order: number | undefined,
  direction: 'TB' | 'LR',
): { sourceHandle: string; targetHandle: string } {
  const isVertical = direction === 'TB';

  if (isBidirectional && order === 2) {
    // 2番目のエッジは -2 のハンドルを使用
    return {
      sourceHandle: isVertical ? 'bottom-2' : 'right-2',
      targetHandle: isVertical ? 'top-2' : 'left-2',
    };
  }

  // 1番目のエッジまたは単方向エッジは -1 のハンドルを使用
  return {
    sourceHandle: isVertical ? 'bottom-1' : 'right-1',
    targetHandle: isVertical ? 'top-1' : 'left-1',
  };
}

/**
 * 双方向関係を検出する
 */
function detectBidirectionalRelations(
  relations: ScenarioCharacterRelationship[],
): Map<string, number> {
  const bidirectionalPairs = new Map<string, number>();
  const edgeMap = new Map<string, ScenarioCharacterRelationship>();

  relations.forEach((relation) => {
    const key = `${relation.fromCharacterId}-${relation.toCharacterId}`;
    const reverseKey = `${relation.toCharacterId}-${relation.fromCharacterId}`;

    edgeMap.set(key, relation);

    if (edgeMap.has(reverseKey)) {
      if (!bidirectionalPairs.has(reverseKey)) {
        bidirectionalPairs.set(reverseKey, 1);
      }
      bidirectionalPairs.set(key, 2);
    }
  });

  return bidirectionalPairs;
}

/**
 * キャラクター関係性をReactFlowのエッジ形式に変換
 * 双方向の関係を検出してカーブで表現
 */
function convertToEdges(
  relations: ScenarioCharacterRelationship[],
  direction: 'TB' | 'LR' = 'TB',
): Edge[] {
  const bidirectionalPairs = detectBidirectionalRelations(relations);

  return relations.map((relation, index) => {
    const key = `${relation.fromCharacterId}-${relation.toCharacterId}`;
    const order = bidirectionalPairs.get(key);
    const isBidirectional = order !== undefined;

    const { sourceHandle, targetHandle } = determineHandles(
      isBidirectional,
      order,
      direction,
    );

    return {
      id: `edge-${index}`,
      source: relation.fromCharacterId,
      target: relation.toCharacterId,
      sourceHandle,
      targetHandle,
      label: relation.relationshipName,
      type: isBidirectional ? 'smoothstep' : 'default',
      animated: true,
      style: {
        stroke: '#3b82f6',
        strokeWidth: 2,
      },
      labelStyle: { fill: '#1e40af', fontWeight: 600 },
      labelBgStyle: { fill: '#eff6ff' },
    };
  });
}

/**
 * キャラクター関係性グラフコンポーネント
 * ReactFlowを使用してキャラクター間の関係性を可視化
 */
export function CharacterRelationshipGraph({
  characters,
  relations,
  isLoading,
}: CharacterRelationshipGraphProps) {
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');

  const initialNodes = convertToNodes(characters);
  const initialEdges = convertToEdges(relations, direction);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (newDirection: 'TB' | 'LR') => {
      setDirection(newDirection);

      // エッジをレイアウト方向に応じて再生成
      const updatedEdges = convertToEdges(relations, newDirection);

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedCharacterElements(nodes, updatedEdges, newDirection);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, relations, setNodes, setEdges],
  );

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">キャラクターが登録されていません</p>
          <p className="text-sm">キャラクターを追加して関係性を可視化しましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden relative">
      <style>{`
        .react-flow__handle {
          width: 12px !important;
          height: 12px !important;
          border: 2px solid #3b82f6 !important;
          background: white !important;
        }
        .react-flow__handle:hover {
          width: 16px !important;
          height: 16px !important;
          background: #3b82f6 !important;
        }
        .react-flow__node:hover .react-flow__handle {
          width: 14px !important;
          height: 14px !important;
        }

        /* エッジのスタイル */
        .react-flow__edge-path {
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
        }
        .react-flow__edge.selected .react-flow__edge-path {
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
        }
      `}</style>
      <CharacterGraphToolbar onLayout={onLayout} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
