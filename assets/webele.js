import { reactive, ref , watch  } from "vue"

export function Nid() {
    return crypto.randomUUID()
}

function appendCommon(ctx, ele) {
    let curRoot = ctx.curRoot
    if (Array.isArray(ctx.curRoot)) {
        curRoot = ctx.curRoot[1]
        // console.dir(curRoot);
    }
    if (curRoot.nodeType === 8) {
        curRoot.before(ele)
    }
    else {
        if (Array.isArray(ele)) {
            curRoot.append(...ele)
        } else {
            curRoot.append(ele)
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

function createCommonCtx(callback, { ele, id = Nid() } = {}) {
    let ctx = {
        id,
        curRoot: undefined,
        getEle() {
            return ele
        },
        done(parent) {
            ctx.curRoot = parent
            appendCommon(ctx, ele)
            callback(ele)
        }
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
            appendCommon(ctx, ele);
            ctx.build(max, list)
        },
        reload({ max, list } = {}) {
            while (ele[0].nextSibling !== ele[1]) {
                ele[0].nextSibling.remove()
            }
            //    console.log(max);
            ctx.build(max, list)
        },
        build(innerMax, innerList) {
            if (innerList) {
                for (let index = 0; index < innerList.length; index++) {
                    callback(ele, { index, item: innerList[index] })
                }
            }
            else {
                // console.log(ele);
                for (let index = 0; index < innerMax; index++) {
                    callback(ele, { index, item: index })
                }
            }
        }
    }
    return ctx
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

export function Column() {
    let ele = document.createElement('div')
    ele.classList.add('column')
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

export function Text(text = '') {
    let ctx
    let ele = document.createElement('div')
    ele.classList.add('text')

    function render(ele) {
        ele.textContent = text.__v_isRef ? text.value : text
    }

    render(ele)

    // console.log(text);
    if (text.__v_isRef) {
        watch(text, () => {
            // console.log('1111');
            render(ctx.getEle())
        })
    }
    return {
        init(callback) {
            // console.log(callback);
            return function () {
                ctx = createCommonCtx(callback, { ele })
                return ctx
            }
        }
    }
}

export function ForEach({ max = ref(0), list = null } = {}) {
    let startFlg = document.createComment('start')
    let endFlg = document.createComment('end')
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

let currentCondition = null
export function If(conditions) {
    // console.log(conditions);
    currentCondition = conditions
    let fragment = ForEach({ max: Number(conditions.value) })
    watch(conditions, (newVal, oldVal) => {
        // console.log('111', newVal, fragment);
        fragment.getCtx().reload({ max: Number(newVal) })
    })
    return fragment
}

export function Else() {
    // console.log(conditions);
    if (!currentCondition) {
        return;
    }
    let conditions = currentCondition
    let fragment = ForEach({ max: !Number(conditions.value) })
    watch(conditions, (newVal, oldVal) => {
        // console.log('111', newVal, fragment);
        fragment.getCtx().reload({ max: !Number(newVal) })
    })
    return fragment
}

function defc(buildCtx, runFun) {
    let ctx = buildCtx()
    runFun(ctx)
}

export let g = {
    defc
}
