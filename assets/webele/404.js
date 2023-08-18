import { reactive, computed  } from "vue"
import { Nid, g, hc2, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If,  Else, Column, defComponent, hc } from "wle";
import {parseArkUI} from "/assets/parser.js?v=0.0.3";


export default function({Page}) {
  
    let ele =  document.createElement('div');



    g.defc(Column().init(function (ele) {
        ; g.defc(Text('404').init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });
        
    }), function (ctx) { ctx.done(ele) })


    

    Page({
        ele,
        lifeTimes: {
            onLoad() {
                console.log("main 加载完成");
            }
        }
    })
}