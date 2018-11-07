import Request from './request';

export default class JSONPrint {
	constructor() {
		this.fieldArea = document.querySelector('.field-area');
		
		this.isInputOpened = true;
		this.input = document.querySelector('.input');
		this.inputHeader = this.input.querySelector('.input-header');
		this.inputHeaderUp = this.inputHeader.querySelector('.icon-circle-up');
		this.inputHeaderDown = this.inputHeader.querySelector('.icon-circle-down');

		this.fields = this.input.querySelector('.fields');
		this.fieldPlainText = this.fields.querySelector('.field-area');
		this.fieldURL = this.fields.querySelector('.field-text');
		this.fieldFile = this.fields.querySelector('.field-file');
		this.processButton = this.fields.querySelector('.field-process');

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
			var url = this.fieldURL.value;	

			this.loadJSON(url);
		} else if (this.fieldFile.value) {
			console.log(this.fieldFile.value);

			this.fieldFile.value = null;	
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
		console.log('process json', data);
	}
}