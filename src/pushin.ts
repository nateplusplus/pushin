import { PushInScene } from './pushInScene';
import { PushInOptions } from './types';
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
  public target?: HTMLElement | null;
  public scrollY = 0;
  private lastAnimationFrameId = -1;
  public cleanupFns: VoidFunction[] = [];
  public options: PushInOptions;

  constructor(public container: HTMLElement, options?: PushInOptions) {
    options = options ?? {};

    this.options = {
      debug: options?.debug ?? false,
      scene: options?.scene ?? { breakpoints: [], inpoints: [] },
      target: options?.target ?? undefined,
    };

    this.options.scene!.composition = options?.composition ?? undefined;
    this.options.scene!.layers = options?.layers ?? undefined;

    this.options.debug = options?.debug ?? false;
  }

  /**
   * Initialize the object to start everything up.
   */
  start(): void {
    this.setTarget();

    this.scrollY = this.getScrollY();

    if (this.options.debug) {
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
  setTarget(): void {
    if (this.options.target) {
      this.target = document.querySelector(this.options!.target);
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
        this.scene.layers.forEach(layer => layer.setLayerParams());
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
          const scrollTo = layer.params.inpoint + layer.params.transitionStart;

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
   * Automatically set the container height based on the greatest outpoint.
   *
   * If the container has a height set already (e.g. if set by CSS),
   * the larger of the two numbers will be used.
   */
  private setScrollLength(): void {
    const containerHeight = getComputedStyle(this.container).height.replace(
      'px',
      ''
    );

    let targetHeight = window.innerHeight;
    if (this.target) {
      targetHeight = parseInt(
        getComputedStyle(this.target).height.replace('px', ''),
        10
      );
    }

    let maxOutpoint = 0;
    this.scene.layers.forEach(layer => {
      maxOutpoint = Math.max(maxOutpoint, layer.params.outpoint);
    });

    this.container.style.height = `${Math.max(
      parseFloat(containerHeight),
      maxOutpoint + targetHeight
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
