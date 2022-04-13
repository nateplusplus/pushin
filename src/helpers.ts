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
 *
 * @param options - Optional (legacy) - specify a unique selector for the container of the effect
 */
window.pushInStart = (options?: PushInOptions | string): PushIn[] => {
  let selector = '.pushin';
  let pushInOptions: PushInOptions | undefined;
  if (options) {
    // Backward compatibility <3.3.0 - first parameter was selector, not options
    if (typeof options === 'string') {
      selector = options;
    } else {
      pushInOptions = options;
    }
  }

  const elements = document.querySelectorAll<HTMLElement>(selector);
  const instances: PushIn[] = [];
  for (const element of elements) {
    const instance = new PushIn(element, pushInOptions);
    instance.start();

    instances.push(instance);
  }

  return instances;
};
