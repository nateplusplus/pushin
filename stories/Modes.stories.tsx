import { Meta } from '@storybook/react';

import { Modes } from './Modes';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'PushIn/Modes',
  component: Modes,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    mode: { control: 'select', options: ['sequential', 'continuous'] },
  },
} as Meta<typeof Modes>;

export default meta;

export const SequentialMode = {
  args: {
    options: {
      mode: 'sequential',
      layers: [],
    },
  },
};

export const ContinuousMode = {
  args: {
    options: {
      mode: 'continuous',
      layers: [],
    },
  },
};

export const ContinuousWithTransitions = {
  args: {
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
  },
};

export const SetModeByAttribute = {
  args: {
    options: {
      mode: '',
      layers: [],
    },
    modeAttr: 'continuous',
  },
};

export const ContinuousWithLayerOutpoint = {
  args: {
    options: {
      mode: 'continuous',
      layers: [
        {
          outpoints: [3000],
        },
      ],
      debug: true,
    },
  },
};

export const ContinuousWithLayerDepth = {
  args: {
    options: {
      mode: 'continuous',
      debug: true,
      scene: {
        layerDepth: 3500,
      },
    },
  },
};

export const ContinuousWithLength = {
  args: {
    options: {
      mode: 'continuous',
      debug: true,
      length: 4000,
    },
  },
};
