import { Nid } from "wle";

export function parseArkUI(code = '') {
    let reg = /([\w\d]*)(\s*\()([^\)]*)\)\s*{/g

    let funcNames = []
    code = code.replace(reg, function (s, ...args) {
        if (args[0]) {
            let funcName = args[0].trim() + '__' + Nid()
            funcNames.push(funcName)
            s = 'function ' + s.replace(args[0], funcName)
            s = s.replace(args[2], '') + `/*${args[2]}*/`
        }
        return s
    })

    // console.log(code) 

    let newfuncNames = funcNames.slice(0)
    let curFuncDefArr = new Map()

    let context = {
        newfuncNames
    }

    context.root = document.createElement('div');

    // console.log( context.newfuncNames);

    function getFunBody(Func) {
        var entire = Func.toString();
        var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        return body
    }
    let argsReg = /\/\*([^\*]+)\*\//;

    let runFunReg = /([A-Z]{1}[\w\d]+)\(([^\)]*)\)/g;

    let preDef = ['Text', 'Column', 'Button'].map(v => {
        return `
                    function ${v}() {
                        return {
                            init() {
                            }
                        }
                    }
                    `
    }).join('\n')

        + `
                let some = {};
                `


    function findFun(code, context, parent) {
        let rootEle = document.createElement('div')
        let newCode = preDef + ' let a = function(){' + code + ` return [__FUNC__] }; a()`;
        let keys = [...curFuncDefArr.keys()];
        context.newfuncNames.filter(v => !keys.includes(v)).forEach(funcName => {
            try {
                let curCode = newCode.replace('__FUNC__', funcName);
                // console.log(curCode)
                let b = eval(curCode);
                // console.log(b)
                if (b[0]) {
                    let ele = document.createElement('div');
                    let arr = funcName.split('__')
                    ele.setAttribute('tag', arr[0])
                    ele.setAttribute('id', arr[1])
                    parent.appendChild(ele);
                    let funcBody = getFunBody(b[0])
                    let argArr = funcBody.match(argsReg)
                    // let funcDeca =  b[0].toString().replace(funcBody, '')

                    // console.log(getFunBody(b[0]));
                    if (!funcBody.includes('function')) {
                        // console.log(funcBody);
                        let funs = [...funcBody.matchAll(runFunReg)]
                        funs.forEach(v => {
                            let item = document.createElement('div')
                            item.setAttribute('tag', v[1])
                            if (v[2]) {
                                let param = document.createElement('param1')
                                param.innerHTML = v[2]
                                item.appendChild(param)
                            }
                            // item.setAttribute('param', `[${v[2]}]`)
                            ele.appendChild(item)

                            // console.log(v[0].replaceAll('(', '\\\(').replaceAll(')', '\\\)'));
                            // let index = funcBody.indexOf(v[0])
                            console.log('index', v[0], v.index, funcBody[parseInt(v.index) + v[0].length]);
                            if (funcBody[v.index + v[0].length]  === '.') {
                                let prefix  = v[0].replaceAll('(', '\\\(').replaceAll(')', '\\\)')
                                let finded = new RegExp(prefix + '(\\s*)(\\.{1}[^\\n]+)')
                                if (funcBody.match(finded)) {
                                    let funarr = funcBody.match(finded)
                                    console.log(funarr);
                                    if (!item.querySelector('method')) {
                                        let param = document.createElement('method')
                                        param.innerHTML = funarr[2]
                                        item.appendChild(param)
                                    }
    
                                }
                            }
                            // console.log(v[0])
                        })

                        // let fnas = [...new Set(funs.map(v => v[1]))]
                        // console.log(fnas);
                    }
                    curFuncDefArr.set(funcName, {
                        args: argArr[1],
                        funcBody: funcBody,
                    });
                    findFun(funcBody, context, ele)
                }
            } catch (e) {
                console.log(e)
            }
        })
        // let keys = [...curFuncDefArr.keys()]
        // context.newfuncNames = context.newfuncNames.filter(v => !keys.includes(v))
    }

    findFun(code, context, context.root)

    console.log(curFuncDefArr, context.root.innerHTML);

    return context.root
}