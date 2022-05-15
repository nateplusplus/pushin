import { PushInScene } from './pushInScene';
import { LayerOptions } from './types';
export declare class PushInLayer {
    private element;
    private index;
    private scene;
    private options;
    private originalScale;
    private ref;
    private params;
    constructor(element: HTMLElement, index: number, scene: PushInScene, options: LayerOptions | null);
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
     * Get the interaction status for the layer.
     */
    private getInteractive;
    /**
     * Set the z-index of each layer so they overlap correctly.
     */
    setZIndex(total: number): void;
    /**
     * Reset all the layer parameters.
     *
     * This is used if the window is resized
     * and things need to be recalculated.
     */
    resetLayerParams(): void;
    /**
     * Get the initial scale of the element at time of DOM load.
     */
    private getElementScaleX;
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
    setLayerStyle(): void;
}
