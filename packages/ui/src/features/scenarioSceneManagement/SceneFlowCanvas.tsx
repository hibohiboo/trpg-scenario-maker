import {
  useSceneFlowCanvas,
  type SceneFlowCanvasProps,
} from '../../scene/canvas/useSceneFlowCanvas';
import { CanvasToolbar, FlowCanvas, SceneDetailSidebar } from './canvas';

export function SceneFlowCanvas(props: SceneFlowCanvasProps) {
  const {
    selectedScene,
    nodes,
    edges,
    onLayout,
    handleConnect,
    handleEdgesChange,
    handleNodesChange,
    handleNodeClick,
    handleCloseSidebar,
  } = useSceneFlowCanvas(props);

  return (
    <div className="relative" style={{ width: '100%', height: '600px' }}>
      <CanvasToolbar onLayout={onLayout} />
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
      />
      <SceneDetailSidebar scene={selectedScene} onClose={handleCloseSidebar} />
    </div>
  );
}
