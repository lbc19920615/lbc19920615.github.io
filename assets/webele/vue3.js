import { Nid, Text, hc2, View, BaseVmControl, injectControl, useControl, g } from "wle";

class DomCotnrol extends BaseVmControl {
    title = ''
    get TextDetail() {
        return 'vue3 页面 ' + this.title
    }
    setTitle(v) {
        this.title = v
    }
    action(e) {
        globalThis.wRoute.back()
    }
    action2() {
        this.title = Nid()
    }
}

injectControl('vue3')(DomCotnrol);


export default function ({ Page }) {
    let ele = document.createElement('div');
    ele.classList.add('vue3-page')
    let vm = useControl('vue3')


    g.defc(View().init(function (ele) {

        hc2(Text, { args: [vm.TextDetail] }, ele);

        const app = Vue.createApp({
            template: /*template*/`<div>1111</div>`
        /* root component options */
        });
        app.use(window.lib.VueKonva);

        hc2(View, { 
            args: [],
            init(ele) {
                console.log('ele', ele);
                // app.mount(ele)
                // first we need to create a stage

                const stageWidth  = 1200;
                const stageHeight =  675;

    var stage = new Konva.Stage({
        container: ele,   // id of container <div>
        width: stageWidth,
        height: stageHeight
    });
  
  // then create layer
  var layer = new Konva.Layer();
  
  // create our shape
  
  let items = [1,2,3]

  items.forEach(v => {
    var circle = new Konva.Circle({
        x: Math.random() * stageWidth,
        y: Math.random() * stageHeight,
        radius: 70,
        fill: Konva.Util.getRandomColor(),
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });

    circle.on('dragend', function (e) {
        console.log('dragend', e.target.zIndex());
    });

    layer.add(circle);
  })

  
  stage.add(layer);

  layer.draw();
            }
        }, ele);
    }), function (ctx) { ctx.done(ele) })

    Page({
        ele,
        lifeTimes: {
            onCreated(pageVm, { app } = {}) {

            },
            onRouteEnter() {
                console.log('路由onRouteEnter');
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}