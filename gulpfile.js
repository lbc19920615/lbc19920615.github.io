const gulp = require('gulp')
const { exec } = require('child_process')

let folders = ['articles/*.md', 'bug/*.md', 'flutter/*.md']

gulp.task('compile', function () {
  'use strict'
  var twig = require('gulp-twig')
  return gulp
    .src('./index.twig')
    .pipe(
      twig({
        data: {
          now: Date.now(),
          // title: 'Gulp and Twig',
          // benefits: [
          //     'Fast',
          //     'Flexible',
          //     'Secure'
          // ]
        },
      })
    )
    .pipe(gulp.dest('./'))
})

gulp.task('default', async function watchMd() {
  // gulp.watch(['component.js', 'plugin.js', 'index.twig'], gulp.parallel(['compile']))

  gulp.watch(folders, function (cb) {
    exec('npm run toc:articles', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      }
      console.log(stdout)
      console.error(stderr)
      // body omitted
      cb()
    })
  })
})
