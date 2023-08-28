import {  g, Text, View } from "wle";

export default function({Page}) {
  
    let ele = document.createElement('div');
    ele.classList.add('a-page');

    g.defc(View().init(function (ele) {
        ; g.defc(Text('404').init(function (ele) {
        }), function (ctx) {
            ctx.done(ele)
        });
    }), function (ctx) { ctx.done(ele) })


    Page({
        ele
    })
}