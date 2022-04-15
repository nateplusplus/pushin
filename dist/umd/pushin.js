/* Pushin.js - v4.0.1
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

    /**
     * PushIn object
     *
     * Once new object is created, it will initialize itself and
     * bind events to begin interacting with dom.
     */
    class PushIn {
        constructor(container, options) {
            var _a, _b, _c;
            this.container = container;
            this.scrollY = 0;
            this.scrollEnd = null;
            this.touchStart = null;
            this.pageHeight = null;
            this.layers = [];
            this.speedDelta = 100;
            this.transitionLength = 200;
            this.layerDepth = 1000;
            this.lastAnimationFrameId = -1;
            this.cleanupFns = [];
            this.debug = (_a = options === null || options === void 0 ? void 0 : options.debug) !== null && _a !== void 0 ? _a : false;
            this.layerOptions = (_b = options === null || options === void 0 ? void 0 : options.layers) !== null && _b !== void 0 ? _b : [];
            this.sceneOptions = (_c = options === null || options === void 0 ? void 0 : options.scene) !== null && _c !== void 0 ? _c : { breakpoints: [], inpoints: [] };
        }
        /**
         * Initialize the object to start everything up.
         */
        start() {
            if (this.container) {
                this.scrollY = this.getScrollY();
                if (this.debug) {
                    this.showDebugger();
                }
                this.addScene();
                this.setBreakpoints();
                this.getLayers();
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
         * Get the "scene" element from the DOM.
         * If it doesn't exist, make one.
         */
        addScene() {
            const scene = this.container.querySelector('.pushin-scene');
            if (scene) {
                this.scene = scene;
            }
            else {
                this.scene = document.createElement('div');
                this.scene.classList.add('pushin-scene');
                this.scene.innerHTML = this.container.innerHTML;
                this.container.innerHTML = '';
                this.container.appendChild(this.scene);
                // We register the cleanup function only for the manually created scene.
                this.cleanupFns.push(() => this.container.removeChild(this.scene));
            }
        }
        /**
         * Set breakpoints for responsive design settings.
         */
        setBreakpoints() {
            if (this.sceneOptions.breakpoints.length === 0) {
                this.sceneOptions.breakpoints = [768, 1440, 1920];
            }
            if (this.scene.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE]) {
                this.sceneOptions.breakpoints = this.scene.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE].split(',').map(breakpoint => parseInt(breakpoint.trim(), 10));
            }
            // Always include break point 0 for anything under first breakpoint
            this.sceneOptions.breakpoints.unshift(0);
        }
        /**
         * Find all layers on the page and store them with their parameters
         */
        getLayers() {
            const layers = Array.from(this.container.getElementsByClassName('pushin-layer'));
            for (let index = 0; index < layers.length; index++) {
                const element = layers[index];
                const inpoints = this.getInpoints(element, index);
                const outpoints = this.getOutpoints(element, inpoints[0], index);
                const speed = this.getSpeed(element, index);
                const layer = {
                    element,
                    index,
                    originalScale: this.getElementScaleX(element),
                    ref: { inpoints, outpoints, speed },
                    params: {
                        inpoint: this.getInpoint(inpoints),
                        outpoint: this.getOutpoint(outpoints),
                        speed,
                    },
                };
                this.layers.push(layer);
                this.setZIndex(layer, layers.length);
            }
        }
        /**
         * Get all inpoints for the layer.
         */
        getInpoints(element, index) {
            var _a, _b;
            const { top } = this.scene.getBoundingClientRect();
            let inpoints = [top];
            if (element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
                inpoints = element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE].split(',').map(inpoint => parseInt(inpoint.trim(), 10));
            }
            else if ((_a = this.layerOptions[index]) === null || _a === void 0 ? void 0 : _a.inpoints) {
                inpoints = this.layerOptions[index].inpoints;
            }
            else if (index === 0 && this.scene.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
                // Custom inpoint
                inpoints = this.scene.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE].split(',').map(inpoint => parseInt(inpoint.trim(), 10));
            }
            else if (index === 0 && ((_b = this.sceneOptions) === null || _b === void 0 ? void 0 : _b.inpoints.length) > 0) {
                inpoints = this.sceneOptions.inpoints;
            }
            else if (index > 0) {
                // Set default for middle layers if none provided
                const { outpoint } = this.layers[index - 1].params;
                inpoints = [outpoint - this.speedDelta];
            }
            return inpoints;
        }
        /**
         * Get all outpoints for the layer.
         */
        getOutpoints(element, inpoint, index) {
            var _a;
            let outpoints = [inpoint + this.layerDepth];
            if (element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]) {
                const values = element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE].split(',');
                outpoints = values.map(value => parseInt(value.trim(), 10));
            }
            else if ((_a = this.layerOptions[index]) === null || _a === void 0 ? void 0 : _a.outpoints) {
                outpoints = this.layerOptions[index].outpoints;
            }
            return outpoints;
        }
        /**
         * Get the push-in speed for the layer.
         */
        getSpeed(element, index) {
            var _a;
            let speed = null;
            if (element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]) {
                speed = parseInt(element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE], 10);
                if (Number.isNaN(speed)) {
                    speed = DEFAULT_SPEED;
                }
            }
            else if ((_a = this.layerOptions[index]) === null || _a === void 0 ? void 0 : _a.speed) {
                speed = this.layerOptions[index].speed;
            }
            return speed || DEFAULT_SPEED;
        }
        /**
         * Get the array index of the current window breakpoint.
         */
        getBreakpointIndex() {
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
            const searchIndex = this.sceneOptions.breakpoints
                .reverse()
                .findIndex(bp => bp <= windowWidth);
            return searchIndex === -1
                ? 0
                : this.sceneOptions.breakpoints.length - 1 - searchIndex;
        }
        /**
         * Set the z-index of each layer so they overlap correctly.
         */
        setZIndex(layer, total) {
            layer.element.style.zIndex = (total - layer.index).toString();
        }
        /**
         * Bind event listeners to watch for page load and user interaction.
         */
        bindEvents() {
            const onScroll = () => {
                this.scrollY = this.getScrollY();
                this.dolly();
            };
            window.addEventListener('scroll', onScroll);
            this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
            const onTouchstart = (event) => {
                this.touchStart = event.changedTouches[0].screenY;
            };
            window.addEventListener('touchstart', onTouchstart);
            this.cleanupFns.push(() => window.removeEventListener('touchstart', onTouchstart));
            const onTouchmove = (event) => {
                event.preventDefault();
                const touchMove = event.changedTouches[0].screenY;
                this.scrollY = Math.max(this.scrollEnd + this.touchStart - touchMove, 0);
                this.scrollY = Math.min(this.scrollY, this.pageHeight - window.innerHeight);
                this.dolly();
            };
            window.addEventListener('touchmove', onTouchmove);
            this.cleanupFns.push(() => window.removeEventListener('touchmove', onTouchmove));
            const onTouchend = () => {
                this.scrollEnd = this.scrollY;
            };
            window.addEventListener('touchend', onTouchend);
            this.cleanupFns.push(() => window.removeEventListener('touchend', onTouchend));
            let resizeTimeout;
            const onResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = window.setTimeout(() => {
                    this.resetLayerParams();
                    this.setScrollLength();
                    this.toggleLayers();
                }, 300);
            };
            window.addEventListener('resize', onResize);
            this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
            if (this.pushinDebug) {
                window.addEventListener('scroll', () => {
                    var _a;
                    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
                    const content = (_a = this.pushinDebug) === null || _a === void 0 ? void 0 : _a.querySelector('.pushin-debug__content');
                    if (content) {
                        content.textContent = `Scroll position: ${Math.round(scrollY)}px`;
                    }
                });
            }
        }
        /**
         * Reset all the layer parameters.
         *
         * This is used if the window is resized
         * and things need to be recalculated.
         */
        resetLayerParams() {
            this.layers.forEach(layer => {
                layer.params = {
                    inpoint: this.getInpoint(layer.ref.inpoints),
                    outpoint: this.getOutpoint(layer.ref.outpoints),
                    speed: layer.ref.speed,
                };
            });
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
            this.layers.forEach(layer => this.setLayerStyle(layer));
        }
        /**
         * Whether or not a layer should currently be zooming.
         */
        isActive(layer) {
            const { inpoint } = layer.params;
            const { outpoint } = layer.params;
            return this.scrollY >= inpoint && this.scrollY <= outpoint;
        }
        /**
         * Get the current inpoint for a layer,
         * depending on window breakpoint.
         */
        getInpoint(inpoints) {
            return inpoints[this.getBreakpointIndex()] || inpoints[0];
        }
        /**
         * Get the current outpoint for a layer,
         * depending on window breakpoint.
         */
        getOutpoint(outpoints) {
            return outpoints[this.getBreakpointIndex()] || outpoints[0];
        }
        /**
         * Get the scaleX value for the layer.
         */
        getScaleValue(layer) {
            const distance = this.scrollY - layer.params.inpoint;
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
        setLayerStyle(layer) {
            let opacity = 0;
            const isFirst = layer.index === 0;
            const isLast = layer.index + 1 === this.layers.length;
            const { inpoint } = layer.params;
            const { outpoint } = layer.params;
            if (isFirst && this.scrollY < inpoint) {
                opacity = 1;
            }
            else if (isLast && this.scrollY > outpoint) {
                opacity = 1;
            }
            else if (this.isActive(layer)) {
                this.setScale(layer.element, this.getScaleValue(layer));
                let inpointDistance = Math.max(Math.min(this.scrollY - inpoint, this.transitionLength), 0) /
                    this.transitionLength;
                // Set opacity to 1 if its the first layer and it is active (no fading in here)
                if (isFirst) {
                    inpointDistance = 1;
                }
                let outpointDistance = Math.max(Math.min(outpoint - this.scrollY, this.transitionLength), 0) /
                    this.transitionLength;
                // Set opacity to 1 if its the last layer and it is active (no fading out)
                if (isLast) {
                    outpointDistance = 1;
                }
                opacity = Math.min(inpointDistance, outpointDistance);
            }
            layer.element.style.opacity = opacity.toString();
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
            const transitions = (this.layers.length - 1) * this.speedDelta;
            const scrollLength = this.layers.length * (this.layerDepth + this.transitionLength);
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
            const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
            const debuggerContent = document.createElement('div');
            debuggerContent.classList.add('pushin-debug__content');
            debuggerContent.innerText = `Scroll position: ${scrollY}px`;
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
