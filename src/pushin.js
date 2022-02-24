/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
class pushIn {

	constructor( container ) {
		this.layers = [];
		this.container = container;
	}

	/**
	 * Initialize the object to start everything up.
	 */
	start() {
		if ( this.container ) {
			this.scene = this.container.querySelector('.pushin-scene');

			if ( ! this.scene ) {
				const innerHtml = this.container.innerHTML;
				this.scene = document.createElement( 'div' );
				this.scene.classList.add('pushin-scene');
				this.scene.innerHTML = innerHtml;
				this.container.innerHTML = '';
				this.container.appendChild( this.scene );
			}

			this.scrollPos = window.pageYOffset;
			this.getLayers();
			this.setScrollLength();
			this.bindEvents();

			// Set layer initial state
			this.toggleLayers();
		} else {
			console.error( 'No container element provided to pushIn.js. Effect will not be applied.' );
		}
	}

	/**
	 * Find all layers on the page and store them with their parameters
	 */
	getLayers() {
		const layers = this.container.getElementsByClassName('pushin-layer');
		if ( layers ) {
			for (let i = 0; i < layers.length; i++) {
				const elem = layers[i];
	
				const inpoint  = elem.dataset.hasOwnProperty( 'pushinFrom' ) ? elem.dataset.pushinFrom : null;
				const outpoint = elem.dataset.hasOwnProperty( 'pushinTo' ) ? elem.dataset.pushinTo : null;
				const speed    = elem.dataset.hasOwnProperty( 'pushinSpeed' ) ? elem.dataset.pushinSpeed : null;
	
				// Default for first layers
				let top = this.container.getBoundingClientRect().top;
				if ( this.scene.dataset.hasOwnProperty('pushinFrom') ) {
					// custom inpoint
					top = this.scene.dataset.pushinFrom;
				} else if ( i > 0 ) {
					// Set default for middle layers
					top = this.layers[ i - 1 ].params.outpoint - 100;
				}

				// Default for last layers
				let bottom = this.container.getBoundingClientRect().bottom;
				if ( this.scene.dataset.hasOwnProperty('pushinTo') ) {
					// custom outpoint
					bottom = this.scene.dataset.pushinTo;
				} else if ( i > 0 ) {
					// Set default for middle layers
					bottom = top + 1000;
				}

				const layer = {
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
	}

	/**
	 * Set the z-index of each layer so they overlap correctly.
	 *
	 * @param {object} layer
	 * @param {int} total
	 */
	setZIndex( layer, total ) {
		layer.elem.style.zIndex = total - layer.index;
	}

	/**
	 * Bind event listeners to watch for page load and user interaction.
	 */
	bindEvents() {
		window.addEventListener("scroll", function (event) {
			this.scrollPos = window.pageYOffset;
			this.dolly();
		}.bind(this));

		window.addEventListener("touchstart", function (event) {
			this.touchStart = event.changedTouches[0].screenY;
		}.bind(this));

		window.addEventListener("touchmove", function (event) {
			event.preventDefault();

			const touchMove = event.changedTouches[0].screenY;
			this.scrollPos = Math.max(this.scrollEnd + this.touchStart - touchMove, 0);
			this.scrollPos = Math.min(this.scrollPos, this.pageHeight - window.innerHeight);

			dolly();
		}.bind(this));

		window.addEventListener("touchend", function (event) {
			this.scrollEnd = this.scrollPos;
		}.bind(this));
	}

	/**
	 * Get the initial scale of the element at time of DOM load.
	 *
	 * @param {Element} elem 
	 * @return {Number} scaleX
	 */
	getElementScaleX(elem) {
		const transform = window.getComputedStyle( elem ).getPropertyValue( 'transform' );

		let scaleX = 1;
		if ( transform && transform !== 'none' ) {
			var match = transform.match( /[matrix|scale]\(([\d,\.\s]+)/ );
			if ( match && match[1] ) {
				var matrix = match[1].split( ', ' );
				scaleX = parseFloat(matrix[0]);
			}
		}


		return scaleX;
	}

	/**
	 * Animation effect, mimicking a camera dolly on the webpage.
	 */
	dolly() {
		requestAnimationFrame(function () {
			this.toggleLayers();
		}.bind(this));
	}

	/**
	 * Show or hide layers and set their scale, depending on if active.
	 */
	toggleLayers() {
		this.layers.forEach( layer => this.setLayerStyle( layer ) );
	}

	/**
	 * Whether or not a layer should currently be zooming.
	 *
	 * @param {Object} layer 
	 * @returns Boolean
	 */
	isActive( layer ) {
		return this.scrollPos >= layer.params.inpoint && this.scrollPos <= layer.params.outpoint;
	}

	/**
	 * Get the scaleX value for the layer.
	 *
	 * @param {Object} layer 
	 * @return {Number}
	 */
	getScaleValue(layer) {
		const distance = this.scrollPos - layer.params.inpoint;
		const speed    = Math.min( layer.params.speed, 100 ) / 100;
		const delta    = ( distance * speed ) / 100;

		return Math.max( layer.originalScale + delta, 0 );
	}

	/**
	 * Set element scale.
	 *
	 * @param {HtmlElement} elem 
	 * @param {Number} value 
	 */
	setScale( elem, value ) {
		const scaleString = "scale(" + value + ")";
		elem.style.webkitTransform = scaleString;
		elem.style.mozTransform = scaleString;
		elem.style.msTransform = scaleString;
		elem.style.oTransform = scaleString;
		elem.style.transform = scaleString;
	}

	/**
	 * Set CSS styles to control the effect on each layer.
	 *
	 * This will control the scale and opacity of the layer
	 * as the user scrolls.
	 *
	 * @param Element layer    Layer element
	 */
	setLayerStyle( layer ) {
		let opacity   = 0;
		const isFirst = layer.index === 0;
		const isLast  = layer.index + 1 === this.layers.length;

		if ( isFirst && this.scrollPos < layer.params.inpoint ) {
			opacity = 1;
		} else if ( isLast && this.scrollPos > layer.params.outpoint ) {
			opacity = 1;
		} else if ( this.isActive( layer ) ) {
			this.setScale( layer.elem, this.getScaleValue( layer ) );

			let inpointDistance = Math.max( Math.min( this.scrollPos - layer.params.inpoint, 200 ), 0) / 200;
			if ( isFirst ) {
				inpointDistance = 1;
			}

			let outpointDistance = Math.max( Math.min( layer.params.outpoint - this.scrollPos, 200 ), 0) / 200;
			if ( isLast ) {
				outpointDistance = 1;
			}

			opacity = Math.min( inpointDistance, outpointDistance );
		}

		layer.elem.style.opacity = opacity;
	}

	setScrollLength() {
		const height = getComputedStyle( this.container ).height.replace('px', '');
		this.container.style.height = Math.max( height, this.layers.length * ( screen.height + 100 ) ) + 'px';
	}
}

exports.pushIn = pushIn;