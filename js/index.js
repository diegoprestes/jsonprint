import JSONPrint from './json-print';
import Notification from './notification';

document.addEventListener('DOMContentLoaded', function() {
	window.notification = new Notification();

	new JSONPrint();
});