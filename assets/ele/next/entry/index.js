import Base from "../zy-base.js";
import style from "./index.css" assert { type: "css" };

export default class Radio extends Base {
	#radio;
	#num;
	static get observedAttributes() {
		return ["disabled", "checked", "required", "item_val", "item_min", "item_max"];
	}

	focus(options) {
		this.#radio.focus(options);
	}

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });
		this.adoptedStyle(style);
		shadowRoot.innerHTML = `
      <input class="radio" part="radio" type="radio" id="radio">
      <label class="label" for="radio" part="label">
          <slot></slot>
		  <xy-input part="entry_input" id="num" type="number" step="1" ></xy-input>
      </label>
	  
      `;
		this.#radio = shadowRoot.getElementById("radio");
		this.#num = shadowRoot.getElementById("num");
	}

	get disabled() {
		return this.getAttribute("disabled") !== null;
	}

	get checked() {
		return this.getAttribute("checked") !== null;
	}

	get required() {
		return this.getAttribute("required") !== null;
	}

	getInput() {
		return this.#num.input
	}

	set item_val(value) {
		this.#num.value = value
	}

	set item_min(value) {
		this.#num.input.setAttribute('min', value)
	}

	set item_max(value) {
		console.dir(this.#num);
		this.#num.input.setAttribute('max', value)
	}

	get value() {
		return parseFloat(this.#num.value) 
		// return this.getAttribute("value") || this.textContent;
	}

	set disabled(value) {
		this.toggleAttribute("disabled", value);
	}

	set checked(value) {
		this.toggleAttribute("checked", value);
	}

	set required(value) {
		this.toggleAttribute("required", value);
	}

	connectedCallback() {
		this.radioGroup = document.querySelectorAll(
			`zy-radio[name='${this.name}']`
		);
		this.#radio.addEventListener("click", (ev) => {
			// this.checked = ev.target.checked;
			// // this.checkValidity();
			// this.dispatchEvent(new InputEvent("change"));
			this.checked = true;
		});
		// this.#num.addEventListener("focus", (ev) => {
		// 	this.checked = true;
		// })
		this.#num.addEventListener('change', () => {
			this.dispatchEvent(new InputEvent("change"));
		})
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// console.log(name);
		// this.#radio[name] = newValue !== null;
		if (name === "checked" && newValue !== null) {
			// 将其他radio选中态取消
			if (this.radioGroup?.length) {
				const prev = [...this.radioGroup].find(
					(el) => el.checked && el !== this
				);
				if (prev) {
					prev.checked = false;
				}
			}
		}
		if (name === 'item_val') {
			this.item_val = newValue
		}

		if (name === 'item_min') {
			this.item_min = newValue
		}

		if (name === 'item_max') {
			this.item_max = newValue
		}
	}
}

if (!customElements.get("zy-entry")) {
	customElements.define("zy-entry", Radio);
}