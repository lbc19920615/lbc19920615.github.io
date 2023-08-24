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

let mainCssFileName = '';
let appStyleEgg = /\/\*#start app\*\/[^]*\/\*#end app\*\//;

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
          let APP_CSS_PATH = ''
          let links = cssFiles.map(cssFile => {
            if (cssFile.startsWith('app')) {
              APP_CSS_PATH  = '/assets/webelef/' + cssFile
              return
            }
            if (cssFile.startsWith('web')) {
              mainCssFileName = '/assets/webelef/' + cssFile;
              
            }
            return `<link rel="stylesheet" href="/assets/webelef/${cssFile}" />`
          })
          links.unshift('<link rel="stylesheet" href="/assets/uno.css" />')
          imports['wle'] =  '/' + baseFolder + '/webelef/' + newFileName + '?v='+ Date.now();
          let html = ejs.render(mainFileStr, {importmap: JSON.stringify(imports), APP_CSS_PATH, links: links.join('\n')});
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)

          let html2 = ejs.render(subFileStr, {importmap: JSON.stringify(imports), APP_CSS_PATH, links: links.join('\n')});
          fs.writeFileSync(`./${baseFolder}/sub.html`, html2)
          setTimeout(() => {

          fse.copySync(`./${baseFolder}/webelef/${newFileName}`, `./${baseFolder}/wle.js`);


          if (mainCssFileName) {
            let webelecssFile = fs.readFileSync('.' + mainCssFileName).toString();
            let trueCssFile = webelecssFile.replace(appStyleEgg, function(s, ...args) {
              // console.log('appStyle', s);

              // 120 / 750 * 360

              let pcCss = s.replace(/(\d+)(?=rpx)rpx/g, function(pxs, ...pxargs) {
                return pxs.replace('rpx', 'px')
              });

              
              let mbCss = s.replace(/(\d+)(?=rpx)rpx/g, function(pxs, ...pxargs) {
                let val = pxargs[0]
                return pxs.replace('rpx', 'px').replace(val, val / 750 * 360)
              })
              fs.writeFileSync('.' + APP_CSS_PATH, pcCss)
              fs.writeFileSync('.' + APP_CSS_PATH.replace('.css', '_360.css'), mbCss)
              return ''
            });
            fs.writeFileSync('.' + mainCssFileName, trueCssFile)
              // console.log(trueCssFile);
          }

                        
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
        // this.addWatchFile('src/app.scss')
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
      format: 'es',
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