import { babel } from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss'
import ejs from "ejs"
import fse from "fs-extra"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./src/webele.ejs').toString()

let imports = {
  "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
}

let baseFolder = "assets"
let lastKeys = []

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
      buildStart(){
        if (!imports.wle) {
          this.addWatchFile('src/webele.ejs')
          this.addWatchFile('src/webele.scss')
          movePrevMainFile()
        }
      },
      generateBundle(options, bundle, isWrite) {
        // console.log('generateBundle');
        // console.log(Object.keys(bundle));
        let keys =  Object.keys(bundle)
        if (!imports.wle) {
          let newFileName = keys[0];
          let cssFiles = keys.filter(v => v.endsWith('.css'));
          let links = cssFiles.map(cssFile => {
            return `<link rel="stylesheet" href="/assets/webelef/${cssFile}" />`
          })
          links.push('<link rel="stylesheet" href="/assets/uno.css" />')
          imports['wle'] =  '/' + baseFolder + '/webelef/' + newFileName + '?v='+ Date.now();
          let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports), links: links.join('\n')});
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)
          setTimeout(() => {

          fse.copySync(`./${baseFolder}/webelef/${newFileName}`, `./${baseFolder}/wle.js`)
          console.log('compile done');
          }, 300)
        }
      }
  }
}

let commonPlugins = [
  babel({ babelHelpers: 'bundled' } ),  scss()
]

const config = [
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
  }
];

export default config;