import type { SceneEvent, SceneEventType } from '@trpg-scenario-maker/schema';
import React, { useState, useEffect } from 'react';

export interface SceneEventFormProps {
  event?: SceneEvent;
  onSave: (eventData: { type: SceneEventType; content: string }) => void;
  onCancel: () => void;
}

const EVENT_TYPE_OPTIONS: {
  value: SceneEventType;
  label: string;
}[] = [
  { value: 'start', label: 'スタート' },
  { value: 'conversation', label: '会話' },
  { value: 'choice', label: '選択肢' },
  { value: 'skill_check', label: '判定' },
  { value: 'battle', label: '戦闘' },
  { value: 'treasure', label: '宝箱' },
  { value: 'trap', label: '罠' },
  { value: 'puzzle', label: '謎解き' },
  { value: 'rest', label: '休息' },
  { value: 'ending', label: 'エンディング' },
];

export const SceneEventForm: React.FC<SceneEventFormProps> = ({
  event,
  onSave,
  onCancel,
}) => {
  const [type, setType] = useState<SceneEventType>(
    event?.type || 'conversation',
  );
  const [content, setContent] = useState(event?.content || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (event) {
      setType(event.type);
      setContent(event.content);
    }
  }, [event]);

  const handleSubmit = () => {
    setError('');
    onSave({ type, content });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="event-type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          イベントタイプ
        </label>
        <select
          id="event-type"
          value={type}
          onChange={(e) => setType(e.target.value as SceneEventType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {EVENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="event-content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          イベント内容
        </label>
        <textarea
          id="event-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="イベントの詳細を入力してください..."
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {event ? '更新' : '追加'}
        </button>
      </div>
    </div>
  );
};
