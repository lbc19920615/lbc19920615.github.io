import { Nid } from "wle";

export function parseArkUI(code = '', {glo = globalThis, components = new Map(), hc2 = function() {} } = {}) {

    // console.log(components);
    let reg = /([\w\d]*)(\s*\()([^\)]*)\)\s*{/g;
    let withModifierReg = /(Column)\(([^]*)(Modifier[\?\.]+[^\)]*\))/g
    let mreg = /([A-Z]{1}[\w\d]+)\(/g

    let allMethods = [...code.matchAll(mreg)].map(v => v[1])
    let uniMethods = [...new Set(allMethods)];

    let modifierReg = /\$__([^\$]*)\$/
    // console.log(uniMethods);

    let funcNames = [];
    let modifierMap = new Map();

    code = code.replace(withModifierReg, function (s, ...args) {
        if (args[0]) {
            let funcName = args[0].trim() + '__' + Nid()
            funcNames.push(funcName)
            s = 'function ' + s.replace(args[0], funcName);
            modifierMap.set(funcName, args[2])
            s = s.replace(args[2], `$__${Nid()}\$`) 
        }
        return s
    });

    // console.log(modifierMap, funcNames);

    code = code.replace(reg, function (s, ...args) {
        if (args[0]) {
            if (args[0].trim().includes('__')) {
                // console.log(args)
                s = s.replace(args[2], '');
                let newRegs = args[2].replace(modifierReg, function(cs, ...cargs) {
                    // console.log(cargs);
                    let sss =  modifierMap.get(args[0])?.replace('Modifier', 'Modifier.setCurEle(ele)');
                    return cs.replace('$__' + cargs[0]+ '$', '(ele) => ' + sss)
                })
                return s + '/*'+ newRegs +'*/'
            }
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

    let preDef = /*javascript*/`
    let p = new Proxy({}, {
        get(target, key, receiver) {
            return function(...args) {
                return p
            }
        }
    });
    ` + uniMethods.map(v => {
        return `
                    function ${v}(...args) {
                        return p
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

                // console.log(p)
                return p
            }
        }
    });
    `+ uniMethods.map(v => {
        return `
                    function ${v}(...args) {
                        curFunArr = [${v}.name, args, []]
                        funcs.push(curFunArr);
                        return p
                    }

                    `
    }).join('\n')

        + ` `;


       
    function __get(object, path, defval = null) {
        if (typeof path === "string") {
            path = path.split(".");
        }
        return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
    }


    function evalArgs(args = []) {
        return args.map(v => {
            try {
                let o = eval(`let a = ${v}; a;`);
                // console.log(v, o);
                return o
            } catch(e) {
                if (typeof v === 'string') {
                    let val = __get(glo, v?.trim().split('.'))
                    // console.log(v, val);
                    if (typeof val !== 'undefined' && val != null) {
                        return val
                    } 
                }

                // console.log(v, e);
                return v
            }
        })
    }


    function findFun(code, context, {parent, dom} = {}) {
        let newCode =  preDef + ' let a = function(){' + code + ` return [__FUNC__] }; a()`;

        // console.log(newCode);
        let keys = [...curFuncDefArr.keys()];
        context.newfuncNames.filter(v => !keys.includes(v)).forEach(funcName => {
            try {
                let curCode = newCode.replace('__FUNC__', funcName);
                // console.log(curCode)
                let b = eval(curCode);
                // console.log(b)
                if (b[0]) {
                    let funcBody = getFunBody(b[0])
                    let argArr = funcBody.match(argsReg) ?? []
                    let arr = funcName.split('__');

                    // tag
                    let ele = document.createElement('div');   
                    ele.setAttribute('tag', arr[0])
                    ele.setAttribute('id', arr[1])
                    parent.appendChild(ele);
         
                    let dom1 = document.createElement('div');
                    if (components.has(arr[0])) {
                        // console.log(arr[0], argArr[1]);
                        let func_args =  []
                        try {
                            func_args = evalArgs([argArr[1]])   
                        } catch(e) {
                            console.log('func_args', e);
                        }
                        console.log(arr[0], func_args[0]);

                        if (['ForEach', 'If', 'Else'].includes(arr[0])) {
                            
                            // console.log(arr[0], func_args);
                            let ctx = hc2(components.get(arr[0]), {args: func_args, init(initEle) {
                                dom1 = initEle;
                                // console.log('init');
                                onParentInit()
                            }}, dom);
                            dom1 = ctx.ele
                        }
                        else {
                            let ctx = hc2(components.get(arr[0]), {args: func_args, init(initEle) {
                                dom1 = initEle;
                                onParentInit()
                            }, ready(ctx) {
                                // console.log('ready', ctx.size);
                            }}, dom);
                            dom1 = ctx.ele
                        }
                    }


                   function onParentInit() {
                        let newRetCode = `
                        let funcs = [];
                        ` + runDef + ' ;let a = function() {' + funcBody + '}; a(); funcs;'
                        let allFuncs = eval(newRetCode);
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
                            let funcArgs = v[1];
     
                            // console.log(funcArgs);
                            funcArgs = funcArgs.map(v => {
                                try {
                                    let o = eval(`let a = ${v}; a;`);
                                    // console.log(v, o);
                                    return o
                                } catch(e) {
                                    if (typeof v === 'string') {
                                        let val = __get(glo, v?.trim().split('.'))
                                        // console.log(v, val);
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
                                // console.log(v[0]);
                                hc2(components.get(v[0]), {args: funcArgs, ready(ctx) {
                                    if (v[2].length > 0) {
                                        v[2].forEach(([name, funcArgs]) => {
                                            if (ctx[name]) {
                                                ctx[name](...funcArgs)
                                            }
                                        })
                                    }
                                }}, dom1);
                            }
                            // console.log(v[0])
                        })
                    }
                }
            } catch (e) {
                if (!e.message.includes('is not defined')) {
                    console.log(e)
                }
            }
        })
        // let keys = [...curFuncDefArr.keys()]
        // context.newfuncNames = context.newfuncNames.filter(v => !keys.includes(v))
    }

    context.dom =  document.createElement('div')
    findFun(code, context, {parent: context.root, dom: context.dom})

    console.log(context.root);

    return {
        def: context.root,
        dom: context.dom
    }
}