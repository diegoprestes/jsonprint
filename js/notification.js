export default class Notification {
	constructor() {
		this.element = document.querySelector('.notification');
	}

	show(message) {
		this.element.innerHTML = message;

		this.element.classList.add('visible');
		setTimeout(() => {
			this.element.classList.remove('visible');
		}, 2000);
	}
}