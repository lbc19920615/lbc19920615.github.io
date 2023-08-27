import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss'
import ejs from "ejs"
import fse from "fs-extra"
import fs from "node:fs"

let mainFileStr = fs.readFileSync('./src/webele.ejs').toString();
let subFileStr = fs.readFileSync('./src/sub.ejs').toString()

let imports = {
  // "vue": "https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.esm-browser.js",
  "async-validator": "https://cdn.jsdelivr.net/npm/async-validator@4.2.5/+esm",
  "vue": "https://cdn.jsdelivr.net/npm/vue@3.3.4/+esm",
  "wlepre": "/assets/wle-provider/index.js?v=0.0.3",
  // "pinia": "https://cdn.bootcdn.net/ajax/libs/pinia/2.0.35/pinia.esm-browser.js",
}

let baseFolder = "assets";
let resources = {
  cssFiles: [],
  jsFiles: []
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


          let app_file =  '/' + baseFolder + '/webelef/' + resources.jsFiles[0]
          let compileArg = {
            importmap: JSON.stringify(imports), 
            APP_CSS_PATH, 
            links: links.join('\n'),
            APP_JS_PATH: app_file
          }

          let html = ejs.render(mainFileStr, compileArg);
          fs.writeFileSync(`./${baseFolder}/webele.html`, html)

          let html2 = ejs.render(subFileStr, compileArg);
          fs.writeFileSync(`./${baseFolder}/sub.html`, html2)
          setTimeout(() => {

          fse.copySync(`./${baseFolder}/webelef/${newFileName}`, `./${baseFolder}/wle.js`);


          if (mainCssFileName) {
            let webelecssFile = fs.readFileSync('.' + mainCssFileName).toString();
            let trueCssFile = webelecssFile.replace(appStyleEgg, function(s, ...args) {
              // console.log('appStyle', s);

              // 120 / 750 * 360

              // let pcCss = s.replace(/(\d+)(?=rpx)rpx/g, function(pxs, ...pxargs) {
              //   return pxs.replace('rpx', 'px')
              // });

              
              // let mbCss = s.replace(/(\d+)(?=rpx)rpx/g, function(pxs, ...pxargs) {
              //   let val = pxargs[0]
              //   return pxs.replace('rpx', 'px').replace(val, val / 750 * 360)
              // })
              // fs.writeFileSync('.' + APP_CSS_PATH, pcCss)
              // fs.writeFileSync('.' + APP_CSS_PATH.replace('.css', '_360.css'), mbCss)
              return ''
            });
            fs.writeFileSync('.' + mainCssFileName, trueCssFile)
              // console.log(trueCssFile);
          }


          }, 300)
        }
      }
  }
}


function demoAppPlugin() {
  return {
    buildStart(){
      this.addWatchFile('src/webele.ejs')
      this.addWatchFile('src/webele.scss')
      // this.addWatchFile('src/app.scss')
      movePrevMainFile()
    },
    generateBundle(options, bundle, isWrite) {
      let keys = Object.keys(bundle);
      // console.log(keys);
      resources.cssFiles  = keys.filter(v => v.endsWith('.css'));
      resources.jsFiles  = keys.filter(v => v.endsWith('.js'));

      setTimeout(() => {
        resources.jsFiles.forEach(v => {
          let filePath = './assets/webelef/' + v;
          let str = fs.readFileSync(filePath).toString();
          let newStr = str.replaceAll('@webele', '/assets/webele')
          // console.log('resources.jsFiles ', v);
          fs.writeFileSync(filePath, newStr)
        });

                                
        console.log('compile done');
      }, 1000)
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
    plugins: [...commonPlugins, demoAppPlugin()],
    external: ['wle', 'wlepre', '@webele']
  },
  {
    input: 'src/main.js',
    output: {
      dir: 'assets/webelef',
      format: 'es',
      entryFileNames: 'main_esm_[hash].js',
      assetFileNames: 'webele_[hash][extname]'
    },
    plugins: [nodeResolve(), ...commonPlugins, demoWatcherPlugin()],
    external: ['async-validator']
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