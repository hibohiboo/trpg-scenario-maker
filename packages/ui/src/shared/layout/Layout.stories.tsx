import { Layout } from './Layout';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Common/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['container', 'full', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">ページタイトル</h1>
    <p className="text-gray-600">
      これは共通レイアウトコンテナのデモです。サイト全体で一貫したレイアウトを提供します。
    </p>
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-2 text-xl font-semibold">セクション</h2>
      <p className="text-gray-600">
        コンテンツがここに表示されます。レイアウトは自動的に中央揃えされ、適切なパディングが適用されます。
      </p>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    children: <DemoContent />,
  },
};

export const FullWidth: Story = {
  args: {
    maxWidth: 'full',
    children: <DemoContent />,
  },
};

export const LargeWidth: Story = {
  args: {
    maxWidth: 'lg',
    children: <DemoContent />,
  },
};

export const ExtraLargeWidth: Story = {
  args: {
    maxWidth: 'xl',
    children: <DemoContent />,
  },
};

export const CustomPadding: Story = {
  args: {
    paddingX: 'px-8',
    paddingY: 'py-12',
    children: <DemoContent />,
  },
};

export const NoPadding: Story = {
  args: {
    paddingX: 'px-0',
    paddingY: 'py-0',
    children: <DemoContent />,
  },
};

export const WithBackgroundColor: Story = {
  args: {
    className: 'bg-gray-50 min-h-screen',
    children: <DemoContent />,
  },
};

export const MultipleLayouts: Story = {
  args: {
    className: '',
    children: null,
  },
  render: () => (
    <div className="space-y-8 bg-gray-100">
      <Layout className="bg-white shadow">
        <h2 className="text-2xl font-bold">Container (デフォルト)</h2>
        <p>通常のコンテナ幅</p>
      </Layout>
      <Layout maxWidth="xl" className="bg-white shadow">
        <h2 className="text-2xl font-bold">Extra Large</h2>
        <p>より広いコンテナ幅</p>
      </Layout>
      <Layout maxWidth="full" className="bg-white shadow">
        <h2 className="text-2xl font-bold">Full Width</h2>
        <p>画面幅いっぱい</p>
      </Layout>
    </div>
  ),
};
