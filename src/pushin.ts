import { PushInScene } from './pushInScene';
import { PushInTarget } from './pushInTarget';
import { PushInOptions, PushInSettings, TargetSettings } from './types';
import { PUSH_IN_LAYER_INDEX_ATTRIBUTE } from './constants';
import PushInBase from './pushInBase';
import pushInStyles from './pushInStyles';

/**
 * PushIn object
 *
 * Once new object is created, it will initialize itself and
 * bind events to begin interacting with dom.
 */
export class PushIn extends PushInBase {
  public scene!: PushInScene;
  private pushinDebug?: HTMLElement;
  public target?: PushInTarget;
  public scrollY = 0;
  private lastAnimationFrameId = -1;
  public cleanupFns: VoidFunction[] = [];
  public settings: PushInSettings;
  public mode!: string;

  /* istanbul ignore next */
  constructor(public container: HTMLElement, options?: PushInOptions) {
    super();
    options = options ?? {};

    this.settings = {
      debug: options?.debug ?? false,
      scene: options?.scene ?? { breakpoints: [], inpoints: [] },
      target: options?.target ?? undefined,
      scrollTarget: options?.scrollTarget,
      mode: options?.mode ?? 'sequential',
    };

    this.settings.scene!.composition = options?.composition ?? undefined;
    this.settings.scene!.layers = options?.layers ?? undefined;

    // Defaults
    this.settings.debug = options?.debug ?? false;
  }

  /**
   * Initialize the object to start everything up.
   */
  /* istanbul ignore next */
  start(): void {
    if (this.container) {
      if (this.settings.debug) {
        this.showDebugger();
      }

      this.setMode();
      this.loadStyles();
      this.setTarget();
      this.scrollY = this.getScrollY();

      this.scene = new PushInScene(this);
      this.scene.start();

      this.setScrollLength();
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
   * Set the mode.
   *
   * @returns {string}    The mode setting, or "sequential" by default.
   */
  setMode() {
    const mode = <string>this.getStringOption('mode');
    this.mode = mode !== '' ? mode : 'sequential';
  }

  /**
   * Set up the target element for this effect, and where to listen for scrolling.
   */
  setTarget() {
    const options: TargetSettings = {};

    if (this.settings.target) {
      options.target = this.settings.target;
    }

    if (this.settings.scrollTarget) {
      options.scrollTarget = this.settings.scrollTarget;
    }

    this.target = new PushInTarget(this, options);
    this.target.start();
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

    if (
      this.target?.scrollTarget === 'window' &&
      typeof window !== 'undefined'
    ) {
      scrollY = window.scrollY;
    } else {
      const target = <HTMLElement>this.target!.scrollTarget;
      scrollY = <number>target.scrollTop;
    }

    return scrollY;
  }

  /**
   * Bind event listeners to watch for page load and user interaction.
   */
  /* istanbul ignore next */
  bindEvents(): void {
    let scrollTarget: Window | HTMLElement = window;
    if (this.target!.scrollTarget !== 'window') {
      scrollTarget = <HTMLElement>this.target!.scrollTarget;
    }

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

          if (this.target!.scrollTarget === 'window') {
            window.scrollTo(0, scrollTo);
          } else {
            const container = <HTMLElement>scrollTarget;
            container.scrollTop = scrollTo;
          }
        }
      }
    };
    window.addEventListener('focus', onFocus, true);
  }

  /**
   * Animation effect, mimicking a camera dolly on the webpage.
   */
  /* istanbul ignore next */
  private dolly(): void {
    cancelAnimationFrame(this.lastAnimationFrameId);

    this.lastAnimationFrameId = requestAnimationFrame(() => {
      this.toggleLayers();
    });
  }

  /**
   * Show or hide layers and set their scale, depending on if active.
   */
  /* istanbul ignore next */
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

    let maxOutpoint = 0;
    this.scene.layers.forEach(layer => {
      maxOutpoint = Math.max(maxOutpoint, layer.params.outpoint);
    });

    this.container.style.height = `${Math.max(
      parseFloat(containerHeight),
      maxOutpoint + this.target!.height
    )}px`;
  }

  loadStyles(): void {
    const stylesheet = document.querySelector('style#pushin-styles');

    if (!stylesheet) {
      const sheet = document.createElement('style');
      sheet.id = 'pushin-styles';

      sheet.appendChild(document.createTextNode(pushInStyles));
      document.head.appendChild(sheet);

      this.cleanupFns.push(() => {
        document.head.removeChild(sheet);
      });
    }
  }

  /**
   * Show a debugging tool appended to the frontend of the page.
   * Can be used to determine best "pushin-from" and "pushin-to" values.
   */
  /* istanbul ignore next */
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

    const target = this.target!.container ?? document.body;

    target.appendChild(this.pushinDebug);
  }
}
