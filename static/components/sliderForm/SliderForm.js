class SliderForm extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.initShadowDom();
		const shadowRoot = this.shadowRoot;
		const form = shadowRoot.querySelector("form");

		setTimeout(() => form.classList.add("fade-in"), 100);
	}

	initShadowDom() {
		const shadowRoot = this.attachShadow({mode: "open"});
		shadowRoot.innerHTML = this.template;
	}
	buttonsTemplate() {
		const dataButtons = this.buttons;
		return dataButtons.reduce(function(template, button){
			return template + `
				<header-button title="${button.title}" webfont="${button.webfont}" classes="brd-none bg-transp 
					txt-white txt-green__hover">
				</header-button>`
		}, ``);
	}

	get buttons() {
		const str = this.getAttribute("buttons");
		return JSON.parse(str);
	}
	get type() {
		return this.getAttribute("type");
	}
	get object() {
		return this.getAttribute("object") || "";
	}
	set buttons(arr) {
		const str = JSON.stringify(arr);
		this.setAttribute("buttons", str);
	}
	set type(str) {
		this.setAttribute("type", str);
	}
	set object(title) {
		this.setAttribute("object", title);
	}
	get template() {
		return `
			<style>
			    @import url('static/style/appearance.css');
			    @import url('static/style/color.css');
				@import url('static/style/size.css');
				@import url('static/style/position.css');
				/*@import url('components/sliderForm/style/hide.css');*/

				.hidden {
					opacity: 0;
				}
				.fade-in { 
					opacity: 1;
					transition: opacity .6s ease-in;
				}
				form:hover .fade-in { 
					opacity: 1;
					transition: opacity .6s ease-in;
				}
				form:not(:hover) .fade-out {
					opacity: 0;
					transition: opacity .6s ease-in;
				}
			</style>
			<form class="w-min pdg-micro hidden">
				<header class="flx flx-middle flx-spread fade-out fade-in">
					<article>${ this.buttonsTemplate() }</article>
					<article>
						<header-button title="Deletar" isDelete="true" webfont="far fa-trash-alt" classes="brd-none bg-transp 
							txt-white txt-red__hover">
						</header-button>
					</article>
				</header>
				<section>
					<slot></slot>
				</section>
			</form>
		`;
	}
}
window.customElements.define('slider-form', SliderForm);