import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, defComponent, Nid, g } from "wle";





let TextArea1 = defComponent({
    setup({getCtx, startWatch, args}) {    
        let ele = document.createElement('elastic-textarea')
        ele.style.display = 'block'
        ele.style.border = '1px solid'
        ele.innerHTML = `<label>
        <textarea style="display: block; padding: 0; border: 0; width: 100%; outline: none;" name="textarea-1"></textarea>
    </label>`
        return ele
    }
})

export default function({Page}) {
  
    let ele =  document.createElement('div');
    let vm = (function () {
        let data = reactive({
            some: "initStr",
            max: 1,
            list: [1, 2, 3]
        })
        return {
            action(e) {
                data.some = Nid()
                console.log('action', data, e);
            },
            onLoad(e) {
                console.log('main 组件事件回调');
            },
            action2() {
                globalThis.wRoute.push('detail', {
                    paramA: Nid()
                })
            },
            data
        }
    })();

    let vmData = vm.data;

    let vmDataList = vmData.list
    let vmDataMax = computed(() => vmData.max > 1)
    let vmStrSome = computed(() => vmData.some)


    setTimeout(() => {
        vmData.list[0] = 3;
        vmData.max = 2;
    }, 3000)


    g.defc(Column().init(function (ele) {
        ; g.defc(Text(vmStrSome).init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });
        g.defc(Column({ space: 5 }).init(function (ele) {

            ; g.defc(Button({ text: 'button', action: vm.action }).init(function (ele) { })
                , function (ctx) {
                    ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
                    ctx.done(ele)
                });

            ; g.defc(Text('for测试').init(function (ele) {
            }), function (ctx) {
                ctx.done(ele)
            });


            ; g.defc(ForEach({ list: vmDataList }).init(function (ele, option) {
                g.defc(Text(option.item).init(function (ele) {

                }), function (ctx) {
                    ctx.width('100%').height(30).backgroundColor(0x00FFFF);
                    ctx.done(ele)
                })
            }), function (ctx) {
                ctx.done(ele)
            });


            ; g.defc(Text('if测试').init(function (ele) {
            }), function (ctx) {
                // ctx.fontSize(9).fontColor(0xCCCCCC).width('90
                ctx.done(ele)
            });

            ; g.defc(If(vmDataMax).init(function (ele) {
                g.defc(Text('if ok').init(function (ele) {

                }), function (ctx) { ctx.done(ele) })
            }), function (ctx) {
                ctx.done(ele)
            });

            ; g.defc(Else().init(function (ele) {
                g.defc(Text('else ok').init(function (ele) {

                }), function (ctx) { ctx.done(ele) })
            }), function (ctx) {
                ctx.done(ele)
            });


            ; g.defc(Button({ text: 'detail', action: vm.action2 }).init(function (ele) { })
            , function (ctx) {
                ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
                ctx.done(ele)
            });

            
            ; g.defc(Text('form测试').init(function (ele) {
            }), function (ctx) {
                // ctx.fontSize(9).fontColor(0xCCCCCC).width('90
                ctx.done(ele)
            });


            ; g.defc(TextArea1().init(function (ele) {
            }), function (ctx) {
                ctx.done(ele)
            });

        }), function (ctx) {
            ctx.onLoad((e) => { vm.onLoad(e) }).border({ width: 1 });
            ctx.done(ele)
        });

    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onLoad() {
                console.log("main 加载完成");
            }
        }
    })
}