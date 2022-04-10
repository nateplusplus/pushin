import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

const banner = require('./build/banner');

function createConfig(format) {
  return {
    input: 'src/index.ts',
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
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions:
          format === 'esm'
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

export default [createConfig('umd'), createConfig('esm')];
