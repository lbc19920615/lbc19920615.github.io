import { Provider, Subscriber } from "wlepre"
import { Nid, g, hc2, ForEach, Column, Text, BaseVmControl, injectControl, useControl, getAllComments, getcustomComponents } from "wle";

window.testSubApp = function() {
    window.createNewPageFrame(location.origin + '/assets/sub.html#/detail')
}

let BaseDir = '/assets/'
export const routes = {
    ['']: (params) => {
        return import(BaseDir + 'webele/main.js?v=' + Date.now())
    },
    404: (params) => {
        return import(BaseDir + 'webele/404.js?v=' + Date.now())
    },
    shop: (params) => {
        return import(BaseDir + 'webele/shop.js?v=' + Date.now())
    },
    my: (params) => {
        return import(BaseDir + 'webele/my.js?v=' + Date.now())
    },
    detail: (params) => {
        return import(BaseDir + 'webele/detail.js?v=' + Date.now())
    },
};

const APP_TABS = [
    ['', {
        label: '首页'
    }],
    ['shop', {
        label: '店铺'
    }],
    ['my', {
        label: '我的'
    }],
    
]

class AppCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail 页面 ' + this.title
    }
    get navs() {
        return APP_TABS
    }
    getNavIndex(name) {
        if (typeof name !== 'undefined') {
            return APP_TABS.findIndex(v => v[0] === name)
        }
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        globalThis.wRoute.back()
    }
}

injectControl('app')(AppCotnrol);

export function runApp(Pinia, rooterRootEle) {
    const { defineStore } = Pinia;

    // console.log(Provider, Subscriber);
    let useCounterStore = defineStore('counter', {
        state: () => {
            return { count: 0 }
        },
        // could also be defined as
        // state: () => ({ count: 0 })
        actions: {
            increment() {
                this.count++
            },
        },
    });

    let countStore = useCounterStore();

    // console.log(rooterRootEle);

    VueDemi.watch(countStore, function(newVal, oldVal) {
        
        let swCon = rooterRootEle.querySelector('#swCon');
        // console.log('sssssssssssssssssssssssss',  swCon.children[0], newVal.count);
        if (swCon) {
            swCon.children[0].innerHTML = `
            <div>  ${ 'swCon' + newVal.count}</div>
              `
        }
    })

    globalThis.appConfig = {
        useCounterStore
    }
}

