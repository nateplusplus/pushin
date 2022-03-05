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

/**
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * MIT license
 */
 (function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
}());
