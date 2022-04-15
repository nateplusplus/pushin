import { PushInOptions } from './types';
/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
export declare class PushIn {
    private container;
    private scene;
    private pushinDebug?;
    private layerOptions;
    private sceneOptions;
    private scrollY;
    private scrollEnd;
    private touchStart;
    private pageHeight;
    private readonly layers;
    private readonly debug;
    private speedDelta;
    private transitionLength;
    private layerDepth;
    private lastAnimationFrameId;
    private readonly cleanupFns;
    constructor(container: HTMLElement, options?: PushInOptions);
    /**
     * Initialize the object to start everything up.
     */
    start(): void;
    /**
     * Does all necessary cleanups by removing event listeners.
     */
    destroy(): void;
    /**
     * If there is a window object,
     * get the current scroll position.
     *
     * Otherwise default to 0.
     */
    private getScrollY;
    /**
     * Get the "scene" element from the DOM.
     * If it doesn't exist, make one.
     */
    private addScene;
    /**
     * Set breakpoints for responsive design settings.
     */
    private setBreakpoints;
    /**
     * Find all layers on the page and store them with their parameters
     */
    private getLayers;
    /**
     * Get all inpoints for the layer.
     */
    private getInpoints;
    /**
     * Get all outpoints for the layer.
     */
    private getOutpoints;
    /**
     * Get the push-in speed for the layer.
     */
    private getSpeed;
    /**
     * Get the array index of the current window breakpoint.
     */
    private getBreakpointIndex;
    /**
     * Set the z-index of each layer so they overlap correctly.
     */
    private setZIndex;
    /**
     * Bind event listeners to watch for page load and user interaction.
     */
    bindEvents(): void;
    /**
     * Reset all the layer parameters.
     *
     * This is used if the window is resized
     * and things need to be recalculated.
     */
    private resetLayerParams;
    /**
     * Get the initial scale of the element at time of DOM load.
     */
    private getElementScaleX;
    /**
     * Animation effect, mimicking a camera dolly on the webpage.
     */
    private dolly;
    /**
     * Show or hide layers and set their scale, depending on if active.
     */
    private toggleLayers;
    /**
     * Whether or not a layer should currently be zooming.
     */
    private isActive;
    /**
     * Get the current inpoint for a layer,
     * depending on window breakpoint.
     */
    private getInpoint;
    /**
     * Get the current outpoint for a layer,
     * depending on window breakpoint.
     */
    private getOutpoint;
    /**
     * Get the scaleX value for the layer.
     */
    private getScaleValue;
    /**
     * Set element scale.
     */
    private setScale;
    /**
     * Set CSS styles to control the effect on each layer.
     *
     * This will control the scale and opacity of the layer
     * as the user scrolls.
     */
    private setLayerStyle;
    /**
     * Set the default container height based on a few factors:
     * 1. Number of layers present
     * 2. The transition length between layers
     * 3. The length of scrolling time during each layer
     *
     * If this calculation is smaller than the container's current height,
     * the current height will be used instead.
     */
    private setScrollLength;
    /**
     * Show a debugging tool appended to the frontend of the page.
     * Can be used to determine best "pushin-from" and "pushin-to" values.
     */
    private showDebugger;
}
