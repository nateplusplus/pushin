import { PushInScene } from './pushInScene';
import { PushInLayer } from './pushInLayer';

import { PushInOptions, SceneOptions } from './types';

import { PUSH_IN_LAYER_INDEX_ATTRIBUTE } from './constants';

/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
export class PushIn {
  public scene!: PushInScene;
  private pushinDebug?: HTMLElement;
  public sceneOptions: SceneOptions;
  public target?: HTMLElement | null;

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

    this.setTarget(options);
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
      this.setTargetOverflow();
      this.scene.resize();

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
   * Set the target parameter and make sure
   * pushin is always a child of that target.
   *
   * @param options
   */
  setTarget(options: PushInOptions | undefined): void {
    if (options?.target) {
      this.target = document.querySelector(options!.target);
    }

    if (this.container.hasAttribute('data-pushin-target')) {
      const selector = <string>this.container!.dataset!.pushinTarget;
      this.target = document.querySelector(selector);
    }

    if (this.target && this.container.parentElement !== this.target) {
      // Move pushin into the target container
      this.target.appendChild(this.container);
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
    let scrollY = 0;
    if (this.target) {
      scrollY = this.target.scrollTop;
    } else if (typeof window !== 'undefined') {
      scrollY = window.scrollY;
    }

    return scrollY;
  }

  /**
   * Set overflow-y and scroll-behavior styles
   * on the provided target element.
   */
  private setTargetOverflow(): void {
    if (this.target) {
      this.target.style.overflowY = 'scroll';
      this.target.style.scrollBehavior = 'smooth';
    }
  }

  /**
   * Bind event listeners to watch for page load and user interaction.
   */
  bindEvents(): void {
    const scrollTarget = this.target ? this.target : window;

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
    scrollTarget.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() =>
      scrollTarget.removeEventListener('scroll', onScroll)
    );

    let resizeTimeout: number;
    const onResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = window.setTimeout(() => {
        this.scene.layers.forEach(layer => layer.resetLayerParams());
        this.setScrollLength();
        this.scene.resize();
        this.toggleLayers();
      }, 300);
    };
    window.addEventListener('resize', onResize);
    this.cleanupFns.push(() => window.removeEventListener('resize', onResize));

    const onFocus = (event: FocusEvent) => {
      const target = <HTMLElement>event.target;
      if (
        'hasAttribute' in target &&
        target.hasAttribute(PUSH_IN_LAYER_INDEX_ATTRIBUTE)
      ) {
        const index = parseInt(
          <string>target!.getAttribute(PUSH_IN_LAYER_INDEX_ATTRIBUTE),
          10
        );

        const layer = this.scene.layers[index];
        if (layer) {
          const scrollTo =
            layer.params.inpoint + layer!.scene!.transitionLength;

          if (!this.target) {
            window.scrollTo(0, scrollTo);
          } else {
            this.target.scrollTop = scrollTo;
          }
        }
      }
    };
    window.addEventListener('focus', onFocus, true);
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

    const target = this.target ?? document.body;

    target.appendChild(this.pushinDebug);
  }
}
