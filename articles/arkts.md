# 实现arkts build 里ui编译成js

## 原来语法
```
Column() {
    Text('space') .fontSize(9) .fontColor (0xCCCCCC) . width('90%')
    Column({ space: 5 }) {
      Column().width('100%').height(30).backgroundColor(0xAFEEEE)
      Column().width('100%').height(30).backgroundColor(0x00FFFF)
    }.width('90%').height(100).border({ width: 1 })
}
```

## 编译后
```js
g.defc(Column().init(function (ele) {
    ; g.defc(Text('space').init(function (ele) {
     }), function (ctx) {
        ctx.fontSize(9).fontColor(0xCCCCCC).width('90%');
        ctx.curRoot = ele;
        ctx.done()
    });
    g.defc(Column({ space: 5 }).init(function (ele) {

        ; g.defc(Column().init(function (ele) { 
        }), function (ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
            ctx.curRoot = ele;
            ctx.done()
        });


        ; g.defc(Column().init(function (ele) {
         }), function (ctx) {
            ctx.width('100%').height(30).backgroundColor(0x00FFFF);
            ctx.curRoot = ele;
            ctx.done()
        });

    }), function (ctx) {
        ctx.width('90%').height(100).border({ width: 1 });
        ctx.curRoot = ele;
        ctx.done()
    });

}), function (ctx) { ctx.curRoot = ele; ctx.done() })
```


## 实现

```js
/**
 * 
 * @param {string} code 
 */
function parseFlutterLikeFun(code = '') {
    let reg = /\.{1}[^\n]+/g

    let funcNameReg = /([\w]+)\([^)]*\)/g

    let methodReg1 = /(\.\s*)([\w0-9]+)(\s*\([^)]*\))\s*\./g

    let methodReg2 = /(\.\s*)([\w0-9]+)(\s*\([^)]*\))/g

    let funcNames = [...code.matchAll(funcNameReg)].map(v => v[1])

    let uniFuncNames = [...new Set(funcNames)]

    // console.log(uniFuncNames);


    let methodArr = []
    function getMethodNames(context = { str: '' }, { type = 1 } = {}) {
        if (type === 1) {
            context.str = context.str.replace(methodReg1, function (s, ...args) {
                methodArr.push(args[1])
                return s.replace(args[0] + args[1] + args[2], '')
            })
        }
        else {
            context.str = context.str.replace(methodReg2, function (s, ...args) {
                methodArr.push(args[1])
                return s.replace(args[0] + args[1] + args[2], '')
            })
        }
        if (context.str.match(methodReg1)) {
            getMethodNames(context)
        } else {
            if (context.str.match(methodReg2)) {
                getMethodNames(context, { type: 2 })
            } else {
                // console.log(context.str);
            }
        }
    }



    getMethodNames({
        str: code
    })

    let unmethodArr = [...new Set(methodArr)]

    let tags = uniFuncNames.filter(v => !unmethodArr.includes(v))

    // console.log(tags);



    code = code.replace(reg, function (s, ...args) {

        // console.log(s);
        return `__init(__FuncName__, function(ctx) {
ctx${s.trim()};
ctx.done()
});__end_init__;`
    })



    let reg2 = /([^\n\}]+)\s*__init\(__FuncName__/g


    let code2 = code.replace(reg2, function (s, ...args) {
        if (args[0]) {
            // console.log(s, args);
            s = s.replace(args[0], '\n;')
            s = s.replace('__init(__FuncName__', `g.defc(${args[0].trim()}.init(function() {})`)
            return s
        }
        return s
    })

    // console.log(code2);

    let code3 = code2

    // console.log(code2);

    tags.forEach(tagName => {
        let reg3 = new RegExp(`(__end_init__;)([^]*${tagName}\\([^]*\\)[^]*{[^]*})(__init\\(__FuncName__)`, 'g')

        let blockReg = new RegExp(`(Column[^(]*\([^)]*\)[^{]*){`)
        code3 = code3.replace(reg3, function (s, ...args) {
            if (args[0]) {
                // console.log(args);
                // s = s.replace(args[0], '')
                s = s.replace(args[1], '')
                let funName = ''
                let funBody = args[1].replace(blockReg, function (s, ...funArgs) {
                    funName = funArgs[0].trim()
                    // console.log(s);
                    return '{'
                })

                // console.log('funBody', funBody);

                s = s.replace('__init(__FuncName__', `g.defc(${funName}.init(function() ${funBody.trim()})`)

                // console.log(s);
                return s
            }
            return s
        })
    })



    tags.forEach(tagName => {
        let reg = new RegExp(`(${tagName}[^(]*\\([^)]*\\)[^{.]*){`, 'g')
        code3 = code3.replace(reg, function (s, ...args) {
            // console.log(args);
            // let funBody = s.replace(args[0], '')
            // console.log(funBody);
            let str = `@g.defc(${args[0].trim()}.init(function() {__some__`

            // console.log(str);

            return str
        })
    })

    code3 = code3.replace(/{(__some__)([^@]*)/, function (s, ...args) {
        return '{' + args[1].trim() + '), function (ctx) {ctx.done()})'
    })

    code3 = code3.replaceAll('@g.defc', 'g.defc')

    code3 = code3.replaceAll('__end_init__;', '\n')

    return code3
}
```