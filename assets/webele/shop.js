import { Nid, g, hc2, Modifier, Utils, getcustomComponents, Button, Text, ForEach, If,  Else, Column, defComponent, hc } from "wle";

export default function({Page}) {  
    let ele = document.createElement('div');
    ele.classList.add('shop-page')

    g.defc(Column().init(function (ele) {
        hc2(Text, {args: ['shop'], init() {

        }}, ele);
    }), function (ctx) { ctx.done(ele) })


    Page({
        ele
    })
}