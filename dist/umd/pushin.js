/* Pushin.js - v4.1.0
Author: Nathan Blair <nate@natehub.net> (https://natehub.net)
License: MIT */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pushin = {}));
})(this, (function (exports) { 'use strict';

    const DEFAULT_SPEED = 8;
    // The data attribute which may be defined on the elemenet in the following way:
    // `<div class="pushin-scene" data-pushin-breakpoints="768,1440"></div>`.
    const PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE = 'pushinBreakpoints';
    // The data attribute which may be defined on the elemenet in the following way:
    // `<div data-pushin-speed="6"></div>`.
    const PUSH_IN_SPEED_DATA_ATTRIBUTE = 'pushinSpeed';
    const PUSH_IN_TO_DATA_ATTRIBUTE = 'pushinTo';
    const PUSH_IN_FROM_DATA_ATTRIBUTE = 'pushinFrom';
    const PUSH_IN_DEFAULT_BREAKPOINTS = [768, 1440, 1920];

    class PushInLayer {
        constructor(element, index, scene, options) {
            this.element = element;
            this.index = index;
            this.scene = scene;
            this.options = options;
            const inpoints = this.getInpoints(this.element, this.index);
            const outpoints = this.getOutpoints(this.element, inpoints[0]);
            const speed = this.getSpeed(this.element);
            this.originalScale = this.getElementScaleX(element);
            this.ref = { inpoints, outpoints, speed };
            this.params = {
                inpoint: this.getInpoint(inpoints),
                outpoint: this.getOutpoint(outpoints),
                speed,
            };
        }
        /**
         * Get all inpoints for the layer.
         */
        getInpoints(element, index) {
            var _a;
            let inpoints = [this.scene.getTop()];
            if (element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
                inpoints = element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE].split(',').map(inpoint => parseInt(inpoint.trim(), 10));
            }
            else if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.inpoints) {
                inpoints = this.options.inpoints;
            }
            else if (index === 0) {
                inpoints = this.scene.getInpoints();
            }
            else if (index > 0) {
                // Set default for middle layers if none provided
                const { outpoint } = this.scene.layers[index - 1].params;
                inpoints = [outpoint - this.scene.speedDelta];
            }
            return inpoints;
        }
        /**
         * Get all outpoints for the layer.
         */
        getOutpoints(element, inpoint) {
            var _a;
            let outpoints = [inpoint + this.scene.layerDepth];
            if (element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]) {
                const values = element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE].split(',');
                outpoints = values.map(value => parseInt(value.trim(), 10));
            }
            else if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.outpoints) {
                outpoints = this.options.outpoints;
            }
            return outpoints;
        }
        /**
         * Get the push-in speed for the layer.
         */
        getSpeed(element) {
            var _a;
            let speed = null;
            if (element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]) {
                speed = parseInt(element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE], 10);
                if (Number.isNaN(speed)) {
                    speed = DEFAULT_SPEED;
                }
            }
            else if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.speed) {
                speed = this.options.speed;
            }
            return speed || DEFAULT_SPEED;
        }
        /**
         * Set the z-index of each layer so they overlap correctly.
         */
        setZIndex(total) {
            this.element.style.zIndex = (total - this.index).toString();
        }
        /**
         * Reset all the layer parameters.
         *
         * This is used if the window is resized
         * and things need to be recalculated.
         */
        resetLayerParams() {
            this.params = {
                inpoint: this.getInpoint(this.ref.inpoints),
                outpoint: this.getOutpoint(this.ref.outpoints),
                speed: this.ref.speed,
            };
        }
        /**
         * Get the initial scale of the element at time of DOM load.
         */
        getElementScaleX(element) {
            const transform = window
                .getComputedStyle(element)
                .getPropertyValue('transform');
            let scaleX = 1;
            if (transform && transform !== 'none') {
                const match = transform.match(/[matrix|scale]\(([\d,.\s]+)/);
                if (match && match[1]) {
                    const matrix = match[1].split(', ');
                    scaleX = parseFloat(matrix[0]);
                }
            }
            return scaleX;
        }
        /**
         * Whether or not a layer should currently be zooming.
         */
        isActive() {
            const { inpoint } = this.params;
            const { outpoint } = this.params;
            return (this.scene.pushin.scrollY >= inpoint &&
                this.scene.pushin.scrollY <= outpoint);
        }
        /**
         * Get the current inpoint for a layer,
         * depending on window breakpoint.
         */
        getInpoint(inpoints) {
            const { breakpoints } = this.scene.options;
            return inpoints[this.scene.getBreakpointIndex(breakpoints)] || inpoints[0];
        }
        /**
         * Get the current outpoint for a layer,
         * depending on window breakpoint.
         */
        getOutpoint(outpoints) {
            const { breakpoints } = this.scene.options;
            return (outpoints[this.scene.getBreakpointIndex(breakpoints)] || outpoints[0]);
        }
        /**
         * Get the scaleX value for the layer.
         */
        getScaleValue(layer) {
            const distance = this.scene.pushin.scrollY - layer.params.inpoint;
            const speed = Math.min(layer.params.speed, 100) / 100;
            const delta = (distance * speed) / 100;
            return Math.max(layer.originalScale + delta, 0);
        }
        /**
         * Set element scale.
         */
        setScale({ style }, value) {
            const scaleString = `scale(${value})`;
            style.webkitTransform = scaleString;
            style.mozTransform = scaleString;
            style.msTransform = scaleString;
            style.oTransform = scaleString;
            style.transform = scaleString;
        }
        /**
         * Set CSS styles to control the effect on each layer.
         *
         * This will control the scale and opacity of the layer
         * as the user scrolls.
         */
        setLayerStyle() {
            let opacity = 0;
            const isFirst = this.index === 0;
            const isLast = this.index + 1 === this.scene.layers.length;
            const { inpoint } = this.params;
            const { outpoint } = this.params;
            if (isFirst && this.scene.pushin.scrollY < inpoint) {
                opacity = 1;
            }
            else if (isLast && this.scene.pushin.scrollY > outpoint) {
                opacity = 1;
            }
            else if (this.isActive()) {
                this.setScale(this.element, this.getScaleValue(this));
                let inpointDistance = Math.max(Math.min(this.scene.pushin.scrollY - inpoint, this.scene.transitionLength), 0) / this.scene.transitionLength;
                // Set opacity to 1 if its the first layer and it is active (no fading in here)
                if (isFirst) {
                    inpointDistance = 1;
                }
                let outpointDistance = Math.max(Math.min(outpoint - this.scene.pushin.scrollY, this.scene.transitionLength), 0) / this.scene.transitionLength;
                // Set opacity to 1 if its the last layer and it is active (no fading out)
                if (isLast) {
                    outpointDistance = 1;
                }
                opacity = Math.min(inpointDistance, outpointDistance);
            }
            this.element.style.opacity = opacity.toString();
        }
    }

    class PushInScene {
        constructor(pushin) {
            var _a, _b, _c;
            this.pushin = pushin;
            const container = this.pushin.container.querySelector('.pushin-scene');
            if (container) {
                this.container = container;
            }
            else {
                this.container = document.createElement('div');
                this.container.classList.add('pushin-scene');
                this.container.innerHTML = this.pushin.container.innerHTML;
                this.pushin.container.innerHTML = '';
                this.pushin.container.appendChild(this.container);
                this.pushin.cleanupFns.push(() => {
                    this.pushin.container.innerHTML = this.container.innerHTML;
                });
            }
            this.options = pushin.sceneOptions;
            this.speedDelta = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.speedDelta) || 100;
            this.layerDepth = ((_b = this.options) === null || _b === void 0 ? void 0 : _b.layerDepth) || 1000;
            this.transitionLength = ((_c = this.options) === null || _c === void 0 ? void 0 : _c.transitionLength) || 200;
            this.layers = [];
            this.setBreakpoints();
            this.getLayers();
        }
        /**
         * Set breakpoints for responsive design settings.
         */
        setBreakpoints() {
            var _a;
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.breakpoints.length) === 0) {
                this.options.breakpoints = [...PUSH_IN_DEFAULT_BREAKPOINTS];
            }
            if (this.container.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE]) {
                this.options.breakpoints = this.container.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE].split(',').map(breakpoint => parseInt(breakpoint.trim(), 10));
            }
            // Always include break point 0 for anything under first breakpoint
            this.options.breakpoints.unshift(0);
        }
        /**
         * Find all layers on the page and store them with their parameters
         */
        getLayers() {
            var _a;
            const layers = Array.from(this.container.getElementsByClassName('pushin-layer'));
            for (let index = 0; index < layers.length; index++) {
                const element = layers[index];
                let options = {};
                if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.layers) && this.options.layers.length > index) {
                    options = this.options.layers[index];
                }
                const layer = new PushInLayer(element, index, this, options);
                this.layers.push(layer);
                layer.setZIndex(layers.length);
            }
        }
        /**
         * Get the array index of the current window breakpoint.
         */
        getBreakpointIndex(breakpoints) {
            const searchIndex = breakpoints
                .reverse()
                .findIndex(bp => bp <= window.innerWidth);
            return searchIndex === -1 ? 0 : breakpoints.length - 1 - searchIndex;
        }
        getTop() {
            return this.container.getBoundingClientRect().top;
        }
        getInpoints() {
            var _a, _b;
            let inpoints = [this.getTop()];
            if (this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
                const pushInFrom = (this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]);
                inpoints.push(parseInt(pushInFrom, 10));
            }
            else if (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.inpoints) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                inpoints = this.options.inpoints;
            }
            return inpoints;
        }
    }

    /**
     * PushIn object
     *
     * Once new object is created, it will initialize itself and
     * bind events to begin interacting with dom.
     */
    class PushIn {
        constructor(container, options) {
            var _a;
            this.container = container;
            this.scrollY = 0;
            this.layers = [];
            this.lastAnimationFrameId = -1;
            this.cleanupFns = [];
            this.debug = (_a = options === null || options === void 0 ? void 0 : options.debug) !== null && _a !== void 0 ? _a : false;
            this.sceneOptions = { breakpoints: [], inpoints: [] };
            if (options === null || options === void 0 ? void 0 : options.scene) {
                Object.assign(this.sceneOptions, options.scene);
            }
            if (options === null || options === void 0 ? void 0 : options.layers) {
                Object.assign(this.sceneOptions, options.layers);
            }
        }
        /**
         * Initialize the object to start everything up.
         */
        start() {
            this.scrollY = this.getScrollY();
            if (this.debug) {
                this.showDebugger();
            }
            if (this.container) {
                this.scene = new PushInScene(this);
                this.setScrollLength();
                if (typeof window !== 'undefined') {
                    this.bindEvents();
                }
                // Set layer initial state
                this.toggleLayers();
            }
            else {
                // eslint-disable-next-line no-console
                console.error('No container element provided to pushIn.js. Effect will not be applied.');
            }
        }
        /**
         * Does all necessary cleanups by removing event listeners.
         */
        destroy() {
            cancelAnimationFrame(this.lastAnimationFrameId);
            while (this.cleanupFns.length) {
                this.cleanupFns.pop()();
            }
        }
        /**
         * If there is a window object,
         * get the current scroll position.
         *
         * Otherwise default to 0.
         */
        getScrollY() {
            return typeof window !== 'undefined' ? window.scrollY : 0;
        }
        /**
         * Bind event listeners to watch for page load and user interaction.
         */
        bindEvents() {
            const onScroll = () => {
                var _a;
                this.scrollY = this.getScrollY();
                this.dolly();
                if (this.pushinDebug) {
                    const content = (_a = this.pushinDebug) === null || _a === void 0 ? void 0 : _a.querySelector('.pushin-debug__content');
                    if (content) {
                        content.textContent = `Scroll position: ${Math.round(this.scrollY)}px`;
                    }
                }
            };
            window.addEventListener('scroll', onScroll);
            this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
            let resizeTimeout;
            const onResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = window.setTimeout(() => {
                    this.scene.layers.forEach(layer => layer.resetLayerParams());
                    this.setScrollLength();
                    this.toggleLayers();
                }, 300);
            };
            window.addEventListener('resize', onResize);
            this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
        }
        /**
         * Animation effect, mimicking a camera dolly on the webpage.
         */
        dolly() {
            cancelAnimationFrame(this.lastAnimationFrameId);
            this.lastAnimationFrameId = requestAnimationFrame(() => {
                this.toggleLayers();
            });
        }
        /**
         * Show or hide layers and set their scale, depending on if active.
         */
        toggleLayers() {
            this.scene.layers.forEach(layer => layer.setLayerStyle());
        }
        /**
         * Set the default container height based on a few factors:
         * 1. Number of layers present
         * 2. The transition length between layers
         * 3. The length of scrolling time during each layer
         *
         * If this calculation is smaller than the container's current height,
         * the current height will be used instead.
         */
        setScrollLength() {
            const containerHeight = getComputedStyle(this.container).height.replace('px', '');
            const transitions = (this.scene.layers.length - 1) * this.scene.speedDelta;
            const scrollLength = this.scene.layers.length *
                (this.scene.layerDepth + this.scene.transitionLength);
            this.container.style.height = `${Math.max(parseFloat(containerHeight), scrollLength - transitions)}px`;
        }
        /**
         * Show a debugging tool appended to the frontend of the page.
         * Can be used to determine best "pushin-from" and "pushin-to" values.
         */
        showDebugger() {
            this.pushinDebug = document.createElement('div');
            this.pushinDebug.classList.add('pushin-debug');
            const scrollTitle = document.createElement('p');
            scrollTitle.innerText = 'Pushin.js Debugger';
            scrollTitle.classList.add('pushin-debug__title');
            const debuggerContent = document.createElement('div');
            debuggerContent.classList.add('pushin-debug__content');
            debuggerContent.innerText = `Scroll position: ${this.scrollY}px`;
            this.pushinDebug.appendChild(scrollTitle);
            this.pushinDebug.appendChild(debuggerContent);
            document.body.appendChild(this.pushinDebug);
        }
    }

    /**
     * Helper function: Set up and start push-in effect on all elements
     * matching the provided selector.
     */
    const pushInStart = (options) => {
        const pushInOptions = options !== null && options !== void 0 ? options : {};
        const elements = document.querySelectorAll('.pushin');
        const instances = [];
        for (const element of elements) {
            const instance = new PushIn(element, pushInOptions);
            instance.start();
            instances.push(instance);
        }
        return instances;
    };
    if (typeof window !== 'undefined') {
        window.pushInStart = pushInStart;
    }

    exports.PushIn = PushIn;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=pushin.js.map
