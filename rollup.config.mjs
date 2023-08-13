import { babel } from '@rollup/plugin-babel';

function demoWatcherPlugin() {

  return {
      async buildEnd(arg) {
          // console.log('ssss', arg);
      },
      // augmentChunkHash(chunkInfo) {
      //   console.log(chunkInfo );
      // }

      generateBundle(options, bundle, isWrite) {
        console.log(options, bundle, isWrite);
      }
  }
}

const config = {
  input: 'src/main.js',
  output: {
    dir: 'assets',
    format: 'es',
    entryFileNames: 'main_[hash].js' 
  },
  plugins: [babel({ babelHelpers: 'bundled' }), demoWatcherPlugin()]
};

export default config;