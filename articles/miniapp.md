# 小程序动态执行

小程序自从2022 年把eval5 之类的js 动态执行库 禁用后

一些类似计算器的 动态执行 也被消灭


对此 我只能表示 腾讯有病

但是 方案还是要做的  突然 我发现了 css calc 居然可以执行代码


## 确定语法

```js
(@(fun,[1, {a: 1}]) + 1) + 1 + @(fun,[1,2,"3"])
```

## 先解析函数 

```js
function createFunc() {
  return  {
    fun(...args) {
      // console.log('fun');
      
      if (Array.isArray(args) && args.length > 0) {
        return args.at(-1)
      }
      return 0
    },
    // get(...args) {
    //   let name = args[0]
    //   return (funContext[name] ?? 0)
    // },
    str_append(...args) {
      // console.log('str_append');
      let str = ''
      args.forEach(item => {
        str = str + item
      })
      return str
    },
    async fetch(...args) {
      await sleep(1000);
      return `fetch ${args}`
    }
  }
}

function makestyleCore(newCssCode = '', funContext = {}, context: any = {}) {

  let functions = createFunc() 

  let regexp = /@\(([^\)]*)\)/g

  // console.log(funContext);
  let match = newCssCode.match(regexp);


  if (Array.isArray(match)) {
    match.some( async (funcArgBody, funcIndex) => {
      let funcNameRe = funcArgBody.match(/@\(([^,)]*)/)
      let funcName = funcNameRe[1]
      let args = funcArgBody.slice(funcNameRe[0].length).slice(1).slice(0, -1);
      // console.log(funcArgBody);
      // console.log(funcName);
      // console.log(args);
      if (functions[funcName]) {
        // let parsedArgs = parseArgs(args, funContext)
        // console.log(args);
        if (context.run) {
          await context.run(functions[funcName], funcArgBody, args)
        }
      }

      if (funcIndex > match.length - 2) {
        if (context.done) {
          await context.done()
        }
        return true
      }
      return false
    });
    
  } 
}

function makestyle(cssCode = '', funContext = {}) {
  let newCssCode = parseArgs(cssCode, funContext)
  makestyleCore(newCssCode, funContext, {
    run(fun, funcArgBody, args) {
      let ret = fun.bind({})(...JSON5.parse(args));
      newCssCode = newCssCode.replace(funcArgBody, ret)
    }
  })
  return newCssCode
}

function asyncmakestyle(cssCode = '', funContext = {}) {
  return new Promise(resolve => {
    let newCssCode = parseArgs(cssCode, funContext)
    makestyleCore(newCssCode, funContext, {
      async run(fun, funcArgBody, args) {
        let ret = await fun.bind({})(...JSON5.parse(args));
        newCssCode = newCssCode.replace(funcArgBody, ret)
      },
      async done() {
        resolve(newCssCode)
      }
    });
  })
}
```

### 执行css calc
### 返回查询