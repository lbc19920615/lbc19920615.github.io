import { reactive, computed, ref,  watch } from "vue"
import { Button, Text, ForEach, If, hc, defComponent, Column, BaseVmControl, injectControl, useControl, g } from "wle";


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
}

injectControl('vm')(DomCotnrol)



let Text2 = defComponent({
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('text2')

        hc(Column, {
            init(ele)  {
                hc(Text, {args: ['text2 com start']}, ele)
                hc(Text, {args: args}, ele)
                hc(Text, {args: ['text2 com end']}, ele)
            },
            done(ctx) {
                ctx.width('100%')
            }
        }, ele)

    
        function render(ele) {
            // console.log(args[0]);
            // let text = args[0]
            // ele.textContent = text.__v_isRef ? text.value : text
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
    let vm = useControl('vm')

    g.defc(Column().init(function (ele) {
        ; g.defc(Text2(vm.TextDetail).init(function (ele) {
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

                vm.setTitle(JSON.stringify( pageVm.$getParams()))
                
    // console.log( vm.TextDetail.value);
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}