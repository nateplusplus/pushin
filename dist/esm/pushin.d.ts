import { PushInScene } from './pushInScene';
import { PushInOptions } from './types';
/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
export declare class PushIn {
    container: HTMLElement;
    scene: PushInScene;
    private pushinDebug?;
    target?: HTMLElement | null;
    scrollY: number;
    private lastAnimationFrameId;
    cleanupFns: VoidFunction[];
    options: PushInOptions;
    constructor(container: HTMLElement, options?: PushInOptions);
    /**
     * Initialize the object to start everything up.
     */
    start(): void;
    /**
     * Set the target parameter and make sure
     * pushin is always a child of that target.
     *
     * @param options
     */
    setTarget(): void;
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
     * Set overflow-y and scroll-behavior styles
     * on the provided target element.
     */
    private setTargetOverflow;
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
     * Automatically set the container height based on the greatest outpoint.
     *
     * If the container has a height set already (e.g. if set by CSS),
     * the larger of the two numbers will be used.
     */
    private setScrollLength;
    /**
     * Show a debugging tool appended to the frontend of the page.
     * Can be used to determine best "pushin-from" and "pushin-to" values.
     */
    private showDebugger;
}
