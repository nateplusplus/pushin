import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from './Text';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Plain Text',
  component: Text,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    layer1: { control: 'text' },
    layer2: { control: 'text' },
    layer3: { control: 'text' },
    layer4: { control: 'text' },
  },
} as ComponentMeta<typeof Text>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Text> = args => <Text {...args} />;

export const FormattedText = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FormattedText.args = {
  layer1:
    '<em>This example</em> <u>showcases</u> <strong>formatted text</strong> with <a href="https://pushinjs.com" target="_blank">hyperlinks</a>.',
  layer2:
    'Layers should <strong>pass-through click events</strong>, allowing users to <a href="https://pushinjs.com" target="_blank">click on hyperlinks</a>.',
};

export const PlainText = Template.bind({});
PlainText.args = {
  layer1:
    'This example demonstrates the simplest, zero-configuration setup for pushin.js.',
  layer2:
    'These layers are added to the HTML without any parameters and minimal CSS.',
  layer3:
    'Pushin.js has configured the timing of this effect automatically to adjust for the number of layers.',
  layer4:
    'The scroll length increases to accommodate all layers in an evenly-spaced animation.',
};
