(function() {	
	const createFormTemplate = (type, qtdSliders, buttons) => ({
		type,
		qtdSliders,
		buttons
	});

	const templateWater = createFormTemplate("Agua", 1, [
		{ "title": "Agua", "webfont": "fas fa-tint" }
	]);

	const templateVehicle = createFormTemplate("Veiculo", 2, [
		{ "title": "Metro", "webfont": "flaticon-train" },
		{ "title": "Onibus", "webfont": "flaticon-bus" },
		{ "title": "Automovel", "webfont": "flaticon-car" },
		{ "title": "Motocicleta", "webfont": "flaticon-scooter" },
		{ "title": "Veiculos pesados", "webfont": "flaticon-delivery" }
	]);

	const templateEletronic = createFormTemplate("Eletronico", 3, [
		{ "title": "TV", "webfont": "flaticon-tv" },
		{ "title": "Chuveiro", "webfont": "flaticon-shower" },
		{ "title": "Microondas", "webfont": "flaticon-food-and-restaurant" },
		{ "title": "Geladeira", "webfont": "flaticon-kitchen" }
	]);

	const createForm = ({type, qtdSliders, buttons}) => () => {
		const carousel = document.getElementById("carousel");
		if (carousel.children.length < 3) {
			const sliderForm = document.createElement("slider-form");
			sliderForm.buttons = buttons;
			sliderForm.type = type;
			const rangeSliders = Array(qtdSliders).fill(null).map(() => document.createElement("range-slider"));
			rangeSliders.forEach(slider => sliderForm.appendChild(slider));

			carousel.appendChild(sliderForm);
		}
		
	};

	const createWaterForm = createForm(templateWater);
	const createVehicleForm = createForm(templateVehicle);
	const createEletronicForm = createForm(templateEletronic);

	document.getElementById("btnWater").addEventListener("click", createWaterForm);
	document.getElementById("btnVehicle").addEventListener("click", createVehicleForm);
	document.getElementById("btnEletronic").addEventListener("click", createEletronicForm);

	document.getElementById("btnClear").addEventListener("click", () => document.querySelector("output").innerText = "");
	document.getElementById("btnCalculate").addEventListener("click", () => {
		const sliderForms = [...document.getElementsByTagName("slider-form")];
		const sliderTypes = sliderForms.map(form => ({
			type: form.type,
			object: form.object,
			rangeSliders: [...form.querySelectorAll("range-slider")]
		}));
		const sliderShadows = sliderTypes.map(obj => ({
			type: obj.type,
			object: obj.object,
			shadowRoots: obj.rangeSliders.map(elem => elem.shadowRoot)
		}));
		const sliderElems = sliderShadows.map(obj => ({
			type: obj.type,
			object: obj.object,
			elems: obj.shadowRoots.map(shadow => ({
				label: shadow.querySelector("label").innerText,
				value: shadow.querySelector("input[type=\"number\"]").value
			}))
		}));

		const request = new XMLHttpRequest();
		const str = JSON.stringify(sliderElems);
		const url = "./resultado";

		request.open("POST", url);
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = function() {
		    if(request.readyState == 4 && request.status == 200) {		    	
		    	document.querySelector("output").innerText = request.response;
		    }
		}
		request.send(str);
	});
}());