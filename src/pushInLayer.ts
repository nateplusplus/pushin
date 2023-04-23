import {
  DEFAULT_SPEED,
  PUSH_IN_TO_DATA_ATTRIBUTE,
  PUSH_IN_FROM_DATA_ATTRIBUTE,
  PUSH_IN_SPEED_DATA_ATTRIBUTE,
  PUSH_IN_DEFAULT_TRANSITION_LENGTH,
} from './constants';
import { PushInScene } from './pushInScene';
import PushInBase from './pushInBase';

import { LayerOptions, LayerSettings, LayerRef, LayerParams } from './types';

export class PushInLayer extends PushInBase {
  public params!: LayerParams;
  private originalScale: number;
  private ref: LayerRef;
  public settings: LayerSettings;
  public isFirst: boolean;
  public isLast: boolean;

  /* istanbul ignore next */
  constructor(
    public container: HTMLElement,
    private index: number,
    public scene: PushInScene,
    options: LayerOptions
  ) {
    super();
    this.settings = options;

    this.isFirst = options.isFirst;
    this.isLast = options.isLast;

    const inpoints = this.getInpoints(this.container, this.index);
    const outpoints = this.getOutpoints(this.container, inpoints[0]);
    const speed = this.getSpeed(this.container);
    const tabInpoints = this.getTabInpoints(inpoints);

    this.originalScale = this.getElementScaleX(this.container);
    this.ref = {
      inpoints,
      outpoints,
      speed,
      tabInpoints,
    };

    this.setA11y();
    this.setLayerParams();
  }

  /**
   * Set Accessibility features.
   * Ensures layers are tabbable and their role is understood by screenreaders.
   */
  private setA11y() {
    this.container.setAttribute(
      'data-pushin-layer-index',
      this.index.toString()
    );
    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('aria-role', 'composite');
  }

  /**
   * Get the transitions setting, either from the API or HTML attributes.
   *
   * @return {boolean}
   */
  private getTransitions(): boolean {
    let transitions =
      this.settings?.transitions ?? this.scene.getMode() === 'sequential';
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
      const prevTranEnd = Math.max(0, prevLayer.params.transitionEnd);
      const curTranStart = Math.max(0, this.getTransitionStart());

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
    const transitions = this.getTransitions();
    let option = this.getNumberOption('transitionStart');

    if (option !== null && typeof option !== 'number') {
      // not yet compatible with breakpoints. Fall back to first value only.
      [option] = option;
    }

    let start = option as number | null;

    if (!start && !transitions && this.scene.getMode() === 'continuous') {
      start = -1;
    } else if (!start && this.isFirst) {
      start = -1;
    } else if (!start) {
      start = PUSH_IN_DEFAULT_TRANSITION_LENGTH;
    }

    return start;
  }

  /**
   * Get the transitionEnd setting, either from the API or HTML attributes.
   *
   * @returns number
   */
  private getTransitionEnd(): number {
    const transitions = this.getTransitions();
    let option = this.getNumberOption('transitionEnd');

    if (option !== null && typeof option !== 'number') {
      // not yet compatible with breakpoints. Fall back to first value only.
      [option] = option;
    }

    let end = option as number | null;

    if (!end && !transitions && this.scene.getMode() === 'continuous') {
      end = -1;
    } else if (!end && this.isLast) {
      end = -1;
    } else if (!end) {
      end = PUSH_IN_DEFAULT_TRANSITION_LENGTH;
    }

    return end;
  }

  /**
   * Get all inpoints for the layer.
   */
  private getInpoints(element: HTMLElement, index: number): number[] {
    const { scene } = this;
    let inpoints = [0];
    if (element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      inpoints = element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]!.split(',').map(
        inpoint => parseInt(inpoint.trim(), 10)
      );
    } else if (this.settings?.inpoints) {
      inpoints = this.settings.inpoints;
    } else if (this.isFirst || scene.getMode() === 'continuous') {
      inpoints = this.scene.getInpoints();
    } else if (index > 0) {
      // Set default for middle layers if none provided
      const { outpoint } = scene.layers[index - 1].params;
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
    } else if (this.settings?.outpoints) {
      outpoints = this.settings.outpoints;
    } else if (this.scene.getMode() === 'continuous') {
      // match pushin container height.
      outpoints = [-1];
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
    } else if (this.settings?.speed) {
      speed = this.settings.speed;
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
      tabInpoint: this.getTabInpoint(this.ref.tabInpoints),
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
   * Whether or not a layer should currently be animated.
   */
  private isActive(): boolean {
    const min = this.scene.pushin.scrollY >= this.params.inpoint;
    const max = this.scene.pushin.scrollY <= this.params.outpoint;
    return min && max;
  }

  /**
   * Get the current inpoint for a layer,
   * depending on window breakpoint.
   */
  /* istanbul ignore next */
  private getInpoint(inpoints: number[]): number {
    const { breakpoints } = this.scene.settings;
    return inpoints[this.scene.getBreakpointIndex(breakpoints)] || inpoints[0];
  }

  /**
   * Get the current outpoint for a layer,
   * depending on window breakpoint.
   */
  /* istanbul ignore next */
  private getOutpoint(outpoints: number[]): number {
    const { breakpoints } = this.scene.settings;
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

    if (
      isFirst &&
      this.scene.pushin.scrollY < inpoint &&
      this.params.transitionStart === -1
    ) {
      opacity = 1;
    } else if (
      isLast &&
      this.scene.pushin.scrollY > outpoint &&
      this.params.transitionEnd === -1
    ) {
      opacity = 1;
    } else if (this.isVisible() || this.isActive()) {
      let inpointDistance =
        Math.max(
          Math.min(
            this.scene.pushin.scrollY - inpoint,
            this.params.transitionStart
          ),
          0
        ) / this.params.transitionStart;

      if (this.params.transitionStart < 0) {
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

      if (this.params.transitionEnd < 0) {
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
   * Check if the layer should be visible.
   *
   * @returns boolean
   */
  isVisible(): boolean {
    const { scrollY } = this.scene.pushin;
    const { transitionStart, transitionEnd, transitions } = this.params;
    let isVisible = false;

    if (!transitions) {
      isVisible = true;
    } else if (this.params.inpoint > scrollY && transitionStart === -1) {
      isVisible = true;
    } else if (this.params.outpoint < scrollY && transitionEnd === -1) {
      isVisible = true;
    } else if (this.isActive()) {
      isVisible = true;
    }

    return isVisible;
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

  /**
   * Set tabInpoints for this layer.
   */
  getTabInpoints(inpoints: number[]): number[] {
    let tabInpoints = this.getNumberOption('tabInpoints');
    if (!tabInpoints) {
      tabInpoints = inpoints.map(
        inpoint => inpoint + this.getTransitionStart()
      );
    }
    if (typeof tabInpoints === 'number') {
      tabInpoints = [tabInpoints];
    }
    return tabInpoints;
  }

  /**
   * Get the current tabInpoint for a layer,
   * depending on window breakpoint.
   */
  /* istanbul ignore next */
  private getTabInpoint(tabInpoints: number[]): number {
    const { breakpoints } = this.scene.settings;
    const breakpoint = this.scene.getBreakpointIndex(breakpoints);
    return tabInpoints[breakpoint] || tabInpoints[0];
  }
}
