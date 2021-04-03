// webpack.config.js
const Path = require('path')
const { MyPlugin } = require('./builds/webpack/plugins/my-webpack.plugin')

const config = require(`./builds/webpack/env/webpack-${process.env.NODE_ENV}`)

console.log(config)

let ret = Object.assign(
  {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: 'txt-loader',
            options: {
              name: 'Jay',
            },
          },
        },
        {
          test: /\.html$/,
          use: [
            'html-loader',
            {
              loader: 'html-optimize-loader',
              options: {
                comments: false,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: require('sass'),
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new MyPlugin({
        banner: '版权所有，翻版必究',
      }),
    ],

    resolveLoader: {
      // html-loader 在 'node_modules'
      modules: [
        'node_modules',
        Path.resolve(__dirname, './builds/webpack/loaders'),
      ],
    },
  },
  config
)

module.exports = ret
