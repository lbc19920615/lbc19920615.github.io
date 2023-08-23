import { babel } from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss'
import ejs from "ejs"
import fse from "fs-extra"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./src/webele.ejs').toString();
let subFileStr = fs.readFileSync('./src/sub.ejs').toString()

let imports = {
  // "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
  "vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js",
  "wlepre": "/assets/wle-provider/index.js?v=0.0.3",
  // "pinia": "https://cdn.bootcdn.net/ajax/libs/pinia/2.0.35/pinia.esm-browser.js",
}

let baseFolder = "assets"
let lastKeys = [];
let resources = {
  cssFiles: []
}

/**
 * 移动旧的文件
 * @param {*} newName 
 */
function movePrevMainFile() {
  let folderPath = `./${baseFolder}/webelef`
  let files = fse.readdirSync(folderPath)

  files.forEach(filePath => {
    fse.removeSync(`./${folderPath}/${filePath}`)
  })
}

function demoWatcherPlugin() {
  return {
      async buildEnd(arg) {
          // console.log('ssss', arg);
      },

      generateBundle(options, bundle, isWrite) {
        // console.log('generateBundle');
        // console.log(Object.keys(bundle));
        let keys = Object.keys(bundle);
        console.log(keys);
        if (!imports.wle) {
          let newFileName = keys[0];
          let cssFiles =  keys.filter(v => v.endsWith('.css'));
          cssFiles =   cssFiles.concat(resources.cssFiles);
          let links = cssFiles.map(cssFile => {
            return `<link rel="stylesheet" href="/assets/webelef/${cssFile}" />`
          })
          links.unshift('<link rel="stylesheet" href="/assets/uno.css" />')
          imports['wle'] =  '/' + baseFolder + '/webelef/' + newFileName + '?v='+ Date.now();
          let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports), links: links.join('\n')});
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)

          let html2 = ejs.render(subFileStr, {importmap: JSON.stringify(imports), links: links.join('\n')});
          fs.writeFileSync(`./${baseFolder}/sub.html`, html2)
          setTimeout(() => {

          fse.copySync(`./${baseFolder}/webelef/${newFileName}`, `./${baseFolder}/wle.js`)
          console.log('compile done');
          }, 300)
        }
      }
  }
}

function demoAppPlugin() {
  return {
    buildStart(){
      if (!imports.wle) {
        this.addWatchFile('src/webele.ejs')
        this.addWatchFile('src/webele.scss')
        this.addWatchFile('src/app.scss')
        movePrevMainFile()
      }
    },
    generateBundle(options, bundle, isWrite) {
      let keys = Object.keys(bundle);
      console.log(keys);
      resources.cssFiles  = keys.filter(v => v.endsWith('.css'));
    }
  }
}

let commonPlugins = [
  babel({ babelHelpers: 'bundled' } ),  scss()
]

const config = [
  {
    input: 'src/app.js',
    output: {
      dir: 'assets/webelef',
      entryFileNames: 'app_[hash].js',
      assetFileNames: 'app_[hash][extname]'
    },
    plugins: [...commonPlugins, demoAppPlugin()]
  },
  {
    input: 'src/main.js',
    output: {
      dir: 'assets/webelef',
      format: 'es',
      entryFileNames: 'main_esm_[hash].js',
          // Removes the hash from the asset filename
      assetFileNames: 'webele_[hash][extname]'
    },
    plugins: [...commonPlugins, demoWatcherPlugin()]
  },
  {
    input: 'src/main.js',
    output: {
      dir: 'assets/webelef',
      format: 'cjs',
      entryFileNames: 'main_cjs_dev.js',
      assetFileNames: 'webele_[hash][extname]'
    },
    plugins: [...commonPlugins]
  },

];

export default config;