import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Modes } from './Modes';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'PushIn/Modes',
  component: Modes,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    mode: { control: 'select', options: ['sequential', 'continuous'] },
  },
} as ComponentMeta<typeof Modes>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Modes> = args => <Modes {...args} />;

export const SequentialMode = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SequentialMode.args = {
  mode: 'sequential',
};

export const ContinuousMode = Template.bind({});
ContinuousMode.args = {
  mode: 'continuous',
};
