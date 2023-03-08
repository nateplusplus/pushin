import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Target } from './Target';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'PushIn/Target',
  component: Target,
  argTypes: {
    scrollTarget: { control: 'text' },
  },
} as ComponentMeta<typeof Target>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Target> = args => <Target {...args} />;

export const Default = Template.bind({});

export const WindowScroll = Template.bind({});
WindowScroll.args = {
  scrollTarget: 'window',
};
