import { babel } from '@rollup/plugin-babel';

const config = {
  input: 'src/main.js',
  output: {
    dir: 'assets',
    format: 'es'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
};

export default config;