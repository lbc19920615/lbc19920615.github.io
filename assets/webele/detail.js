import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, Nid, g } from "wle";

export default function({Page}) {
    let ele =  document.createElement('div');

    let vm = (function () {
        let data = reactive({
        })
        return {
            action(e) {
                globalThis.wRoute.back()
            },
            data
        }
    })();

    g.defc(Column().init(function (ele) {
        ; g.defc(Text('detail 页面').init(function (ele) {
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
            onLoad() {
                console.log("detail 加载完成");
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}