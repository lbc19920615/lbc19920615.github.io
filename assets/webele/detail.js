

import { Nid, Button, Text, setGlobal,  hc2, defComponent, getcustomComponents, Column, BaseVmControl, injectControl, useControl, g } from "wle";

setGlobal(window.self);



class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'detail 页面 ' + this.title
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        self.wRoute.back()
    }
    action2() {
        let countStore = getApp()?.globalConfig?.useCounterStore();
        countStore.increment()
    }
    action3() {
        window.self.openSubApp('detail2', {
            paramA: Nid()
        })
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
    ele.classList.add('detail-page');
    ele.classList.add('h-full')
    let vm = useControl('vm')


    let customComponents = getcustomComponents()
    // console.log(customComponents.get('PageWrapper'));
    g.defc(customComponents.get('PageWrapper')({title: 'detail页'}).init(function (ele) {

        
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

        hc2(Text, {args: ['下一个页面2'], ready(ctx) {
            ctx.marginBottom(20)
        }}, ele);


        hc2(Button, {args: [{text: 'detail2', action: vm.action3}], ready(ctx) {
            ctx.width('100%').height(30).backgroundColor(0xAFEEEE);
        }}, ele);

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
            },
            onReady() {
                console.log("detail ready");
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}