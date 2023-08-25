import { getStorageSync, setStorageSync } from "./store.js"

const storePrefix = "zy_";

let storeMap = new Map();
let partialMap = new Map();


export function getStoreMap() {
    return storeMap
}

function buildStore(name, cls) {
    const defineStore = window.Pinia.defineStore;
    let def = {
        state() { },
        getters: {},
        actions: {}
    }
    let stateKeys = Object.keys(cls.state ?? {})
    // console.log(cls.state);
    def.state = () => {
        return cls.state
    }
    def.getters = cls.getters ?? {}
    def.actions = cls.actions ?? {}
    let useStore = defineStore(name, def)
    let getterKeys = Object.keys(cls.getters ?? {})
    let actionKeys = Object.keys(cls.actions ?? {})
    return {
        useStore,
        stateKeys,
        getterKeys,
        actionKeys
    }
}

let currentNeedCacheKeys = []
export function useCache({ } = {}) {
    // console.log('ffff');
    return function (target, propertyKey, descriptor) {
        // console.log(target, propertyKey, descriptor);
        currentNeedCacheKeys.push(propertyKey)
    }
}

let currentSubStoreKeys = []
let currentSubStoreMap = {
}
export function SubStore(baseCls = "", defVal, { } = {}) {
    return function (target, propertyKey, descriptor) {
        // console.log(target, propertyKey, descriptor);

        currentSubStoreKeys.push(propertyKey)
        currentSubStoreMap[propertyKey] = { baseCls, defVal }
    }
}


function scanCls(ret, cls, cache = {}, { handleKey = null, needCacheKeys = [], subStoreKeys = [], isMainCls = false } = {}) {
    let obj = new cls()
    let keys = Reflect.ownKeys(obj)
    let parentKeys = []

    // if (Reflect.getPrototypeOf(cls)) {
    //   parentKeys = Reflect.ownKeys(Reflect.getPrototypeOf(cls))
    // }

    // if (isMainCls) {
    //   parentKeys = Object.keys(ret.state)
    // }

    keys = keys.filter(key => {
        if (subStoreKeys.includes(key)) {
            return false
        }
        return true
    })

    // console.log('keys', cls, keys);

    if (!handleKey) {
        handleKey = function (key) { return key }
    }
    // console.log('sssssssssssss', parentKeys);
    keys.forEach(key => {
        if (!parentKeys.includes(key)) {
            let parsedKey = handleKey(key)
            ret.state[parsedKey] = obj[key]
            if (needCacheKeys.includes(parsedKey) && typeof cache[parsedKey] !== 'undefined') {
                ret.state[parsedKey] = cache[parsedKey]
            }
        }
    })

    // console.log(ret.state);

    let p = Object.getOwnPropertyDescriptors(cls.prototype);
    Object.entries(p).forEach(([key, item]) => {
        if (key !== 'constructor') {
            let parsedKey = handleKey(key)
            if (typeof item.set === 'undefined' && item.get) {
                ret.getters[parsedKey] = function (state) {
                    return item.get.bind(state)()
                }
            }
            if (typeof item.value === 'function') {
                ret.actions[parsedKey] = item.value
            }
        }
    })

    // if (cls.name === 'cart_default') {
    //   console.dir(obj);
    // }
}

export function createStore(cls, name = '', currentNeedCacheKeys = [], { partials = [] } = {}) {
    let cache = getStorageSync(storePrefix + name) ?? {}
    let ret = {
        getters: {},
        actions: {},
        state: {}
    }

    if (Array.isArray(partials)) {
        partials.forEach((partial) => {
            let handleKey;
            let cachedCls;
            if (typeof partial === 'string') {
                cachedCls = partialMap.get(partial)
            }
            if (Array.isArray(partial)) {
                cachedCls = partialMap.get(partial[0])
                if (partial[1]) {
                    if (partial[1].handleKey) {
                        handleKey = partial[1].handleKey
                    }
                    if (partial[1].cachedKeys) {
                        currentNeedCacheKeys = currentNeedCacheKeys.concat(partial[1].cachedKeys)
                    }
                }
            }

            if (cachedCls) {
                scanCls(ret, cachedCls, cache, { handleKey: handleKey, needCacheKeys: currentNeedCacheKeys, subStoreKeys: currentSubStoreKeys })
            }
        })
    }

    // console.log(currentNeedCacheKeys);
    scanCls(ret, cls, cache, { needCacheKeys: currentNeedCacheKeys, subStoreKeys: currentSubStoreKeys, isMainCls: true })


    let res = buildStore(name, ret)
    // @ts-ignore
    res.__STORE_NAME__ = name
    res.__NeedCacheKeys__ = currentNeedCacheKeys
    res.currentSubStoreKeys = currentSubStoreKeys
    return res;
}

export function injectStore(name, { partials = [] } = {}) {
    // console.log('sssss', currentNeedCacheKeys);
    return function (target) {
        target.__IS_STORE__ = true
        target.__STORE_NAME__ = name
        target.__NeedCacheKeys__ = currentNeedCacheKeys


        let storeCache = createStore(target, name, currentNeedCacheKeys, { partials })
        storeCache.SUB_STORE = {}

        currentSubStoreKeys.forEach(key => {
            let def = currentSubStoreMap[key];

            let __STORE_NAME__ = `${name}_${key}`
            let target = def.defVal ?? class extends partialMap.get(def.baseCls) { };
            target.__STORE_NAME__ = __STORE_NAME__
            // console.log(__STORE_NAME__);
            storeMap.set(__STORE_NAME__, createStore(target, __STORE_NAME__, def?.needCacheKeys ?? [], {

            }))

            storeCache.SUB_STORE[__STORE_NAME__] = def
        })

        storeMap.set(name, storeCache)

        currentNeedCacheKeys = []
        currentSubStoreKeys = []
        console.log(target, storeMap);
    }
}

export function getStore(key) {
    let storeToRefs  = window.Pinia.storeToRefs;
    let ins = storeMap.get(key);
    // console.log(ins);
    if (ins) {
        let ret = ins.useStore()
        ret.__STORE_NAME__ = ins.__STORE_NAME__

        let subStoreMap = {}
        if (ins.SUB_STORE) {
            Object.keys(ins.SUB_STORE).forEach(subStoreKey => {
                subStoreMap[subStoreKey] = storeMap.get(subStoreKey)
            })
        }

        // console.log(subStoreMap);

        return {
            STORE_NAME: ins.__STORE_NAME__,
            ins: ret,
            getSubStore(subKey) {
                let def = subStoreMap[key + '_' + subKey];
                let subIns = def?.useStore()
                return {
                    ins: subIns,
                    refs: storeToRefs(subIns)
                }
            },
            refs: storeToRefs(ret)
        };
    }
}

export function cacheStoreRun(storeIns, runtime = function (proxyObj) { }) {
    let needKeys = []
    let proxyObj = new Proxy(storeIns, {
        set(target, name, value) {
            target[name] = value
            needKeys.push(name)
            return true
        }
    })

    runtime(proxyObj);

    setTimeout(() => {
        // console.log('1111', needKeys);
        cacheStore(storeIns, { needKeys })
    }, 30)
}

export function cacheStore(storeIns, { handleCache, key, needKeys = [] } = {}) {
    let ins = storeMap.get(key ?? storeIns.__STORE_NAME__);
    let keyName = storePrefix + storeIns.__STORE_NAME__
    let val = getStorageSync(keyName)
    let cache = typeof val != 'object' ? {} : val
    // console.log(cache);

    let cacheObj = {}
    let __NeedCacheKeys__ = (Array.isArray(needKeys) && needKeys.length > 0) ? needKeys : ins.__NeedCacheKeys__

    __NeedCacheKeys__.forEach(key => {
        let value = unref(storeIns[key])
        if (typeof value !== 'undefined') {
            cacheObj[key] = unref(storeIns[key])
        }
    })

    let newCache = { ...cache, ...cacheObj }
    if (handleCache) {
        handleCache(newCache)
    }

    setStorageSync(keyName, newCache)
}

export function clearStoreCache(storeIns, { handleCache, key } = {}) {
    let ins = storeMap.get(key ?? storeIns.__STORE_NAME__);
    let keyName = storePrefix + ins.__STORE_NAME__
    removeStorageSync(keyName)
}

export function partialStore(name) {
    return function (target) {
        partialMap.set(name, target)
    }
}


export let es6 = {
    partialStore(target, name = target.name) {
        partialStore(name)(target)
    },
    injectStore(target, option, name = target.name) {
        injectStore(name, option)(target)
    }
}