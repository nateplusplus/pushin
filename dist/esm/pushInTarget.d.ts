import PushInBase from './pushInBase';
import { PushIn } from './pushin';
import { TargetSettings } from './types';
export declare class PushInTarget extends PushInBase {
    pushin: PushIn;
    settings: TargetSettings;
    container: HTMLElement | null;
    scrollTarget: HTMLElement | string;
    height: number;
    constructor(pushin: PushIn, settings: TargetSettings);
    start(): void;
    /**
     * Set the target parameter and make sure
     * pushin is always a child of that target.
     *
     * @param options
     */
    setTargetElement(): void;
    /**
     * Get scrollTarget option from data attribute
     * or JavaScript API.
     */
    setScrollTarget(): void;
    /**
     * Set the target height on initialization.
     *
     * This will be used to calculate scroll length.
     *
     * @see setScrollLength
     */
    setTargetHeight(): void;
    /**
     * Set overflow-y and scroll-behavior styles
     * on the provided target element.
     */
    private setTargetOverflow;
}
