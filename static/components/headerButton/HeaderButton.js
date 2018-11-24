class HeaderButton extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.initShadowDom();
		this.observeClick();
		this.maybeDeleteOnClick();
	}

	initShadowDom() {
		const shadowRoot = this.attachShadow({mode: "open"});
		shadowRoot.innerHTML = this.template;
	}
	observeClick() {
		if (!this.isDelete) {
			const shadowRoot = this.shadowRoot;
			const button = shadowRoot.querySelector("button");
			const innerShadow = button.parentNode;
			const headerButton = innerShadow.host;
			const article = headerButton.parentNode;
			const header = article.parentNode;
			const form = header.parentNode;
			const outerShadow = form.parentNode;
			const sliderForm = outerShadow.host;

			/*const toggleFixButton = () => {
				const toggleWhiteAndGreen = btn => {
					btn.classList.toggle("txt-white");
					btn.classList.toggle("txt-green");
				};
				const headerButtons = [...article.querySelectorAll("header-button")];
				const buttons = headerButtons.map(btn => btn.shadowRoot.querySelector("button")).flat();

				buttons.forEach(toggleWhiteAndGreen);
				toggleWhiteAndGreen(button);
			};*/
			const detailClickedIconForSliderForm = () => {
				sliderForm.object = this.title;
			}
			const describeDataOnRangeSlider = () => {
				const { type } = sliderForm;
				const description = dictionary.filter(obj => obj.id === type)[0].labels;
				const rangeSliders = [...sliderForm.querySelectorAll("range-slider")];
				const formLabels = rangeSliders.map(slider => slider.shadowRoot.querySelector("label"));

				formLabels.forEach((form, i) => form.innerText = description[i] + ":");
			};
			const insertDataOnRangeSlider = () => {
				const rangeSliders = [...sliderForm.querySelectorAll("range-slider")];
				const shadowSliders = rangeSliders.map(slider => slider.shadowRoot);
				/*const response = [
				    {"min": 1, "max": 3, "value": 1},
				    {"min": 1, "max": 7, "value": 5}
				];*/

				const request = new XMLHttpRequest();
				const str = JSON.stringify({"object": button.title});
				const url = "./valores";

				request.open("POST", url);
				request.setRequestHeader("Content-type", "application/json");
				request.onreadystatechange = function() {
				    if(request.readyState == 4 && request.status == 200) {
				        shadowSliders.forEach((shadow, i) => {
				        	const json = JSON.parse(request.response);
							const data = json[i];
							const slider = shadow.getElementById("slider");
							const min = shadow.getElementById("min");
							const max = shadow.getElementById("max");

							min.innerText = data.min;
							max.innerText = data.max;
							slider.min = data.min;
							slider.max = data.max;
							slider.value = data.value;

							const trigger = new Event("input");
							slider.dispatchEvent(trigger);
						});
				    }
				}
				request.send(str);
			};

			//button.addEventListener("click", toggleFixButton);
			button.addEventListener("click", describeDataOnRangeSlider);
			button.addEventListener("click", insertDataOnRangeSlider);
			button.addEventListener("click", detailClickedIconForSliderForm);
		}
		
	}
	maybeDeleteOnClick() {
		if (this.isDelete){
			const shadowRoot = this.shadowRoot;
			const button = shadowRoot.querySelector("button");
			const innerShadow = button.parentNode;
			const headerButton = innerShadow.host;
			const article = headerButton.parentNode;
			const header = article.parentNode;
			const form = header.parentNode;
			const outerShadow = form.parentNode;
			const sliderForm = outerShadow.host;
			const carousel = sliderForm.parentNode;

			button.addEventListener("click", () => {
				setTimeout(() => carousel.removeChild(sliderForm), 600);
				sliderForm.classList.add("fade-out");
			}); 
		}
	}

	get title() {
		return this.getAttribute("title");
	}
	get webfont() {
		return this.getAttribute("webfont");
	}
	get classes() {
		return this.getAttribute("classes");
	}
	get isDelete() {
		const isDelete = this.getAttribute("isdelete");
		return !!isDelete;
	}
	get template() {
		return `
			<style>
				@import url("static/fonts/fontawesome-free-5.5.0-web/css/all.css");
			    @import url("static/fonts/flaticon.css");
			    @import url('static/style/appearance.css');
			    @import url('static/style/color.css');
				@import url('static/style/size.css');
				@import url('static/style/position.css');
				@import url('static/components/headerButton/style/button.css');
			</style>
			<button type="button" title="${this.title}" class="${this.classes}">
				<i class="${this.webfont}"></i>
			</button>
		`;
	}
}
window.customElements.define('header-button', HeaderButton);