// txt-loader.js
const loaderUtils = require('loader-utils')

module.exports = function (source) {
  this.cacheable && this.cacheable()
  const options = loaderUtils.getOptions(this) || {}
  console.log(options)

  source = source.replace(/\[name\]/g, options.name)
  console.log(source)

  return `module.exports = ${JSON.stringify(source)}`
}
