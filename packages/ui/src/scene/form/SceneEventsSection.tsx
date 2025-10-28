import type { SceneEvent, SceneEventType } from '@trpg-scenario-maker/schema';
import { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { Button } from '../../common';
import { SceneEventForm, SceneEventIcon } from '../sceneEvent';

export interface SceneEventsSectionProps {
  events: SceneEvent[];
  onAddEvent: (eventData: { type: SceneEventType; content: string }) => void;
  onUpdateEvent: (
    eventId: string,
    eventData: { type: SceneEventType; content: string },
  ) => void;
  onDeleteEvent: (eventId: string) => void;
  onMoveEventUp: (eventId: string) => void;
  onMoveEventDown: (eventId: string) => void;
}

export const SceneEventsSection: React.FC<SceneEventsSectionProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMoveEventUp,
  onMoveEventDown,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SceneEvent | null>(null);

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: SceneEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSave = (eventData: {
    type: SceneEventType;
    content: string;
  }) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      onAddEvent(eventData);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId: string) => {
    if (window.confirm('このイベントを削除しますか？')) {
      onDeleteEvent(eventId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">イベント管理</h3>
        <Button
          type="button"
          variant="primary"
          onClick={handleAddClick}
          className="flex items-center gap-2"
        >
          <FaPlus />
          イベント追加
        </Button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <h4 className="mb-4 text-md font-medium text-gray-900">
            {editingEvent ? 'イベント編集' : 'イベント追加'}
          </h4>
          <SceneEventForm
            event={editingEvent || undefined}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
            >
              <SceneEventIcon type={event.type} size={24} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {event.type}
                </div>
                <div className="text-sm text-gray-600">
                  {event.content.length > 50
                    ? `${event.content.substring(0, 50)}...`
                    : event.content}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMoveEventUp(event.id)}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title="上に移動"
                >
                  <FaArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveEventDown(event.id)}
                  disabled={index === events.length - 1}
                  className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  title="下に移動"
                >
                  <FaArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEditClick(event)}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50"
                  title="編集"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  title="削除"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            イベントがまだ登録されていません。
          </p>
          <p className="text-sm text-gray-500">
            「イベント追加」ボタンから新しいイベントを追加してください。
          </p>
        </div>
      )}
    </div>
  );
};
