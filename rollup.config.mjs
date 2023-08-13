import { babel } from '@rollup/plugin-babel';
import ejs from "ejs"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./webele.ejs').toString()

let imports = {
  "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
}

let baseFolder = "assets"

function demoWatcherPlugin() {

  return {
      async buildEnd(arg) {
          console.log('ssss', arg);


      },
      // augmentChunkHash(chunkInfo) {
      //   console.log(chunkInfo );
      // }

      generateBundle(options, bundle, isWrite) {
        console.log(Object.keys(bundle));
        imports['wle'] =  '/' + baseFolder + '/' + Object.keys(bundle)[0]
        let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports)});

        // console.log(html);
        fs.writeFileSync(`./${baseFolder}/webele.html`, html)
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