import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AutoStart } from './AutoStart';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'PushIn/AutoStart',
  component: AutoStart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AutoStart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AutoStart> = args => (
  <AutoStart {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const ScreenTop = Template.bind({});
ScreenTop.args = {
  settings: {
    autoStart: 'screen-top',
  },
};

export const ScreenBottom = Template.bind({});
ScreenBottom.args = {
  settings: {
    autoStart: 'screen-bottom',
  },
};

export const ScreenTopAttr = Template.bind({});
ScreenTopAttr.args = {
  settings: {
    autoStart: 'screen-bottom',
  },
  useAttr: 'screen-top',
};

export const ScreenTopContinuous = Template.bind({});
ScreenTopContinuous.args = {
  settings: {
    autoStart: 'screen-top',
    mode: 'continuous',
    debug: true,
  },
};
