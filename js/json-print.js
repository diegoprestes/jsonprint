import Request from './request';

export default class JSONPrint {
	constructor() {
		this.fieldArea = document.querySelector('.field-area');
		
		this.isInputOpened = true;
		this.input = document.querySelector('.input');
		this.inputHeader = this.input.querySelector('.input-header');
		this.inputHeaderUp = this.inputHeader.querySelector('.icon-cheveron-outline-up');
		this.inputHeaderDown = this.inputHeader.querySelector('.icon-cheveron-outline-down');

		this.fields = this.input.querySelector('.fields');
		this.fieldPlainText = this.fields.querySelector('.field-area');
		this.fieldURL = this.fields.querySelector('.field-text');
		this.fieldFile = this.fields.querySelector('.field-file');
		this.processButton = this.fields.querySelector('.field-process');

		this.output = document.querySelector('.output');

		this.bindEvents();
	}

	bindEvents() {
		this.inputHeader.addEventListener('click', () => {
			this.updateInputState(!this.isInputOpened);
		});

		this.processButton.addEventListener('click', () => {
			this.validateInput();
		});
	}

	updateInputState(state) {
		this.isInputOpened = state;

		if (this.isInputOpened) {
			this.inputHeaderUp.classList.remove('hidden');
			this.inputHeaderDown.classList.add('hidden');
			this.fields.classList.remove('hidden');
		} else {
			this.inputHeaderUp.classList.add('hidden');
			this.inputHeaderDown.classList.remove('hidden');
			this.fields.classList.add('hidden');
		}
	}

	validateInput() {
		if (this.fieldPlainText.value) {
			try {
				let json = JSON.parse(this.fieldPlainText.value);

				this.processJSON(json);
			} catch {
				window.notification.show('Invalid JSON');
			}
		} else if (this.fieldURL.value) {
			let url = this.fieldURL.value;	

			this.loadJSON(url);
		} else if (this.fieldFile.value) {
			let url = window.URL.createObjectURL(this.fieldFile.files[0]);

			this.loadJSON(url);
		}
	}

	loadJSON(url) {
		let request = new Request();
		request.load(url)
		.then((data) => {
			if (data) {
				this.processJSON(data);
			}
		});
	}

	processJSON(data) {
		this.updateInputState(false);

		let bracketStart = '{';
		let bracketEnd = '}';
		if (data instanceof Array) {
			bracketStart = '[';
			bracketEnd = ']';
		}
		
		var html = '<div class="json-wrapper">';
		html += bracketStart + this.processObject(data) + bracketEnd;
		html += '</div>';

		this.output.innerHTML = html;

		this.bindOutput();
	}

	processObject(data) {
		let html = '<ul>';
		for (let key in data) {
			let keyClass = 'json-key';
			let keyText = '"' + key + '"';
			let keySeparator = ': ';
			if (typeof(data[key]) == 'object' && data[key] != null) {
				keyClass = 'json-key expansive';
			}
			if (data instanceof Array) {
				keyText = '';
				keySeparator = '';
			}
			let keyIcons = '<span class="icon icon-add-outline"></span><span class="icon icon-minus-outline"></span>';
			let keyValue = '<span class="' + keyClass + '">' + keyIcons + keyText + '</span>' + keySeparator;

			html += '<li>';
			if (data[key] == null) {
				html += keyValue + '<span class="json-value-null">' + data[key] + '</span>' + ',';
			} else if (typeof(data[key]) == 'object') {
				let bracketStart = '{';
				let bracketEnd = '}';
				if (data[key] instanceof Array) {
					bracketStart = '[';
					bracketEnd = ']';
				}

				html += keyValue + bracketStart + this.processObject(data[key]) + bracketEnd + ',';
			} else {
				if (typeof(data[key]) == 'string') {
					html += keyValue + '"' + '<span class="json-value-string">' + data[key] + '</span>' + '",';
				} else {
					let valueClass = 'json-value-number';
					if (typeof(data[key]) == "boolean") {
						valueClass = 'json-value-bool';
					}
					html += keyValue + '<span class="' + valueClass + '">' + data[key] + '</span>' + ',';
				}
				
			}
			html += '</li>';
		}
		html += '</ul>';

		return html;
	}

	bindOutput() {
		var jsonKeyList = document.querySelectorAll('.json-key.expansive');
		jsonKeyList.forEach((item) => {
			item.addEventListener('click', (event) => {
				let target = event.currentTarget;
				if (target.classList.contains('closed')) {
					target.classList.remove('closed');
				} else {
					target.classList.add('closed');
				}
			});
		});
	}
}