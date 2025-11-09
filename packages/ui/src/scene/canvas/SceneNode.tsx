import { safeParseSceneSchema } from '@trpg-scenario-maker/schema';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import { SceneEventIcon } from '../sceneEvent';
import type { NodeProps } from '@xyflow/react';

/**
 * カスタムシーンノードコンポーネント
 * シーンのタイトルとイベントアイコンを表示
 */
export const SceneNode = memo((props: NodeProps) => {
  const result = safeParseSceneSchema(props.data);
  if (!result.success) {
    console.debug('SceneNode parse failed:', props.data);
    return <></>;
  }
  const data = result.output;
  const hasEvents = data.events && data.events.length > 0;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} />

      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-gray-900">{data.title}</div>

        {hasEvents && data.events && (
          <div className="flex gap-1 items-center flex-wrap">
            {data.events.map((event) => (
              <SceneEventIcon
                key={event.id}
                type={event.type}
                size={14}
                className="text-gray-600"
                title={event.content}
              />
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

SceneNode.displayName = 'SceneNode';
