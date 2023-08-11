import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, Nid, g } from "wle";

export default function({Page}) {
    let ele =  document.createElement('div');

    let vm = (function () {
        let data = reactive({
            title: ''
        })
        return {
            action(e) {
                globalThis.wRoute.back()
            },
            data
        }
    })();

    let TextDetail = computed(() => {
        return 'detail 页面 ' + vm.data.title
    })

    g.defc(Column().init(function (ele) {
        ; g.defc(Text(TextDetail).init(function (ele) {
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

                vm.data.title = JSON.stringify( pageVm.$getParams())
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}