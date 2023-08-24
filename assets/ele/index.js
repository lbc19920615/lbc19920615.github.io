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
import "./next/dialog/index.js";
import "./next/entry-group/index.js";


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
});

export class MyRadio extends customElements.get('xy-radio') {
    constructor() {
        super();
        this.shadowRoot.innerHTML = /*html*/`
        <style>
        :host{ 
            display:inline-block;
            font-size:14px;
            color:var(--fontColor,#333);
            -webkit-tap-highlight-color: transparent;
        }
        :host([disabled]){ 
            pointer-events: none; 
            opacity:.6; 
        }
        :host([disabled]) label{ 
            pointer-events: all;  
            cursor: not-allowed; 
        }
        #radio{
            position:absolute;
            clip:rect(0,0,0,0);
        }
        :host(:focus-within) .cheked,:host(:not([disabled])) label:hover .cheked{ 
            border-color:var(--themeColor,#42b983);
            /*box-shadow: 0 0 10px rgba(0,0,0,0.1);*/
            z-index:1;
        }
        :host([disabled]) .cheked{ 
            background:rgba(0,0,0,.1);
        }
        label{
            box-sizing:border-box;
            cursor:pointer;
            display:flex;
            align-items:center;
            outline:0;
        }
        .cheked{
            position:relative;
            box-sizing: border-box;
            width: 16px;
            height: 16px;
            display: flex;
            border-radius:50%;
            border: 1px solid var(--borderColor,rgba(0,0,0,.2));
            transition:.3s;
            margin-right:.5em;
        }
        :host(:empty) .cheked{
            margin-right:0;
        }
        .cheked::before{
            content:'';
            width:8px;
            height:8px;
            margin:auto;
            border-radius:50%;
            background:var(--themeColor,#42b983);
            transform: scale(0);
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        .cheked::after{
            position:absolute;
            content:'';
            width:100%;
            height:100%;
            background:var(--themeColor,#42b983);
            border-radius:50%;
            opacity:.2;
            transform:scale(0);
            z-index:-1;
            transition: .2s cubic-bezier(.12, .4, .29, 1.46) .1s;
        }
        /*
        :host(:focus-within) .cheked::after,:host(:not([disabled]):active) .cheked::after{ 
            transform:scale(2.5);
        }
        */
        #radio:focus-visible+label .cheked::after{
            transform:scale(2.5);
        }
        #radio:checked+label .cheked::before{
            transform: scale(1);
        }
        #radio:checked+label .cheked{
            border-color:var(--themeColor,#42b983);
        }
        </style>
        <input type="checkbox" id="radio" part="radio" ><label id="label" for="radio" part="label"><span class="cheked" part="checked"></span><slot></slot></label>
        `
    }

    tocheck() {
        const selector = this.group?`my-radio[checked]`:`my-radio[name="${this.name}"][checked]`;
        const prev = this.parent.querySelector(selector);
        if( prev ){
            prev.checked = false;
        }
        this.checked = true;
    }

    connectedCallback() {
        this.group = this.closest('xy-radio-group');
        this.parent = this.group||this.getRootNode();
        this.radio = this.shadowRoot.getElementById('radio');
        this.disabled = this.disabled;
        this.checked = this.checked;
        this.radio.addEventListener('change',(ev)=>{
            this.tocheck();
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    checked: this.checked
                }
            }));
        })
    }
}

customElements.define('my-radio', MyRadio);


class MyRadioGroup extends HTMLElement {
    static get observedAttributes() { return ['disabled','required'] }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host {
            display:inline-block;
        }
        :host(:focus-within) xy-tips,:host(:hover) xy-tips{
            z-index:2;
        }
        :host([disabled]){ 
            pointer-events: none; 
        }
        :host([disabled]) xy-tips{
            pointer-events: all;
            cursor: not-allowed;
            outline: 0;
        }
        ::slotted(my-radio){
            transition: opacity .3s;
        }
        :host([disabled]) ::slotted(my-radio){
            pointer-events: none;
            opacity:.6;
        }
        xy-tips[show=show]{
            --themeColor:var(--errorColor,#f4615c);
            --borderColor:var(--errorColor,#f4615c);
        }
        </style>
        <xy-tips id="tip" type="error"><slot></slot></xy-tips>
        `
    }

    get name() {
        return this.getAttribute('name');
    }

    get required() {
        return this.getAttribute('required')!==null;
    }

    get defaultvalue() {
        return this.getAttribute('defaultvalue')||"";
    }

    get value() {
        const radio = this.querySelector('my-radio[checked]');
        return radio?radio.value:'';
    }

    get novalidate() {
        return this.getAttribute('novalidate')!==null;
    }

    get disabled() {
        return this.getAttribute('disabled')!==null;
    }

    get validity() {
        return this.value!=='';
    }

    get invalid() {
        return this.getAttribute('invalid')!==null;
    }

    set value(value) {
        this.elements.forEach(el=>{
            if(value == el.value){
                el.checked = true;
            }else{
                el.checked = false;
            }
        })
    }

    set required(value) {
        if(value===null||value===false){
            this.removeAttribute('required');
        }else{
            this.setAttribute('required', '');
        }
    }

    set novalidate(value) {
        if(value===null||value===false){
            this.removeAttribute('novalidate');
        }else{
            this.setAttribute('novalidate', '');
        }
    }

    set disabled(value) {
        if(value===null||value===false){
            this.removeAttribute('disabled');
        }else{
            this.setAttribute('disabled', '');
        }
    }

    set invalid(value) {
        if(value===null||value===false){
            this.removeAttribute('invalid');
        }else{
            this.setAttribute('invalid', '');
        }
    }

    focus(){
        if(getComputedStyle(this.tip).zIndex!=2){
            this.elements[0].focus();
        }
    }

    reset() {
        this.value = this.defaultvalue;
        this.invalid = false;
        this.tip.show = false;
    }

    checkValidity(){
        if(this.novalidate||this.disabled||this.form&&this.form.novalidate){
            return true;
        }
        if(this.validity){
            this.tip.show = false;
            this.invalid = false;
            return true;
        }else{
            this.focus();
            this.invalid = true;
            this.tip.show = 'show';
            this.tip.tips = '请选择1项';
            return false;
        }
    }

    connectedCallback() {
        this.form = this.closest('xy-form');
        this.tip  = this.shadowRoot.getElementById('tip');
        this.slots = this.shadowRoot.querySelector('slot');
        this.slots.addEventListener('slotchange',()=>{
            this.elements  = this.querySelectorAll('my-radio');
            this.value = this.defaultvalue;
            this.elements.forEach(el=>{
                el.addEventListener('change',()=>{
                    if(el.checked){
                        this.checkValidity();
                        this.dispatchEvent(new CustomEvent('change',{
                            detail:{
                                value:this.value
                            }
                        }));
                    }
                })
            })
            this.init = true;
        })
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if( name == 'disabled' && this.tip){
            if(newValue!==null){
                this.tip.setAttribute('tabindex',-1);
            }else{
                this.tip.removeAttribute('tabindex');
            }
        }
    }
}

if(!customElements.get('my-radio-group')){
    customElements.define('my-radio-group', MyRadioGroup);
}



const DATE_PICKER_HAS_STATE = 'date-picker--has-val';

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