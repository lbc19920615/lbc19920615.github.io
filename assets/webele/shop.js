import { Nid, g, hc2, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If,  Else, Column, defComponent, hc } from "wle";


let ShopNav1 = defComponent({
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('shop-nav')

        hc2(Column, {
            init(ele)  {
                hc(ForEach, {args: [{max: 6}], 
                    init(ele, option)  {
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
        }, ele)

    
        /**
         * 
         * @param {Element} ele 
         */
        function render(ele) {
            ele.addEventListener('click', function(e) {
                // console.log(e.target);
                if (e.target.classList.contains('shop-nav__item')) {
                    let itemIndex = e.target.value;
                    document.querySelector(`[good_item_index="${itemIndex}"]`).scrollIntoView({ behavior: "smooth"})
                }
            })
        }
    
        render(ele)
    
        startWatch(() => {
            render(ele)
        })

        return ele
    }
})


let ShopGood1 = defComponent({
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('shop-good')

        hc2(Column, {
            init(ele)  {
                hc(ForEach, {args: [{max: 6}], 
                    init(ele, option)  {
                        let optionEle = document.createElement('div');
                        optionEle.setAttribute('good_item_index', option.index);
                        optionEle.classList.add('shop-good__item');
                        optionEle.innerHTML = `商品大类${option.index + 1}`;
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
})

export default function({Page}) {  
    const sheet = window.jssStyleMan.createStyleSheet({
        'shop-page': {
            'height': '100%',
            '--shop-good__item_h': '560px'
        },
    });

    sheet.attach();

    

    let ele = document.createElement('div');
    ele.classList.add('shop-page');
    ele.classList.add(sheet.classes['shop-page'])

    g.defc(Column().init(function (ele) {


        let column1Ctx = hc2(Column, {args: [], attrs: {
            class: 'dis-flex h-full'
        }, init(ele) {
            hc2(ShopNav1, {args: [], 
                attrs: {
                },
                init() {

                }
            }, ele);

            hc2(ShopGood1, {args: [], 
                attrs: {
                    class: 'flex-1 h-full'
                }, 
                init() {

                }
            }, ele);
        }}, ele);

        column1Ctx.ele.classList.add('overflow-auto')

    }), function (ctx) {
        ctx.height('100%');
        ctx.done(ele);
     })


    Page({
        ele
    })
}