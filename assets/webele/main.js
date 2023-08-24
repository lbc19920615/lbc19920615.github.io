
import { Nid, g, hc2, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If,  Else, Column, defComponent, hc } from "wle";
import {parseArkUI} from "/assets/parser.js?v=0.0.3";

const { reactive, computed  } = globalThis.VueDemi;


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
        let label = args[1] ?? name;
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
                hc(Text, {args: [label]}, ele)
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
        let argOpt = args[0] ?? {}
        let ele = document.createElement('xy-checkbox-group')
        ele.classList.add('checkbox-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let checkbox = document.createElement('xy-checkbox')
                checkbox.setAttribute('name', argOpt.name)
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
        let argOpt = args[0] ?? {}
        let ele = document.createElement('my-radio-group')
        ele.classList.add('radio-group')

        hc(ForEach, {args: [{max: 6}], 
            init(ele, option)  {
                let radio = document.createElement('my-radio');
                radio.classList.add('a-radio1')
                radio.classList.add('mr-10')
                radio.setAttribute('name', argOpt.name)
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
});

let SwiperNav1 = defComponent({
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('swiper-nav1');

        let childrens = []
        hc2(Column, {
            init(ele)  {
                hc2(Text, {args: ['swiper com 1'], attrs: {sindex: 0}}, ele)
                hc2(Text, {args: ['swiper com 2'], attrs: {sindex: 1}}, ele)
                hc2(Text, {args: ['swiper com 3'], attrs: {sindex: 2}}, ele)
            },
            end(ctx) {
                ctx.ele.classList.add('dis-flex');
                ele.style.width = 'max-content';
                ele.style.transform = 'translateX(0)';
                childrens = [...ctx.ele.children];
            }
        }, ele);

        ele.addEventListener('click', (e) => {
            // console.log(e.target, childrens);
            if (childrens.includes(e.target)) {
                let sindex = parseInt(e.target.getAttribute('sindex'));

                ele.dispatchEvent(new CustomEvent('select-index', {
                    detail: sindex
                }))
                // console.log('ssssssssssss', sindex);
            }
        })

    
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
    ele.classList.add('a-page');
    ele.classList.add('main-page');
    let vm = (function () {
        let data = reactive({
            some: "initStr",
            max: 1,
            max2: 1,
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
                // globalThis.wRoute.push('detail', {
                //     paramA: Nid()
                // })
                window.openSubApp('detail', {
                    paramA: Nid()
                })
            },
            action3() {
                data.dialog = true
            },
            submitForm() {
                let formName = 'form1'
                console.log(formName, document.querySelector(`.form[name=${formName}]`)?.$formCtx.getModel())
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
    let vmDataMax2 = computed(() => vmData.max2 > 1)
    let vmStrSome = computed(() => vmData.some)


    globalThis.vmDataMax = vmDataMax;
    globalThis.vmmodifierFactory = vmmodifierFactory;
    globalThis.vmmodifierFactory2 = vmmodifierFactory2;
    globalThis.vm = vm;


    setTimeout(() => {
        vmData.list[0] = 3;
        vmData.max = 2;
        vmData.max2 = 2;
    }, 3000)

    globalThis.$vmData = vmData;

    const interpreter = new eval5.Interpreter({
        vmDataMax,
        vmDataMax2,
        vm,
        vmmodifierFactory,
        vmmodifierFactory2
    }, {
        rootContext: globalThis,
        timeout: 1000,
    });


    g.defc(Column().init(function (ele) {
        let SwiperNav1Ctx = hc2(SwiperNav1, {args: []}, ele);
        let SwiperNav1Ele = SwiperNav1Ctx.ele;
        // console.log(SwiperNav1Ele);
        SwiperNav1Ele.addEventListener('select-index', function(e) {
            // console.dir( swCon.swiper)
            if (swCon.swiper) {
                if (swCon.swiper.realIndex === e.detail) {
                    return
                }
                // console.dir( swCon.swiper.slideTo)
                swCon.swiper.slideTo(e.detail)
            }
        })

        let swCon = document.createElement('swiper-container');
        swCon.id = 'swCon';
        swCon.setAttribute('autoplay',true )
        swCon.setAttribute('speed', 1000)
        swCon.setAttribute('autoplay-delay', 6000)
        swCon.style.setProperty('--swiper-slide-h', '180px')
        ele.appendChild(swCon);


        hc2(ForEach, {
            args: [{ max: 3 }], 
            init: (ele, option) => {
                // console.log('ele', ele)
                let swSlide = document.createElement('swiper-slide');
                swSlide.classList.add('a-swiper')
                swSlide.innerHTML = 'slide' + option.index;
                swSlide.classList.add('swiper_slide')
                // swSlide.setAttribute('style', 'height: 180px;')
                option.appendChild(swSlide);
            },
            ready() {
                setTimeout(() => {
                    swCon.swiper.on('setTranslate', (swiper, translate) =>{
                        // virtualSize
                        // console.log('translate', swiper.virtualSize, translate);
                        SwiperNav1Ele.style.transform = `translateX(${translate / (swiper.virtualSize) * 100}%)`
                    })
                }, 30)
            }
        }, swCon);


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

            let if_nid_1 = Nid();
            ; g.defc(If(vmDataMax2, if_nid_1).init(function (ele) {
                g.defc(Text('if ok').init(function (ele) {

                }), function (ctx) { ctx.done(ele) })
            }), function (ctx) {
                ctx.done(ele)
            });

            ; g.defc(Else(if_nid_1).init(function (ele) {
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
    
                ; g.defc(FormItem('select','下拉').init(function (ele) {
                    ; g.defc(Select1().init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });
    
                
                ; g.defc(FormItem('textarea', '多行').init(function (ele) {
                    ; g.defc(TextArea1().init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });
    
    
                ; g.defc(FormItem('input text', '文本').init(function (ele) {
                    ; g.defc(Input1().init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });
    
                ; g.defc(FormItem('input number', '数字').init(function (ele) {
                    ; g.defc(Input1({type: "number"}).init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });
    
                ; g.defc(FormItem('datepicker', '日期').init(function (ele) {
                    ; g.defc(DatePicker1().init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });

    
                ; g.defc(FormItem('checkbox', '多选').init(function (ele) {
                    ; g.defc(CheckboxGroup({name: 'checkbox'}).init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele)
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });
    
                ; g.defc(FormItem('radio1', '常见单选').init(function (ele) {
                    ; g.defc(RadioboxGroup({name: 'radio1'}).init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele);
                    });
                }), function (ctx) {
                    ctx.done(ele)
                });

                ; g.defc(FormItem('radio2',  '单选样式').init(function (ele) {
                    ; g.defc(RadioboxGroup({name: 'radio2'}).init(function (ele) {
                    }), function (ctx) {
                        ctx.done(ele);
                        ctx.ele.classList.add('a-btn-radio-group')
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
        
        ; g.defc(If(vmDataDialog, 'if_dialog_nid').init(function (ele) {
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

    Button({text: 'change text',  action: vm.action})
}

Column({space: 5, modifier: vmmodifierFactory2}) {
}

    `;

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
                    // console.log(tag, argArr, originStrArg);
                    item.innerHTML = strArg[0]?.text ?? ''
                }
            }

            

            return [item]
        }
    });

    window.getParsedRet = function(name = 'def') {
        return ret[name]
    }
    console.log(ret?.dom);
    // console.log(ret?.dom);
    
    hc2(Text, {args: ['动态string转换为component测试']}, ele);
    hc2(Column, {
        attrs: {
            class: 'main-show-column'
        },     
        init(ele){
            hc2(TextArea1, {args: [code.trim()]}, ele);
            ele.appendChild(ret.dom);
        }
    }, ele)


    Page({
        ele,
        lifeTimes: {
            onCreated() {
                console.log("main 加载完成");
            },
        }
    })
}