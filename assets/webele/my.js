import { Nid, Button, Text, defComponent, createEle, Utils, hc2, View, BaseVmControl, injectControl, useControl, g } from "wle";


class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'my 页面 ' + this.title
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

injectControl('my')(DomCotnrol);

let iframe1 = defComponent({
    name: 'iframe1',
    setup({ getCompCtx, startWatch, args }) {
        let argObj = Utils.getObjectParam(args);

        /**
         * @type {Element}
         */
        let ele = createEle('iframe', {
            attrs: {
                class: 'w-full',
                src: argObj.src,
                style: 'border: 0; display: block;'
            }
        });



        return ele;
    }
})


export default function ({ Page }) {
    let ele = document.createElement('div');
    ele.classList.add('my-page')
    let vm = useControl('my')


    g.defc(View().init(function (ele) {

        hc2(Text, { args: [vm.TextDetail] }, ele);

        hc2(Button, {
            // args: [{text: 'gen title', action: vm.action2}]
            objArg: {
                text: 'gen title', action: vm.action2
            },
            ready(ctx) {
                ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
            }
        }, ele);

        hc2(iframe1, {
            objArg: {
                src: location.origin + '/assets/three.html?v=' + Date.now()
            },
            attrs: {
                style: 'height: 80vh'
            }
        }, ele)

    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onCreated(pageVm, { app } = {}) {
                console.log("detail 加载完成", pageVm.$getParams());
                vm.setTitle(JSON.stringify(pageVm.$getParams()))
            },
            onRouteEnter() {
                console.log('路由onRouteEnter');
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}