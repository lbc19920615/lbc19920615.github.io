const loaderUtils = require('loader-utils')

let lib = {
  parse(source, callback) {
    callback(null, source)
  },
}

module.exports = function (source) {
  var callback = this.async()
  this.cacheable && this.cacheable()

  var options = loaderUtils.getOptions(this) || {}
  console.log(source, options)
  return lib.parse(source, callback)
}
