import copy from 'rollup-plugin-copy';

import package$ from './package.json';

function createConfig(format) {
  return {
    input: 'src/index.js',
    output: {
      format,
      sourcemap: true,
      file: `dist/${format}/pushin.js`,
      name: format === 'umd' ? 'pushin' : undefined,
      banner: `/* Pushin.js - v${package$.version}\nAuthor: ${package$.author}\nLicense: ${package$.license} */`,
    },
    plugins: [
      copy({
        targets: [{ src: 'src/pushin.css', dest: 'dist' }],
      }),
    ],
  };
}

export default [createConfig('umd'), createConfig('esm')];
