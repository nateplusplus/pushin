import { Meta, StoryObj } from '@storybook/react';

import { A11y } from './A11y';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'PushIn/A11y',
  component: A11y,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    mode: { control: 'select', options: ['sequential', 'continuous'] },
  },
} as Meta<typeof A11y>;

export default meta;

export const Template: StoryObj<typeof A11y> = {};

export const A11yOptionsSequential: StoryObj<typeof A11y> = {
  args: {
    settings: {
      mode: 'sequential',
      layers: [
        {
          tabInpoints: [100],
        },
      ],
      debug: true,
    },
  },
};
