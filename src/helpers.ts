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
window.pushInStart = (options?: PushInOptions | string) => {
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
  for (const element of elements) {
    new PushIn(element, pushInOptions).start();
  }
};
