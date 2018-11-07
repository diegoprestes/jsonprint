export default class JSONPrint {
	constructor() {
		this.fieldArea = document.querySelector('.field-area');
		
		this.isInputOpened = true;
		this.input = document.querySelector('.input');
		this.inputHeader = this.input.querySelector('.input-header');
		this.inputHeaderUp = this.inputHeader.querySelector('.icon-circle-up');
		this.inputHeaderDown = this.inputHeader.querySelector('.icon-circle-down');

		this.fields = this.input.querySelector('.fields');
		this.processButton = this.fields.querySelector('.field-process');
		
		this.bindEvents();
	}

	bindEvents() {
		this.inputHeader.addEventListener('click', () => {
			this.isInputOpened = !this.isInputOpened;
			
			if (this.isInputOpened) {
				this.inputHeaderUp.classList.remove('hidden');
				this.inputHeaderDown.classList.add('hidden');
				this.fields.classList.remove('hidden');
			} else {
				this.inputHeaderUp.classList.add('hidden');
				this.inputHeaderDown.classList.remove('hidden');
				this.fields.classList.add('hidden');
			}
		});

		this.processButton.addEventListener('click', () => {
			console.log('click');
		});
	}
}