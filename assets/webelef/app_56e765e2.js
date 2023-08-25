import { defComponent, Utils, hc2, Column, Text, injectControl, useControl, BaseWleElement, BaseVmControl } from 'wle';
import { getStore } from '/assets/webele/frame/storeMan.js';

import('/assets/webele/store/cart.js');
class ShopGoodItem extends BaseWleElement {
  constructor(option = {}) {
    super();
    const shadowRoot = this.attachShadow({
      mode: 'open'
    });
    shadowRoot.innerHTML = /*html*/`
        
<style>
:host {
    display: block;
}
</style> 
<div part="con">shop item ${option.index}
    <button id="buy">buy</button>
</div>
`;
  }
  connectedCallback() {
    let self = this;
    this.buyBtn = this.shadowRoot.getElementById('buy');
    this.buyBtn.addEventListener('click', function () {
      // console.log('sssssssssss');
      self._fireEvent('show-buy-item', {});
    });
  }
}
if (!customElements.get('shop-good-item')) {
  customElements.define('shop-good-item', ShopGoodItem);
}
defComponent({
  name: 'PageWrapper',
  setup({
    getCompCtx,
    startWatch,
    args
  }) {
    let wRoute = window.wRoute;
    let {
      title = ''
    } = Utils.getObjectParam(args);
    let ele = document.createElement('div');
    ele.classList.add('page-wrapper');
    ele.classList.add('a-page-wrapper');
    let PageNav1Ctx = hc2(Column, {
      init(ele) {
        let backCtx = hc2(Text, {
          args: ['back']
        }, ele);
        setTimeout(function () {
          backCtx.ele.onclick = function () {
            // console.log('sssssssss');
            wRoute?.back();
          };
        }, 30);
        hc2(Text, {
          args: [title],
          attrs: {
            class: 'text text-center'
          }
        }, ele);
        hc2(Text, {
          args: ['&nbsp;']
        }, ele);
      },
      attrs: {
        class: 'dis-grid page-wrapper__nav',
        style: 'grid-template-columns: var(--page-wrapper-nav-tpl)'
      }
    }, ele);
    PageNav1Ctx.ele.style.height = 'var(--page-wrapper-nav-h)';
    let Column1Ctx = hc2(Column, {
      init(ele) {},
      attrs: {
        class: 'page-wrapper__content'
      }
    }, ele);
    Column1Ctx.ele.style.height = 'var(--page-wrapper-content-h)';
    startWatch(() => {
    });
    return [ele, Column1Ctx.ele];
  }
});
window.openSubApp = function (routeName, params = {}) {
  function newPage() {
    window.createNewPageFrame(routeName, location.origin + '/assets/sub.html?v=' + Date.now() + '#/' + routeName);
  }
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      newPage();
    });
  } else {
    newPage();
  }
};

/**
 * 
 * @param {class} target 
 */
window.createControl = function createControl(target, name = target.name) {
  injectControl(name)(target);
  return useControl(name);
};
let BaseDir = '/assets/';
const routes = {
  ['']: params => {
    return import(BaseDir + 'webele/main.js?v=' + Date.now());
  },
  404: params => {
    return import(BaseDir + 'webele/404.js?v=' + Date.now());
  },
  shop: params => {
    return import(BaseDir + 'webele/shop.js?v=' + Date.now());
  },
  my: params => {
    return import(BaseDir + 'webele/my.js?v=' + Date.now());
  },
  detail: params => {
    return import(BaseDir + 'webele/detail.js?v=' + Date.now());
  },
  detail2: params => {
    return import(BaseDir + 'webele/detail2.js?v=' + Date.now());
  }
};
const APP_TABS = [['', {
  label: '首页'
}], ['shop', {
  label: '店铺'
}], ['my', {
  label: '我的'
}]];
class AppCotnrol extends BaseVmControl {
  title = '';
  get TextDetail() {
    return 'detail 页面 ' + this.title;
  }
  get navs() {
    return APP_TABS;
  }
  getNavIndex(name) {
    if (typeof name !== 'undefined') {
      return APP_TABS.findIndex(v => v[0] === name);
    }
  }
  setTitle(v) {
    this.title = v;
  }
  action(e) {
    globalThis.wRoute.back();
  }
}
injectControl('app')(AppCotnrol);
function runApp(Pinia, rooterRootEle) {
  const {
    defineStore
  } = Pinia;

  // console.log(Provider, Subscriber);
  let useCounterStore = defineStore('counter', {
    state: () => {
      return {
        count: 0
      };
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
      increment() {
        this.count++;
      }
    }
  });
  let countStore = useCounterStore();

  // console.log(rooterRootEle);

  VueDemi.watch(countStore, function (newVal, oldVal) {
    let swCon = rooterRootEle.querySelector('#swCon');
    // console.log('sssssssssssssssssssssssss',  swCon.children[0], newVal.count);
    if (swCon) {
      swCon.children[0].innerHTML = `
            <div>  ${'swCon' + newVal.count}</div>
              `;
    }
  });

  // let CartCtx = getStore('Cart')
  globalThis.appConfig = {
    useCounterStore,
    getStore(name) {
      return getStore(name).ins;
    }
  };
}
window.addEventListener('resizeend', function () {
  console.log('window resize end');
});

export { routes, runApp };
