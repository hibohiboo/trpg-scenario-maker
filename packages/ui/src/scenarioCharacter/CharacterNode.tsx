import { safeParseCharacterNodeData } from '@trpg-scenario-maker/schema';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';

/**
 * キャラクターノードコンポーネント
 * ReactFlowのカスタムノード
 */
export const CharacterNode = memo((props: NodeProps) => {
  const result = safeParseCharacterNodeData(props.data);
  if (!result.success) {
    console.debug('CharacterNode parse failed:', props.data);
    return <></>;
  }
  const data = result.output;

  return (
    <div className="character-node px-4 py-3 shadow-md rounded-lg bg-white border-2 border-blue-500 min-w-[150px]">
      {/* 4方向に2つずつハンドルを追加 */}
      {/* 上側 */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-1"
        style={{ left: '33%' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-2"
        style={{ left: '67%' }}
      />

      {/* 下側 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-1"
        style={{ left: '33%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-2"
        style={{ left: '67%' }}
      />

      {/* 左側 */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-1"
        style={{ top: '33%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-2"
        style={{ top: '67%' }}
      />

      {/* 右側 */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-1"
        style={{ top: '33%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-2"
        style={{ top: '67%' }}
      />

      <div className="flex flex-col gap-1">
        <div className="text-base font-bold text-gray-900 text-center">
          {data.name}
        </div>

        {data.role && (
          <div className="text-xs text-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {data.role}
          </div>
        )}

        {data.description && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2 text-center">
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
});

CharacterNode.displayName = 'CharacterNode';
