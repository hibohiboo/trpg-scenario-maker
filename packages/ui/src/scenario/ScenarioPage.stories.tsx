import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Layout } from '../common';
import { ScenarioPage } from './ScenarioPage';
import type { Scenario } from './types';

const meta = {
  title: 'Scenario/ScenarioPage',
  component: ScenarioPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Layout>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof ScenarioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScenarios: Scenario[] = [
  {
    id: '1',
    title: '古城の謎',
    createdAt: new Date('2025-01-15T10:00:00'),
    updatedAt: new Date('2025-01-20T15:30:00'),
  },
  {
    id: '2',
    title: '森の奥の秘密',
    createdAt: new Date('2025-01-10T08:00:00'),
    updatedAt: new Date('2025-01-18T12:00:00'),
  },
  {
    id: '3',
    title: '海底神殿の財宝',
    createdAt: new Date('2025-01-05T14:30:00'),
    updatedAt: new Date('2025-01-15T09:45:00'),
  },
];

export const Default: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>(sampleScenarios);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [createTitle, setCreateTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(
      null,
    );
    const [deletingScenario, setDeletingScenario] = useState<Scenario | null>(
      null,
    );

    return (
      <ScenarioPage
        scenarios={scenarios}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        createTitle={createTitle}
        editTitle={editTitle}
        editingScenario={editingScenario}
        deletingScenario={deletingScenario}
        onCreateNew={() => setIsCreateModalOpen(true)}
        onCloseCreateModal={() => {
          setIsCreateModalOpen(false);
          setCreateTitle('');
        }}
        onCreateTitleChange={setCreateTitle}
        onCreateSubmit={fn()}
        onEdit={(scenario) => {
          setEditingScenario(scenario);
          setEditTitle(scenario.title);
          setIsEditModalOpen(true);
        }}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingScenario(null);
          setEditTitle('');
        }}
        onEditTitleChange={setEditTitle}
        onEditSubmit={fn()}
        onDelete={(scenario) => {
          setDeletingScenario(scenario);
          setIsDeleteModalOpen(true);
        }}
        onCloseDeleteModal={() => {
          setIsDeleteModalOpen(false);
          setDeletingScenario(null);
        }}
        onDeleteConfirm={fn()}
        onClick={fn()}
      />
    );
  },
  args: {} as never,
};

export const Empty: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createTitle, setCreateTitle] = useState('');

    return (
      <ScenarioPage
        scenarios={scenarios}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={false}
        isDeleteModalOpen={false}
        createTitle={createTitle}
        editTitle=""
        editingScenario={null}
        deletingScenario={null}
        onCreateNew={() => setIsCreateModalOpen(true)}
        onCloseCreateModal={() => {
          setIsCreateModalOpen(false);
          setCreateTitle('');
        }}
        onCreateTitleChange={setCreateTitle}
        onCreateSubmit={fn()}
        onEdit={fn()}
        onCloseEditModal={fn()}
        onEditTitleChange={fn()}
        onEditSubmit={fn()}
        onDelete={fn()}
        onCloseDeleteModal={fn()}
        onDeleteConfirm={fn()}
      />
    );
  },
  args: {} as never,
};

export const Loading: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>([]);

    return (
      <ScenarioPage
        scenarios={scenarios}
        isLoading
        isCreateModalOpen={false}
        isEditModalOpen={false}
        isDeleteModalOpen={false}
        createTitle=""
        editTitle=""
        editingScenario={null}
        deletingScenario={null}
        onCreateNew={fn()}
        onCloseCreateModal={fn()}
        onCreateTitleChange={fn()}
        onCreateSubmit={fn()}
        onEdit={fn()}
        onCloseEditModal={fn()}
        onEditTitleChange={fn()}
        onEditSubmit={fn()}
        onDelete={fn()}
        onCloseDeleteModal={fn()}
        onDeleteConfirm={fn()}
      />
    );
  },
  args: {} as never,
};

export const CreateModalOpen: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>(sampleScenarios);
    const [createTitle, setCreateTitle] = useState('');

    return (
      <ScenarioPage
        scenarios={scenarios}
        isCreateModalOpen
        isEditModalOpen={false}
        isDeleteModalOpen={false}
        createTitle={createTitle}
        editTitle=""
        editingScenario={null}
        deletingScenario={null}
        onCreateNew={fn()}
        onCloseCreateModal={fn()}
        onCreateTitleChange={setCreateTitle}
        onCreateSubmit={fn()}
        onEdit={fn()}
        onCloseEditModal={fn()}
        onEditTitleChange={fn()}
        onEditSubmit={fn()}
        onDelete={fn()}
        onCloseDeleteModal={fn()}
        onDeleteConfirm={fn()}
      />
    );
  },
  args: {} as never,
};

export const EditModalOpen: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>(sampleScenarios);
    const [editTitle, setEditTitle] = useState('古城の謎');

    return (
      <ScenarioPage
        scenarios={scenarios}
        isCreateModalOpen={false}
        isEditModalOpen
        isDeleteModalOpen={false}
        createTitle=""
        editTitle={editTitle}
        editingScenario={sampleScenarios[0]}
        deletingScenario={null}
        onCreateNew={fn()}
        onCloseCreateModal={fn()}
        onCreateTitleChange={fn()}
        onCreateSubmit={fn()}
        onEdit={fn()}
        onCloseEditModal={fn()}
        onEditTitleChange={setEditTitle}
        onEditSubmit={fn()}
        onDelete={fn()}
        onCloseDeleteModal={fn()}
        onDeleteConfirm={fn()}
      />
    );
  },
  args: {} as never,
};

export const DeleteModalOpen: Story = {
  render: () => {
    const [scenarios] = useState<Scenario[]>(sampleScenarios);

    return (
      <ScenarioPage
        scenarios={scenarios}
        isCreateModalOpen={false}
        isEditModalOpen={false}
        isDeleteModalOpen
        createTitle=""
        editTitle=""
        editingScenario={null}
        deletingScenario={sampleScenarios[0]}
        onCreateNew={fn()}
        onCloseCreateModal={fn()}
        onCreateTitleChange={fn()}
        onCreateSubmit={fn()}
        onEdit={fn()}
        onCloseEditModal={fn()}
        onEditTitleChange={fn()}
        onEditSubmit={fn()}
        onDelete={fn()}
        onCloseDeleteModal={fn()}
        onDeleteConfirm={fn()}
      />
    );
  },
  args: {} as never,
};
