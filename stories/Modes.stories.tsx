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
  options: {
    mode: 'sequential',
    layers: [],
  },
};

export const ContinuousMode = Template.bind({});
ContinuousMode.args = {
  options: {
    mode: 'continuous',
    layers: [],
  },
};

export const ContinuousWithTransitions = Template.bind({});
ContinuousWithTransitions.args = {
  options: {
    mode: 'continuous',
    layers: [
      {
        transitions: true,
      },
      {
        transitions: true,
        transitionStart: 300,
        transitionEnd: 300,
      },
      {
        transitions: true,
        inpoints: [200],
        transitionStart: 300,
        transitionEnd: 300,
      },
    ],
  },
};

export const SetModeByAttribute = Template.bind({});
SetModeByAttribute.args = {
  options: {
    mode: '',
    layers: [],
  },
  modeAttr: 'continuous',
};

export const ContinuousWithLayerOutpoint = Template.bind({});
ContinuousWithLayerOutpoint.args = {
  options: {
    mode: 'continuous',
    layers: [
      {
        outpoints: [3000],
      },
    ],
    debug: true,
  },
};
