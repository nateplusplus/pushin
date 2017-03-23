// Task: When user scrolls, or touchmoves, elements on the page grow or shrink in their relative positions.
// Solution: Use event listeners to target scroll/touchmove actions, and bind them to CSS transforms
	// Actions should be bound to specific elements based on id


// Reference: http://kristerkari.github.io/adventures-in-webkit-land/blog/2013/08/30/fixing-a-parallax-scrolling-website-to-run-in-60-fps/





// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var layers = document.getElementsByClassName('layer');
var pageHeight = document.body.clientHeight;


// Get the initial scale of the element at time of DOM load
function getElementScale(elem) {
	var transform = /matrix\([^\)]+\)/.exec(
		window.getComputedStyle(elem)['-webkit-transform']),
		scale = {'x': 1, 'y': 1};
	if( transform ) {
		transform = transform[0].replace(
			'matrix(', '').replace(')', '').split(', ');
		scale.x = parseFloat(transform[0]);
		scale.y = parseFloat(transform[3]);
	}
	return scale;
}

// Hold all scale values in an array of objects
var scaleArray = [];

for ( var i=0; i<layers.length; i++ ){
	scaleArray.push( getElementScale( layers[i] ) );
}

/* =============================================== 
	scaleArray should only be defined one time
	this allows for original CSS transforms to
	be used as a base-point for the push-in effect
/* =============================================== */

var dolly = function(scrollPos) {
	
	requestAnimationFrame( function(){
	
		for( var i=0; i<layers.length; i++){

			var params = [];

			if ( layers[i].getAttribute('data-params') ){
				params = layers[i].getAttribute('data-params').split(',');
			}

			var inpoint = ( params[0] || 0 );
			var outpoint = ( params[1] || pageHeight );
			var speed = ( params[2] || 200 );

			var scaleVal = (
				(scaleArray[i].x + ( (scrollPos - inpoint) / speed ) )
				);

			// At the inpoint: 
			if(scrollPos >= inpoint && scrollPos <= outpoint){
				// make sure the element is visible
				if(layers[i].classList.contains('hide')){
					layers[i].classList.remove('hide');
				}
				// Use move data to recalculate the element's size
				var scaleString = "scale("+scaleVal+")";
				layers[i].style.webkitTransform = scaleString;
				layers[i].style.mozTransform = scaleString;
				layers[i].style.msTransform = scaleString;
				layers[i].style.oTransform = scaleString;
				layers[i].style.transform = scaleString;

			} else { // Before inpoint and after the outpoint:

				// Make sure the element is hidden
				if(!layers[i].classList.contains('hide')){
					layers[i].classList.add('hide');
				}
				// Do not recalculate element's size
			}
		} // For loop
	}); // Request animation frame
} // Dolly function


// Detect when user scrolls or touchmoves

var scrollPos = 0,
	touchStart = null,
	scrollEnd = null;

window.addEventListener("scroll", function(event) {

	scrollPos = window.pageYOffset;

	dolly(scrollPos);
	
});

window.addEventListener("touchstart", function(event) {
	touchStart = event.changedTouches[0].screenY;
});

window.addEventListener("touchmove", function(event) {
	event.preventDefault();
	
	var touchMove = event.changedTouches[0].screenY;
	scrollPos = Math.max(scrollEnd+touchStart-touchMove, 0);
	scrollPos = Math.min(scrollPos, pageHeight-window.innerHeight);
	
	dolly(scrollPos);
});

window.addEventListener("touchend", function(event) {
	scrollEnd = scrollPos;
});