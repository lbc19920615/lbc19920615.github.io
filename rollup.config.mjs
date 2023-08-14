import { babel } from '@rollup/plugin-babel';
import ejs from "ejs"
import fse from "fs-extra"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./src/webele.ejs').toString()

let imports = {
  "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
}

let baseFolder = "assets"

/**
 * 移动旧的文件
 * @param {*} newName 
 */
function movePrevMainFile(newName = '') {
  let files = fse.readdirSync(`./${baseFolder}/`).filter(v => v.startsWith('main_esm_'))
  files.forEach(filePath => {
    console.log(filePath);
    fse.copySync(`./${baseFolder}/${filePath}`, `./${baseFolder}/wle.js`)
    if (filePath === newName) {
      return
    }
    fse.moveSync(`./${baseFolder}/${filePath}`, `./${baseFolder}/old/${filePath}`)
  })
  // console.log(files);
}

function demoWatcherPlugin() {
  return {
      async buildEnd(arg) {
          // console.log('ssss', arg);
      },
      buildStart(){
        this.addWatchFile('src/webele.ejs')
      },
      generateBundle(options, bundle, isWrite) {
        // console.log(Object.keys(bundle));
        if (!imports.wle) {
          let newFileName = Object.keys(bundle)[0];
          movePrevMainFile(newFileName)
          imports['wle'] =  '/' + baseFolder + '/' + newFileName + '?v='+ Date.now();
          let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports)});
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)
          console.log('compile done');
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
    plugins: [babel({ babelHelpers: 'bundled' })]
  }
];

export default config;