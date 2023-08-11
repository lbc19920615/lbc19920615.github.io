import { reactive, computed  } from "vue"
import { Button, Text, ForEach, If, Else, Column, Nid, g } from "wle";

export default function({Page}) {
    let ele =  document.createElement('div');
    ele.innerHTML = 'detail 页面'
    Page({
        ele,
        lifeTimes: {
            onLoad() {
                console.log("detail 加载完成");
            },
            onUnload() {
                console.log("detail 结束");
            }
        }
    })
}