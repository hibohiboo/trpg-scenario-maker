import type { Meta, StoryObj } from '@storybook/react-vite';
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
  args: {},
  render: () => <ImageUploadDataUrlPreview />,
};
