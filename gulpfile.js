const { watch, task } = require('gulp');
const { exec } = require('child_process')

task('default', async function watchMd () {
  watch(['articles/*.md'], function(cb) {
    exec('npm run toc:articles', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      console.log(stdout)
      console.error(stderr)
        // body omitted
      cb();
    })
  });
})