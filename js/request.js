export default class Request {
	
	load(url) {
		return fetch(url) // Call the fetch function passing the url of the API as a parameter
		.then((response) => {
		    if (response.status >= 200 && response.status < 400) {
			    return response.json();
			} else {
				window.notification.show('Request error');
			}
		})
		.catch((error) => {
		    // This is where you run code if the server returns any errors
		    console.error('Error:', error);
		    window.notification.show('Request error');
		});
	}
}