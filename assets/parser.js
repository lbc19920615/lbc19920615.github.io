import { Nid } from "wle";

export function parseArkUI(code = '', {components, hc2 } = {}) {

    // console.log(components);
    let reg = /([\w\d]*)(\s*\()([^\)]*)\)\s*{/g;
    let mreg = /([A-Z]{1}[\w\d]+)\(/g

    let allMethods = [...code.matchAll(mreg)].map(v => v[1])
    let uniMethods = [...new Set(allMethods)]
    // console.log(uniMethods);

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

    console.log( context.newfuncNames);

    function getFunBody(Func) {
        var entire = Func.toString();
        var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        return body
    }
    let argsReg = /\/\*([^\*]+)\*\//;

    let runFunReg = /([A-Z]{1}[\w\d]+)\(([^\)]*)\)/g;

    let preDef = uniMethods.map(v => {
        return `
                    function ${v}(...args) {
                        return {
                            init() {
                            }
                        }
                    }
                    `
    }).join('\n')

        + ` `




    let runDef = /*javascript*/`
    let curFunArr = null;
    let p = new Proxy({}, {
        get(target, key, receiver) {
            return function(...args) {
                curFunArr[2].push([key, args])
                return p
            }
        }
    })
    `+ uniMethods.map(v => {
        return `
                    function ${v}(...args) {
                        curFunArr = [${v}.name, args, []]
                        funcs.push(curFunArr);
                        return p
                    }
                    `
    }).join('\n')

        + ` `    


    function findFun(code, context, {parent, dom} = {}) {
        let newCode =  preDef + ' let a = function(){' + code + ` return [__FUNC__] }; a()`;
        let keys = [...curFuncDefArr.keys()];
        context.newfuncNames.filter(v => !keys.includes(v)).forEach(funcName => {
            try {
                let curCode = newCode.replace('__FUNC__', funcName);
                // console.log(curCode)
                let b = eval(curCode);
                // console.log(b)
                if (b[0]) {
                    let arr = funcName.split('__')
         
                    let dom1 = document.createElement('div');
                    if (components.has(arr[0])) {
                        let ctx = hc2(components.get(arr[0]), {args: []}, dom);
                        dom1 = ctx.ele
                    }


                    let ele = document.createElement('div');
         
                    ele.setAttribute('tag', arr[0])
                    ele.setAttribute('id', arr[1])
                    parent.appendChild(ele);
                    let funcBody = getFunBody(b[0])
                    let argArr = funcBody.match(argsReg)
                    // let funcDeca =  b[0].toString().replace(funcBody, '')

                    let newRetCode = `
                    let funcs = [];
                    ` + runDef + ' ;let a = function() {' + funcBody + '}; a(); funcs;'
                    let allFuncs = eval(newRetCode);

                    // console.log(allFuncs);

                    // console.log(getFunBody(b[0]));
                    // if (!funcBody.includes('function')) {
                        // console.log(funcBody);
                    

                        // let fnas = [...new Set(funs.map(v => v[1]))]
                        // console.log(fnas);
                    // }
                    curFuncDefArr.set(funcName, {
                        args: argArr[1],
                        funcBody: funcBody,
                    });
                    findFun(funcBody, context, {parent: ele, dom: dom1});
                    let funs = allFuncs
                    funs.forEach(v => {
                        let item = document.createElement('div')
                        item.setAttribute('tag', v[0])
                        if (v[1]) {
                            let param = document.createElement('param1')
                            param.innerHTML = v[1]
                            item.appendChild(param)
                        }
                        ele.appendChild(item);

                        // console.log(v[0].replaceAll('(', '\\\(').replaceAll(')', '\\\)'));
                        // let index = funcBody.indexOf(v[0])
                        // console.log('index', v[0], v.index, funcBody[parseInt(v.index) + v[0].length]);
                        let funcArgs = v[1]
                        // if (funcBody[v.index + v[0].length]  === '.') {
                        //     let prefix  = v[0].replaceAll('(', '\\\(').replaceAll(')', '\\\)')
                        //     let finded = new RegExp(prefix + '(\\s*)(\\.{1}[^\\n]+)')
                        //     if (funcBody.match(finded)) {
                        //         let funarr = funcBody.match(finded)
                        //         // console.log(funarr);
                        //         if (!item.querySelector('method')) {
                        //             let param = document.createElement('method')
                        //             param.innerHTML = funarr[2]
                        //             item.appendChild(param);
                        //             // funcArgs = funarr[2]
                        //         }

                        //     }
                        // }


                    //   console.log(funcArgs);
        
                        function __get(object, path, defval = null) {
                            if (typeof path === "string") {
                                path = path.split(".");
                            }
                            return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
                        }
        

                        // console.log(funcArgs);
                        funcArgs = funcArgs.map(v => {

                            try {
                                let o = eval(`let a = ${v}; a;`);
                                // console.log(v, o);
                                return o
                            } catch(e) {
                                if (typeof v === 'string') {
                                    let val = __get(globalThis, v?.trim().split('.'))
                                    console.log(v, val);
                                    if (typeof val !== 'undefined' && val != null) {
                                        return val
                                    } 
                                }

                                // console.log(v, e);
                                return v
                            }
                        })

                        // console.log(funcArgs);

                        if (components.has(v[0])) {
                            hc2(components.get(v[0]), {args: funcArgs, ready(ctx) {
                                if (v[2].length > 0) {
                                    v[2].forEach(([name, funcArgs]) => {
                                        if (ctx[name]) {
                                            console.log(name, funcArgs);
                                            ctx[name](...funcArgs)
                                        }
                                    })
                                }
                            }}, dom1);
                        }
                        // console.log(v[0])
                    })
                }
            } catch (e) {
                // console.log(e)
            }
        })
        // let keys = [...curFuncDefArr.keys()]
        // context.newfuncNames = context.newfuncNames.filter(v => !keys.includes(v))
    }

    context.dom =  document.createElement('div')
    findFun(code, context, {parent: context.root, dom: context.dom})

    // console.log(curFuncDefArr, context.root);

    return {
        def: context.root,
        dom: context.dom
    }
}