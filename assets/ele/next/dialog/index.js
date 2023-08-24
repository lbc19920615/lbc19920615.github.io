import Base from "../xy-base.js";
// import "../icon/index.js";
// import "../loading/index.js";
import style from "./index.css?inline" assert { type: "css" };

export default class Dialog extends Base {
    #dialog;
    #title;
    #content;
    #btnClose;
    #btnCancel;
    #btnSubmit;

    static open;
    static show;
    static alert;
    static success;
    static info;
    static warning;
    static error;
    static confirm;

    static get observedAttributes() {
        return ["loading", "open", "title", "content", "canceltext", "submittext"];
    }

    constructor(option) {
        let {type, title, attrs = {}}= option
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });

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

        this.adoptedStyle(style);
        shadowRoot.innerHTML = /*html*/`
      <dialog class="dialog ${classStr}" id="dialog" part="dialog">
        <slot class="icon" name="icon" id="icon"></slot>
        <form class="form" method="dialog">
          <xy-button id="btnClose" class="close" close type="flat">
            <xy-icon name="close"></xy-icon>
          </xy-button>
          <h4 class="title" id="title" part="title">dialog</h4>
          <slot id="content" class="content"></slot>
          <slot class="footer" name="footer" part="footer">
            <xy-button id="btnCancel" type="flat" close>取消</xy-button>
            <xy-button id="btnSubmit" type="primary">确定</xy-button>
          </slot>
        </form>
      </dialog>
        `;
        this.#dialog = shadowRoot.getElementById("dialog");
        this.#title = shadowRoot.getElementById("title");
        this.#content = shadowRoot.querySelector("#content");
        this.#btnClose = shadowRoot.getElementById("btnClose");
        this.#btnCancel = shadowRoot.getElementById("btnCancel");
        this.#btnSubmit = shadowRoot.getElementById("btnSubmit");
    }

    get open() {
        return this.getAttribute("open") !== null;
    }

    get loading() {
        return this.getAttribute("loading") !== null;
    }

    get submittext() {
        return this.getAttribute("submittext") || "确认";
    }

    get canceltext() {
        return this.getAttribute("canceltext") || "取消";
    }

    get content() {
        return this.getAttribute("content") || "";
    }

    set content(value) {
        this.setAttribute("content", value);
    }

    set submittext(value) {
        this.setAttribute("submittext", value);
    }

    set canceltext(value) {
        this.setAttribute("canceltext", value);
    }

    set open(value) {
        this.toggleAttribute("open", value);
    }

    set loading(value) {
        this.toggleAttribute("loading", value);
    }

    show() {
        this.open = true
    }

    close() {
        this.open = false
    }

    connectedCallback() {
        this.#dialog.addEventListener('click', (ev) => {
            if (ev.target.closest('[close]')) {
                this.open = false
                this.dispatchEvent(new Event("cancel"));
            }
        })
        this.#dialog.addEventListener('close', () => {
            this.open = false
            this.dispatchEvent(new Event("close"));
            console.log('close')
        })
        this.#dialog.addEventListener('cancel', () => {
            this.open = false
            this.dispatchEvent(new Event("cancel"));
            console.log('cancel')
        })
        if (this.#btnSubmit) {
            this.#btnSubmit.addEventListener('click', () => {
                this.dispatchEvent(new Event("submit"));
            })
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "open") {
            if (newValue !== null) {
                this.#dialog.showModal()
                setTimeout(() => {
                    this.#btnClose.focus()
                }, 50);
            } else {
                this.#dialog.close()
                this.loading = false
            }
        }
        if (name === "title") {
            this.#title.textContent = newValue
        }
        if (name === "content") {
            this.#content.textContent = newValue;
        }
        if (name === "canceltext" && this.#btnCancel) {
            this.#btnCancel.textContent = newValue;
        }
        if (name === "submittext" && this.#btnSubmit) {
            this.#btnSubmit.textContent = newValue;
        }
        if (name === "loading" && this.#btnSubmit) {
            this.#btnSubmit.loading = newValue !== null;
        }
    }
}

if (!customElements.get("zy-dialog")) {
    customElements.define("zy-dialog", Dialog);
}