/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
class pushIn {

	constructor( container, options ) {
		this.layers    = [];
		this.container = container;

		if ( options ) {
			this.debug = ( options.debug || false );
		}
	}

	/**
	 * Initialize the object to start everything up.
	 */
	start() {
		if ( this.container ) {
			this.addScene();

			this.speedDelta       = 100;
			this.transitionLength = 200;
			this.layerDepth       = 1000;

			this.scrollPos = window.pageYOffset;

			this.setBreakpoints();
			this.getLayers();
			this.setScrollLength();
			this.bindEvents();

			// Set layer initial state
			this.toggleLayers();
		} else {
			console.error( 'No container element provided to pushIn.js. Effect will not be applied.' );
		}

		if ( this.debug ) {
			this.showDebugger();
		}
	}

	/**
	 * Get the "scene" element from the DOM.
	 * If it doesn't exist, make one.
	 */
	addScene() {
		this.scene = this.container.querySelector('.pushin-scene');

		if ( ! this.scene ) {
			this.scene = document.createElement( 'div' );
			this.scene.classList.add('pushin-scene');

			this.scene.innerHTML = this.container.innerHTML;
			this.container.innerHTML = '';
			this.container.appendChild( this.scene );
		}
	}

	/**
	 * Set breakpoints for responsive design settings.
	 */
	setBreakpoints() {
		this.breakpoints = [
			768,
			1440,
			1920
		];

		if ( this.scene.dataset.breakpoints ) {
			this.breakpoints = this.scene.dataset.breakpoints.split(',');
			this.breakpoints = this.breakpoints.map( bp => parseInt( bp.trim() ) );
		}
	}

	/**
	 * Find all layers on the page and store them with their parameters
	 */
	getLayers() {
		const layers   = this.container.getElementsByClassName( 'pushin-layer' );

		if ( layers ) {
			for ( let i = 0; i < layers.length; i++ ) {
				const elem    = layers[i];
				const inpoints = this.getInpoints( elem, i );

				const layer = {
					elem : elem,
					index: i,
					originalScale: this.getElementScaleX( elem ),
					params: {
						inpoints  : inpoints,
						outpoint : this.getOutpoints( elem, inpoints[0], i ),
						speed    : this.getSpeed( elem )
					}
				};

				this.layers.push( layer );
				this.setZIndex( layer, layers.length );
			}
		}
	}

	getInpoints( elem, i ) {
		const sceneTop = this.scene.getBoundingClientRect().top;

		let inpoints = null;
		if ( elem.dataset.hasOwnProperty( 'pushinFrom' ) ) {
			inpoints = elem.dataset.pushinFrom.split( ',' );
			inpoints = inpoints.map( inpoint => parseInt( inpoint.trim() ) );
		}

		// Default for first layers
		let sceneInpoints = [ sceneTop ];
		if ( this.scene.dataset.hasOwnProperty( 'pushinFrom' ) ) {
			// custom inpoint
			sceneInpoints = this.scene.dataset.pushinFrom.split( ',' );
			sceneInpoints = sceneInpoints.map( inpoint => parseInt( inpoint.trim() ) );
		} else if ( i > 0 ) {
			// Set default for middle layers
			top = [ this.layers[ i - 1 ].params.outpoint - this.speedDelta ];
		}

		return ( inpoints || top );
	}

	getOutpoints( elem, inpoint, i ) {
		const outpoint = elem.dataset.hasOwnProperty( 'pushinTo' ) ? elem.dataset.pushinTo : null;

		let bottom;
		if ( this.scene.dataset.hasOwnProperty( 'pushinTo' ) ) {
			// custom outpoint
			bottom = this.scene.dataset.pushinTo;
		} else if ( i === 0 ) {
			// Set default for first layer
			bottom = this.layerDepth;
		} else {
			// Set default for middle layers
			bottom = inpoint + this.layerDepth;
		}

		return (outpoint || bottom);
	}

	getSpeed( elem ) {
		const speed = elem.dataset.hasOwnProperty( 'pushinSpeed' ) ? elem.dataset.pushinSpeed : null;
		return (speed || 8);
	}

	getBreakpointIndex() {
		const index = this.breakpoints.reverse().findIndex( bp => bp <= window.innerWidth );
		return Math.max( index, 0 );
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
		const inpoint = this.getInpoint( layer );
		return this.scrollPos >= inpoint && this.scrollPos <= layer.params.outpoint;
	}

	getInpoint( layer ) {
		return layer.params.inpoints[ this.getBreakpointIndex() ] || layer.params.inpoints[ 0 ];
	}

	/**
	 * Get the scaleX value for the layer.
	 *
	 * @param {Object} layer 
	 * @return {Number}
	 */
	getScaleValue( layer ) {
		const inpoint  = this.getInpoint( layer );
		const distance = this.scrollPos - inpoint;
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
		const inpoint = this.getInpoint( layer );

		if ( isFirst && this.scrollPos < inpoint ) {
			opacity = 1;
		} else if ( isLast && this.scrollPos > layer.params.outpoint ) {
			opacity = 1;
		} else if ( this.isActive( layer ) ) {
			this.setScale( layer.elem, this.getScaleValue( layer ) );

			let inpointDistance = Math.max( Math.min( this.scrollPos - inpoint, this.transitionLength ), 0) / this.transitionLength;
			if ( isFirst ) {
				inpointDistance = 1;
			}

			let outpointDistance = Math.max( Math.min( layer.params.outpoint - this.scrollPos, this.transitionLength ), 0) / this.transitionLength;
			if ( isLast ) {
				outpointDistance = 1;
			}

			opacity = Math.min( inpointDistance, outpointDistance );
		}

		layer.elem.style.opacity = opacity;
	}

	setScrollLength() {
		const containerHeight = getComputedStyle( this.container ).height.replace('px', '');

		const transitions = ( this.layers.length - 1 ) * this.speedDelta;
		const scrollLength = this.layers.length * ( this.layerDepth + this.transitionLength );

		this.container.style.height = Math.max( containerHeight, scrollLength - transitions ) + 'px';
	}

	showDebugger() {
		const scrollCounter = document.createElement( 'div' );
		scrollCounter.classList.add( 'pushin-debug' );

		const scrollTitle = document.createElement( 'p' );
		scrollTitle.innerText = 'Pushin.js Debugger'
		scrollTitle.classList.add( 'pushin-debug__title' )

		const debuggerContent = document.createElement( 'div' );
		debuggerContent.classList.add( 'pushin-debug__content' );
		debuggerContent.innerText = 'Scroll position: ' + window.pageYOffset + 'px';

		scrollCounter.appendChild( scrollTitle );
		scrollCounter.appendChild( debuggerContent );

		document.body.appendChild( scrollCounter );

		window.addEventListener( 'scroll', function( evt ) {
			debuggerContent.innerText = 'Scroll position: ' + window.pageYOffset + 'px';
		} );
	}
}

exports.pushIn = pushIn;