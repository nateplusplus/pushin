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

/**
 * Helper function: Set up and start push-in effect on all elements
 * matching the provided selector.
 *
 * @param { string } selector
 */
function pushInStart( selector ) {
	document.addEventListener('DOMContentLoaded', function () {
		var elements = document.querySelectorAll(selector);

		for (var i = 0; i < elements.length; i++) {
			new pushIn( elements[i] ).start();
		}
	});
}

/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
var pushIn = function ( parent ) {
	this.touchStart;
	this.scrollEnd;
	this.layers = [];
	this.scrollPos = 0;

	this.parent = parent || null;
}

/**
 * Prototype functions for the PushIn object.
 */
pushIn.prototype = {

	/**
	 * Initialize the object to start everything up.
	 */
	start: function () {
		if ( this.parent ) {
			this.appendStyles();
			this.scrollPos = window.pageYOffset;
			this.getLayers();
			this.bindEvents();
		} else {
			console.error( 'No parent element provided to pushIn.js. Effect will not be applied.' );
		}
	},

	/**
	 * Find all layers on the page and store them with their parameters
	 */
	 getLayers: function () {
		var layers = this.parent.getElementsByClassName('layer');
		if ( layers ) {
			for (var i = 0; i < layers.length; i++) {
				var elem = layers[i];
	
				var inpoint  = elem.dataset.hasOwnProperty( 'pushinFrom' ) ? elem.dataset.pushinFrom : null;
				var outpoint = elem.dataset.hasOwnProperty( 'pushinTo' ) ? elem.dataset.pushinTo : null;
				var speed    = elem.dataset.hasOwnProperty( 'pushinSpeed' ) ? elem.dataset.pushinSpeed : null;
	
				var top = this.parent.getBoundingClientRect().top;
				if ( this.parent.dataset.hasOwnProperty('pushinFrom') ) {
					top = this.parent.dataset.pushinFrom;
				}
	
				var bottom = this.parent.getBoundingClientRect().bottom;
				if ( this.parent.dataset.hasOwnProperty('pushinTo') ) {
					bottom = this.parent.dataset.pushinTo;
				}

				layer = {
					elem : elem,
					index: i,
					originalScale: this.getElementScaleX( elem ),
					params: {
						inpoint  : (inpoint || top),
						outpoint : (outpoint || bottom),
						speed    : (speed || 8)
					}
				};

				this.layers.push( layer );
				this.setZIndex( layer, layers.length );
			}
		}
	},

	/**
	 * Set the z-index of each layer so they overlap correctly.
	 *
	 * @param {object} layer
	 * @param {int} total
	 */
	setZIndex( layer, total ) {
		layer.elem.style.zIndex = total - layer.index;
	},

	/**
	 * Bind event listeners to watch for page load and user interaction.
	 */
	bindEvents: function () {
		window.addEventListener("scroll", function (event) {
			this.scrollPos = window.pageYOffset;
			this.dolly();
		}.bind(this));

		window.addEventListener("touchstart", function (event) {
			this.touchStart = event.changedTouches[0].screenY;
		}.bind(this));

		window.addEventListener("touchmove", function (event) {
			event.preventDefault();

			var touchMove = event.changedTouches[0].screenY;
			this.scrollPos = Math.max(this.scrollEnd + this.touchStart - touchMove, 0);
			this.scrollPos = Math.min(this.scrollPos, this.pageHeight - window.innerHeight);

			dolly();
		}.bind(this));

		window.addEventListener("touchend", function (event) {
			this.scrollEnd = this.scrollPos;
		}.bind(this));
	},

	/**
	 * Get the initial scale of the element at time of DOM load.
	 *
	 * @param {Element} elem 
	 * @return {Number} scaleX
	 */
	getElementScaleX: function (elem) {
		var transform = window.getComputedStyle( elem ).getPropertyValue( 'transform' );

		var scaleX = 1;
		if ( transform && transform !== 'none' ) {
			var match = transform.match( /[matrix|scale]\(([\d,\.\s]+)/ );
			if ( match && match[1] ) {
				var matrix = match[1].split( ', ' );
				scaleX = parseFloat(matrix[0]);
			}
		}


		return scaleX;
	},

	/**
	 * Animation effect, mimicking a camera dolly on the webpage.
	 */
	dolly: function () {
		requestAnimationFrame(function () {
			this.layers.forEach( function( layer ) {
				if ( this.isActive( layer ) ) {
					layer.elem.classList.remove('hide');
					this.setScale( layer.elem, this.getScaleValue( layer ) );
				} else if ( this.shouldHide( layer ) ) {
					layer.elem.classList.add('hide');
				}
			}.bind(this));
		}.bind(this));
	},

	/**
	 * Whether or not a layer should currently be zooming.
	 *
	 * @param {Object} layer 
	 * @returns Boolean
	 */
	isActive: function( layer ) {
		return this.scrollPos >= layer.params.inpoint && this.scrollPos <= layer.params.outpoint;
	},

	/**
	 * Whether or not a layer should be hidden
	 *
	 * @param {Object} layer 
	 * @returns Boolean
	 */
	shouldHide: function( layer ) {
		var hide = true;
		var isFirst = layer.index === 0;
		var isLast = layer.index + 1 === this.layers.length;

		if ( isFirst && this.scrollPos < layer.params.inpoint ) {
			hide = false;
		} else if ( isLast && this.scrollPos > layer.params.outpoint ) {
			// If this is the last layer and we have scrolled past the bottom of the parent, it should be visible
			hide = false;
		} else if ( ! isFirst && ! isLast & this.isActive( layer )) {
			hide = false;
		}
		return hide;
	},

	/**
	 * Get the scaleX value for the layer.
	 *
	 * @param {Object} layer 
	 * @return {Number}
	 */
	getScaleValue: function(layer) {
		var distance = this.scrollPos - layer.params.inpoint;
		var speed    = Math.min( layer.params.speed, 100 ) / 100;
		var delta    = ( distance * speed ) / 100;

		return Math.max( layer.originalScale + delta, 0 );
	},

	/**
	 * Set element scale.
	 *
	 * @param {HtmlElement} elem 
	 * @param {Number} value 
	 */
	setScale: function( elem, value ) {
		var scaleString = "scale(" + value + ")";
		elem.style.webkitTransform = scaleString;
		elem.style.mozTransform = scaleString;
		elem.style.msTransform = scaleString;
		elem.style.oTransform = scaleString;
		elem.style.transform = scaleString;
	},

	/**
	 * Add a few simple CSS styles to the page for functionality.
	 */
	appendStyles: function() {
		var stylesheet = document.getElementById( 'pushinStyles' );
		if ( ! stylesheet ) {
			stylesheet = document.createElement( 'style' );
			stylesheet.id = 'pushinStyles';
			stylesheet.innerText = ".hide{ opacity: 0 !important; } .layer { width: 100%; height: 100%; transition: opacity 1000ms ease; position: fixed; }";

			document.head.appendChild( stylesheet )
		}
	}

};


// Export for mocha unit tests
if ( typeof exports !== 'undefined' ) {
	exports.pushIn = pushIn;
}