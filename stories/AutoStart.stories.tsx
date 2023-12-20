import { Meta } from '@storybook/react';

import { AutoStart } from './AutoStart';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'PushIn/AutoStart',
  component: AutoStart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof AutoStart>;

export default meta;

export const Default = {};

export const ScreenTop = {
  args: {
    settings: {
      autoStart: 'screen-top',
    },
  },
};

export const ScreenBottom = {
  args: {
    settings: {
      autoStart: 'screen-bottom',
    },
  },
};

export const ScreenTopAttr = {
  args: {
    settings: {
      autoStart: 'screen-bottom',
    },
    useAttr: 'screen-top',
  },
};

export const ScreenTopContinuous = {
  args: {
    settings: {
      autoStart: 'screen-top',
      mode: 'continuous',
      debug: true,
    },
  },
};
