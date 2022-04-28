import {
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE,
} from './constants';
import { PushInLayer } from './pushinLayer';
import { PushIn } from './pushin';

import { LayerOptions } from './types';

export class PushInScene {
  private container: HTMLElement;
  private readonly cleanupFns: VoidFunction[] = [];
  public layers: PushInLayer[];
  public speedDelta: number;
  public transitionLength: number;
  public layerDepth: number;

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
      this.cleanupFns.push(() => {
        this.pushin.container.innerHTML = this.container.innerHTML;
      });
    }

    this.speedDelta = pushin.sceneOptions?.speedDelta || 100;
    this.layerDepth = pushin.sceneOptions?.layerDepth || 1000;
    this.transitionLength = pushin.sceneOptions?.transitionLength || 200;

    this.layers = [];

    this.setBreakpoints();
    this.getLayers();
  }

  /**
   * Set breakpoints for responsive design settings.
   */
  private setBreakpoints(): void {
    if (this.pushin.sceneOptions?.breakpoints.length === 0) {
      this.pushin.sceneOptions.breakpoints = [768, 1440, 1920];
    }

    if (this.container.dataset[PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE]) {
      this.pushin.sceneOptions!.breakpoints = this.container.dataset[
        PUSH_IN_BREAKPOINTS_DATA_ATTRIBUTE
      ]!.split(',').map(breakpoint => parseInt(breakpoint.trim(), 10));
    }

    // Always include break point 0 for anything under first breakpoint
    this.pushin.sceneOptions!.breakpoints.unshift(0);
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
      if (
        this.pushin.sceneOptions?.layers &&
        this.pushin.sceneOptions.layers.length > index
      ) {
        options = this!.pushin.sceneOptions.layers[index];
      }

      const layer = new PushInLayer(element, index, this, options);
      this.layers.push(layer);

      layer.setZIndex(layers.length);
    }
  }

  /**
   * Get the array index of the current window breakpoint.
   */
  getBreakpointIndex(): number {
    const searchIndex = this.pushin
      .sceneOptions!.breakpoints.reverse()
      .findIndex(bp => bp <= window.innerWidth);
    return searchIndex === -1
      ? 0
      : this.pushin.sceneOptions!.breakpoints.length - 1 - searchIndex;
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
    } else if (this.pushin.sceneOptions?.inpoints?.length > 0) {
      inpoints = this.pushin.sceneOptions.inpoints;
    }

    return inpoints;
  }
}
