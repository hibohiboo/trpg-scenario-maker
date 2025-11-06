import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import ImageUploadDataUrlPreview from './ImageInput';

const meta: Meta<typeof ImageUploadDataUrlPreview> = {
  title: 'Components/ImageUploadDataUrlPreview',
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
