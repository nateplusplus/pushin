import {
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE,
  PUSH_IN_DEFAULT_BREAKPOINTS,
} from './constants';
import { PushInLayer } from './pushInLayer';
import { PushIn } from './pushin';

import { LayerOptions, SceneOptions } from './types';

export class PushInScene {
  private container: HTMLElement;
  public layers: PushInLayer[];
  public speedDelta: number;
  public transitionLength: number;
  public layerDepth: number;
  public options: SceneOptions;

  constructor(public pushin: PushIn) {
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
        this.pushin.container.innerHTML = this.container.innerHTML;
      });
    }

    this.options = pushin.sceneOptions;

    this.speedDelta = this.options?.speedDelta || 100;
    this.layerDepth = this.options?.layerDepth || 1000;
    this.transitionLength = this.options?.transitionLength || 200;

    this.layers = [];

    this.setSceneClasses();
    this.setBreakpoints();
    this.getLayers();
  }

  private setSceneClasses() {
    if (this.pushin.target) {
      this.container.classList.add('pushin-scene--with-target');
    }
  }

  public resize() {
    const sizes = this.pushin.target?.getBoundingClientRect();
    if (sizes) {
      this.container.style.height = `${sizes.height}px`;
      this.container.style.width = `${sizes.width}px`;
    }
  }

  /**
   * Set breakpoints for responsive design settings.
   */
  private setBreakpoints(): void {
    if (this.options?.breakpoints.length === 0) {
      this.options.breakpoints = [...PUSH_IN_DEFAULT_BREAKPOINTS];
    }

    if (this.container.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE]) {
      this.options!.breakpoints = this.container.dataset[
        PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE
      ]!.split(',').map(breakpoint => parseInt(breakpoint.trim(), 10));
    }

    // Always include break point 0 for anything under first breakpoint
    this.options!.breakpoints.unshift(0);
  }

  /**
   * Find all layers on the page and store them with their parameters
   */
  private getLayers(): void {
    const layers = Array.from(
      this.container.getElementsByClassName('pushin-layer')
    );

    for (let index = 0; index < layers.length; index++) {
      const element = <HTMLElement>layers[index];
      let options = <LayerOptions>{};
      if (this.options?.layers && this.options.layers.length > index) {
        options = this!.options.layers[index];
      }

      const layer = new PushInLayer(element, index, this, options);
      this.layers.push(layer);

      layer.setZIndex(layers.length);
    }
  }

  /**
   * Get the array index of the current window breakpoint.
   */
  getBreakpointIndex(breakpoints: number[]): number {
    const searchIndex = breakpoints
      .reverse()
      .findIndex(bp => bp <= window.innerWidth);
    return searchIndex === -1 ? 0 : breakpoints.length - 1 - searchIndex;
  }

  getTop() {
    return this.container.getBoundingClientRect().top;
  }

  getInpoints(): number[] {
    let inpoints = <number[]>[this.getTop()];

    if (this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      const pushInFrom = <string>(
        this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]
      );
      inpoints.push(parseInt(pushInFrom, 10));
    } else if (this.options?.inpoints?.length > 0) {
      inpoints = this.options.inpoints;
    }

    return inpoints;
  }
}
