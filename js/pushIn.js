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
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
var pushIn = function ( parent ) {
	this.touchStart;
	this.scrollEnd;
	this.scaleArray = [];
	this.scrollPos = 0;

	this.parent = parent;

	this.init();
}

/**
 * Prototype functions for the PushIn object.
 */
pushIn.prototype = {

	/**
	 * Initialize the object to start everything up.
	 */
	init: function () {
		this.bindEvents();
	},

	/**
	 * Bind event listeners to watch for page load and user interaction.
	 */
	bindEvents: function () {
		this.layers    = this.parent.getElementsByClassName('layer');
		this.scrollPos = window.pageYOffset;

		// Find all layers on the page and store them with their parameters
		for (var i = 0; i < this.layers.length; i++) {
			var params = [];
			if (this.layers[i].getAttribute('data-params')) {
				params = this.layers[i].getAttribute('data-params').split(',');
			}

			var top = this.parent.getBoundingClientRect().top;
			if ( this.parent.dataset.hasOwnProperty('from') ) {
				top = this.parent.dataset.from;
			}

			var bottom = this.parent.getBoundingClientRect().bottom;
			if ( this.parent.dataset.hasOwnProperty('to') ) {
				bottom = this.parent.dataset.to;
			}

			this.scaleArray.push({
				elem : this.layers[i],
				index: i,
				originalScale: this.getElementScaleX( this.layers[i] ),
				params: {
					inpoint  : (params[0] || top),
					outpoint : (params[1] || bottom),
					speed    : (params[2] || 200)
				}
			});
		}

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
		var transform = /matrix\([^\)]+\)/.exec(
				window.getComputedStyle(elem)['-webkit-transform']),
			scaleX = 1;
		if (transform) {
			transform = transform[0].replace(
				'matrix(', '').replace(')', '').split(', ');
			scaleX = parseFloat(transform[0]);
		}
		return scaleX;
	},

	/**
	 * Animation effect, mimicking a camera dolly on the webpage.
	 */
	dolly: function () {
		requestAnimationFrame(function () {
			this.scaleArray.forEach( function( layer ) {
				if ( this.isActive( layer ) ) {
					layer.elem.classList.remove('hide');
					this.setScale( layer.elem, this.getScaleValue( layer ) );
				} else if( ! this.isVisible( layer ) ) {
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
	 * Whether or not a layer should be visible
	 *
	 * @param {Object} layer 
	 * @returns Boolean
	 */
	isVisible: function( layer ) {
		var isVisible = false;
		if ( layer.index === 0 && this.scrollPos < layer.params.inpoint ) {
			// If this is the first layer and  we have scrolled past the top of the parent, it should be visible
			isVisible = true;
		} else if ( layer.index === this.layers.length && this.scrollPos > layer.params.outpoint ) {
			// If this is the last layer and we have scrolled past the bottom of the parent, it should be visible
			isVisible = true;
		}
		return isVisible;
	},

	/**
	 * Get the scaleX value for the layer.
	 *
	 * @param {Object} layer 
	 * @returns 
	 */
	getScaleValue: function(layer) {
		return layer.originalScale + ((this.scrollPos - layer.params.inpoint) / layer.params.speed);
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
	}
};

document.addEventListener('DOMContentLoaded', function () {
	var parents = document.getElementsByClassName('push-in');

	for (var i = 0; i < parents.length; i++) {
		new pushIn( parents[i] );
	}
});