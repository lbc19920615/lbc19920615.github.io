import { reactive, computed  } from "vue"
import { Nid, g, hc2, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If,  Else, Column, defComponent, hc } from "wle";
import {parseArkUI} from "/assets/parser.js?v=0.0.3";

globalThis.Modifier = Modifier;

function getParentComp(parent, {cls = ''} = {}) {
    let ret = parent;
    if (!ret.classList.contains(cls)) {
        ret = ret?.closest('.' + cls)
    }
    return ret
}

let Form1 = defComponent({
    name: "Form1",
    setup({setCreated, startWatch, args}) {  
        let config = Utils.getObjectParam(args, 0)
        let innerModel = {}

        let ele = document.createElement('div');
        ele.classList.add('form');
        ele.setAttribute('name', config?.name)
        
        ele.$formCtx = {
            setModel(name, val) {
                // console.log('name', val);
                innerModel[name] = val
            },
            getModel() {
                return innerModel
            }
        }

        return ele
    }
})

let FormItem = defComponent({
    name: 'FormItem',
    afterRender(ele) {
        let div = document.createElement('div')
        // div.innerHTML = 'end form item'
        ele.appendChild(div)
    },
    setup({setCreated, startWatch, args}) {         
        let error_cls = 'form-item__error'

        let ele = document.createElement('div')
        ele.classList.add('form-item');

        let name = args[0];
        ele.$formItemCtx = {
            form: null,
            name: name,
            setValid(isValid = true) {
                console.log('setValid', isValid);
                // let cls = isValid ? 'form-item__sucess' : 'form-item__error'
                if (isValid) {
                    ele.classList.remove(error_cls)
                } else {
                    ele.classList.add(error_cls)
                }
            },
            callOnChange(newVal, target) {
                // console.log('e', e, target);
                ele.$formItemCtx.setModel(name, newVal)
            },
            setModel(name, val) {
                ele.$formItemCtx.form?.$formCtx?.setModel(name, val)
            }
        }

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

        setCreated(function(ctx) {
            let parent = ctx?.parent;
            let form = getParentComp(parent, {cls: 'form'})
            ele.$formItemCtx.form = form
        })
    
        startWatch(() => {
            render(ele)
        })

        return ele
    }
})


const defaultFormSetting = {
    padding: '.35em .625em'
}

function __getParentFormItemCtx(ctx) {
    let formItem = getParentComp(ctx?.parent, {cls: 'form-item'})
    // console.log(formItem);
    return formItem?.$formItemCtx
}

function __forItem_action({ele, ctx}) {
    // console.log('sssssssssssssss', ctx?.parent);
    
    let formCtx = __getParentFormItemCtx(ctx);
    ele.onchange = function(e) {
        // console.log(e);
        let val = e?.detail ? e.detail?.value : e.target?.value 
        formCtx.callOnChange(val, ele)
        // console.log('ele', e, ctx);
    }
}

let TextArea1 = defComponent({
    name: 'TextArea1',
    setup({setCreated, startWatch, args}) {    
        let text = args[0] ?? ''
        let ele = document.createElement('elastic-textarea')
        ele.style.display = 'block'
        ele.style.border = '1px solid var(--borderColor,rgba(0,0,0,.2))'
        ele.style.padding = defaultFormSetting.padding
        ele.innerHTML = `<label>
        <textarea style="display: block; padding: 0; border: 0; width: 100%; outline: none; font-size: 14px" 
        name="textarea-1">${text}</textarea>
    </label>`
    setCreated(function(ctx) {
        __forItem_action({ele: ele.children[0].children[0],  ctx})
    });

        return ele
    }
})



let Input1 = defComponent({
    name: 'Input1',
    setup({setCreated, startWatch, args}) {    
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

        setCreated(function(ctx) {
            __forItem_action({ele: input,  ctx})
        });
        return ele
    }
})

let Select1 = defComponent({
    name: 'Select1',
    setup({setCreated, startWatch, args}) {
        let option = args[0] ?? {}
        let ele = document.createElement('xy-select')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let optionEle = document.createElement('xy-option')
                optionEle.setAttribute('value', option.index + 1)
                optionEle.innerHTML = `option${option.index + 1}`
                option.appendChild(optionEle)
            }
        }, ele);

        setCreated(function(ctx) {
            __forItem_action({ele,  ctx})
        });

        return ele
    }
})


let CheckboxGroup = defComponent({
    name: 'CheckboxGroup',
    setup({setCreated, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = document.createElement('xy-checkbox-group')
        ele.classList.add('checkbox-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let checkbox = document.createElement('xy-checkbox')
                checkbox.setAttribute('name', 'lang')
                checkbox.innerHTML = Nid()
                option.appendChild(checkbox)
            }
        }, ele);

        setCreated(function(ctx) {
            __forItem_action({ele,  ctx})
        });


        return ele
    }
})


let RadioboxGroup = defComponent({
    name: 'RadioboxGroup',
    setup({setCreated, startWatch, args}) {    
        let option = args[0] ?? {}
        let ele = document.createElement('xy-radio-group')
        ele.classList.add('radio-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let radio = document.createElement('xy-radio')
                radio.setAttribute('name', 'lang')
                radio.innerHTML = Nid()
                option.appendChild(radio)
            }
        }, ele);

        setCreated(function(ctx) {
            __forItem_action({ele,  ctx})
        });


        return ele
    }
})

let DatePicker1 = defComponent({
    name: 'DatePicker1',
    setup({setCreated, startWatch, args}) {    
        // let option = args[0] ?? {}
        let ele = document.createElement('my-date-picker')
        ele.setAttribute('defaultvalue', '')
        ele.classList.add('date-picker')

        setCreated(function(ctx) {
            __forItem_action({ele,  ctx})
        });

        return ele
    }
})



let Dialog1 = defComponent({
    name: 'Dialog1',
    setup({setCreated, startWatch, args}) {    
        let option = args[0] ?? {}
        let MyDialog = customElements.get('my-dialog')
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
            submitForm() {
                let formName = 'form1'
                console.log(formName, document.querySelector(`.form[name=a{formName}]`)?.$formCtx.getModel())
                // alert('console.log查看')
            },
            getFun() {
                return function() {

                }
            },
            TextDetail: computed(() => vmData.some),
            data
        }
    })();
    globalThis.vm = vm;



    let vmData = vm.data;

    let vmDataList = vmData.list
    let vmmodifierFactory = (ele) => {
        return Modifier?.setCurEle(ele).width('100%')
    }
    let vmmodifierFactory2 = Modifier.create(ctx => {
        ctx.width('100%')?.backgroundColor('var(--cus-background)')
    })
    let vmDataDialog = computed(() => vmData.dialog)
    let vmDataMax = computed(() => vmData.max > 1)
    let vmStrSome = computed(() => vmData.some)


    globalThis.vmDataMax = vmDataMax;
    globalThis.vmmodifierFactory = vmmodifierFactory;
    globalThis.vmmodifierFactory2 = vmmodifierFactory2;
    globalThis.vm = vm;


    setTimeout(() => {
        vmData.list[0] = 3;
        vmData.max = 2;
    }, 3000)

    globalThis.$vmData = vmData;

    const interpreter = new eval5.Interpreter({
        vmDataMax,
        vm,
        vmmodifierFactory,
        vmmodifierFactory2
    }, {
        rootContext: globalThis,
        timeout: 1000,
    });


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

            ; g.defc(Form1({name: 'form1'}).init(function (ele) {
    
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
    
                ; g.defc(FormItem('datepicker').init(function (ele) {
                    ; g.defc(DatePicker1().init(function (ele) {
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


                hc2(Button, {args: [{text: '获取当前model值 console查看', action: vm.submitForm}]}, ele);

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


    let code  = `
Column({space: 5, modifier: vmmodifierFactory2}) {
    Column({a: 1, modifier: vmmodifierFactory}) {

        Text().size('100%')
        Text('single string')
        Text("double string")
        Text(vm.TextDetail)
    }

    Column() {
        Column() {
    
            Text()
            Text('single string')
            Text("double string")
            Text(vm.TextDetail)
            Text()
            
        }
    }

    ForEach({max: 3}) {
        Text('foreach single str')
        Text("foreach double string")
    }

    If(vmDataMax) {
        Text('if is true')
    }

    Else() {
        Text('else is true')
    }

    Button({text: 'change text', s: vm.getFun(),  action: vm.action})
}

Column({a: 1, modifier: vmmodifierFactory}) {
    Column() {
    }
}
    `;

    function __get(object, path, defval = null) {
        if (typeof path === "string") {
            path = path.split(".");
        }
        return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
    }

    function __evalArgs(args = []) {
        return args.map(v => {
            try {
                // let o = eval(`let a = ${v}; a;`);
                let o = interpreter.evaluate(`var a = ${v}; a;`);
                // console.log(v, o);
                return o
            } catch(e) {
                if (typeof v === 'string') {
                    let val = __get(glo, v?.trim().split('.'))
                    // console.log(v, val);
                    if (typeof val !== 'undefined' && val != null) {
                        return val
                    } 
                }

                console.log(v, e);
                return v
            }
        })
    }

    let ret = parseArkUI(code, {
        glo: globalThis,
        interpreter,
        components: getcustomComponents(),
        hc2,
        handleXmlBuild(tag = '', argArr, {originStrArg} = {}) {
            let strArg = argArr;
            let args = []
            if (Array.isArray(argArr) && argArr.input) {
                // args = __evalArgs([argArr[1]])
                strArg = argArr[1]
            }

            // console.log(argArr);

            let tagName = 'zy-' + tag
            let item = null;
            if (tag === 'ForEach') {
                item = document.createElement('zy-foreach');
                item.setAttribute(':condition', strArg)
                let tpl = document.createElement('template');
                tpl.setAttribute('v-slot:default', 'scope')

                item.appendChild(tpl)
                return [item, tpl]
            }
            else if (tag === 'If') { 
                item = document.createElement('template');
                item.setAttribute('v-if', strArg);          
            }
            else if (tag === 'Else') { 
                item = document.createElement('template');
                item.setAttribute('v-else', '')
            }
            else {
                item = document.createElement(tagName);
                // console.log(tag, argArr, originStrArg);
                if (Array.isArray(strArg) && tag === 'Text') {
                    if (strArg[0]?.__v_isRef) {
                        item.innerHTML = originStrArg
                    }
                    else {
                        item.innerHTML = strArg[0] ?? ''
                    }
                }

                if (Array.isArray(strArg) && tag === 'Button') {
                    console.log(tag, argArr, originStrArg);
                    item.innerHTML = strArg[0]?.text ?? ''
                }
            }

            

            return [item]
        }
    });

    window.getParsedRet = function(name = 'def') {
        return ret[name]
    }
    console.log(ret?.def);
    // console.log(ret?.dom);
    
    hc2(Text, {args: ['动态string转换为component测试']}, ele);
    hc2(TextArea1, {args: [code.trim()]}, ele);
    ele.appendChild(ret.dom);
    

    Page({
        ele,
        lifeTimes: {
            onLoad() {
                console.log("main 加载完成");
            }
        }
    })
}