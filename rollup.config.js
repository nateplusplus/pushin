import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import getBabelOutputPlugin from '@rollup/plugin-babel';

const banner = require('./build/banner');

function createConfig(format) {
  return {
    input: 'src/index.js',
    output: {
      format,
      sourcemap: true,
      file: `dist/${format}/pushin.js`,
      name: format === 'umd' ? 'pushin' : undefined,
      banner: `/* ${banner} */`,
    },
    plugins: [
      copy({
        targets: [{ src: 'src/pushin.css', dest: 'dist' }],
      }),
    ],
  };
}

/** This outputs a minified JS file which can then be shipped to CDN. */
function createConfigForCdn() {
  return {
    input: 'src/index.js',
    output: {
      format: 'iife',
      sourcemap: false,
      file: 'dist/umd/pushin.min.js',
      name: 'pushin',
      banner: `/* ${banner} */`,
    },
    plugins: [
      terser({
        ecma: '5',
        mangle: true,
        compress: true,
      }),
      getBabelOutputPlugin({
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              targets:
                '> 0.25%, last 2 versions, Firefox ESR, not dead, IE 9-11',
            },
          ],
        ],
      }),
    ],
  };
}

export default [createConfig('umd'), createConfig('esm'), createConfigForCdn()];
