
import { defineConfig, presetAttributify, presetUno } from 'unocss';

import presetRemToRpx from './preset-rem-to-rpx';
// import { transformerClass } from './uno.webapp';

const sizeMapping = {
  fs: 'font-size',
  height: 'height',
  width: 'width',
  gap: 'gap',
  bdrs: 'border-radius',
  lineH: 'line-height'
};

function getSizeRules(Mapping) {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];    
    return [new RegExp(`^${key}-(\\d+)$`), ([, d], ...args) => {
      return { [value]: `${d}rpx` }
    }];
  });
}

function getLgSizeRules(Mapping) {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];    
    return [new RegExp(`^${key}-(\\d+)(vw|rem|%)$`), ([, d, unit = 'rpx'], ...args) => {
      
      // if (value.startsWith('width')) {
      //   console.log(d, unit);
      // }
      
      return { [value]: `${d}${unit}` }
    }];
  });
}

let rules = getSizeRules(sizeMapping);

rules = rules.concat(getLgSizeRules(sizeMapping));

const colorMapping = {
  bgc: 'background-color',
  bdc: 'border-color'
};

function getColorRules(Mapping) {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];
    return [
      new RegExp(`^${key}-([\\w-]+)$`),
      ([, d]) => ({ [value]: `var(--color-${d})` })
    ];
  });
}

rules = rules.concat(getColorRules(colorMapping));

const commonMapping = {
  dis: function(d) {
    return { ['display']: `${d}` }
  },
};


function getCommonRules(Mapping) {
  return Object.keys(Mapping).map((key) => {
    const fun = Mapping[key];
    return [
      new RegExp(`^${key}-([\\w-]+)$`),
      ([, d]) => fun(d)
    ];
  });
}


rules = rules.concat(getCommonRules(commonMapping));


// console.log(rules);


const myRules = {
  // '.': '-ddd-',
  // '/': '-ss-',
  ':': '__',
  // '%': '-pp-'
}


export default defineConfig({
  cli: {
    entry:      {
      /**
       * Glob patterns to match files
       */
      patterns: ['./src/*.ejs'],
      /**
       * The output filename for the generated UnoCSS file
       */
      outFile: './assets/uno.css'
    }, // CliEntryItem | CliEntryItem[]
  },
  presets: [
    presetAttributify(),
    presetUno(),
    presetRemToRpx({
      baseFontSize: 4
    })
  ],
  theme: {
    preflightRoot: ['page,::before,::after']
  },
  transformers: [
    // transformerClass({
    //   transformRules: myRules
    // })
  ],
  rules,
  separators: '__'
});
