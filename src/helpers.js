const pushIn = require( './pushin' ).pushIn;

/**
 * Helper function: Set up and start push-in effect on all elements
 * matching the provided selector.
 *
 * @param { string } selector    Optional (legacy) - specify a unique selector for the container of the effect
 */
 window.pushInStart = ( selector ) => {
	selector = ( selector || '.pushin' );

	const elements = document.querySelectorAll( selector );

	for (let i = 0; i < elements.length; i++) {
		new pushIn( elements[i] ).start();
	}
}
