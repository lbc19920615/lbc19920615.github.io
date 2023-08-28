import { Nid, g, hc2, BaseVmControl, CompEvent, createEle, Text, ForEach, If, View, defComponent } from "wle";

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

        /**
         * @type {Element}
         */
        let ele = createEle('div', {
            attrs: {
                class: 'shop-detail',
            },
            props: {
                style: {
                    height: 'var(--shop-main-detail-h)'
                }
            }
        });


        hc2(View, {
            attrs: {
            },
            load(hce) {
                hce(Text, { args: ['商店信息'] });
            }
        }, ele);

        return ele
    }
})

let ShopCart1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let skuNum = args[0];
        let priceNum = args[1];
        let items = args[2];
        let argOpt = args[3];
        let ele = document.createElement('div');
        let compHostEle = ele;
        ele.classList.add('shop-cart');
        ele.style.height = 'var(--shop-main-card-h)';

        function ShopItem(ele, option) {
            hc2(View, {
                attrs: {
                    class: 'shop-cart__item'
                },
                load(hce) {
                    hce(Text, {
                        args: [option.item[1]?.extra?.sku_name]
                    });
                    hce(Text, {
                        args: ['&nbsp;'],
                    })
                    hce(Text, {
                        args: ['&#8722;'],
                        attrs: {
                            class: 'shop-cart__item-act'
                        },
                        props: {
                            onclick() {
                                if (argOpt && argOpt.onDel) {
                                    argOpt.onDel(option.item)
                                }
                            }
                        }
                    });
                    hce(Text, {
                        args: [option.item[1].num]
                    });
                    hce(Text, {
                        args: ['&#43;'],
                        attrs: {
                            class: 'shop-cart__item-act'
                        },
                        props: {
                            onclick() {
                                if (argOpt && argOpt.onAdd) {
                                    argOpt.onAdd(option.item)
                                }
                            }
                        }
                    });
                }
            }, ele)
        }

        hc2(View, {
            attrs: {
                class: 'shop-cart__action'
            },
            load(hce) {
                hce(Text, {
                    args: ['购物篮'],
                    props: {
                        onclick: function () {
                            ShopCart1.toggleDetail()
                        }
                    }
                });
                hce(Text, {
                    args: [skuNum],
                    // attrs: {class: 'a-placeholder'}
                });
                hce(Text, { args: ['&nbsp'] });
                hce(Text, {
                    args: ['合计'],
                    // attrs: {class: 'a-placeholder'}
                });
                hce(Text, { args: [priceNum] })
            }
        }, ele);

        hc2(View, {
            attrs: {
                class: 'shop-cart__mask'
            },
            props: {
                onclick() {
                    compHostEle.dispatchEvent(new CompEvent('click_mask'))
                }
            }
        }, ele);

        hc2(View, {
            attrs: {
                class: 'shop-cart__detail'
            },
            load(hce) {
                hce(View, {
                    attrs: {
                        class: 'shop-cart__detail-action'
                    },
                    load(hce) {
                        hce(Text, { args: ['已选商品'] });
                        hce(Text, { args: ['&nbsp'] });
                        hce(Text, {
                            args: ['清空'],
                            props: {
                                onclick() {
                                    compHostEle.dispatchEvent(new CompEvent('clear_all'))
                                }
                            }
                        });
                    }
                }, ele);

                hce(ForEach, {
                    args: [{ list: items }],
                    init(ele, option) {
                        ShopItem(ele, option)
                    }
                }, ele);
            }
        }, ele);


        ShopCart1.toggleDetail = function (flag = true) {
            if (flag) {
                ele.style.setProperty('--shop-cart__mask-h', ele.parentElement.scrollHeight + 'px')
            }
            setTimeout(() => {
                ele.classList.toggle('shop-cart--show-detail')
            }, 0);

            ele.dispatchEvent(new CompEvent('toggle', flag))
        }


        return ele
    }
})

let ShopNav1 = defComponent({
    setup({ getCompCtx, startWatch, args }) {
        let ele = document.createElement('div')
        ele.classList.add('shop-nav')

        hc2(View, {
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

        hc2(View, {
            attrs: {
                class: 'h-full overflow-auto'
            },
            init(ele) {
                hc2(ForEach, {
                    args: [{ max: 6 }],
                    init(ele, option) {
                        let con = document.createElement('div');
                        con.classList.add('shop-good__section');
                        con.setAttribute('good_item_index', option.index);


                        let ctxText = hc2(Text, {
                            args: [`商品大类${option?.index + 1}`],
                            attrs: {
                                class: "shop-good__title"
                            }
                        }, con);

                        let optionEle = document.createElement('div')




                        for (let i = 0; i < 5; i++) {
                            let cls = customElements.get('shop-good-item')
                            let item = new cls({ index: i });
                            item.classList.add('shop-good__item');
                            item.dataset.id = Nid()
                            item.addEventListener('show-buy-item', function () {
                                if (argOpt?.onBuyItem) {
                                    argOpt.onBuyItem(item, i)
                                }
                                // vm.shopDialog = true
                            })
                            optionEle.appendChild(item)
                        }

                        con.appendChild(optionEle);

                        option.appendChild(con)
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

        resetCartDetail()

        // console.dir(cartStore);
    }, 30);

    const { watch } = globalThis.VueDemi;


    class ShopVm extends BaseVmControl {
        title = ''
        shopDialog = false
        current = {
            item: null
        }
        collect = {}
        setCollect(obj) {
            Object.keys(obj).forEach(key => {
                this.collect[key] = obj[key]
            })
        }
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
        get skuItems() {
            if (this.collect?.items) {
                return this.collect?.items
            }
            return []
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
            ShopCart1.toggleAction(true);
            let curItem = self.current.item;
            if (!curItem) {
                return;
            }
            cartStore.putSku(curItem.dataset.id, { sku_name: 'good ' + curItem.dataset.id, sku_price: 1000 });
            resetCartDetail()
            // console.log('onDialogSubmit', e);
        }
    }

    // injectControl('shopVm')(DomCotnrol);
    // let vm = useControl('shopVm');
    let vm = window.createControl(ShopVm);
    window.shopVm = vm;

    function resetCartDetail() {
        const { nextTick } = globalThis.VueDemi;
        nextTick(() => {
            let obj = cartStore.getCollect();
            vm.setCollect(obj);
        })
    }

    let ele = document.createElement('div');
    ele.classList.add('a-page');
    ele.classList.add('shop-page');



    function addCartStyle() {
        ele.classList.toggle('shop--has-cart', true)
    }

    ShopCart1.toggleAction = function (flag = true) {
        ele.classList.toggle('shop--has-cart', flag)
    }


    hc2(ShopDetail1, {
        args: [],
        attrs: {
        },
        init() {

        }
    }, ele);

    g.defc(View().init(function (ele) {

        hc2(View, {
            args: [],
            attrs: {
                class: 'dis-flex h-full'
            },
            load(hce) {
                hce(ShopNav1, {
                    args: [],
                    attrs: {
                    }
                });

                hce(ShopGood1, {
                    args: [
                        {
                            onBuyItem(item) {
                                vm.shopDialog = true;
                                vm.current.item = item;
                            }
                        }
                    ],
                    attrs: {
                        class: 'flex-1 h-full'
                    }
                });
            }
        }, ele);


        g.defc(If(vm.shopDialogOpen1, Nid()).init(function (ele) {

            hc2(ShopDialog1, {
                args: [
                    { onClose: vm.onDialogClose, onSubmit: vm.onDialogSubmit }
                ]
            }, ele)

        }), function (ctx) {
            ctx.done(ele)
        });


    }), function (ctx) {
        ctx.done(ele);
        ctx.ele.style.height = 'var(--shop-main-con-h)'
    })




    hc2(ShopCart1, {
        args: [
            vm.skuNumTotal,
            vm.skuPriceTotal,
            vm.skuItems,
            {
                onDel(item) {
                    cartStore.delSku(item[0]);
                    resetCartDetail()
                },
                onAdd(item) {
                    cartStore.addSku(item[0]);
                    resetCartDetail()
                }
            }
        ],
        events: {
            toggle() {
                // console.log('on toggle');
            },
            click_mask() {
                ShopCart1.toggleDetail(false);
            },
            clear_all() {
                cartStore.clearAllItems();
                resetCartDetail()
            }
        },
        init() {

        }
    }, ele);

    watch(vm.skuNumTotal, (newVal) => {
        console.log('skuNumTotal', newVal);
        if (newVal < 1) {
            ShopCart1.toggleDetail(false);
            ShopCart1.toggleAction(false);
        }
        else {
            // ShopCart1.toggleDetail(false);
            ShopCart1.toggleAction(true);
        }
    })

    Page({
        ele,
        lifeTimes: {
            beforeReload(params) {
                console.log('beforeReload shop', params);
            },
            onUnload() {
                console.log('unload shop');
            }
        }
    })
}