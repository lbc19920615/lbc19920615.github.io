import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, defComponent, Nid, hc, g } from "wle";


let FormItem = defComponent({
    name: 'FormItem',
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
    name: 'TextArea1',
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
    name: 'Input1',
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
    name: 'Select1',
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
    name: 'CheckboxGroup',
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
    name: 'RadioboxGroup',
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

class MyDialog extends customElements.get('xy-dialog') {
    constructor(option = {}) {
        let {type, title}= option
        super(option)
        this.setAttribute('title', title)
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        :host{
            position:fixed;
            display:flex;
            left:0;
            top:0;
            right:0;
            bottom:0;
            z-index:-1;
            background:rgba(0,0,0,.3);
            visibility:hidden;
            opacity:0;
            /*backdrop-filter: blur(3px);*/
            transition:.3s;
        }
        :host([open]){
            opacity:1;
            z-index:50;
            visibility:visible;
        }
        .dialog {
            display:flex;
            position:relative;
            min-width: 360px;
            margin:auto;
            box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
            box-sizing: border-box;
            max-width: calc(100vw - 20px);
            max-height: calc(100vh - 20px);
            border-radius: 3px;
            background-color: #fff;
            opacity:0;
            transform:scale(0.5);
            transition:.3s cubic-bezier(.645, .045, .355, 1);
        }
        .dialog-content{
            box-sizing: border-box;
            display:flex;
            width: 100%;
            padding:0 20px;
            flex:1;
            flex-direction:column;
        }
        :host([open]) .dialog{
            opacity:1;
            transform:scale(1);
        }
        .dialog-title {
            line-height: 30px;
            padding: 15px 30px 0 0;
            font-weight: 700;
            font-size: 14px;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        .dialog-body {
            flex: 1;
            overflow: auto;
            min-height: 50px;
            padding: 10px 0;
        }
        .dialog-footer {
            padding: 3px 0 20px 0;
            margin-top: -3px;
            text-align: right;
        }
        .btn-close{
            position:absolute;
            right:10px;
            top:10px;
            border:0;
        }
        .dialog-footer xy-button {
            margin-left:10px;
        }
        .dialog-type{
            display:none;
            margin: 15px -10px 0 20px;
            width:30px;
            height:30px;
            font-size:24px;
        }
        .dialog-type[name]{
            display:flex;
        }
        #btn-cancel{
            visibility:hidden;
        }
        :host(:not([type])) .dialog-type,
        :host([type="prompt"]) .dialog-type{
            display:none;
        }
        :host([type="confirm"]) #btn-cancel,
        :host([type="prompt"]) #btn-cancel{
            visibility:visible;
        }
        xy-input{
            width:100%;
        }
        :host(:not(:empty)) xy-input{
            margin-top:10px;
        }
        :host(:empty) .dialog-body{
            min-height:0;
        }
        #btn-submit {
            display: none;
        }
        </style>
        <div class="dialog">
            <xy-icon id="dialog-type" class="dialog-type"></xy-icon>
            <div class="dialog-content">
                <div class="dialog-title" id="title">${this.title}</div>
                <xy-button class="btn-close" id="btn-close" icon="close"></xy-button>
                <div class="dialog-body">
                    <slot></slot>
                    ${(type||this.type)==="prompt"?"<xy-input></xy-input>":""}
                </div>
                <div class="dialog-footer">
                    <xy-button id="btn-cancel">${this.canceltext}</xy-button>
                    <xy-button id="btn-submit" type="primary">${this.oktext}</xy-button>
                </div>
            </div>
        </div>
        `
    }

    get title() {
        return this.getAttribute('title') || 'dialog1';
    }
}
customElements.define('my-dialog', MyDialog)

let Dialog1 = defComponent({
    name: 'Dialog1',
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = new MyDialog({title: 'dialog1'})

        // console.dir(option);
        setTimeout(() => {
            ele.btnClose.addEventListener('click', function() {
                // console.log('onClose');
                if (option?.onClose) {
                    option.onClose()
                }
            })
            ele.addEventListener('submit',function(e){
                //
                if (option?.onClose) {
                    option.onClose()
                }
            })
   
        }, 0)
        // ele.setAttribute('portal','body')

        ele.setAttribute('open',true);
        return ele
    }
})


export default function({Page}) {
  
    let ele =  document.createElement('div');
    let vm = (function () {
        let data = reactive({
            some: "initStr",
            max: 1,
            list: [1, 2, 3],
            dialog: false
        })
        return {
            action(e) {
                data.some = Nid()
                console.log('action', data, e);
            },
            onLoad(e) {
                console.log('main 组件事件回调');
            },
            onDialogClose() {
                data.dialog = false
                console.log('onDialogClose');
            },
            action2() {
                globalThis.wRoute.push('detail', {
                    paramA: Nid()
                })
            },
            action3() {
                data.dialog = true
            },
            data
        }
    })();

    let vmData = vm.data;

    let vmDataList = vmData.list
    let vmDataDialog = computed(() => vmData.dialog)
    let vmDataMax = computed(() => vmData.max > 1)
    let vmStrSome = computed(() => vmData.some)


    setTimeout(() => {
        vmData.list[0] = 3;
        vmData.max = 2;
    }, 3000)

    globalThis.$vmData = vmData


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


            ; g.defc(Text('router测试').init(function (ele) {
            }), function (ctx) {
                ctx.done(ele)
            });
            ; g.defc(Button({ text: 'detail', action: vm.action2 }).init(function (ele) { })
            , function (ctx) {
                ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
                ctx.done(ele)
            });


            ; g.defc(Text('dialog测试').init(function (ele) {
            }), function (ctx) {
                ctx.done(ele)
            });
            ; g.defc(Button({ text: 'dialog', action: vm.action3 }).init(function (ele) { })
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
        
        ; g.defc(If(vmDataDialog).init(function (ele) {
            ; g.defc(Dialog1({onClose: vm.onDialogClose}).init(function (ele) {
                
                ; g.defc(FormItem('input text').init(function (ele) {
                    ; g.defc(Input1().init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });

            }), function (ctx) {
                ctx.done(ele)
            });
        }), function (ctx) {
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