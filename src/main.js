import "./webele.scss"
import { reactive, ref , watch  } from "vue"
import nid from "./nid.browser"

let glo = globalThis;
let dom = glo.document || glo.customDoucment;
let isSsrMode = Boolean(glo.__ssrMode__);

export function setGlobal(v) {
    glo = v;
    dom = glo.document || glo.customDoucment;
    isSsrMode = Boolean(glo.__ssrMode__);
    // console.log('isSsrMode', isSsrMode);
}

export function Nid(...args) {
    if (glo.__Nid__) {
        return glo.__Nid__(...args)
    }
    return nid(...args)
}


function __filterNone() {
    return NodeFilter.FILTER_ACCEPT;
}

export function getAllComments(rootElem) {
    var comments = [];
    // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
    var iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT, __filterNone, false);
    var curNode;
    while (curNode = iterator.nextNode()) {
        comments.push(curNode);
    }
    return comments;
}

function createComment(...args) {
    return dom.createComment(...args)
}

function createElement(...args) {
    let d = dom.createElement(...args);
    return d
}

let customComponents = new Map();
let ssrComponents = new Map();

export function getcustomComponents() {
    return customComponents
}

/**
 * 运行ssr
 * @param {Document} domRuntime 
 * @returns {void}
 */
export let getscripts = function(domRuntime = globalThis.document) {
    return {
        run(jsonMap, dataMap) {
            // console.log(scripts.toString());

            Object.keys(jsonMap).forEach(key => {
                let value = jsonMap[key]
                // console.log(value);

                let ComponentFunName = value.ssrRender[0]
                if (ssrComponents.has(ComponentFunName)) {
                    // console.log(ssrComponents.get(ComponentFunName));
                    let fun =  ssrComponents.get(ComponentFunName)
                    if (fun) {
                        let ele = domRuntime.querySelector(`[ssr-id="${key}"]`)
                        if (ele) {
                            // console.log(ele, key);
                                                    fun(ele, dataMap[key] ?? [])
                        }
                    }
                }
            })
        }

    }
}


function _utils_getObjectParam(args = [], index = 0) {
    if (!Array.isArray(args)) {
        return {}
    }
    return args[index] ?? {}
}

export let Utils = {
    getObjectParam: _utils_getObjectParam
}

function _utils_getAnyParam(args = [], defaultVal, index = 0) {
    return args[index] ?? defaultVal
}


function _directive_text(ele, text = '') {
    ele.textContent = text?.__v_isRef ? text.value : text
}

function _directive_action(ele, name, fun) {
    if (name) {
        ele['on' + name] = function (e) {
            fun(e)
        }
    }
}

/**
 * 
 * @param {object} ctx 
 * @param {Element|Comment} ele 
 */
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
    /**
     * 
     * @param {string | number} val 
     * @returns 
     */
    toLength(val) {
        if (Number(val) == val) {
            return val + 'px'
        }
        return val
    },
    /**
     * 
     * @param {string | number} val 
     * @returns {any}
     */
    toColor(val) {
        if (typeof val !== 'string') {
            // console.log(val.toString(16).padStart(6, '0'));
            return '#' + val.toString(16).padStart(6, '0')
        }
        return val
    }
}

function createModifier(ctx) {

    let colorNames = ['backgroundColor']
    let borderNames = ['border', 'fontColor']
    let sizeNames = ['width', 'height', 'size', 'fontSize']
    let cssFunNames = [...colorNames, ...borderNames, ...sizeNames]

    let eventNames = ['onLoad']

    let proxy = new Proxy(ctx, {
        get(target, key, receiver) {
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
                    if (ctx.resolveStyle) {
                        ctx.resolveStyle(key, val, target, receiver)
                    }
                    return proxy
                }
                // console.log('sssss');
            }
            else if (eventNames.includes(key)) {
                return function (...args) {
                    // console.log(args[0]);
                    let callback = args[0];
                    if (callback) {
                        callback({})
                    }
                    return proxy
                }
            }
            else if (['hookEnd'].includes(key)) {
                return function (...args) {
                    if (args[0]) {
                        ctx?.afterFuns?.push(args[0])
                    }
                    // console.log(args, ele, ctx);
                    return proxy
                }
            }
        }
    });

    return proxy
}

let _Modifier_eles = {};
let _currentModifierEle = null;
export let Modifier =  {
    setCurEle(ele) {
        _currentModifierEle = ele;
        return createModifier({
            resolveStyle(key, val,target,receiver) {
                ele.style[key] = val
                // console.log(key, val,target,receiver, ele);
            }
        })
    },
    create(handleFun) {
        let self = this;
        return function(ele) {
            handleFun(self.setCurEle(ele))
        }
    }
}




/**
 * 
 * @param {Function} callback 
 * @param {{ele: Element, id: string}} param1 
 * @returns 
 */
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
            // ctx.parentCtx = this
            appendCommon(ctx, ele)
            ctx.ele = ele
            callback(ele, {parent})
        },
        resolveStyle(key, val) {
            if (key === 'size') {
                // console.log(key, val, ele);
                ele.style['width'] = val
                ele.style['height'] = val
            }
            else {
                ele.style[key] = val
            }
        },
        afterFuns: []
    }

    let proxy = createModifier(ctx)
    return proxy
}

/**
 * 
 * @param {Function} callback 
 * @param {{ele: Element, max: number, list: Array<any>, id: string}} param1 
 * @returns 
 */
function createForeachCtx(callback, { ele, max = 0, list, id = Nid() } = {}) {
    let ctx = {
        id,
        curRoot: undefined,
        done(parent) {
            ctx.curRoot = parent
            ctx.parent = parent
            appendCommon(ctx, ele);
            ctx.ele = ele;
            // console.log('foreach', max, list);
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

function __ForEach_action(option = {}, obj, ctx) {
    let { max = ref(0), list = null } = option

    // console.log(list);
    watch(max, (newVal, oldVal) => {
        // console.log('list', newVal, oldVal);
        // ctx.reload({ max: obj.max, list: obj.list })
        ctx.reload(obj)
    }, {
        deep: true
    })

    watch(list, (newVal, oldVal) => {
        // console.log('list', newVal, oldVal);
        // ctx.reload({ max: obj.max, list: obj.list })
        ctx.reload(obj)
    }, {
        deep: true
    })

}

/**
 * 
 * @param {object} option 
 * @param {object} param1 
 * @returns 
 */
export function ForEach(option = {}, {label = ''} = {}) {
    let startFlg = createComment('start' + label)
    let endFlg = createComment('end' + label)
    let ele = [
        startFlg,
        endFlg
    ]


    let { max = ref(0), list = null } = option
    let obj = reactive({
        max,
        list
    })

    let ctx;
    
    return {
        getCtx() {
            return ctx
        },
        init(callback) {
            // console.log(callback);
            return function () {
                ctx = createForeachCtx(callback, { ele, max: obj.max, list: obj.list });
                if (!isSsrMode) {
                    __ForEach_action(option, obj, ctx)
                }
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
    let val = conditions?.__v_isRef  ? conditions.value : conditions
    let fragment = ForEach({ max: Number(val) }, {label: ' if'})
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
    
    let conditions = currentCondition;
    let val = conditions?.__v_isRef  ? conditions.value : conditions;
    // console.log('currentCondition', currentCondition, val,  Number(!val));
    let fragment = ForEach({ max: Number(!val) }, {label: ' else'})
    watch(conditions, (newVal, oldVal) => {
        // console.log('if', newVal, fragment);
        fragment.getCtx().reload({ max: !Number(newVal) })
    })
    return fragment
}
customComponents.set('Else', Else)

function defc(buildCtx, runFun) {
    let fun = buildCtx;
    let ctx = fun()
    if (isSsrMode) {
        if (glo.__onDefc__) {
            glo.__onDefc__(ctx)
        }
    }
    runFun(ctx)
    return ctx
}

export let g = {
    defc,
}


export function hc2(ComponentConstruct, {args = [], init = function() {}, end = function() {}, afterInit, ready} = {}, ele) {
    let readyFun = ready ? function(ctx) {
        ready(ctx);
        // console.log('ready', ctx);
        ctx.done(ele)
    } : function(ctx) {  
        ctx.done(ele)
    }

    let ret = ComponentConstruct.apply(null, args).init(init)
    return defc(ret, readyFun);
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

/**
 * 利用proxy 实现h3.Text 这样简单写法
 */
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


/**
 * 定义Component
 * @param {{setup: Function, ssrRender: Function}} option 
 * @returns 
 */
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
                    let _setCreatedCallback = null
                    function setCreated(v) {
                        _setCreatedCallback = v
                    }

                    let ele = setup({getCompCtx, setCreated, startWatch, args, isSsrMode})
                    let id = Nid()
                    if (isSsrMode) {
                        ele.setAttribute('ssr-id', id)
                    }
                    
                    ctx = createCommonCtx(function(childEle, option) {
                        // console.log(option);
                        // console.dir(ele.parentElement);
                        
                    if (_setCreatedCallback) {
                        _setCreatedCallback(ctx)
                    }
                        callback(childEle)
                        // currentRoot = childEle
                        if (option.afterRender) {
                            option.afterRender(childEle, option)
                        }
                    }, { ele });

                    // console.log(ctx)


                    if (isSsrMode) {
                        __ssr_setup(ele, args, {id, option, ctx, ssrRender, funcStr: callback?.toString() ?? ''})
                    }
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


function _button__render(ele, text) {
    _directive_text(ele, text)
}

function _button__action(ele, args) {
    let { action } = _utils_getObjectParam(args)
    _directive_action(ele, 'click', action)
}

export let Button = defComponent({
    name: 'Button',
    setup({getCtx, startWatch, args, isSsrMode}) {
        let { text } = _utils_getObjectParam(args)
        let ele = createElement('button')
        ele.classList.add('button')
        _button__render(ele, text)
        if (!isSsrMode) {
            _button__action(ele, args)
        }
        return ele
    },
    ssrRender(ele, args) {
        _button__action(ele, args)
    }
})

export let Column = defComponent({
    name: 'Column',
    setup({getCtx, startWatch, args, isSsrMode}) {
        let firstArg = _utils_getObjectParam(args);
        let ele = createElement('div');
        // console.log('firstArg', firstArg);
        if (firstArg && firstArg?.modifier) {
            firstArg.modifier(ele)
        }
        ele.classList.add('column')
        return ele
    },
})

function __ssr_setup(...args) {
    if (glo.__onSetup__) {
        glo.__onSetup__(...args)
    }
}

function _text__render(ele, text) {
    _directive_text(ele, text)
}

function _text__action(ele, args) {
    let text =_utils_getAnyParam(args, '')
    if (text.__v_isRef) {
        watch(text, () => {
            _text__render(ele, text)
        })
    }
}

export let Text = defComponent({
    name: 'Text',
    setup({getCtx, startWatch, args, isSsrMode}) {
        let text =_utils_getAnyParam(args, '')
        let ele = createElement('div')
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


export * from "./control"