import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';
import { InformationItemNode, SceneNode } from '../../../entities/scene';

const nodeTypes = {
  sceneNode: SceneNode,
  informationItemNode: InformationItemNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
}: FlowCanvasProps) {
  return (
    <>
      <style>{`
        .react-flow__handle {
          width: 12px !important;
          height: 12px !important;
          border: 2px solid #6366f1 !important;
          background: white !important;
        }
        .react-flow__handle:hover {
          width: 16px !important;
          height: 16px !important;
          background: #6366f1 !important;
        }
        .react-flow__node:hover .react-flow__handle {
          width: 14px !important;
          height: 14px !important;
        }

        /* 選択されたエッジのスタイル */
        .react-flow__edge.selected path {
          stroke: #ef4444 !important;
          stroke-width: 3px !important;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </>
  );
}
