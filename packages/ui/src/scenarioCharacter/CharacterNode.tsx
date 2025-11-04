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
      {/* 4方向のハンドルを追加 */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />

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
