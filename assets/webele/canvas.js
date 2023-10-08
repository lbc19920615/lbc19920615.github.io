import { Nid, Text, hc2, View, getcustomComponents, BaseVmControl, injectControl, useControl, g } from "wle";

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
    ele.classList.add('a-page');
    ele.classList.add('vue3-page')
    let vm = useControl('vue3')

    let customComponents = getcustomComponents()
    g.defc(customComponents.get('PageWrapper')({title: 'canvas页'}).init(function (ele) {

        const app = Vue.createApp({
            template: /*template*/`<div>1111</div>`
        /* root component options */
        });
        app.use(window.lib.VueKonva);

        const canvansLib = {}
        hc2(Text, { 
            args: ['变换'],
            props: {
                onclick() {
                    canvansLib.tango();
                }
            }
        }, ele)

        hc2(View, { 
            args: [],
            init(ele) {
                console.log('ele', ele);
                // app.mount(ele)
                // first we need to create a stage

                const stageWidth  = 1200;
                const stageHeight =  675;


                var width = stageWidth;
                var height = stageHeight;

                var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

                function getRandomColor() {
                  return colors[Math.round(Math.random() * 5)];
                }
          
                function tango(layer) {
                  for (var n = 0; n < layer.getChildren().length; n++) {
                    var color = getRandomColor();
                    var shape = layer.getChildren()[n];
                    var stage = shape.getStage();
                    var radius = Math.random() * 100 + 20;
          
                    new Konva.Tween({
                      node: shape,
                      duration: 1,
                      x: Math.random() * stage.width(),
                      y: Math.random() * stage.height(),
                      rotation: Math.random() * 360,
                      radius: radius,
                      opacity: (radius - 20) / 100,
                      easing: Konva.Easings.EaseInOut,
                      fill: color,
                    }).play();
                  }
                }
                var stage = new Konva.Stage({
                  container: ele,
                  width: width,
                  height: height,
                });
          
                var layer = new Konva.Layer();
          
                for (var n = 0; n < 10; n++) {
                  var radius = Math.random() * 100 + 20;
                  var color = getRandomColor();
                  var shape = new Konva.RegularPolygon({
                    x: Math.random() * stage.width(),
                    y: Math.random() * stage.height(),
                    sides: Math.ceil(Math.random() * 5 + 3),
                    radius: radius,
                    fill: color,
                    opacity: (radius - 20) / 100,
                    draggable: true,
                  });
          
                  layer.add(shape);
                }
          
                stage.add(layer);

                canvansLib.tango = function() {
                    tango(layer)
                }
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