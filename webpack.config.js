// webpack.config.js
const { MyPlugin } = require('./builds/webpack/plugins/my-webpack.plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
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
}
