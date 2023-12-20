import { Meta } from '@storybook/react';

import { Target } from './Target';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'PushIn/Target',
  component: Target,
  argTypes: {
    scrollTarget: { control: 'text' },
  },
} as Meta<typeof Target>;

export default meta;

export const Default = {};

export const WindowScroll = {
  args: {
    scrollTarget: 'window',
  },
};
