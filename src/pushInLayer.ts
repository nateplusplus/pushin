import {
  DEFAULT_SPEED,
  PUSH_IN_TO_DATA_ATTRIBUTE,
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_SPEED_DATA_ATTRIBUTE,
  PUSH_IN_DEFAULT_TRANSITION_LENGTH,
} from './constants';
import { PushInScene } from './pushInScene';
import PushInBase from './pushInBase';

import { LayerOptions, LayerRef, LayerParams } from './types';

export class PushInLayer extends PushInBase {
  public params!: LayerParams;
  private originalScale: number;
  private ref: LayerRef;

  /* istanbul ignore next */
  constructor(
    public container: HTMLElement,
    private index: number,
    public scene: PushInScene,
    public options: LayerOptions
  ) {
    super();
    const inpoints = this.getInpoints(this.container, this.index);
    const outpoints = this.getOutpoints(this.container, inpoints[0]);
    const speed = this.getSpeed(this.container);

    this.originalScale = this.getElementScaleX(this.container);
    this.ref = { inpoints, outpoints, speed };

    this.container.setAttribute(
      'data-pushin-layer-index',
      this.index.toString()
    );

    // Set tabindex so we can sync scrolling with screenreaders
    this.container.setAttribute('tabindex', '0');

    this.setLayerParams();
  }

  /**
   * Get the transitions setting, either from the API or HTML attributes.
   *
   * @return {boolean}
   */
  private getTransitions(): boolean {
    let transitions = this.options?.transitions ?? true;
    if (this.container.hasAttribute('data-pushin-transitions')) {
      const attr = this.container!.dataset!.pushinTransitions;
      if (attr) {
        transitions = attr !== 'false' && attr !== '0';
      }
    }
    return transitions;
  }

  /**
   * Get the amount of overlap between previous and current layer.
   *
   * @return {number}
   */
  private getOverlap(): number {
    let overlap = 0;

    if (this.index > 0) {
      const prevLayer = this.scene.layers[this.index - 1];
      const prevTranEnd = prevLayer.params.transitionEnd;
      const curTranStart = this.getTransitionStart();

      const average = (curTranStart + prevTranEnd) / 2;

      overlap = Math.min(average * 0.5, curTranStart);
    }

    return overlap;
  }

  /**
   * Get the transitionStart setting, either from the API or HTML attributes.
   *
   * @returns number
   */
  private getTransitionStart(): number {
    let option = this.getNumberOption('transitionStart');

    if (option !== null && typeof option !== 'number') {
      // not yet compatible with breakpoints. Fall back to first value only.
      [option] = option;
    }

    const start = option as number | null;

    return start === null ? PUSH_IN_DEFAULT_TRANSITION_LENGTH : start;
  }

  /**
   * Get the transitionEnd setting, either from the API or HTML attributes.
   *
   * @returns number
   */
  private getTransitionEnd(): number {
    let option = this.getNumberOption('transitionEnd');

    if (option !== null && typeof option !== 'number') {
      // not yet compatible with breakpoints. Fall back to first value only.
      [option] = option;
    }

    const end = option as number | null;

    return end === null ? PUSH_IN_DEFAULT_TRANSITION_LENGTH : end;
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
      inpoints = [outpoint - this.getOverlap()];
    }

    return inpoints;
  }

  /**
   * Get all outpoints for the layer.
   */
  private getOutpoints(element: HTMLElement, inpoint: number): number[] {
    let outpoints = [inpoint + this.scene.layerDepth];

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
  private getSpeed(element: HTMLElement): number {
    let speed: number | null = null;

    if (element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]) {
      speed = parseFloat(element.dataset[PUSH_IN_SPEED_DATA_ATTRIBUTE]!);
      if (Number.isNaN(speed)) {
        speed = DEFAULT_SPEED;
      }
    } else if (this.options?.speed) {
      speed = this.options.speed;
    }

    return speed || DEFAULT_SPEED;
  }

  /**
   * Set the z-index of each layer so they overlap correctly.
   */
  setZIndex(total: number): void {
    this.container.style.zIndex = (total - this.index).toString();
  }

  /**
   * Set all the layer parameters.
   *
   * This is used during initalization and
   * if the window is resized.
   */
  /* istanbul ignore next */
  setLayerParams(): void {
    this.params = {
      depth: this.getDepth(),
      inpoint: this.getInpoint(this.ref.inpoints),
      outpoint: this.getOutpoint(this.ref.outpoints),
      overlap: this.getOverlap(),
      speed: this.ref.speed,
      transitions: this.getTransitions(),
      transitionStart: this.getTransitionStart(),
      transitionEnd: this.getTransitionEnd(),
    };
  }

  /* istanbul ignore next */
  private getDepth(): number {
    return (
      this.getOutpoint(this.ref.outpoints) - this.getInpoint(this.ref.inpoints)
    );
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
   * Whether or not a layer should currently be zooming.
   */
  private isActive(): boolean {
    const { inpoint } = this.params;
    const { outpoint } = this.params;

    let active = true;

    if (this.params.transitions) {
      const min = this.scene.pushin.scrollY >= inpoint;
      const max = this.scene.pushin.scrollY <= outpoint;
      active = min && max;
      if (!active && this.params.transitionStart < 0 && !min) {
        active = true;
      } else if (!active && this.params.transitionEnd < 0 && !max) {
        active = true;
      }
    }

    return active;
  }

  /**
   * Get the current inpoint for a layer,
   * depending on window breakpoint.
   */
  /* istanbul ignore next */
  private getInpoint(inpoints: number[]): number {
    const { breakpoints } = this.scene.options;
    return inpoints[this.scene.getBreakpointIndex(breakpoints)] || inpoints[0];
  }

  /**
   * Get the current outpoint for a layer,
   * depending on window breakpoint.
   */
  /* istanbul ignore next */
  private getOutpoint(outpoints: number[]): number {
    const { breakpoints } = this.scene.options;
    return (
      outpoints[this.scene.getBreakpointIndex(breakpoints)] || outpoints[0]
    );
  }

  /**
   * Get the scaleX value for the layer.
   */
  private getScaleValue(layer: PushInLayer): number {
    const distance = this.scene.pushin.scrollY - layer.params.inpoint;
    const speed = Math.min(layer.params.speed, 100) / 100;
    const delta = (distance * speed) / 100;

    return Math.max(layer.originalScale + delta, 0);
  }

  /**
   * Set element scale.
   */
  private setScale(value: number): void {
    const { style } = this.container;
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

    if (isFirst && this.scene.pushin.scrollY < inpoint) {
      opacity = 1;
    } else if (isLast && this.scene.pushin.scrollY > outpoint) {
      opacity = 1;
    } else if (this.isActive()) {
      let inpointDistance =
        Math.max(
          Math.min(
            this.scene.pushin.scrollY - inpoint,
            this.params.transitionStart
          ),
          0
        ) / this.params.transitionStart;

      if (isFirst || this.params.transitionStart < 0) {
        inpointDistance = 1;
      }

      let outpointDistance =
        Math.max(
          Math.min(
            outpoint - this.scene.pushin.scrollY,
            this.params.transitionEnd
          ),
          0
        ) / this.params.transitionEnd;

      if (isLast || this.params.transitionEnd < 0) {
        outpointDistance = 1;
      }

      opacity = this.params.transitions
        ? Math.min(inpointDistance, outpointDistance)
        : 1;
    }

    if (this.isActive()) {
      this.setScale(this.getScaleValue(this));
    }

    this.container.style.opacity = opacity.toString();
  }

  /**
   * Set a css class depending on current opacity.
   */
  setLayerVisibility() {
    if (parseFloat(this.container.style.opacity) > 0.1) {
      this.container.classList.add('pushin-layer--visible');
    } else {
      this.container.classList.remove('pushin-layer--visible');
    }
  }
}
