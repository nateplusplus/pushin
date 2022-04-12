import { PushInOptions } from './types';
declare global {
    interface Window {
        pushInStart(options?: PushInOptions | string): void;
    }
}
