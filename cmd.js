#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const fse = require('fs-extra')
const path = require('path');
const { listFile } = require('./src/utils/cmd')

const marked = require('marked');
const { resolve } = require('path');

function scanMarkdown(basepath, arr) {
  let res = []
  let basefolder = path.resolve(__dirname)
  let folder = path.resolve(basefolder, basepath)
  res = res.concat(
    listFile(folder)
  )

  res.forEach(function({ filedir, filename }) {
    if (filename.endsWith('.md')){
      const fileContent = fse.readFileSync(filedir).toString()
      const lexer = marked.lexer(fileContent)
      arr.push(
        {
          title: lexer[0].text,
          link: '/' + path.relative(basefolder, filedir)
          .split(path.sep).join(path.posix.sep)
        },
      )
      resolve()
    }
  })
}

// 处理文章的导航
if (argv.type === 'build-toc') {
  let arr = []

  scanMarkdown('articles', arr)
  scanMarkdown('bug', arr)

  // console.log(arr)
  fse.outputFileSync(path.resolve(__dirname, argv.dist), `
  window.articleToc = ${JSON.stringify(arr)}
`)
}