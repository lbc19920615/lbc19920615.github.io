import { reactive, ref , watch, computed  } from "vue"

let customComponents = new Map()
let ssrComponents = new Map()

let isSsrMode = Boolean(globalThis.__ssrMode__)
// isSsrMode = true

let scripts = []
let jsonMap = {}

globalThis.getscripts = function() {
    return {
        run(jsonMap, dataMap) {
            // console.log(scripts.toString());

            Object.keys(jsonMap).forEach(key => {
                let value = jsonMap[key]
                // console.log(value);

                let ComponentFunName = value.ssrRender[0]
                if (ssrComponents.has(ComponentFunName)) {
                    // console.log(ssrComponents.get(ComponentFunName));
                    ssrComponents.get(ComponentFunName)(document.querySelector(`[ssr-id="${key}"]`), dataMap[key] ?? [])
                }
            })
            
            // scripts.forEach(fun => {
            //     fun()
            // })
        }
    }
}

export function Nid() {
    return crypto.randomUUID()
}

function appendCommon(ctx, ele) {
    let curParent = ctx.parent
    if (Array.isArray(ctx.parent)) {
        curParent = ctx.parent[1]
        // console.dir(curParent);
    }
    if (curParent.nodeType === 8) {
        curParent.before(ele)
    }
    else {
        if (Array.isArray(ele)) {
            curParent.append(...ele)
        } else {
            curParent.append(ele)
        }
    }
}

let cssHelper = {
    toLength(val) {
        if (Number(val) == val) {
            return val + 'px'
        }
        return val
    },
    toColor(val) {
        if (typeof val !== 'string') {
            // console.log(val.toString(16).padStart(6, '0'));
            return '#' + val.toString(16).padStart(6, '0')
        }
        return val
    }
}

export function createCommonCtx(callback, { ele, id = Nid() } = {}) {
    let ctx = {
        id,
        curRoot: undefined,
        getEle() {
            return ele
        },
        done(parent) {
            ctx.curRoot = parent
            ctx.parent = parent
            appendCommon(ctx, ele)
            ctx.ele = ele
            callback(ele, {parent})
        },
        afterFuns: []
    }


    let colorNames = ['backgroundColor']
    let borderNames = ['border']
    let sizeNames = ['width', 'height', 'fontSize']
    let cssFunNames = [...colorNames, ...borderNames, ...sizeNames]

    let eventNames = ['onLoad']

    let proxy = new Proxy(ctx, {
        get(target, key, receiver) {
            // console.log(target, key, receiver);
            if (ctx[key]) {
                return ctx[key]
            }
            else if (cssFunNames.includes(key)) {
                return function (...args) {
                    // console.log('ele', args[0].toString(16));
                    let val = args[0]
                    if (colorNames.includes(key)) {
                        val = cssHelper.toColor(val)
                    }
                    if (sizeNames.includes(key)) {
                        val = cssHelper.toLength(val)
                    }
                    if (borderNames.includes(key)) {
                        let option = {
                            width: '0px',
                            style: 'solid',
                            ...val
                        }

                        let width = cssHelper.toLength(option.width)

                        let str = `${width} ${option.style}`
                        // console.log(width);
                        val = str
                    }
                    ele.style[key] = val
                    return proxy
                }
                // console.log('sssss');
            }
            else if (eventNames.includes(key)) {
                return function (...args) {
                    // console.log(args[0]);
                    let callback = args[0];
                    callback({})
                    return proxy
                }
            }
            else if (['hookEnd'].includes(key)) {
                return function (...args) {
                    if (args[0]) {
                        ctx.afterFuns.push(args[0])
                    }
                    // console.log(args, ele, ctx);
                    return proxy
                }
            }
        }
    })
    return proxy
}

function createForeachCtx(callback, { ele, max = 0, list, id = Nid() } = {}) {
    let ctx = {
        id,
        curRoot: undefined,
        done(parent) {
            ctx.curRoot = parent
            ctx.parent = parent
            appendCommon(ctx, ele);
            ctx.ele = ele
            ctx.build(max, list)
        },
        reload({ max, list } = {}) {
            while (ele[0].nextSibling !== ele[1]) {
                if ( ele[0].nextSibling?.remove) {
                    ele[0].nextSibling.remove()
                } else {
                    // console.dir(ele[0].nextSibling)
                    if (ele[0].nextSibling.parentElement) {
                        ele[0].nextSibling.parentElement.removeChild(ele[0].nextSibling)
                    } else {
                      
                        throw new Error('not have remove')
                    }
                }
            }
            //    console.log(max);
            ctx.build(max, list)
        },
        build(innerMax, innerList) {
                
            function appendChild(childEle) {
                appendCommon(ctx, childEle);
            }

            if (innerList) {
                for (let index = 0; index < innerList.length; index++) {
                    callback(ele, { appendChild, index, item: innerList[index] })
                }
            }
            else {
                // console.log(ele);
                for (let index = 0; index < innerMax; index++) {
                    callback(ele, { appendChild, index, item: index })
                }
            }
        }
    }
    return ctx
}

export function ForEach({ max = ref(0), list = null } = {}, {label = ''} = {}) {
    let startFlg = document.createComment('start' + label)
    let endFlg = document.createComment('end' + label)
    let ele = [
        startFlg,
        endFlg
    ]

    // let computeMax = computed(() => max)

    let obj = reactive({
        max,
        list
    })

    // console.log(list);
    watch(max, (newVal, oldVal) => {
        // console.log('list', newVal, oldVal);
        ctx.reload({ max: obj.max, list: obj.list })
    }, {
        deep: true
    })

    watch(list, (newVal, oldVal) => {
        // console.log('list', newVal, oldVal);
        ctx.reload({ max: obj.max, list: obj.list })
    }, {
        deep: true
    })

    let ctx;
    return {
        getCtx() {
            return ctx
        },
        init(callback) {
            // console.log(callback);
            return function () {
                // console.log(obj);
                ctx = createForeachCtx(callback, { ele, max: obj.max, list: obj.list })
                return ctx
            }
        }
    }
}
customComponents.set('ForEach', ForEach)

let currentCondition = null;

export function If(conditions) {
    // console.log(conditions);
    currentCondition = conditions;
    let fragment = ForEach({ max: Number(conditions.value) }, {label: ' if'})
    watch(conditions, (newVal, oldVal) => {
        // console.log('111', newVal, fragment);
        fragment.getCtx().reload({ max: Number(newVal) })
    })
    return fragment
}
customComponents.set('If', If)

export function Else() {
    // console.log(conditions);
    if (!currentCondition) {
        return;
    }
    
    let conditions = currentCondition
    let fragment = ForEach({ max: !Number(conditions.value) }, {label: ' else'})
    watch(conditions, (newVal, oldVal) => {
        // console.log('111', newVal, fragment);
        fragment.getCtx().reload({ max: !Number(newVal) })
    })
    return fragment
}
customComponents.set('Else', Else)

function defc(buildCtx, runFun) {
    let fun = buildCtx
    // if (Reflect.getPrototypeOf(buildCtx).toString() === '[object Promise]') {
    //     fun = await buildCtx
    // }
    // console.log(fun);
    let ctx = fun()
    runFun(ctx)
    return ctx
}


function ssrc(buildCtx, runFun) {
    let fun = buildCtx
    let ctx = fun()
    // runFun(ctx)
    runFun(ctx)
    return ctx
}



export let g = {
    defc,
    ssrc,
}


export function hc(ComponentConstruct, {args = [], init = function() {}, end = function() {}, afterInit, ready} = {}, ele) {
    let readyFun = ready ? function(ctx) {
        ready(ctx)
        ctx.done(ele)
    } : function(ctx) {  
        ctx.done(ele)
    }

    return defc(ComponentConstruct.apply(null, args).init(init), readyFun);
}

export let h3 = new Proxy(customComponents, {
    get(target, key) {
        if (target.has(key)) {
            return function(ele, ...args) {
                // console.dir(ele)
                return function(init) {
                   return hc(target.get(key), {args: args.slice(0, args.length), init}, ele)
                }
            }
        }
    }
})
globalThis.h3 = h3




export function defComponent(option = {}) {
    let {setup, ssrRender} = option
    let ctx = null;
    function getCompCtx() {
        return ctx
    }

    let stopWatch

    let fun = function(...args) {
        // console.log(args);
        function startWatch(onChange) {
            stopWatch = watch(args, (newVal, oldVal) => {
                if (onChange) {
                    onChange(newVal, oldVal)
                }
            }, {
                deep: true
            })
        }

        return {
            init(callback) {
                // console.log(callback);
                return function () {
                    let ele = setup({getCompCtx, startWatch, args, isSsrMode})
                    if (isSsrMode) {
                        let id = Nid()
                        ele.setAttribute('ssr-id', id)

                        if (ssrRender) {
                            if (!jsonMap[id]) {
                                
                                console.log(args);
                                jsonMap[id] = {
                                    ssrRender: [option.name, ['ssrRender']]
                                }
                            }
                        }
                    }
                    
                    ctx = createCommonCtx(function(childEle, option) {
                        // console.log(option);
                        // console.dir(ele.parentElement);
                        callback(childEle)
                        // currentRoot = childEle
                        if (option.afterRender) {
                            option.afterRender(childEle, option)
                        }
                    }, { ele })
                    // console.log(ctx);
                    return ctx
                }
            }
        }
    }

    if (option?.name) {
        customComponents.set(option.name, fun)
        ssrComponents.set(option.name, ssrRender)
    }

    // console.log(customComponents);
    return fun
}


export function Button({ action, text } = {}) {
    let ele = document.createElement('button')
    ele.classList.add('button')
    ele.onclick = function (e) {
        action(e)
    }
    ele.textContent = text
    return {
        init(callback) {
            // console.log(callback);
            return function () {
                let ctx = createCommonCtx(callback, { ele })
                return ctx
            }
        }
    }
}

customComponents.set('Button', Button)

// export function Column() {
//     let ele = document.createElement('div')
//     ele.classList.add('column')
//     return {
//         init(callback) {
//             // console.log(callback);
//             return function () {
//                 let ctx = createCommonCtx(callback, { ele })
//                 return ctx
//             }
//         }
//     }
// }

export let Column = defComponent({
    name: 'Column',
    setup() {
        // console.log('ssssssssssss');
        let ele = document.createElement('div')
        ele.classList.add('column')
        return ele
    },
})
// customComponents.set('Column', Column)

// export function Text(text) {
//     let ctx
//     let ele = document.createElement('div')
//     ele.classList.add('text')
//     function render(ele) {
//         ele.textContent = text.__v_isRef ? text.value : text
//     }

//     render(ele)

//     if (text.__v_isRef) {
//         watch(text, () => {
//             render(ele)
//         })
//     }
//     return {
//         init(callback) {
//             // console.log(callback);
//             return function () {
//                 ctx = createCommonCtx(callback, { ele })
//                 return ctx
//             }
//         }
//     }
// }
// customComponents.set('Text', Text)

function _text__render(ele, text) {
    ele.textContent = text?.__v_isRef ? text.value : text
}

function _text__action(ele, args) {
    console.log('ssrRender', args);

    let text = args[0] ?? ''



    if (text.__v_isRef) {
        watch(text, () => {
            console.log('ssss');
            _text__render(ele, text)
        })
    }
}

export let Text = defComponent({
    name: 'Text',
    setup({getCtx, startWatch, args, isSsrMode}) {
        let text = args[0] ?? ''
        let ele = document.createElement('div')
        ele.classList.add('text');
        _text__render(ele, text)
        if (!isSsrMode) {
            _text__action(ele, args)
        }
        return ele
    },
    ssrRender(ele, args) {
        _text__action(ele, args)
    }
})


let symbol = Symbol('BaseControl')

export class BaseVmControl {
  static [symbol] = 1
  constructor() {
    this[symbol] = 1
  }
}

let cachedDefs = {}

/**
 * 
 * @param { Function | any} f 
 * @returns 
 */
function isConstructor(f) {
    try {
        new f();
    } catch (err) {
        // verify err is the expected error and then
        return false;
    }
    return true;
}



function __vm_scanCls(ret, cls, { handleKey = null } = {}) {
    let obj = new cls()
    let keys = Reflect.ownKeys(obj)
    let parentKeys = []


    // console.log('keys', keys);


    if (!handleKey) {
        handleKey = function (key) { return key }
    }
    // console.log('sssssssssssss', parentKeys);
    keys.forEach(key => {
        if (!parentKeys.includes(key)) {
            let parsedKey = handleKey(key)
            ret.state[parsedKey] = obj[key]
        }
    })

    // console.log(ret.state);

    let p = Object.getOwnPropertyDescriptors(cls.prototype);
    Object.entries(p).forEach(([key, item]) => {
        if (key !== 'constructor') {
            let parsedKey = handleKey(key)
            if (typeof item.set === 'undefined' && item.get) {
                ret.getters[parsedKey] = item.get
            }
            if (typeof item.value === 'function') {
                ret.actions[parsedKey] = item.value
            }
        }
    })
}



export function injectControl(name = '') {
    return function(target) {
        let clsDef = {
            state: {},
            getters: {},
            actions: {}
        }

        let extendCls = Reflect.getPrototypeOf(target)
        // console.log(extendCls);
        
        if (isConstructor(extendCls)) {
            let symbols = Object.getOwnPropertySymbols(new extendCls())
            if (symbols.includes(symbol)) {
                // console.log('good', Object.getOwnPropertySymbols(new extendCls()));
                __vm_scanCls(clsDef, extendCls)
            }
        }
        // console.log(Object.getOwnPropertySymbols(Reflect.getPrototypeOf(extendCls)))

        __vm_scanCls(clsDef, target);
    
        if (!target.__def__) {
            target.__def__ = clsDef;

            // currentModelContext.defs[name] = clsDef;

            cachedDefs[name] = clsDef

        }
        // console.log(clsDef);
    }
}
 
export function useControl(cls) {
    let clsDef = null
    if (typeof cls === 'string') {
        clsDef = cachedDefs[cls]
    }
    else {
        clsDef = cls.__def__
    }
    // console.log(clsDef);
    if (clsDef) {
        let def = clsDef
        let obj = reactive(def.state)

        let getterKeys = []

        Object.keys(def.getters).forEach(key => {
            // console.log(def.getters[key].bind(obj));
            getterKeys.push(key)
            obj[key] = computed(def.getters[key].bind(obj))
        });


        Object.keys(def.actions).forEach(key => {
            obj[key] = def.actions[key].bind(obj)
        })

        // console.log(obj);
        return new Proxy(obj, {
            get(target, key) {
                if (getterKeys.includes(key)) {
                    return computed(() => {
                        return obj[key]
                    })
                }
                else {
                    return obj[key]
                }
            }
        })
    }
    return null
}