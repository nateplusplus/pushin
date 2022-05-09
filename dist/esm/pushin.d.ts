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
    public sceneOptions;
    public scrollY;
    private readonly layers;
    private readonly debug;
    private lastAnimationFrameId;
    public cleanupFns;
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
     * Bind event listeners to watch for page load and user interaction.
     */
    bindEvents(): void;
    /**
     * Animation effect, mimicking a camera dolly on the webpage.
     */
    private dolly;
    /**
     * Show or hide layers and set their scale, depending on if active.
     */
    private toggleLayers;
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
