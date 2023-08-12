import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, defComponent, Nid, hc, g } from "wle";


let FormItem = defComponent({
    afterRender(ele) {
        let div = document.createElement('div')
        // div.innerHTML = 'end form item'
        ele.appendChild(div)
    },
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('form-item')

        hc(Column, {
            init(ele)  {
                hc(Text, {args: [args[0]]}, ele)
                // console.log('init');
            },
            ready(ctx) {
                // console.log('ssssss');
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


const defaultFormSetting = {
    padding: '.35em .625em'
}

let TextArea1 = defComponent({
    setup({getCtx, startWatch, args}) {    
        let ele = document.createElement('elastic-textarea')
        ele.style.display = 'block'
        ele.style.border = '1px solid var(--borderColor,rgba(0,0,0,.2))'
        ele.style.padding = defaultFormSetting.padding
        ele.innerHTML = `<label>
        <textarea style="display: block; padding: 0; border: 0; width: 100%; outline: none; font-size: 14px" 
        name="textarea-1"></textarea>
    </label>`
        return ele
    }
})

let Input1 = defComponent({
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        // console.log(option);

        let ele = document.createElement('div')
        ele.style.setProperty("--input-addon-w", '24px');
        ele.style.border = '1px solid var(--borderColor,rgba(0,0,0,.2))'
        ele.style.display = 'flex'
        ele.style.alignItems = 'center'
        ele.style.padding = defaultFormSetting.padding
        let input = document.createElement('xy-input')
        input.style.flex = '1'
        input.style.lineHeight = 'normal'
        input.style.border = 'none'
        // console.dir(input)
        if (option.type) {
            input.setAttribute('type', option.type)
            input.input.type = option.type
        }
        input.oninput = function(e) {
            // console.log('111', e);
            detectChange(input)
        }

        ele.appendChild(input)
  
        let close = document.createElement('div')
        close.innerHTML = '&#x2715'
        close.style.setProperty("margin-left", 'calc(var(--input-addon-w) / 3)');
        close.style.overflow = 'hidden'
        close.style.setProperty("width", '0');
        close.onclick = function() {
            input.value = ''
            detectChange(input)
        }

        ele.appendChild(close)

        function detectChange(input) {
            if (input.value === '') {
                close.style.setProperty("width", '0');
            }
            else {
                close.style.setProperty("width", 'var(--input-addon-w)');
            }
        }
        return ele
    }
})

let Select1 = defComponent({
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = document.createElement('xy-select')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let optionEle = document.createElement('xy-option')
                optionEle.setAttribute('value', option.index + 1)
                optionEle.innerHTML = `option${option.index + 1}`
                option.appendChild(optionEle)
            }
        }, ele)

        return ele
    }
})


let CheckboxGroup = defComponent({
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = document.createElement('div')
        ele.classList.add('checkbox-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let checkbox = document.createElement('xy-checkbox')
                checkbox.setAttribute('name', 'lang')
                checkbox.innerHTML = Nid()
                option.appendChild(checkbox)
            }
        }, ele)

        return ele
    }
})


let RadioboxGroup = defComponent({
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = document.createElement('div')
        ele.classList.add('radio-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let radio = document.createElement('xy-radio')
                radio.setAttribute('name', 'lang')
                radio.innerHTML = Nid()
                option.appendChild(radio)
            }
        }, ele)

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
                ctx.done(ele)
            });

            ; g.defc(FormItem('select').init(function (ele) {
                ; g.defc(Select1().init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
            }), function (ctx) {
                ctx.done(ele)
            });

            
            ; g.defc(FormItem('textarea').init(function (ele) {
                ; g.defc(TextArea1().init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
            }), function (ctx) {
                ctx.done(ele)
            });


            ; g.defc(FormItem('input text').init(function (ele) {
                ; g.defc(Input1().init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
            }), function (ctx) {
                ctx.done(ele)
            });

            ; g.defc(FormItem('input number').init(function (ele) {
                ; g.defc(Input1({type: "number"}).init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
            }), function (ctx) {
                ctx.done(ele)
            });


            ; g.defc(FormItem('checkbox').init(function (ele) {
                ; g.defc(CheckboxGroup().init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
            }), function (ctx) {
                ctx.done(ele)
            });

            ; g.defc(FormItem('radio').init(function (ele) {
                ; g.defc(RadioboxGroup().init(function (ele) {
                }), function (ctx) {
                    ctx.done(ele)
                });
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