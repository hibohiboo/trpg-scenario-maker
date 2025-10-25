import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SceneEditor } from './SceneEditor';
import type { Scene, SceneConnection } from './types';

const meta = {
  title: 'Scene/SceneEditor',
  component: SceneEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    scenarioId: {
      description: 'シナリオID',
    },
    scenes: {
      description: 'シーンの配列',
    },
    connections: {
      description: 'シーン間の接続の配列',
    },
    onAddScene: {
      description: 'シーン追加時のコールバック',
    },
    onUpdateScene: {
      description: 'シーン更新時のコールバック',
    },
    onDeleteScene: {
      description: 'シーン削除時のコールバック',
    },
    onAddConnection: {
      description: '接続追加時のコールバック',
    },
    onUpdateConnection: {
      description: '接続更新時のコールバック',
    },
    onDeleteConnection: {
      description: '接続削除時のコールバック',
    },
  },
} satisfies Meta<typeof SceneEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialScenes: Scene[] = [
  {
    id: '1',
    title: 'オープニング',
    description: '冒険者たちが酒場で出会うシーン',
    isMasterScene: true,
  },
  {
    id: '2',
    title: '古城への道',
    description: '険しい山道を登り、古城へ向かう',
    isMasterScene: false,
  },
  {
    id: '3',
    title: '古城の入口',
    description: '荘厳な古城の門をくぐる',
    isMasterScene: false,
  },
];

const initialConnections: SceneConnection[] = [
  { id: '1-2', source: '1', target: '2' },
  { id: '2-3', source: '2', target: '3' },
];

export const Default: Story = {
  render: () => {
    const [scenes, setScenes] = useState<Scene[]>(initialScenes);
    const [connections, setConnections] =
      useState<SceneConnection[]>(initialConnections);

    const handleAddScene = (scene: Omit<Scene, 'id'>) => {
      const newScene: Scene = {
        ...scene,
        id: `${Date.now()}`,
      };
      setScenes([...scenes, newScene]);
    };

    const handleUpdateScene = (id: string, updates: Partial<Scene>) => {
      setScenes(
        scenes.map((scene) =>
          scene.id === id ? { ...scene, ...updates } : scene,
        ),
      );
    };

    const handleDeleteScene = (id: string) => {
      setScenes(scenes.filter((scene) => scene.id !== id));
      setConnections(
        connections.filter((conn) => conn.source !== id && conn.target !== id),
      );
    };

    const handleAddConnection = (connection: Omit<SceneConnection, 'id'>) => {
      const newConnection: SceneConnection = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
      };
      setConnections([...connections, newConnection]);
    };

    const handleDeleteConnection = (id: string) => {
      setConnections(connections.filter((conn) => conn.id !== id));
    };

    return (
      <div className="p-8">
        <SceneEditor
          scenarioId="sample-scenario"
          scenes={scenes}
          connections={connections}
          onAddScene={handleAddScene}
          onUpdateScene={handleUpdateScene}
          onDeleteScene={handleDeleteScene}
          onAddConnection={handleAddConnection}
          onUpdateConnection={fn()}
          onDeleteConnection={handleDeleteConnection}
        />
      </div>
    );
  },
  args: {} as never,
};

export const Empty: Story = {
  args: {
    scenarioId: 'sample-scenario',
    scenes: [],
    connections: [],
    onAddScene: fn(),
    onUpdateScene: fn(),
    onDeleteScene: fn(),
    onAddConnection: fn(),
    onUpdateConnection: fn(),
    onDeleteConnection: fn(),
  },
};

export const WithManyScenes: Story = {
  args: {
    scenarioId: 'sample-scenario',
    scenes: Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 1}`,
      title: `シーン ${i + 1}`,
      description: `シーン ${i + 1} の詳細な説明がここに入ります`,
      isMasterScene: i === 0,
    })),
    connections: Array.from({ length: 7 }, (_, i) => ({
      id: `${i + 1}-${i + 2}`,
      source: `${i + 1}`,
      target: `${i + 2}`,
      order: i + 1,
    })),
    onAddScene: fn(),
    onUpdateScene: fn(),
    onDeleteScene: fn(),
    onAddConnection: fn(),
    onUpdateConnection: fn(),
    onDeleteConnection: fn(),
  },
};

export const WithComplexFlow: Story = {
  render: () => {
    const complexScenes: Scene[] = [
      {
        id: '1',
        title: 'オープニング',
        description: '物語の始まり',
        isMasterScene: true,
      },
      {
        id: '2',
        title: '分岐A：森へ',
        description: '森へ向かう選択',
        isMasterScene: false,
      },
      {
        id: '3',
        title: '分岐B：山へ',
        description: '山へ向かう選択',
        isMasterScene: false,
      },
      {
        id: '4',
        title: '森の奥',
        description: '森の奥深くで妖精と出会う',
        isMasterScene: false,
      },
      {
        id: '5',
        title: '山頂',
        description: '山の頂上で賢者と出会う',
        isMasterScene: false,
      },
      {
        id: '6',
        title: '合流',
        description: '2つのルートが合流する',
        isMasterScene: false,
      },
      {
        id: '7',
        title: 'エンディング',
        description: '物語の終わり',
        isMasterScene: false,
      },
    ];

    const complexConnections: SceneConnection[] = [
      { id: '1-2', source: '1', target: '2' },
      { id: '1-3', source: '1', target: '3' },
      { id: '2-4', source: '2', target: '4' },
      { id: '3-5', source: '3', target: '5' },
      { id: '4-6', source: '4', target: '6' },
      { id: '5-6', source: '5', target: '6' },
      { id: '6-7', source: '6', target: '7' },
    ];

    const [scenes, setScenes] = useState<Scene[]>(complexScenes);
    const [connections, setConnections] =
      useState<SceneConnection[]>(complexConnections);

    return (
      <div className="p-8">
        <SceneEditor
          scenarioId="complex-scenario"
          scenes={scenes}
          connections={connections}
          onAddScene={(scene) => {
            setScenes([...scenes, { ...scene, id: `${Date.now()}` }]);
          }}
          onUpdateScene={(id, updates) => {
            setScenes(
              scenes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
            );
          }}
          onDeleteScene={(id) => {
            setScenes(scenes.filter((s) => s.id !== id));
            setConnections(
              connections.filter((c) => c.source !== id && c.target !== id),
            );
          }}
          onAddConnection={(conn) => {
            setConnections([
              ...connections,
              { ...conn, id: `${conn.source}-${conn.target}` },
            ]);
          }}
          onUpdateConnection={fn()}
          onDeleteConnection={(id) => {
            setConnections(connections.filter((c) => c.id !== id));
          }}
        />
      </div>
    );
  },
  args: {} as never,
};
