import './index.scss'
import './component'
import txt from './name.txt'

console.log(txt)

window.initDocute = function () {
  new Docute({
    target: '#docute',
    highlight: [
      'typescript',
      'go',
      'glsl',
      'scss',
      'less',
      'python',
      'php',
      'dart',
    ],
    darkThemeToggler: true,
    fetchOptions: {
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        testsds: 'Mozilla/4.0 MDN Example',
      },
    },
    plugins: [showAuthorPlugin, extCurPagePlugin, appSearchsPlugin],
    nav: [
      {
        title: '首页',
        link: '/',
      },
      {
        title: 'GitHub',
        link: 'https://github.com/lbc19920615',
      },
      {
        title: 'Gitee',
        link: 'https://gitee.com/lbc19920615',
      },
    ],
    sidebar: [
      // A sidebar item, with child links
      {
        title: '文章列表',
        children: [
          ...window.articleToc.slice(0, 5),
          {
            title: 'bug处理积累',
            link: '/bug/README.md',
          },
          {
            title: '凌柏超的个人简历',
            link: '/crm/images.md',
          },
        ],
      },
      {
        title: '推荐文章',
        children: [
          {
            title: 'css固定浮动到右下角',
            link: '/articles/float-to-end.md'
          }
        ]
      },
      {
        title: '用js多端开发',
        children: [
          {
            title: 'uniapp 使用tabbar',
            link: '/wechat/s1.md',
          },
        ],
      },
      {
        title: 'echarts.js学习',
        children: [
          {
            title: 'echarts的地图',
            link: '/echarts/s1.md',
          },
        ],
      },
      {
        title: 'flutter学习',
        children: [
          {
            title: 'dart 基础1',
            link: '/flutter/s1.md',
          },
          {
            title: 'flutter 01',
            link: '/flutter/s2.md',
          },
        ],
      },
      {
        title: 'WebGL2学习',
        children: [
          {
            title: 'WebGL2的基本原理',
            link: '/webgl2/s1.md',
          },
          {
            title: 'WebGL2 着色器和 GLSL 语言',
            link: '/webgl2/s2.md',
          },
          {
            title: 'WebGL2 图像处理',
            link: '/webgl2/s3.md',
          },
          {
            title: 'WebGL2 2D矩阵',
            link: '/webgl2/s4.md',
          },
          {
            title: 'WebGL2 Orthographic 3D',
            link: '/webgl2/s5.md',
          },
          {
            title: 'WebGL2 3D Perspective',
            link: '/webgl2/s6.md',
          },
        ],
      },
      {
        title: 'three.js学习',
        children: [
          {
            title: 'three.js的基本原理',
            link: '/threejs/s1.md',
          },
          {
            title: 'three.js的魔方',
            link: '/threejs/s2.md',
          },
        ],
      },
      {
        title: '树莓派',
        children: [
          {
            title: '为树莓派装系统',
            link: '/pie/s1.md',
          },
        ],
      },
    ],
  })
}
