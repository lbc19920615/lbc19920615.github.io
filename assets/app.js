import { Provider, Subscriber } from "wlepre"
import { Nid, g, hc2, ForEach, Column, Text, BaseVmControl, injectControl, useControl, getAllComments, getcustomComponents } from "wle";


class AppCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail 页面 ' + this.title
    }
    get navs() {
        return [
            ['', {
                label: '首页'
            }],
            ['my', {
                label: '我的'
            }],
        ]
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

