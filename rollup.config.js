import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import getBabelOutputPlugin from '@rollup/plugin-babel';
import CleanCSS from 'clean-css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const banner = require('./build/banner');

function createConfig(format) {
  const isESM = format === 'esm';
  const extension = isESM ? '.mjs' : '.js';

  return {
    input: 'src/index.ts',
    output: {
      format,
      sourcemap: true,
      file: `dist/${format}/pushin${extension}`,
      name: isESM ? undefined : 'pushin',
      banner: `/* ${banner} */`,
    },
    plugins: [
      copy({
        targets: [{ src: 'src/pushin.css', dest: 'dist' }],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: isESM
          ? {
              sourceMap: true,
              declaration: true,
              declarationDir: '.',
            }
          : {},
      }),
    ],
  };
}

/** This outputs a minified JS file which can then be shipped to CDN. */
function createConfigForCdn() {
  return {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      sourcemap: false,
      file: 'dist/umd/pushin.min.js',
      name: 'pushin',
      banner: `/* ${banner} */`,
    },
    plugins: [
      copy({
        targets: [
          {
            src: 'src/pushin.css',
            dest: 'dist',
            transform: contents => new CleanCSS().minify(contents).styles,
            rename: 'pushin.min.css',
          },
        ],
      }),
      typescript({ tsconfig: './tsconfig.json' }),
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
