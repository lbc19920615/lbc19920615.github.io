import { Nid, g, hc2, BaseVmControl, injectControl, useControl, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If, Else, Column, defComponent, hc } from "wle";


class DomCotnrol extends BaseVmControl {
    title = ''
    shopDialog = false
    get shopDialogOpen1() {
        return this.shopDialog
    }
    setTitle(v) {
        this.title = v
    }
    onDialogClose(e) {
        this.shopDialog = false
        console.log('onDialogClose', e);
    }
}

injectControl('shopVm')(DomCotnrol);
let vm = useControl('shopVm');
window.shopVm = vm;

let ShopDialog1 = defComponent({
    name: 'ShopDialog1',
    setup({ setCreated, startWatch, args }) {
        let option = args[0] ?? {}
        let MyDialog = customElements.get('zy-dialog');
        let ele = new MyDialog({ title: 'dialog1', attrs: { class: 'dialog--bottom' } })
        ele.classList.add('shop-dialog-1')

        // console.dir(ele);
        setTimeout(() => {
            ele.addEventListener('cancel',function(e){
                //
                if (option?.onClose) {
                    option.onClose()
                }
            })
            ele.setAttribute('open', true);         
        }, 0)
        
        return ele
    }
})

let ShopNav1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let ele = document.createElement('div')
        ele.classList.add('shop-nav')

        hc2(Column, {
            init(ele) {
                hc(ForEach, {
                    args: [{ max: 6 }],
                    init(ele, option) {
                        let optionEle = document.createElement('xy-option')
                        optionEle.classList.add('shop-nav__item')
                        optionEle.setAttribute('value', option.index)
                        optionEle.innerHTML = `种类${option.index + 1}`
                        option.appendChild(optionEle)
                    }
                }, ele);
            },
            end(ctx) {
                // ctx.width('100%')
            }
        }, ele);



        /**
         * 
         * @param {Element} ele 
         */
        function render(ele) {
            ele.addEventListener('click', function (e) {
                // console.log(e.target);
                if (e.target.classList.contains('shop-nav__item')) {
                    let itemIndex = e.target.value;
                    document.querySelector(`[good_item_index="${itemIndex}"]`).scrollIntoView({ behavior: "smooth" })
                }
            })
        }

        render(ele)

        startWatch(() => {
            render(ele)
        })

        return ele
    }
});






let ShopGood1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let ele = document.createElement('div')
        ele.classList.add('shop-good')

        hc2(Column, {
            init(ele) {
                hc(ForEach, {
                    args: [{ max: 6 }],
                    init(ele, option) {
                        let optionEle = document.createElement('div')
                        
                        hc2(Text, {
                            args: [`商品大类${option?.index + 1}`],
                            attrs: {
                            }
                        }, optionEle);

                        optionEle.setAttribute('good_item_index', option.index);
        
                        
                        for (let i = 0; i < 5; i++) {
                            let cls = customElements.get('shop-good-item')
                            let item = new cls({index: i});
                            item.classList.add('shop-good__item');
                            item.addEventListener('show-buy-item', function() {
                                vm.shopDialog = true
                            })
                            optionEle.appendChild(item)
                        }

                        option.appendChild(optionEle)
                    }
                }, ele);
            },
            end(ctx) {
                // ctx.width('100%')
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
});


export default function ({ Page }) {
    
    const sheet = window.jssStyleMan.createStyleSheet({
        'shop-page': {
            'height': '100%',
            '--shop-good__item_h': '160px'
        },
    });

    sheet.attach();

    let ele = document.createElement('div');
    ele.classList.add('a-page');
    ele.classList.add('shop-page');
    ele.classList.add(sheet.classes['shop-page'])

    g.defc(Column().init(function (ele) {


        let column1Ctx = hc2(Column, {
            args: [], attrs: {
                class: 'dis-flex h-full'
            }, init(ele) {
                hc2(ShopNav1, {
                    args: [],
                    attrs: {
                    },
                    init() {

                    }
                }, ele);

                hc2(ShopGood1, {
                    args: [],
                    attrs: {
                        class: 'flex-1 h-full'
                    },
                    init() {

                    }
                }, ele);
            }
        }, ele);


        g.defc(If(vm.shopDialogOpen1, Nid()).init(function (ele) {

            hc2(ShopDialog1, {
                args: [{ onClose: vm.onDialogClose }],
                init() {

                }
            }, ele)

        }), function (ctx) {
            ctx.done(ele)
        });


        column1Ctx.ele.classList.add('overflow-auto');


    }), function (ctx) {
        ctx.height('100%');
        ctx.done(ele);
    })


    Page({
        ele,
        lifeTimes: {
            onUnload() {
                console.log('unload shop');
                sheet.detach()
            }
        }
    })
}