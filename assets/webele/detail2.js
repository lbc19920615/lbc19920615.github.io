import { Button, Text, setGlobal,  hc2, defComponent, getcustomComponents, Column, BaseVmControl, injectControl, useControl, g } from "wle";

setGlobal(window.self);

class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail2 页面 ' + this.title
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        self.wRoute.back()
    }
    action2() {
        let countStore = getApp()?.globalConfig?.useCounterStore();
        countStore.increment()
    }
}

injectControl('vm')(DomCotnrol)


let Text2 = defComponent({
    setup({getCompCtx, startWatch, args}) {      

        
        let ele = document.createElement('div')
        ele.classList.add('text2')

        hc2(Column, {
            init(ele)  {
                hc2(Text, {args: ['text2 com start']}, ele)
                hc2(Text, {args: args}, ele)
                hc2(Text, {args: ['text2 com end']}, ele)
            },
            done(ctx) {
                ctx.width('100%')
            }
        }, ele)

    
        function render(ele) {
        }
    
        render(ele)
    
        startWatch(() => {
            render(ele)
        })

        return ele
    }
})


export default function({Page}) {
    let ele =  document.createElement('div');
    ele.classList.add('a-page');
    ele.classList.add('detail2-page');
    ele.classList.add('h-full')
    let vm = useControl('vm')


    let customComponents = getcustomComponents()
    // console.log(customComponents.get('PageWrapper'));
    g.defc(customComponents.get('PageWrapper')({title: 'detail2页'}).init(function (ele) {

        
        ; g.defc(Text2(vm.TextDetail).init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });

        hc2(Button, {args: [{text: 'pinia', action: vm.action2}], ready(ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
        }}, ele);

        hc2(Text, {args: ['router'], ready(ctx) {
            ctx.marginBottom(20)
        }}, ele);

        ; g.defc(Button({ text: 'back', action: vm.action }).init(function (ele) { 
        }), function (ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
            ctx.done(ele)
        });


    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onCreated(pageVm, {app} = {}) {
            },
            onReady() {
                console.log("detail2 ready");
            },
            onUnload() {
                console.log("detail2 结束");
            }
        }
    })
}