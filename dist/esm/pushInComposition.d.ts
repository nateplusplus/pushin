import { PushInScene } from './pushInScene';
import { CompositionOptions } from './types';
export declare class PushInComposition {
    scene: PushInScene;
    private options;
    container?: HTMLElement;
    constructor(scene: PushInScene, options: CompositionOptions);
    /**
     * Get the composition ratio based on
     * what has been passed in through the JavaScript API
     * and/or what has been passed in via HTML data-attributes.
     *
     * @return {number[] | undefined}
     */
    private getRatio;
    /**
     * Set the aspect ratio based setting.
     */
    setRatio(): void;
}
