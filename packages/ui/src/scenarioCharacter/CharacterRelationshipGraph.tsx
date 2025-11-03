import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
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
 * キャラクター関係性をReactFlowのエッジ形式に変換
 */
function convertToEdges(relations: ScenarioCharacterRelationship[]): Edge[] {
  return relations.map((relation, index) => ({
    id: `edge-${index}`,
    source: relation.fromCharacterId,
    target: relation.toCharacterId,
    label: relation.relationshipName,
    type: 'default',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    labelStyle: { fill: '#1e40af', fontWeight: 600 },
    labelBgStyle: { fill: '#eff6ff' },
  }));
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
  const nodes = convertToNodes(characters);
  const edges = convertToEdges(relations);

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
    <div className="w-full h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden">
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
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
