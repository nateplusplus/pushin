import { PushInScene } from './pushInScene';
import { PushInLayer } from './pushInLayer';

import { PushInOptions, SceneOptions } from './types';

/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
export class PushIn {
  private scene!: PushInScene;
  private pushinDebug?: HTMLElement;
  public sceneOptions: SceneOptions;

  public scrollY = 0;

  private readonly layers: PushInLayer[] = [];
  private readonly debug: boolean;

  private lastAnimationFrameId = -1;
  public cleanupFns: VoidFunction[] = [];

  constructor(public container: HTMLElement, options?: PushInOptions) {
    this.debug = options?.debug ?? false;

    this.sceneOptions = { breakpoints: [], inpoints: [] };
    if (options?.scene) {
      Object.assign(this.sceneOptions, options.scene);
    }
    if (options?.layers) {
      Object.assign(this.sceneOptions, options.layers);
    }
  }

  /**
   * Initialize the object to start everything up.
   */
  start(): void {
    this.scrollY = this.getScrollY();

    if (this.debug) {
      this.showDebugger();
    }

    if (this.container) {
      this.scene = new PushInScene(this);

      this.setScrollLength();

      if (typeof window !== 'undefined') {
        this.bindEvents();
      }

      // Set layer initial state
      this.toggleLayers();
    } else {
      // eslint-disable-next-line no-console
      console.error(
        'No container element provided to pushIn.js. Effect will not be applied.'
      );
    }
  }

  /**
   * Does all necessary cleanups by removing event listeners.
   */
  destroy(): void {
    cancelAnimationFrame(this.lastAnimationFrameId);

    while (this.cleanupFns.length) {
      this.cleanupFns.pop()!();
    }
  }

  /**
   * If there is a window object,
   * get the current scroll position.
   *
   * Otherwise default to 0.
   */
  private getScrollY(): number {
    return typeof window !== 'undefined' ? window.scrollY : 0;
  }

  /**
   * Bind event listeners to watch for page load and user interaction.
   */
  bindEvents(): void {
    const onScroll = () => {
      this.scrollY = this.getScrollY();
      this.dolly();

      if (this.pushinDebug) {
        const content = this.pushinDebug?.querySelector(
          '.pushin-debug__content'
        );
        if (content) {
          content!.textContent = `Scroll position: ${Math.round(
            this.scrollY
          )}px`;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));

    let resizeTimeout: number;
    const onResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = window.setTimeout(() => {
        this.scene.layers.forEach(layer => layer.resetLayerParams());
        this.setScrollLength();
        this.toggleLayers();
      }, 300);
    };
    window.addEventListener('resize', onResize);
    this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
  }

  /**
   * Animation effect, mimicking a camera dolly on the webpage.
   */
  private dolly(): void {
    cancelAnimationFrame(this.lastAnimationFrameId);

    this.lastAnimationFrameId = requestAnimationFrame(() => {
      this.toggleLayers();
    });
  }

  /**
   * Show or hide layers and set their scale, depending on if active.
   */
  private toggleLayers(): void {
    this.scene.layers.forEach(layer => {
      layer.setLayerStyle();
      layer.setLayerVisibility();
    });
  }

  /**
   * Set the default container height based on a few factors:
   * 1. Number of layers present
   * 2. The transition length between layers
   * 3. The length of scrolling time during each layer
   *
   * If this calculation is smaller than the container's current height,
   * the current height will be used instead.
   */
  private setScrollLength(): void {
    const containerHeight = getComputedStyle(this.container).height.replace(
      'px',
      ''
    );

    const transitions = (this.scene.layers.length - 1) * this.scene.speedDelta;
    const scrollLength =
      this.scene.layers.length *
      (this.scene.layerDepth + this.scene.transitionLength);

    this.container.style.height = `${Math.max(
      parseFloat(containerHeight),
      scrollLength - transitions
    )}px`;
  }

  /**
   * Show a debugging tool appended to the frontend of the page.
   * Can be used to determine best "pushin-from" and "pushin-to" values.
   */
  private showDebugger(): void {
    this.pushinDebug = document.createElement('div');
    this.pushinDebug.classList.add('pushin-debug');

    const scrollTitle = document.createElement('p');
    scrollTitle.innerText = 'Pushin.js Debugger';
    scrollTitle.classList.add('pushin-debug__title');

    const debuggerContent = document.createElement('div');
    debuggerContent.classList.add('pushin-debug__content');
    debuggerContent.innerText = `Scroll position: ${this.scrollY}px`;

    this.pushinDebug.appendChild(scrollTitle);
    this.pushinDebug.appendChild(debuggerContent);

    document.body.appendChild(this.pushinDebug);
  }
}
