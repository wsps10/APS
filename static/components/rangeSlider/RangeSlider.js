class RangeSlider extends HTMLElement {
	constructor() {
    	super();
  	}
  	connectedCallback() {
		this.initShadowDom();
		//this.colorSliderBarByThumbPos();
		this.flowFromInputToElem("field", "slider");
		this.flowFromInputToElem("slider", "field");
	}

	initShadowDom() {
		const shadowRoot = this.attachShadow({mode: "open"});
		shadowRoot.innerHTML = this.template;
	}
	/*colorSliderBarByThumbPos() {
		const self = this;
		const shadowRoot = self.shadowRoot;
		const slider = shadowRoot.querySelector("input[type=\"range\"]");
		const changeColor = () => {
			const { min, max } = self;
			const { value } = slider;
			const range = max - min;
			const thumbPos = value - min;
			const color = thumbPos === 0
				? "bg-grey"
				: thumbPos < range * 0.5 
					? "bg-green"
					: thumbPos < range * 0.75
						? "bg-orange"
						: "bg-red";

			["bg-grey", "bg-green", "bg-orange", "bg-red"].forEach(className => slider.classList.remove(className));
			slider.classList.add(color);
		}

		slider.addEventListener("input", changeColor);
		slider.addEventListener("change", changeColor);
	}*/
	flowFromInputToElem(inputId, elemId) {
		const shadowRoot = this.shadowRoot;
		const input = shadowRoot.getElementById(inputId);
		const elem = shadowRoot.getElementById(elemId);

		input.addEventListener("input", e => {
			const min = parseFloat(elem.min);
			const max = parseFloat(elem.max);
			const newVal = parseFloat(input.value);

			elem.value = newVal > max
				? max
				: newVal < min
					? min
					: newVal;
		});
	}

	get label() {
		return this.getAttribute("label") || "Range slider";
	}
	get min() {
		return this.getAttribute("min") || 0;
	}
	get max() {
		return this.getAttribute("max") || 100;
	}
	get value() {
		return this.getAttribute("value") || 80;
	}
	set label(val) {
		this.setAttribute("label", val);
	}
	set min(val) {
		this.setAttribute("min", val);
	}
	set max(val) {
		this.setAttribute("max", val);
	}
	set value(val) {
		this.setAttribute("value", val);
	}

	get template() {
		const { label, min, max, value } = this;
		return `
			<style>
				@import url('static/style/appearance.css');
				@import url('static/style/color.css');
				@import url('static/style/size.css');
				@import url('static/style/position.css');
				@import url('static/components/rangeSlider/style/slider.css');
			</style>
			<article class="w-max verdana txt-white">
				<label for="field" class="mrg-micro">${label}:</label>
				<div class="flx flx-middle">
					<div class="w-max">
						<input id="slider" type="range" min="${min}" max="${max}" value="${value}" 
							class="slider w-big">
						<div class="flx flx-middle flx-spread">
							<small id="min">${min}</small>
							<small id="max">${max}</small>
						</div>
					</div>
					<input id="field" type="number" min="0" max="${Infinity}" value="${value}" class="mrg-none 
						spin-none brd-none w-medium bg-transp txt-center georgia txt-white">
				</div>
			</article>
		`;
	}
}

window.customElements.define('range-slider', RangeSlider);