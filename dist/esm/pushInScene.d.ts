import { PushInComposition } from './pushInComposition';
import { PushInLayer } from './pushInLayer';
import { PushIn } from './pushin';
import PushInBase from './pushInBase';
import { SceneOptions } from './types';
export declare class PushInScene extends PushInBase {
    pushin: PushIn;
    layers: PushInLayer[];
    layerDepth: number;
    options: SceneOptions;
    composition?: PushInComposition;
    constructor(pushin: PushIn);
    /**
     * Set scene class names.
     */
    private setSceneClasses;
    /**
     * Resize the PushIn container if using a target container.
     */
    resize(): void;
    /**
     * Set breakpoints for responsive design settings.
     */
    private setBreakpoints;
    /**
     * Find all layers on the page and store them with their parameters
     */
    private getLayers;
    /**
     * Get the array index of the current window breakpoint.
     */
    getBreakpointIndex(breakpoints: number[]): number;
    /**
     * Get the screen-top value of the container.
     *
     * If using a target, get the top of the
     * container relative to the target's top.
     *
     * @returns {number}
     */
    getTop(): number;
    /**
     * Get the scene inpoints provided by the JavaScript API
     * and/or the HTML data-attributes.
     *
     * @returns {number[]}
     */
    getInpoints(): number[];
}
