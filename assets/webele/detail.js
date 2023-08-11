import { reactive, computed, ref,  } from "vue"
import { Button, Text, ForEach, If, Else, Column, BaseVmControl, injectControl, useControl, g } from "wle";





class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return computed(() =>'detail 页面 ' + this.title)
    }
    setTitle(v) {
        // console.log('setTitle', v);
        this.title = v
    }
    action(e) {
        globalThis.wRoute.back()
    }
}

injectControl('vm')(DomCotnrol)


export default function({Page}) {
    let ele =  document.createElement('div');
    let vm = useControl('vm')

    g.defc(Column().init(function (ele) {
        ; g.defc(Text(vm.TextDetail).init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });

        ; g.defc(Button({ text: 'back', action: vm.action }).init(function (ele) { 
        }), function (ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
            ctx.done(ele)
        });
    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onLoad(pageVm) {
                console.log("detail 加载完成", pageVm.$getParams());

                // vm.data.title = JSON.stringify( pageVm.$getParams())

                vm.setTitle(JSON.stringify( pageVm.$getParams()))
                
    // console.log(vm.TextDetail);
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}