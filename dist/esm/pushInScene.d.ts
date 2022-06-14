import { PushInLayer } from './pushInLayer';
import { PushIn } from './pushin';
import { SceneOptions } from './types';
export declare class PushInScene {
    pushin: PushIn;
    private container;
    layers: PushInLayer[];
    speedDelta: number;
    layerDepth: number;
    options: SceneOptions;
    constructor(pushin: PushIn);
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
    getTop(): number;
    getInpoints(): number[];
}
