import { useState } from 'react';
import { fn } from 'storybook/test';
import { ScenarioForm } from './ScenarioForm';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Scenario/ScenarioForm',
  component: ScenarioForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'タイトルの値',
    },
    onTitleChange: {
      description: 'タイトル変更時のコールバック',
    },
    onSubmit: {
      description: '送信時のコールバック',
    },
    onCancel: {
      description: 'キャンセル時のコールバック',
    },
    submitLabel: {
      description: '送信ボタンのラベル',
    },
    isSubmitting: {
      description: '送信中かどうか',
    },
  },
} satisfies Meta<typeof ScenarioForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  render: () => {
    const [title, setTitle] = useState('');
    return (
      <ScenarioForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={fn()}
        onCancel={fn()}
        submitLabel="作成"
      />
    );
  },
  args: {} as never,
};

export const Edit: Story = {
  render: () => {
    const [title, setTitle] = useState('古城の謎');
    return (
      <ScenarioForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={fn()}
        onCancel={fn()}
        submitLabel="更新"
      />
    );
  },
  args: {} as never,
};

export const WithoutCancelButton: Story = {
  render: () => {
    const [title, setTitle] = useState('');
    return (
      <ScenarioForm title={title} onTitleChange={setTitle} onSubmit={fn()} />
    );
  },
  args: {} as never,
};

export const Submitting: Story = {
  render: () => {
    const [title, setTitle] = useState('古城の謎');
    return (
      <ScenarioForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={fn()}
        onCancel={fn()}
        isSubmitting
      />
    );
  },
  args: {} as never,
};

export const CustomSubmitLabel: Story = {
  render: () => {
    const [title, setTitle] = useState('');
    return (
      <ScenarioForm
        title={title}
        onTitleChange={setTitle}
        onSubmit={fn()}
        onCancel={fn()}
        submitLabel="シナリオを保存"
      />
    );
  },
  args: {} as never,
};

export const InModal: Story = {
  render: () => {
    const [title, setTitle] = useState('');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h2 className="text-xl font-bold mb-4">新規シナリオ作成</h2>
          <ScenarioForm
            title={title}
            onTitleChange={setTitle}
            onSubmit={fn()}
            onCancel={fn()}
            submitLabel="作成"
          />
        </div>
      </div>
    );
  },
  args: {} as never,
};
