import { Nid, Button, Text, ForEach, If,  hc2, defComponent, Column, BaseVmControl, injectControl, useControl, g } from "wle";


class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail 页面 ' + this.title
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        globalThis.wRoute.back()
    }
    action2() {
        this.title = Nid()
    }
}

injectControl('my')(DomCotnrol)


export default function({Page}) {
    let ele =  document.createElement('div');
    ele.classList.add('my-page')
    let vm = useControl('my')


    g.defc(Column().init(function (ele) {

        hc2(Text, {args: [vm.TextDetail]}, ele);

        hc2(Button, {args: [{text: 'gen title', action: vm.action2}], ready(ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
        }}, ele);

    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onCreated(pageVm, {app} = {}) {
                console.log("detail 加载完成", pageVm.$getParams());
                vm.setTitle(JSON.stringify( pageVm.$getParams()))
            },
            onReady({appConfig} = {}) {
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}