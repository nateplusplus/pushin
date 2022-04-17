import {
  DEFAULT_SPEED,
  PUSH_IN_TO_DATA_ATTRIBUTE,
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_SPEED_DATA_ATTRIBUTE,
} from './constants';
import { PushInScene } from './pushinScene';

import { LayerOptions, LayerRef, LayerParams } from './types';

export class PushInLayer {
  private originalScale: number;
  private ref: LayerRef;
  private params: LayerParams;

  constructor(
    private element: HTMLElement,
    private index: number,
    private scene: PushInScene,
    private options: LayerOptions | null
  ) {
    const inpoints = this.getInpoints(this.element, this.index);
    const outpoints = this.getOutpoints(this.element, inpoints[0]);
    const speed = this.getSpeed(this.element, this.index);

    this.originalScale = this.getElementScaleX(element);
    this.ref = { inpoints, outpoints, speed };

    this.params = {
      inpoint: this.getInpoint(inpoints),
      outpoint: this.getOutpoint(outpoints),
      speed,
    };
  }

  /**
   * Get all inpoints for the layer.
   */
  private getInpoints(element: HTMLElement, index: number): number[] {
    let inpoints = [this.scene.getTop()];
    if (element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      inpoints = element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]!.split(',').map(
        inpoint => parseInt(inpoint.trim(), 10)
      );
    } else if (this.options?.inpoints) {
      inpoints = this.options.inpoints;
    } else if (index === 0) {
      inpoints = this.scene.getInpoints();
    } else if (index > 0) {
      // Set default for middle layers if none provided
      const { outpoint } = this.scene.layers[index - 1].params;
      inpoints = [outpoint - this.speedDelta];
    }

    return inpoints;
  }

  /**
   * Get all outpoints for the layer.
   */
  private getOutpoints(element: HTMLElement, inpoint: number): number[] {
    let outpoints = [inpoint + this.layerDepth];

    if (element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]) {
      const values = element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]!.split(',');
      outpoints = values.map(value => parseInt(value.trim(), 10));
    } else if (this.options?.outpoints) {
      outpoints = this.options.outpoints;
    }

    return outpoints;
  }

  /**
   * Get the push-in speed for the layer.
   */
  private getSpeed(element: HTMLElement, index: number): number {
    let speed: number | null = null;

    if (element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]) {
      speed = parseInt(element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]!, 10);
      if (Number.isNaN(speed)) {
        speed = DEFAULT_SPEED;
      }
    } else if (this.options?.speed) {
      speed = this.options.speed;
    }

    return speed || DEFAULT_SPEED;
  }

  /**
   * Get the array index of the current window breakpoint.
   */
  private getBreakpointIndex(): number {
    const searchIndex = this.sceneOptions.breakpoints
      .reverse()
      .findIndex(bp => bp <= window.innerWidth);
    return searchIndex === -1
      ? 0
      : this.sceneOptions.breakpoints.length - 1 - searchIndex;
  }

  /**
   * Set the z-index of each layer so they overlap correctly.
   */
  setZIndex(total: number): void {
    this.element.style.zIndex = (total - this.index).toString();
  }

  /**
   * Reset all the layer parameters.
   *
   * This is used if the window is resized
   * and things need to be recalculated.
   */
  private resetLayerParams(): void {
    this.params = {
      inpoint: this.getInpoint(this.ref.inpoints),
      outpoint: this.getOutpoint(this.ref.outpoints),
      speed: this.ref.speed,
    };
  }

  /**
   * Get the initial scale of the element at time of DOM load.
   */
  private getElementScaleX(element: HTMLElement): number {
    const transform = window
      .getComputedStyle(element)
      .getPropertyValue('transform');

    let scaleX = 1;
    if (transform && transform !== 'none') {
      const match = transform.match(/[matrix|scale]\(([\d,.\s]+)/);
      if (match && match[1]) {
        const matrix = match[1].split(', ');
        scaleX = parseFloat(matrix[0]);
      }
    }

    return scaleX;
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
    this.layers.forEach(layer => this.setLayerStyle(layer));
  }

  /**
   * Whether or not a layer should currently be zooming.
   */
  private isActive(layer: PushInLayer): boolean {
    const { inpoint } = layer.params;
    const { outpoint } = layer.params;
    return this.scrollPos >= inpoint && this.scrollPos <= outpoint;
  }

  /**
   * Get the current inpoint for a layer,
   * depending on window breakpoint.
   */
  private getInpoint(inpoints: number[]): number {
    return inpoints[this.getBreakpointIndex()] || inpoints[0];
  }

  /**
   * Get the current outpoint for a layer,
   * depending on window breakpoint.
   */
  private getOutpoint(outpoints: number[]): number {
    return outpoints[this.getBreakpointIndex()] || outpoints[0];
  }

  /**
   * Get the scaleX value for the layer.
   */
  private getScaleValue(layer: PushInLayer): number {
    const distance = this.scrollPos - layer.params.inpoint;
    const speed = Math.min(layer.params.speed, 100) / 100;
    const delta = (distance * speed) / 100;

    return Math.max(layer.originalScale + delta, 0);
  }

  /**
   * Set element scale.
   */
  private setScale({ style }: HTMLElement, value: number): void {
    const scaleString = `scale(${value})`;
    style.webkitTransform = scaleString;
    (style as unknown as { mozTransform: string }).mozTransform = scaleString;
    (style as unknown as { msTransform: string }).msTransform = scaleString;
    (style as unknown as { oTransform: string }).oTransform = scaleString;
    style.transform = scaleString;
  }

  /**
   * Set CSS styles to control the effect on each layer.
   *
   * This will control the scale and opacity of the layer
   * as the user scrolls.
   */
  setLayerStyle(): void {
    let opacity = 0;
    const isFirst = this.index === 0;
    const isLast = this.index + 1 === this.scene.layers.length;
    const { inpoint } = this.params;
    const { outpoint } = this.params;

    if (isFirst && this.scrollPos < inpoint) {
      opacity = 1;
    } else if (isLast && this.scrollPos > outpoint) {
      opacity = 1;
    } else if (this.isActive(this)) {
      this.setScale(this.element, this.getScaleValue(this));

      let inpointDistance =
        Math.max(
          Math.min(this.scrollPos - inpoint, this.scene.transitionLength),
          0
        ) / this.scene.transitionLength;

      // Set opacity to 1 if its the first layer and it is active (no fading in here)
      if (isFirst) {
        inpointDistance = 1;
      }

      let outpointDistance =
        Math.max(
          Math.min(outpoint - this.scrollPos, this.transitionLength),
          0
        ) / this.transitionLength;

      // Set opacity to 1 if its the last layer and it is active (no fading out)
      if (isLast) {
        outpointDistance = 1;
      }

      opacity = Math.min(inpointDistance, outpointDistance);
    }

    this.element.style.opacity = opacity.toString();
  }
}
