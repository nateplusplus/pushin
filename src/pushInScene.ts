import {
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE,
  PUSH_IN_DEFAULT_BREAKPOINTS,
} from './constants';
import { PushInComposition } from './pushInComposition';
import { PushInLayer } from './pushInLayer';
import { PushIn } from './pushin';
import PushInBase from './pushInBase';

import { LayerOptions, SceneSettings } from './types';

export class PushInScene extends PushInBase {
  public layers: PushInLayer[];
  public layerDepth: number;
  public settings: SceneSettings;
  public composition?: PushInComposition;

  /* istanbul ignore next */
  constructor(public pushin: PushIn) {
    super();

    this.settings = pushin.settings.scene!;
    this.layerDepth = this.settings?.layerDepth || 1000;
    this.layers = [];
  }

  /* istanbul ignore next */
  start(): void {
    this.setContainer();
    this.setSceneClasses();
    this.setComposition();
    this.setBreakpoints();
    this.getLayers();
  }

  /**
   * If there is not a pushin-scene element, create one.
   */
  setContainer(): void {
    const container =
      this.pushin.container.querySelector<HTMLElement>('.pushin-scene');

    if (container) {
      this.container = container;
    } else {
      this.container = document.createElement('div');
      this.container.classList.add('pushin-scene');

      this.container.innerHTML = this.pushin.container.innerHTML;
      this.pushin.container.innerHTML = '';
      this.pushin.container.appendChild(this.container);
      this.pushin.cleanupFns.push(() => {
        this.pushin.container.innerHTML = this.container!.innerHTML;
      });
    }
  }

  /**
   * Setup composition for the scene.
   */
  setComposition(): void {
    const compositionOptions = {
      ratio: this.pushin.settings.composition?.ratio ?? undefined,
    };
    this.composition = new PushInComposition(this, compositionOptions);
    this.composition.start();
  }

  /**
   * Set scene class names.
   */
  /* istanbul ignore next */
  private setSceneClasses(): void {
    if (this.pushin.target) {
      this.container!.classList.add('pushin-scene--with-target');
    }

    if (this.pushin.target!.scrollTarget === 'window') {
      this.container!.classList.add('pushin-scene--scroll-target-window');
    }
  }

  /**
   * Resize the PushIn container if using a target container.
   */
  public resize() {
    if (this.pushin.target!.scrollTarget !== 'window') {
      const sizes = this.pushin.target!.container?.getBoundingClientRect();
      if (sizes) {
        this.container!.style.height = `${sizes.height}px`;
        this.container!.style.width = `${sizes.width}px`;
      }
    }
  }

  /**
   * Set breakpoints for responsive design settings.
   */
  private setBreakpoints(): void {
    if (
      !this.settings?.breakpoints ||
      this.settings?.breakpoints.length === 0
    ) {
      this.settings.breakpoints = [...PUSH_IN_DEFAULT_BREAKPOINTS];
    }

    if (this.container!.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE]) {
      this.settings!.breakpoints = this.container!.dataset[
        PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE
      ]!.split(',').map(breakpoint => parseInt(breakpoint.trim(), 10));
    }

    // Always include break point 0 for anything under first breakpoint
    this.settings!.breakpoints.unshift(0);
  }

  /**
   * Find all layers on the page and store them with their parameters
   */
  private getLayers(): void {
    const layers = Array.from(
      this.container!.getElementsByClassName('pushin-layer')
    );

    layers.forEach((element: Element, index) => {
      let options = <LayerOptions>{};
      if (this?.settings?.layers && this.settings.layers[index]) {
        options = this.settings.layers[index];
      }

      const layer = new PushInLayer(<HTMLElement>element, index, this, options);
      this.layers.push(layer);

      layer.setZIndex(layers.length);
    });
  }

  /**
   * Get the array index of the current window breakpoint.
   */
  getBreakpointIndex(breakpoints: number[]): number {
    // Find the largest breakpoint that is less-than or equal to the window width.
    const searchIndex = breakpoints
      .reverse()
      .findIndex(bp => bp <= window.innerWidth);
    return searchIndex === -1 ? 0 : breakpoints.length - 1 - searchIndex;
  }

  /**
   * Get the screen-top value of the container.
   *
   * If using a target, get the top of the
   * container relative to the target's top.
   *
   * @returns {number}
   */
  getTop(): number {
    let { top } = this.container!.getBoundingClientRect();
    if (this.pushin.target!.container) {
      top -= this.pushin.target!.container.getBoundingClientRect().top;
    }
    return top;
  }

  /**
   * Get the scene inpoints provided by the JavaScript API
   * and/or the HTML data-attributes.
   *
   * @returns {number[]}
   */
  getInpoints(): number[] {
    let inpoints = <number[]>[this.getTop()];

    if (this.container!.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      const pushInFrom = <string>(
        this.container!.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]
      );
      inpoints.push(parseInt(pushInFrom, 10));
    } else if (this.settings?.inpoints?.length > 0) {
      inpoints = this.settings.inpoints;
    }

    return inpoints;
  }
}
