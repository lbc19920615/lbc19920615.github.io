// import { reactive, ref , watch, computed  } from "vue"


const { reactive, computed  } = globalThis.VueDemi;

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


/**
 * 
 * @param {object} ret 
 * @param {class} cls 
 * @param {object} param2 
 */
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

/**
 * 
 * @param {class} target 
 * @returns 
 */
export function metaCls(target) {
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
    }
    return clsDef
}

export function injectControl(name = '') {
    return function(target) {
        let clsDef = metaCls(target)
        
        cachedDefs[name] = clsDef
    }
}

/**
 * 
 * @param {string | class} cls 
 * @returns 
 */
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