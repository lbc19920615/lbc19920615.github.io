import { Nid, g, hc2, BaseVmControl, injectControl, useControl, Text, ForEach, If, Column, defComponent } from "wle";


let ShopDialog1 = defComponent({
    name: 'ShopDialog1',
    setup({ setCreated, startWatch, args }) {
        let option = args[0] ?? {}
        let MyDialog = customElements.get('zy-dialog');
        let ele = new MyDialog({ title: 'dialog1', attrs: { class: 'dialog--bottom' } })
        ele.classList.add('shop-dialog-1')

        // console.dir(ele);
        setTimeout(() => {
            ele.addEventListener('cancel', function (e) {
                if (option?.onClose) {
                    option.onClose()
                }
            })

            ele.addEventListener('submit', function (e) {
                if (option?.onSubmit) {
                    option.onSubmit()
                }
            })
            ele.setAttribute('open', true);
        }, 0)

        return ele
    }
});

let ShopDetail1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let ele = document.createElement('div')
        ele.classList.add('shop-detail');
        ele.style.height = 'var(--shop-main-detail-h)';

        hc2(Column, {
            attrs: {
            },
            init(ele) {
                let ctx1 = hc2(Text, { args: ['商店信息'] }, ele);
            }
        }, ele);

        return ele
    }
})

let ShopCart1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let skuNum = args[0];
        let priceNum = args[1];
        let ele = document.createElement('div')
        ele.classList.add('shop-cart');
        ele.style.height = 'var(--shop-main-card-h)';

        hc2(Column, {
            attrs: {
                class: 'shop-cart__action'
            },
            init(ele) {
                hc2(Text, {
                    args: ['购物篮'],
                    props: {
                        onclick: function () {
                            ShopCart1.showDetail()
                        }
                    }
                }, ele);
                hc2(Text, { args: [skuNum] }, ele);
                hc2(Text, { args: ['&nbsp'] }, ele);
                hc2(Text, { args: [priceNum] }, ele)
            }
        }, ele);

        hc2(Column, {
            attrs: {
                class: 'shop-cart__mask'
            },
            init(ele) {
            }
        }, ele);

        hc2(Column, {
            attrs: {
                class: 'shop-cart__detail'
            },
            init(ele) {
                hc2(Text, { args: ['detail'] }, ele)
            }
        }, ele);


        ShopCart1.showDetail = function () {
            ele.style.setProperty('--shop-cart__mask-h', ele.parentElement.scrollHeight + 'px')
            setTimeout(() => {
                ele.classList.toggle('shop-cart--show-detail')
            }, 0)
        }


        return ele
    }
})

let ShopNav1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let ele = document.createElement('div')
        ele.classList.add('shop-nav')

        hc2(Column, {
            init(ele) {
                hc2(ForEach, {
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
        let argOpt = args[0] ?? {}
        let ele = document.createElement('div')
        ele.classList.add('shop-good')

        hc2(Column, {
            init(ele) {
                hc2(ForEach, {
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
                            let item = new cls({ index: i });
                            item.classList.add('shop-good__item');
                            item.addEventListener('show-buy-item', function () {
                                if (argOpt?.onBuyItem) {
                                    argOpt.onBuyItem(item, i)
                                }
                                // vm.shopDialog = true
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

    let cartStore;
    setTimeout(() => {
        cartStore = window.appConfig.getStore('Cart');

        console.dir(cartStore);
    }, 30)


    class ShopVm extends BaseVmControl {
        title = ''
        shopDialog = false
        collect = {}
        get shopDialogOpen1() {
            return this.shopDialog
        }
        get skuNumTotal() {
            if (this.collect?.num) {
                return this.collect?.num
            }
            return 0
        }
        get skuPriceTotal() {
            if (this.collect?.price_display) {
                return this.collect?.price_display
            }
            return 0
        }
        setTitle(v) {
            this.title = v
        }
        onDialogClose(e) {
            this.shopDialog = false
            // console.log('onDialogClose', e);
        }
        onDialogSubmit(e) {
            let self = this;
            this.shopDialog = false;
            addCartStyle();
            cartStore.putSku(Nid(), { sku_price: 1000 });
            setTimeout(() => {
                let obj = cartStore.getCollect();
                Object.keys(obj).forEach(key => {
                    self.collect[key] = obj[key]
                })
                // console.log(collect);
            }, 0)
            // console.log('onDialogSubmit', e);
        }
    }

    // injectControl('shopVm')(DomCotnrol);
    // let vm = useControl('shopVm');
    let vm = window.createControl(ShopVm);
    window.shopVm = vm;

    let ele = document.createElement('div');
    ele.classList.add('a-page');
    ele.classList.add('shop-page');


    function toggleCartStyle() {
        ele.classList.toggle('shop--has-cart')
    }


    function addCartStyle() {
        ele.classList.toggle('shop--has-cart', true)
    }


    hc2(ShopDetail1, {
        args: [],
        attrs: {
        },
        init() {

        }
    }, ele);

    g.defc(Column().init(function (ele) {

        let column1Ctx = hc2(Column, {
            args: [],
            attrs: {
                class: 'dis-flex h-full'
            },
            init(ele) {


                hc2(ShopNav1, {
                    args: [],
                    attrs: {
                    },
                    init() {

                    }
                }, ele);

                hc2(ShopGood1, {
                    args: [
                        {
                            onBuyItem() {
                                vm.shopDialog = true
                            }
                        }
                    ],
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
                args: [
                    { onClose: vm.onDialogClose, onSubmit: vm.onDialogSubmit }
                ],
                init() {

                }
            }, ele)

        }), function (ctx) {
            ctx.done(ele)
        });


        column1Ctx.ele.classList.add('overflow-auto');


    }), function (ctx) {
        ctx.done(ele);
        ctx.ele.style.height = 'var(--shop-main-con-h)'
    })


    hc2(ShopCart1, {
        args: [
            vm.skuNumTotal,
            vm.skuPriceTotal
        ],
        init() {

        }
    }, ele)

    Page({
        ele,
        lifeTimes: {
            onUnload() {
                console.log('unload shop');
            }
        }
    })
}