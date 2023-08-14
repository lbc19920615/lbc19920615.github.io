import { reactive, watch, ref, computed } from 'vue';

let glo = globalThis;
let dom = glo.document || glo.customDoucment;
let isSsrMode = Boolean(glo.__ssrMode__);
function setGlobal(v) {
  glo = v;
  dom = glo.document || glo.customDoucment;
  isSsrMode = Boolean(glo.__ssrMode__);
  console.log('isSsrMode', isSsrMode);
}
function Nid() {
  if (glo.__Nid__) {
    return glo.__Nid__();
  }
  return glo.crypto.randomUUID();
}
function __filterNone() {
  return NodeFilter.FILTER_ACCEPT;
}
function getAllComments(rootElem) {
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
  return dom.createComment(...args);
}
function createElement(...args) {
  let d = dom.createElement(...args);
  // if (isSsrMode) {
  //     d.setAttribute("ssr-id", Nid())
  // }
  return d;
}
let customComponents = new Map();
let ssrComponents = new Map();
let jsonMap = {};
let getscripts = function (domRuntime = globalThis.document) {
  console.log(ssrComponents);
  return {
    run(jsonMap, dataMap) {
      // console.log(scripts.toString());

      Object.keys(jsonMap).forEach(key => {
        let value = jsonMap[key];
        // console.log(value);

        let ComponentFunName = value.ssrRender[0];
        if (ssrComponents.has(ComponentFunName)) {
          // console.log(ssrComponents.get(ComponentFunName));
          let fun = ssrComponents.get(ComponentFunName);
          if (fun) {
            let ele = domRuntime.querySelector(`[ssr-id="${key}"]`);
            if (ele) {
              console.log(ele, key);
            }
            fun(ele, dataMap[key] ?? []);
          }
        }
      });
    }
  };
};
function _utils_getObjectParam(args = [], index = 0) {
  if (!Array.isArray(args)) {
    return {};
  }
  return args[index] ?? {};
}
function _utils_getAnyParam(args = [], defaultVal, index = 0) {
  return args[index] ?? defaultVal;
}
function _directive_text(ele, text = '') {
  ele.textContent = text?.__v_isRef ? text.value : text;
}
function _directive_action(ele, name, fun) {
  if (name) {
    ele['on' + name] = function (e) {
      fun(e);
    };
  }
}
function appendCommon(ctx, ele) {
  let curParent = ctx.parent;
  if (Array.isArray(ctx.parent)) {
    curParent = ctx.parent[1];
    // console.dir(curParent);
  }

  if (curParent.nodeType === 8) {
    curParent.before(ele);
  } else {
    if (Array.isArray(ele)) {
      curParent.append(...ele);
    } else {
      curParent.append(ele);
    }
  }
}
let cssHelper = {
  toLength(val) {
    if (Number(val) == val) {
      return val + 'px';
    }
    return val;
  },
  toColor(val) {
    if (typeof val !== 'string') {
      // console.log(val.toString(16).padStart(6, '0'));
      return '#' + val.toString(16).padStart(6, '0');
    }
    return val;
  }
};
function createCommonCtx(callback, {
  ele,
  id = Nid()
} = {}) {
  let ctx = {
    id,
    curRoot: undefined,
    getEle() {
      return ele;
    },
    done(parent) {
      ctx.curRoot = parent;
      ctx.parent = parent;
      appendCommon(ctx, ele);
      ctx.ele = ele;
      callback(ele, {
        parent
      });
    },
    afterFuns: []
  };
  let colorNames = ['backgroundColor'];
  let borderNames = ['border', 'fontColor'];
  let sizeNames = ['width', 'height', 'fontSize'];
  let cssFunNames = [...colorNames, ...borderNames, ...sizeNames];
  let eventNames = ['onLoad'];
  let proxy = new Proxy(ctx, {
    get(target, key, receiver) {
      // console.log(target, key, receiver);
      if (ctx[key]) {
        return ctx[key];
      } else if (cssFunNames.includes(key)) {
        return function (...args) {
          // console.log('ele', args[0].toString(16));
          let val = args[0];
          if (colorNames.includes(key)) {
            val = cssHelper.toColor(val);
          }
          if (sizeNames.includes(key)) {
            val = cssHelper.toLength(val);
          }
          if (borderNames.includes(key)) {
            let option = {
              width: '0px',
              style: 'solid',
              ...val
            };
            let width = cssHelper.toLength(option.width);
            let str = `${width} ${option.style}`;
            // console.log(width);
            val = str;
          }
          ele.style[key] = val;
          return proxy;
        };
        // console.log('sssss');
      } else if (eventNames.includes(key)) {
        return function (...args) {
          // console.log(args[0]);
          let callback = args[0];
          callback({});
          return proxy;
        };
      } else if (['hookEnd'].includes(key)) {
        return function (...args) {
          if (args[0]) {
            ctx.afterFuns.push(args[0]);
          }
          // console.log(args, ele, ctx);
          return proxy;
        };
      }
    }
  });
  return proxy;
}
function createForeachCtx(callback, {
  ele,
  max = 0,
  list,
  id = Nid()
} = {}) {
  let ctx = {
    id,
    curRoot: undefined,
    done(parent) {
      ctx.curRoot = parent;
      ctx.parent = parent;
      appendCommon(ctx, ele);
      ctx.ele = ele;
      ctx.build(max, list);
    },
    reload({
      max,
      list
    } = {}) {
      while (ele[0].nextSibling !== ele[1]) {
        if (ele[0].nextSibling?.remove) {
          ele[0].nextSibling.remove();
        } else {
          // console.dir(ele[0].nextSibling)
          if (ele[0].nextSibling.parentElement) {
            ele[0].nextSibling.parentElement.removeChild(ele[0].nextSibling);
          } else {
            throw new Error('not have remove');
          }
        }
      }
      //    console.log(max);
      ctx.build(max, list);
    },
    build(innerMax, innerList) {
      function appendChild(childEle) {
        appendCommon(ctx, childEle);
      }
      if (innerList) {
        for (let index = 0; index < innerList.length; index++) {
          callback(ele, {
            appendChild,
            index,
            item: innerList[index]
          });
        }
      } else {
        // console.log(ele);
        for (let index = 0; index < innerMax; index++) {
          callback(ele, {
            appendChild,
            index,
            item: index
          });
        }
      }
    }
  };
  return ctx;
}
function ForEach({
  max = ref(0),
  list = null
} = {}, {
  label = ''
} = {}) {
  let startFlg = createComment('start' + label);
  let endFlg = createComment('end' + label);
  let ele = [startFlg, endFlg];

  // let computeMax = computed(() => max)

  let obj = reactive({
    max,
    list
  });

  // console.log(list);
  watch(max, (newVal, oldVal) => {
    // console.log('list', newVal, oldVal);
    ctx.reload({
      max: obj.max,
      list: obj.list
    });
  }, {
    deep: true
  });
  watch(list, (newVal, oldVal) => {
    // console.log('list', newVal, oldVal);
    ctx.reload({
      max: obj.max,
      list: obj.list
    });
  }, {
    deep: true
  });
  let ctx;
  return {
    getCtx() {
      return ctx;
    },
    init(callback) {
      // console.log(callback);
      return function () {
        // console.log(obj);
        ctx = createForeachCtx(callback, {
          ele,
          max: obj.max,
          list: obj.list
        });
        return ctx;
      };
    }
  };
}
customComponents.set('ForEach', ForEach);
let currentCondition = null;
function If(conditions) {
  // console.log(conditions);
  currentCondition = conditions;
  let fragment = ForEach({
    max: Number(conditions.value)
  }, {
    label: ' if'
  });
  watch(conditions, (newVal, oldVal) => {
    // console.log('111', newVal, fragment);
    fragment.getCtx().reload({
      max: Number(newVal)
    });
  });
  return fragment;
}
customComponents.set('If', If);
function Else() {
  // console.log(conditions);
  if (!currentCondition) {
    return;
  }
  let conditions = currentCondition;
  let fragment = ForEach({
    max: !Number(conditions.value)
  }, {
    label: ' else'
  });
  watch(conditions, (newVal, oldVal) => {
    // console.log('111', newVal, fragment);
    fragment.getCtx().reload({
      max: !Number(newVal)
    });
  });
  return fragment;
}
customComponents.set('Else', Else);
function defc(buildCtx, runFun) {
  let fun = buildCtx;
  // if (Reflect.getPrototypeOf(buildCtx).toString() === '[object Promise]') {
  //     fun = await buildCtx
  // }
  // console.log(fun);

  let ctx = fun();
  if (isSsrMode) {
    if (glo.__onDefc__) {
      glo.__onDefc__(ctx, jsonMap);
    }
  }
  runFun(ctx);
  return ctx;
}
function ssrc(buildCtx, runFun) {
  let fun = buildCtx;
  let ctx = fun();
  // runFun(ctx)
  runFun(ctx);
  return ctx;
}
let g = {
  defc,
  ssrc
};
function hc(ComponentConstruct, {
  args = [],
  init = function () {},
  end = function () {},
  afterInit,
  ready
} = {}, ele) {
  let readyFun = ready ? function (ctx) {
    ready(ctx);
    ctx.done(ele);
  } : function (ctx) {
    ctx.done(ele);
  };
  return defc(ComponentConstruct.apply(null, args).init(init), readyFun);
}
let h3 = new Proxy(customComponents, {
  get(target, key) {
    if (target.has(key)) {
      return function (ele, ...args) {
        // console.dir(ele)
        return function (init) {
          return hc(target.get(key), {
            args: args.slice(0, args.length),
            init
          }, ele);
        };
      };
    }
  }
});
glo.h3 = h3;
function defComponent(option = {}) {
  let {
    setup,
    ssrRender
  } = option;
  let ctx = null;
  function getCompCtx() {
    return ctx;
  }
  let fun = function (...args) {
    // console.log(args);

    function startWatch(onChange) {
      watch(args, (newVal, oldVal) => {
        if (onChange) {
          onChange(newVal, oldVal);
        }
      }, {
        deep: true
      });
    }
    return {
      init(callback) {
        // console.log(callback);
        return function () {
          let ele = setup({
            getCompCtx,
            startWatch,
            args,
            isSsrMode
          });
          let id = Nid();
          if (isSsrMode) {
            ele.setAttribute('ssr-id', id);
            if (ssrRender) {
              if (!jsonMap[id]) {
                jsonMap[id] = {
                  ssrRender: [option.name, ['ssrRender']]
                };
              }
            }
          }
          ctx = createCommonCtx(function (childEle, option) {
            // console.log(option);
            // console.dir(ele.parentElement);
            callback(childEle);
            // currentRoot = childEle
            if (option.afterRender) {
              option.afterRender(childEle, option);
            }
          }, {
            ele
          });
          if (isSsrMode) {
            __ssr_setup(ele, args, {
              id,
              option,
              ctx,
              funcStr: callback?.toString() ?? ''
            });
          }
          // console.log(ctx);
          return ctx;
        };
      }
    };
  };
  if (option?.name) {
    customComponents.set(option.name, fun);
    ssrComponents.set(option.name, ssrRender);
  }

  // console.log(customComponents);
  return fun;
}
function _button__render(ele, text) {
  _directive_text(ele, text);
}
function _button__action(ele, args) {
  let {
    action
  } = _utils_getObjectParam(args);
  _directive_action(ele, 'click', action);
}
let Button = defComponent({
  name: 'Button',
  setup({
    getCtx,
    startWatch,
    args,
    isSsrMode
  }) {
    let {
      text
    } = _utils_getObjectParam(args);
    let ele = createElement('button');
    ele.classList.add('button');
    _button__render(ele, text);
    if (!isSsrMode) {
      _button__action(ele, args);
    }
    return ele;
  },
  ssrRender(ele, args) {
    _button__action(ele, args);
  }
});
let Column = defComponent({
  name: 'Column',
  setup() {
    let ele = createElement('div');
    ele.classList.add('column');
    return ele;
  }
});
function __ssr_setup(...args) {
  if (glo.__onSetup__) {
    glo.__onSetup__(...args);
  }
}
function _text__render(ele, text) {
  _directive_text(ele, text);
}
function _text__action(ele, args) {
  let text = _utils_getAnyParam(args, '');
  if (text.__v_isRef) {
    watch(text, () => {
      _text__render(ele, text);
    });
  }
}
let Text = defComponent({
  name: 'Text',
  setup({
    getCtx,
    startWatch,
    args,
    isSsrMode
  }) {
    let text = _utils_getAnyParam(args, '');
    let ele = createElement('div');
    ele.classList.add('text');
    _text__render(ele, text);
    if (!isSsrMode) {
      _text__action(ele, args);
    }
    return ele;
  },
  ssrRender(ele, args) {
    _text__action(ele, args);
  }
});
let symbol = Symbol('BaseControl');
class BaseVmControl {
  static [symbol] = 1;
  constructor() {
    this[symbol] = 1;
  }
}
let cachedDefs = {};

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
function __vm_scanCls(ret, cls, {
  handleKey = null
} = {}) {
  let obj = new cls();
  let keys = Reflect.ownKeys(obj);
  let parentKeys = [];

  // console.log('keys', keys);

  if (!handleKey) {
    handleKey = function (key) {
      return key;
    };
  }
  // console.log('sssssssssssss', parentKeys);
  keys.forEach(key => {
    if (!parentKeys.includes(key)) {
      let parsedKey = handleKey(key);
      ret.state[parsedKey] = obj[key];
    }
  });

  // console.log(ret.state);

  let p = Object.getOwnPropertyDescriptors(cls.prototype);
  Object.entries(p).forEach(([key, item]) => {
    if (key !== 'constructor') {
      let parsedKey = handleKey(key);
      if (typeof item.set === 'undefined' && item.get) {
        ret.getters[parsedKey] = item.get;
      }
      if (typeof item.value === 'function') {
        ret.actions[parsedKey] = item.value;
      }
    }
  });
}

/**
 * 
 * @param {class} target 
 * @returns 
 */
function metaCls(target) {
  let clsDef = {
    state: {},
    getters: {},
    actions: {}
  };
  let extendCls = Reflect.getPrototypeOf(target);
  // console.log(extendCls);

  if (isConstructor(extendCls)) {
    let symbols = Object.getOwnPropertySymbols(new extendCls());
    if (symbols.includes(symbol)) {
      // console.log('good', Object.getOwnPropertySymbols(new extendCls()));
      __vm_scanCls(clsDef, extendCls);
    }
  }
  // console.log(Object.getOwnPropertySymbols(Reflect.getPrototypeOf(extendCls)))

  __vm_scanCls(clsDef, target);
  if (!target.__def__) {
    target.__def__ = clsDef;
  }
  return clsDef;
}
function injectControl(name = '') {
  return function (target) {
    let clsDef = metaCls(target);
    cachedDefs[name] = clsDef;
  };
}

/**
 * 
 * @param {string | class} cls 
 * @returns 
 */
function useControl(cls) {
  let clsDef = null;
  if (typeof cls === 'string') {
    clsDef = cachedDefs[cls];
  } else {
    clsDef = cls.__def__;
  }
  // console.log(clsDef);
  if (clsDef) {
    let def = clsDef;
    let obj = reactive(def.state);
    let getterKeys = [];
    Object.keys(def.getters).forEach(key => {
      // console.log(def.getters[key].bind(obj));
      getterKeys.push(key);
      obj[key] = computed(def.getters[key].bind(obj));
    });
    Object.keys(def.actions).forEach(key => {
      obj[key] = def.actions[key].bind(obj);
    });

    // console.log(obj);
    return new Proxy(obj, {
      get(target, key) {
        if (getterKeys.includes(key)) {
          return computed(() => {
            return obj[key];
          });
        } else {
          return obj[key];
        }
      }
    });
  }
  return null;
}

export { BaseVmControl, Button, Column, Else, ForEach, If, Nid, Text, createCommonCtx, defComponent, g, getAllComments, getscripts, h3, hc, injectControl, metaCls, setGlobal, useControl };
