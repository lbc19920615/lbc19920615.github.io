import { babel } from '@rollup/plugin-babel';
import ejs from "ejs"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./src/webele.ejs').toString()

let imports = {
  "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
}

let baseFolder = "assets"

function demoWatcherPlugin() {

  return {
      async buildEnd(arg) {
          console.log('ssss', arg);
      },
      buildStart(){
        this.addWatchFile('src/webele.ejs')
       },

      generateBundle(options, bundle, isWrite) {
        console.log(Object.keys(bundle));
        if (!imports.wle) {
          imports['wle'] =  '/' + baseFolder + '/' + Object.keys(bundle)[0];
          let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports)});
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)
        }
      }
  }
}

const config = [
  {
    input: 'src/main.js',
    output: {
      dir: 'assets',
      format: 'es',
      entryFileNames: 'main_esm_[hash].js' 
    },
    plugins: [babel({ babelHelpers: 'bundled' }), demoWatcherPlugin()]
  },
  {
    input: 'src/main.js',
    output: {
      dir: 'assets',
      format: 'cjs',
      entryFileNames: 'main_cjs_dev.js' 
    },
    plugins: [babel({ babelHelpers: 'bundled' }), demoWatcherPlugin()]
  }
];

export default config;