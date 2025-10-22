import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import '../src/styles/tailwind.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
