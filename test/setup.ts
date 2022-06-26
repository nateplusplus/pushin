import { DOMWindow, JSDOM } from 'jsdom';

// `globalThis.window` refers to `typeof globalThis`, but `jsdom.DOMWindow` isn't assignable to `global.window`.
const _global = global as unknown as Omit<typeof globalThis, 'window'> & {
  window?: DOMWindow | undefined;
};

export function setupJSDOM(html: string) {
  const dom = new JSDOM(html);
  _global.window = dom.window;
  _global.document = window.document;
  _global.getComputedStyle = window.getComputedStyle;
  _global.cancelAnimationFrame = () => {};
  return dom;
}
