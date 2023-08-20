import { Provider, Subscriber } from "wlepre"
import { watch  } from "vue"

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

    watch(countStore, function(newVal, oldVal) {
        
        let swCon = rooterRootEle.querySelector('#swCon');
        // console.log('sssssssssssssssssssssssss',  swCon.children[0], newVal.count);
        swCon.children[0].innerHTML = `
        <div>  ${ 'swCon' + newVal.count}</div>
          `
    })

    
    // swCon.onclick = function() {
    //     countStore.increment()
    //     // console.log('swCon',countStore);
    // }
    

    globalThis.appConfig = {
        useCounterStore
    }
}

