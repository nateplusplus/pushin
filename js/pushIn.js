// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
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

var pushIn = function () {
	this.touchStart;
	this.scrollEnd;
	this.scaleArray = [];
	this.scrollPos = 0;

	this.init();
}

pushIn.prototype = {
	init: function () {
		this.bindEvents();
	},
	bindEvents: function () {
		document.addEventListener('DOMContentLoaded', function () {
			this.layers = document.getElementsByClassName('layer');
			this.pageHeight = document.body.clientHeight;

			// Hold all scale values in an array of objects
			for (var i = 0; i < this.layers.length; i++) {
				this.scaleArray.push(this.getElementScale(this.layers[i]));
			}
		}.bind(this));

		window.addEventListener("scroll", function (event) {
			this.scrollPos = window.pageYOffset;
			this.dolly(this.scrollPos);
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
	 * @return {object}
	 */
	getElementScale: function (elem) {
		var transform = /matrix\([^\)]+\)/.exec(
				window.getComputedStyle(elem)['-webkit-transform']),
			scale = {
				'x': 1,
				'y': 1
			};
		if (transform) {
			transform = transform[0].replace(
				'matrix(', '').replace(')', '').split(', ');
			scale.x = parseFloat(transform[0]);
			scale.y = parseFloat(transform[3]);
		}
		return scale;
	},
	dolly: function () {
		requestAnimationFrame(function () {
			for (var i = 0; i < this.layers.length; i++) {

				var params = [];

				if (this.layers[i].getAttribute('data-params')) {
					params = this.layers[i].getAttribute('data-params').split(',');
				}

				var inpoint = (params[0] || 0);
				var outpoint = (params[1] || pageHeight);
				var speed = (params[2] || 200);

				var scaleVal = (
					(this.scaleArray[i].x + ((this.scrollPos - inpoint) / speed))
				);

				// At the inpoint: 
				if (this.scrollPos >= inpoint && this.scrollPos <= outpoint) {
					// make sure the element is visible
					if (this.layers[i].classList.contains('hide')) {
						this.layers[i].classList.remove('hide');
					}
					// Use move data to recalculate the element's size
					var scaleString = "scale(" + scaleVal + ")";
					this.layers[i].style.webkitTransform = scaleString;
					this.layers[i].style.mozTransform = scaleString;
					this.layers[i].style.msTransform = scaleString;
					this.layers[i].style.oTransform = scaleString;
					this.layers[i].style.transform = scaleString;

				} else { // Before inpoint and after the outpoint:

					// Make sure the element is hidden
					if (!this.layers[i].classList.contains('hide')) {
						this.layers[i].classList.add('hide');
					}
					// Do not recalculate element's size
				}
			} // For loop
		}.bind(this)); // Request animation frame
	}
};

new pushIn();