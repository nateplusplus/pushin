import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { A11y } from './A11y';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'PushIn/A11y',
  component: A11y,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    mode: { control: 'select', options: ['sequential', 'continuous'] },
  },
} as Meta<typeof A11y>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof A11y> = args => <A11y {...args} />;

export const A11yOptionsSequential = Template.bind({});
A11yOptionsSequential.args = {
  settings: {
    mode: 'sequential',
    layers: [
      {
        tabInpoints: [100],
      },
    ],
    debug: true,
  },
};
