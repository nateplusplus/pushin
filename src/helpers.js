const pushIn = require( './pushin' ).pushIn;

/**
 * Helper function: Set up and start push-in effect on all elements
 * matching the provided selector.
 *
 * @param { string } selector    Optional (legacy) - specify a unique selector for the container of the effect
 */
 window.pushInStart = ( options ) => {

	let selector = '.pushin';
	if ( options ) {
		// Backward compatibility <3.3.0 - first parameter was selector, not options
		if ( typeof options === 'string' ) {
			selector = options;
			options  = null;
		}
	}


	const elements = document.querySelectorAll( selector );

	for (let i = 0; i < elements.length; i++) {
		new pushIn( elements[i], options ).start();
	}
}
