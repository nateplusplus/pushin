import { PushIn } from './pushin';
import { PushInOptions } from './types';

declare global {
  interface Window {
    pushInStart(options?: PushInOptions | string): void;
  }
}

/**
 * Helper function: Set up and start push-in effect on all elements
 * matching the provided selector.
 */
const pushInStart = (options?: PushInOptions): PushIn[] => {
  const pushInOptions = options ?? {};

  const selector = options?.selector ?? '.pushin';
  const elements = document.querySelectorAll<HTMLElement>(selector);

  const instances: PushIn[] = [];
  for (const element of elements) {
    const instance = new PushIn(element, pushInOptions);
    instance.start();

    instances.push(instance);
  }

  return instances;
};

if (typeof window !== 'undefined') {
  window.pushInStart = pushInStart;
}
