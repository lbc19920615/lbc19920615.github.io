const { ConcatSource } = require('webpack-sources')

const wrapComment = (str) => {
  if (!str.includes('\n')) return `/*! ${str} */`
  return `/*!\n * ${str.split('\n').join('\n * ')}\n */`
}

class MyPlugin {
  constructor(options) {
    if (arguments.length > 1)
      throw new Error(
        'MyBannerPlugin only takes one argument (pass an options object or string)'
      )
    if (typeof options === 'string') {
      options = {
        banner: options,
      }
    }
    this.options = options || {}
    this.banner = this.options.raw
      ? options.banner
      : wrapComment(options.banner)
  }
  apply(compiler) {
    const banner = this.banner
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap('MyPlugin', (chunks) => {
        for (const chunk of chunks) {
          for (const file of chunk.files) {
            compilation.updateAsset(
              file,
              (old) => new ConcatSource(banner, '\n', old)
            )
          }
        }
      })
    })
  }
}

exports.MyPlugin = MyPlugin
