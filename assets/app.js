import { Provider, Subscriber } from "wlepre"

export function runApp(Pinia) {
    const { defineStore } = Pinia;

    console.log(Provider, Subscriber);
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
    

    globalThis.appConfig = {
        useCounterStore
    }
}

