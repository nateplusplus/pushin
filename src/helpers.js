/**
 * Helper function: Set up and start push-in effect on all elements
 * matching the provided selector.
 *
 * @param { string } selector
 */
window.pushInStart = ( selector ) => {
	document.addEventListener('DOMContentLoaded', function () {
		const elements = document.querySelectorAll(selector);

		for (let i = 0; i < elements.length; i++) {
			new pushIn( elements[i] ).start();
		}
	});
}
