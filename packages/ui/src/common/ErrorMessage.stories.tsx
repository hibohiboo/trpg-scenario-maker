import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Common/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fullScreen: {
      control: 'boolean',
    },
    onRetry: {
      action: 'retry',
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: 'データの読み込みに失敗しました',
  },
};

export const WithTitle: Story = {
  args: {
    error: 'データの読み込みに失敗しました',
    title: '通信エラー',
  },
};

export const WithRetry: Story = {
  args: {
    error: 'データの読み込みに失敗しました',
    onRetry: () => alert('再試行します'),
  },
};

export const WithCustomRetryLabel: Story = {
  args: {
    error: 'データの読み込みに失敗しました',
    onRetry: () => alert('再試行します'),
    retryLabel: 'もう一度試す',
  },
};

export const ErrorObject: Story = {
  args: {
    error: new Error('Network request failed'),
    title: 'ネットワークエラー',
  },
};

export const LongErrorMessage: Story = {
  args: {
    error:
      'サーバーとの通信中に予期しないエラーが発生しました。ネットワーク接続を確認するか、しばらく時間をおいてから再度お試しください。問題が解決しない場合は、管理者にお問い合わせください。',
    title: 'サーバーエラー',
    onRetry: () => alert('再試行します'),
  },
};

export const FullScreen: Story = {
  args: {
    error: 'データの読み込みに失敗しました',
    fullScreen: true,
    onRetry: () => alert('再試行します'),
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const MultipleErrors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <ErrorMessage error="通信エラーが発生しました" />
      <ErrorMessage
        error="認証に失敗しました"
        title="認証エラー"
        onRetry={() => alert('再試行')}
      />
      <ErrorMessage
        error={new Error('Database connection failed')}
        title="データベースエラー"
      />
    </div>
  ),
};
