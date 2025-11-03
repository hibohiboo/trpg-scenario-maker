import type { Meta, StoryObj } from '@storybook/react';
import { InformationItemConnectionList } from './InformationItemConnectionList';
import type { InformationItem } from './types';

const mockItems: InformationItem[] = [
  {
    id: '1',
    title: '古代の予言',
    description: '世界の滅亡を予言する古文書',
  },
  {
    id: '2',
    title: '魔法の杖',
    description: '強大な力を秘めた杖',
  },
  {
    id: '3',
    title: '封印の鍵',
    description: '古代神殿を開く鍵',
  },
];

const meta = {
  title: 'InformationItem/InformationItemConnectionList',
  component: InformationItemConnectionList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    connections: { control: 'object' },
    isLoading: { control: 'boolean' },
    onAddConnection: { action: 'onAddConnection' },
    onRemoveConnection: { action: 'onRemoveConnection' },
  },
} satisfies Meta<typeof InformationItemConnectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: mockItems,
    connections: [
      {
        id: 'conn1',
        source: '1',
        target: '2',
        sourceName: '古代の予言',
        targetName: '魔法の杖',
      },
      {
        id: 'conn2',
        source: '2',
        target: '3',
        sourceName: '魔法の杖',
        targetName: '封印の鍵',
      },
    ],
    isLoading: false,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    connections: [],
    isLoading: false,
  },
};

export const NoItems: Story = {
  args: {
    items: [],
    connections: [],
    isLoading: false,
  },
};

export const OneItem: Story = {
  args: {
    items: [mockItems[0]],
    connections: [],
    isLoading: false,
  },
};

export const NoConnections: Story = {
  args: {
    items: mockItems,
    connections: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    items: mockItems,
    connections: [],
    isLoading: true,
  },
};

export const ManyConnections: Story = {
  args: {
    items: mockItems,
    connections: [
      {
        id: 'conn1',
        source: '1',
        target: '2',
        sourceName: '古代の予言',
        targetName: '魔法の杖',
      },
      {
        id: 'conn2',
        source: '1',
        target: '3',
        sourceName: '古代の予言',
        targetName: '封印の鍵',
      },
      {
        id: 'conn3',
        source: '2',
        target: '3',
        sourceName: '魔法の杖',
        targetName: '封印の鍵',
      },
    ],
    isLoading: false,
  },
};
