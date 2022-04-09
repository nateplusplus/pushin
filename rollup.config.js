import copy from 'rollup-plugin-copy';

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

export default [createConfig('umd'), createConfig('esm')];
