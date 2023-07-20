## 小程序动态执行

小程序自从2022 年把eval5 之类的js 动态执行库 禁用后

一些类似计算器的 动态执行 也被消灭


对此 我只能表示 腾讯有病

但是 方案还是要做的  突然 我发现了 css calc 居然可以执行代码


### 确定语法

```js
(@(fun,[1, {a: 1}]) + 1px) + 1px + @(fun,[1,2,"3"])
```

### 先解析函数 

```js
async function makestyle(cssCode = '') {
  return new Promise(resolve => {
    let context = {
    async fun(...args) {
      // console.log(args);
      return '1px'
    }
  }

  let regexp = /@\(([^\)]*)\)/g
  let match = cssCode.match(regexp)


  let newCssCode = cssCode
    match.forEach(async (funcArgBody, funcIndex) => {
      let funcNameRe = funcArgBody.match(/@\(([^,)]*)/)
      let funcName = funcNameRe[1]
      let args = funcArgBody.slice(funcNameRe[0].length).slice(1).slice(0, -1);
      // console.log(funcArgBody);
      // console.log(funcName);
      // console.log(args);
      if (context[funcName]) {
        let ret = await context[funcName](...JSON5.parse(args));
        // console.log(ret);
        
        newCssCode = newCssCode.replace(funcArgBody, ret)
      }
      
      if (funcIndex > match.length -2) {
        resolve(newCssCode)
      }
    });
  })
}
```

### 执行css calc
### 返回查询