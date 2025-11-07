import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';

/**
 * カスタム情報項目ノードコンポーネント
 * 情報項目のタイトルを表示
 */
export const InformationItemNode = memo((props: NodeProps) => {
  const data = props.data as {
    id: string;
    title: string;
    description: string;
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-amber-50 border-2 border-amber-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} />

      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-gray-900">{data.title}</div>
        {data.description && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {data.description}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

InformationItemNode.displayName = 'InformationItemNode';
