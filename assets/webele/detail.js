import { Button, Text, ForEach, If,  hc2, defComponent, Column, BaseVmControl, injectControl, useControl, g } from "wle";


class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail 页面 ' + this.title
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        globalThis.wRoute.back()
    }
    action2() {
        let countStore = getApp()?.globalConfig?.useCounterStore();
        countStore.increment()
    }
}

injectControl('vm')(DomCotnrol)


let Text2 = defComponent({
    setup({getCompCtx, startWatch, args}) {         
        let ele = document.createElement('div')
        ele.classList.add('text2')

        hc2(Column, {
            init(ele)  {
                hc2(Text, {args: ['text2 com start']}, ele)
                hc2(Text, {args: args}, ele)
                hc2(Text, {args: ['text2 com end']}, ele)
            },
            done(ctx) {
                ctx.width('100%')
            }
        }, ele)

    
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
                console.log('ssssssssssss', sindex);
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

function genItems(num = 1000) {
    return new Array(num).fill(0).map((item,index) => 'item' + (index + 1))
}

var VirtualizedList = window.VirtualizedList.default;
let LazyList1 = defComponent({
    name: 'LazyList1',
    setup({getCtx, startWatch, args}) {    
        let option = args[0] ?? {}
        let totalHeight = 500
        let rowHeight = 150


        let ele = document.createElement('div')
        ele.style.height = totalHeight + 'px'
        ele.style.overflow = 'auto'
        const rows = genItems();

        const virtualizedList = new VirtualizedList(ele, {
          height: totalHeight, // The height of the container
          rowCount: rows.length,
          renderRow: index => {
              const element = document.createElement('div');
              element.innerHTML = rows[index];
              element.style.height = '150px'
              return element;
          },
          rowHeight: rowHeight,
        });
        
        // console.dir(virtualizedList )
        return ele
    }
})

export default function({Page}) {
    let ele =  document.createElement('div');
    ele.classList.add('detail-page')
    let vm = useControl('vm')


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
        ele.appendChild(swCon);

        hc2(ForEach, {
            args: [{ max: 3 }], init: (ele, option) => {
                // console.log('ele', ele)
                let swSlide = document.createElement('swiper-slide')
                swSlide.innerHTML = 'slide' + option.index;
                swSlide.style.height = '180px';
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



        ; g.defc(Text2(vm.TextDetail).init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });

        hc2(Button, {args: [{text: 'pinia', action: vm.action2}], ready(ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
        }}, ele);

        hc2(Text, {args: ['router'], ready(ctx) {
            ctx.marginBottom(20)
        }}, ele);

        ; g.defc(Button({ text: 'back', action: vm.action }).init(function (ele) { 
        }), function (ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
            ctx.done(ele)
        });

        ; g.defc(Text('大数据列表').init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });

        ; g.defc(LazyList1().init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });
    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onCreated(pageVm, {app} = {}) {
                console.log("detail 加载完成", pageVm.$getParams());
                vm.setTitle(JSON.stringify( pageVm.$getParams()))
            },
            onReady({appConfig} = {}) {
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}