#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const fse = require('fs-extra')
const path = require('path');
const { fileDisplay } = require('./src/utils/cmd')

const marked = require('marked')

// 处理文章的导航
if (argv.type === 'build-toc') {
  let arr = []
  fileDisplay(path.resolve(__dirname, './articles'), function(filedir, filename) {
    if (filename.endsWith('.md')){
      const fileContent = fse.readFileSync(filedir).toString()
      const lexer = marked.lexer(fileContent)
      arr.push(
        {
          title: lexer[0].text,
          link: '/articles/' + filename
        },
      )
      fse.outputFileSync(path.resolve(__dirname, argv.dist), `
        window.articleToc = ${JSON.stringify(arr)}
      `)
    }
  });
}