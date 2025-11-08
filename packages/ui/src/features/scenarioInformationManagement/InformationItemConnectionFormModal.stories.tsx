import { fn } from 'storybook/test';
import { InformationItemConnectionFormModal } from './InformationItemConnectionFormModal';
import type { InformationItem } from '../../entities/informationItem/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockItems: InformationItem[] = [
  {
    scenarioId: 'x',
    id: '1',
    title: '古代の予言',
    description: '世界の滅亡を予言する古文書',
  },
  {
    scenarioId: 'x',
    id: '2',
    title: '魔法の杖',
    description: '強大な力を秘めた杖',
  },
  {
    scenarioId: 'x',
    id: '3',
    title: '封印の鍵',
    description: '古代神殿を開く鍵',
  },
];

const meta = {
  title: 'InformationItem/InformationItemConnectionFormModal',
  component: InformationItemConnectionFormModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    items: { control: 'object' },
    onClose: { action: 'onClose' },
    onSubmit: { action: 'onSubmit' },
  },
} satisfies Meta<typeof InformationItemConnectionFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    items: mockItems,
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    items: mockItems,
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const NoItems: Story = {
  args: {
    isOpen: true,
    items: [],
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const OneItem: Story = {
  args: {
    isOpen: true,
    items: [mockItems[0]],
    onClose: fn(),
    onSubmit: fn(),
  },
};

export const TwoItems: Story = {
  args: {
    isOpen: true,
    items: mockItems.slice(0, 2),
    onClose: fn(),
    onSubmit: fn(),
  },
};
