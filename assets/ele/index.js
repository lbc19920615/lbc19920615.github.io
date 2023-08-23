// import 'https://unpkg.com/xy-ui';

import 'https://unpkg.com/xy-ui/components/xy-button.js';
import 'https://unpkg.com/xy-ui/components/xy-slider.js';
import 'https://unpkg.com/xy-ui/components/xy-select.js';
import 'https://unpkg.com/xy-ui/components/xy-loading.js';
import 'https://unpkg.com/xy-ui/components/xy-switch.js';
import 'https://unpkg.com/xy-ui/components/xy-checkbox.js';
import 'https://unpkg.com/xy-ui/components/xy-radio.js';
import 'https://unpkg.com/xy-ui/components/xy-tips.js';
import 'https://unpkg.com/xy-ui/components/xy-icon.js';
// import 'https://unpkg.com/xy-ui/components/xy-layout.js';
import 'https://unpkg.com/xy-ui/components/xy-input.js';
import 'https://unpkg.com/xy-ui/components/xy-img.js';
import 'https://unpkg.com/xy-ui/components/xy-rate.js';
import 'https://unpkg.com/xy-ui/components/xy-popover.js';
import 'https://unpkg.com/xy-ui/components/xy-color-picker.js';
// import 'https://unpkg.com/xy-ui/components/xy-form.js';
import 'https://unpkg.com/xy-ui/components/xy-pagination.js';
import 'https://unpkg.com/xy-ui/components/xy-date-picker.js';
// import 'https://unpkg.com/xy-ui/components/xy-table.js';
import 'https://unpkg.com/xy-ui/components/xy-text.js';
// import 'https://unpkg.com/xy-ui/components/xy-view.js';
import 'https://unpkg.com/xy-ui/components/xy-datalist.js';
import XyDialog from 'https://unpkg.com/xy-ui/components/xy-dialog.js';
import 'https://unpkg.com/xy-ui/components/xy-message.js';
window.XyDialog = XyDialog;
// window.XyMessage = XyMessage;


let messageContent = document.getElementById('message-content');
window.XyMessage = new Proxy({}, {
    get(target, key) {
        return function(text, duration, onclose) {
            let cls = customElements.get('xy-message');
            const message = new cls();
            message.timer && clearTimeout(message.timer);
            messageContent.appendChild(message);
            message.type = key;
            message.textContent = text;
            message.show = true;
            message.onclose = onclose;
            message.timer = setTimeout(()=>{
                message.show = false;
            },duration||3000);
            return message;
        }
    }
})

const DATE_PICKER_HAS_STATE = 'date-picker--has-val'

const toDate = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    return [year,month,day];
}


const parseDate = (date,type="date") => {
    const [year,month,day] = toDate(date);
    let value = '';
    switch (type) {
        case 'date':
            value = year + '-' + (month+'').padStart(2,0) + '-' + (day+'').padStart(2,0);
            break;
        case 'month':
            value = year + '-' + (month+'').padStart(2,0);
            break;
        default:
            value = year + '';
            break;
    }
    return value;
}

export class MyDatePicker extends customElements.get('xy-date-picker') {
    constructor(option = {}) {
        super(option);
        // console.log(option, this.shadowRoot);
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        :host{
            display:inline-block;
            font-size: 14px;
        }
        :host([block]){
            display:block;
        }
        
        :host(:focus-within) xy-popover,:host(:hover) xy-popover{ 
            z-index: 2;
        }
        :host([disabled]){
            pointer-events:none;
        }
        xy-popover{
            width:100%;
            height:100%;
        }
        #select{
            display:flex;
            width:100%;
            height:100%;
            font-size: inherit;
        }
        #select span{
            flex:1;
            text-align:left;
        }
        .icon{
            position:relative;
            margin-right:.5em;
            pointer-events:none;
            width:1em;
            height:1em;
            fill:currentColor;
        }
        xy-popover{
            display:block;
        }
        xy-popcon{
            min-width:100%;
        }
        .pop-footer{
            display:flex;
            justify-content:flex-end;
            padding:0 .8em .8em;
        }
        .pop-footer xy-button{
            font-size: .8em;
            margin-left: .8em;
        }
        #clear {
            display: none;
            padding: 0 .8em;
        }
        .${DATE_PICKER_HAS_STATE} #clear {
            display: block;
        }
        .trigger {
            height:100%;
            display: flex;
            align-items: center;
            border: 1px solid var(--borderColor,rgba(0,0,0,.2));
            background-color: var(--datepicker-trigger-bgc);
        }
        .trigger xy-button {
            border: none;
            flex: 1;
        }
        </style>
        <xy-popover class="date-picker ${this.value ? DATE_PICKER_HAS_STATE : ''}" id="popover" ${this.dir? "dir='"+this.dir+"'" : ""}>
            <div class="trigger">
            <xy-button id="select" ${this.disabled? "disabled" : ""}><svg class="icon" viewBox="0 0 1024 1024"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32z m-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" p-id="8054"></path></svg><span id="datetxt"></span></xy-button><div id="clear">&#x2715</div>
            
            </div>
            <xy-popcon id="popcon" class="date-pane">
                <div class="pop-footer">
                    <xy-button autoclose>取 消</xy-button>
                    <xy-button type="primary" id="btn-submit" autoclose>确 认</xy-button>
                </div>
            </xy-popcon>
        </xy-popover>
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.clear =  this.shadowRoot.getElementById('clear');
        this.clear.addEventListener('click',(e)=>{
            e.stopPropagation();
            this.value = ''
            return false
        })
    }

    render(date=this.$value){
        if (!date) {
            return ''
        }
        setTimeout(() => {
            super.render(date);
        }, 0)
    }

    get defaultvalue() {
        const defaultvalue = this.getAttribute('defaultvalue');
        // console.log('defaultvalue', defaultvalue);
        if (!defaultvalue){
            return ''
        }
        if(this.range){
            if(defaultvalue){
                const arr = defaultvalue.split('~');
                if(arr[0]>arr[1]){
                    return [arr[1],arr[0]]
                }else{
                    return arr
                }
            }else{
                return [new Date,new Date]
            }
        }else{
            return defaultvalue || new Date;
        }
    }

    togglePopoverClsState(value) {
        let popover = this.shadowRoot.getElementById('popover')
        // console.log(popover)
        if (!popover) {
            return
        }
        if (value) {
            if (!popover.classList.contains(DATE_PICKER_HAS_STATE)) {
                popover.classList.add(DATE_PICKER_HAS_STATE)
            }
        } else {
            popover.classList.remove(DATE_PICKER_HAS_STATE)
        }
    }

    set defaultvalue(value){
        this.setAttribute('defaultvalue', value);
    }

    get value() {
        if (!this.$value) {
            return ''
        }
        return parseDate(this.$value,this.type);
    }

    set value(value) {

        if (typeof value === 'undefined' || !value) {
            this.$value = ''
            this.datetxt.textContent = ''
        } else {
            this.$value = value;
            this.datetxt.textContent = this.range?this.value.join('~'):this.value;
        }

        // console.log(this.shadowRoot);
        this.togglePopoverClsState(value)
        
        if(this.nativeclick){
            this.nativeclick = false;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value,
                    date: this.date
                }
            }));
        }else{
            if (!value) {
                return
            }
            if(this.datePane){
                this.datePane.value = this.value;
            }else{
                this.defaultvalue = this.range?this.value.join('~'):this.value;
            }
        }
    }
}

if (!customElements.get('my-date-picker')) {
    customElements.define('my-date-picker', MyDatePicker)
}

export class MyDialog extends customElements.get('xy-dialog') {
    constructor(option = {}) {
        let {type, title, attrs = {}}= option
        super(option)
        this.setAttribute('title', title);

        let classStr = ''
        let attrStr = ''
        Object.keys(attrs).forEach(key => {
            if (key === 'class') {
                classStr = attrs[key]
            }
            else {
                attrStr = attrStr + `${key}="${attrs[key]}"`
            }
        });
        console.log('attrStr', attrs, attrStr);
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        :host{
            position:fixed;
            display:flex;
            left:0;
            top:0;
            right:0;
            bottom:0;
            z-index:-1;
            background:rgba(0,0,0,.3);
            visibility:hidden;
            opacity:0;
            /*backdrop-filter: blur(3px);*/
            transition:.3s;
        }
        :host([open]){
            opacity:1;
            z-index:50;
            visibility:visible;
        }
        .dialog {
            display:flex;
            position:relative;
            min-width: 360px;
            margin:auto;
            box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
            box-sizing: border-box;
            max-width: calc(100vw - 20px);
            max-height: calc(100vh - 20px);
            border-radius: 3px;
            background-color: #fff;
            opacity:0;
            transform:scale(0.5);
            transition:.3s cubic-bezier(.645, .045, .355, 1);
        }
        .dialog--bottom {
            margin: auto auto 0 auto;
        }
        .dialog-content{
            box-sizing: border-box;
            display:flex;
            width: 100%;
            padding:0 20px;
            flex:1;
            flex-direction:column;
        }
        :host([open]) .dialog{
            opacity:1;
            transform:scale(1);
        }
        .dialog-title {
            line-height: 30px;
            padding: 15px 30px 0 0;
            font-weight: 700;
            font-size: 14px;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        .dialog-body {
            flex: 1;
            overflow: auto;
            min-height: 50px;
            padding: 10px 0;
        }
        .dialog-footer {
            padding: 3px 0 20px 0;
            margin-top: -3px;
            text-align: right;
        }
        .btn-close{
            position:absolute;
            right:10px;
            top:10px;
            border:0;
        }
        .dialog-footer xy-button {
            margin-left:10px;
        }
        .dialog-type{
            display:none;
            margin: 15px -10px 0 20px;
            width:30px;
            height:30px;
            font-size:24px;
        }
        .dialog-type[name]{
            display:flex;
        }
        #btn-cancel{
            visibility:hidden;
        }
        :host(:not([type])) .dialog-type,
        :host([type="prompt"]) .dialog-type{
            display:none;
        }
        :host([type="confirm"]) #btn-cancel,
        :host([type="prompt"]) #btn-cancel{
            visibility:visible;
        }
        xy-input{
            width:100%;
        }
        :host(:not(:empty)) xy-input{
            margin-top:10px;
        }
        :host(:empty) .dialog-body{
            min-height:0;
        }
        #btn-submit {
            display: none;
        }
        </style>
        <div class="dialog ${classStr}" part="dialog" ${attrStr}>
            <xy-icon id="dialog-type" class="dialog-type"></xy-icon>
            <div class="dialog-content">
                <div class="dialog-title" id="title">${this.title}</div>
                <xy-button class="btn-close" id="btn-close" icon="close"></xy-button>
                <div class="dialog-body">
                    <slot></slot>
                    ${(type||this.type)==="prompt"?"<xy-input></xy-input>":""}
                </div>
                <div class="dialog-footer">
                    <xy-button id="btn-cancel">${this.canceltext}</xy-button>
                    <xy-button id="btn-submit" type="primary">${this.oktext}</xy-button>
                </div>
            </div>
        </div>
        `
    }

    get title() {
        return this.getAttribute('title') || 'dialog1';
    }
}
if (!customElements.get('my-dialog')) {
    customElements.define('my-dialog', MyDialog)
}