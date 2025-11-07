import { fn } from 'storybook/test';
import ImageUploadDataUrlPreview from './ImageInput';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ImageUploadDataUrlPreview> = {
  title: 'Entities/Image/ImageUploadDataUrlPreview',
  component: ImageUploadDataUrlPreview,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ImageUploadDataUrlPreview>;

export const Default: Story = {
  args: {
    onChangeDataUrl: fn(),
  },
};
export const ViewDataUrl: Story = {
  args: {
    onChangeDataUrl: fn(),
    viewDataUrl: true,
  },
};
