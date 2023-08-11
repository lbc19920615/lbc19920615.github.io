import { reactive, computed, ref,  watch } from "vue"
import { Button, Text, ForEach, If, createCommonCtx, Column, BaseVmControl, injectControl, useControl, g } from "wle";





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

function defComponent(option = {}) {
    let {setup} = option

    let ctx = null;
    function getCtx() {
        return ctx
    }

    let stopWatch

    return function(...args) {
        // console.log(args);
        function startWatch(onChange) {
            stopWatch = watch(args, (newVal, oldVal) => {
                if (onChange) {
                    onChange(newVal, oldVal)
                }
            }, {
                deep: true
            })
        }

        return {
            init(callback) {
                // console.log(callback);
                return function () {
                    let ele = setup({getCtx, startWatch, args})
                    ctx = createCommonCtx(callback, { ele })
                    // console.log(ctx);
                    return ctx
                }
            }
        }
    }
}

let Text2 = defComponent({
    setup({getCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('text')
    
        function render(ele) {
            // console.log(args[0]);
            let text = args[0]
            ele.textContent = text.__v_isRef ? text.value : text
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