import { PushInScene } from './pushInScene';
import { CompositionOptions } from './types';
import PushInBase from './pushInBase';
export declare class PushInComposition extends PushInBase {
    scene: PushInScene;
    options: CompositionOptions;
    constructor(scene: PushInScene, options: CompositionOptions);
    /**
     * Set the aspect ratio based setting.
     */
    private setRatio;
}
