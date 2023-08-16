import 'https://unpkg.com/xy-ui';

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
    // constructor(option = {}) {
    //     super(option);
    //     // console.log(option, this.shadowRoot);
    // }

    render(date=this.$value){
        if (!this.$value) {
            return ''
        }
        super.render(date)
    }

    get value() {
        // console.log(this.$value);
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

        
        if(this.nativeclick){
            this.nativeclick = false;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: this.value,
                    date: this.date
                }
            }));
        }else{
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
        let {type, title}= option
        super(option)
        this.setAttribute('title', title)
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
        <div class="dialog">
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