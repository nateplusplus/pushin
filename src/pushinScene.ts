import {
  DEFAULT_SPEED,
  PUSH_IN_TO_DATA_ATTRIBUTE,
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_SPEED_DATA_ATTRIBUTE,
  PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE,
} from './constants';
import { PushInLayer } from './pushinLayer';

import { SceneOptions, LayerOptions } from './types';

export class PushInScene {
  private container: HTMLElement;
  private readonly cleanupFns: VoidFunction[] = [];
  public layers: PushInLayer[];
  public speedDelta: number;
  public transitionLength: number;
  public layerDepth: number;

  constructor(
    private parent: HTMLElement,
    private options?: SceneOptions,
    private layerOptions?: LayerOptions[]
  ) {
    const container = this.parent.querySelector<HTMLElement>('.pushin-scene');

    if (container) {
      this.container = container;
    } else {
      this.container = document.createElement('div');
      this.container.classList.add('pushin-scene');

      this.container.innerHTML = this.parent.innerHTML;
      this.parent.innerHTML = '';
      this.parent.appendChild(this.container);
      this.cleanupFns.push(() => {
        this.parent.innerHTML = this.container.innerHTML;
      });
    }

    this.speedDelta = options?.speedDelta || 100;
    this.layerDepth = options?.layerDepth || 1000;
    this.transitionLength = options?.transitionLength || 200;

    this.layers = [];

    this.setBreakpoints();
    this.getLayers();
  }

  /**
   * Set breakpoints for responsive design settings.
   */
  private setBreakpoints(): void {
    if (this.options?.breakpoints.length === 0) {
      this.options.breakpoints = [768, 1440, 1920];
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
      if (this.layerOptions && this.layerOptions.length > index) {
        options = this!.layerOptions[index];
      }

      const layer = new PushInLayer(element, index, this, options);
      this.layers.push(layer);

      layer.setZIndex(layers.length);
    }
  }

  /**
   * Get the array index of the current window breakpoint.
   */
  private getBreakpointIndex(): number {
    const searchIndex = this.options!.breakpoints.reverse().findIndex(
      bp => bp <= window.innerWidth
    );
    return searchIndex === -1
      ? 0
      : this.options!.breakpoints.length - 1 - searchIndex;
  }

  getTop() {
    return this.container.getBoundingClientRect().top;
  }

  getInpoints(): number[] {
    let inpoints = <number[]>[];

    if (this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      const pushInFrom = <string>(
        this.container.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]
      );
      inpoints.push(parseInt(pushInFrom, 10));
    } else if (this.options && this.options?.inpoints?.length > 0) {
      inpoints = this.options.inpoints;
    }

    return inpoints;
  }
}
