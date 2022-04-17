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

  constructor(
    private parent: HTMLElement,
    private options?: SceneOptions,
    private layerOptions?: LayerOptions
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
      this.cleanupFns.push(() => this.container.removeChild(this.container));
    }

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
      const layerOptions = this.layerOptions ?? {};
      const layer = new PushInLayer(
        element,
        index,
        this.container,
        layerOptions
      );
      this.layers.push(layer);
      this.setZIndex(layer, layers.length);
    }
  }

  /**
   * Get all inpoints for the layer.
   */
  private getInpoints(element: HTMLElement, index: number): number[] {
    const { top } = this.scene.getBoundingClientRect();

    let inpoints = [top];
    if (element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      inpoints = element.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]!.split(',').map(
        inpoint => parseInt(inpoint.trim(), 10)
      );
    } else if (this.layerOptions[index]?.inpoints) {
      inpoints = this.layerOptions[index].inpoints;
    } else if (index === 0 && this.scene.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]) {
      // Custom inpoint
      inpoints = this.scene.dataset[PUSH_IN_FROM_DATA_ATTRIBUTE]!.split(
        ','
      ).map(inpoint => parseInt(inpoint.trim(), 10));
    } else if (index === 0 && this.sceneOptions?.inpoints.length > 0) {
      inpoints = this.sceneOptions.inpoints;
    } else if (index > 0) {
      // Set default for middle layers if none provided
      const { outpoint } = this.layers[index - 1].params;
      inpoints = [outpoint - this.speedDelta];
    }

    return inpoints;
  }

  /**
   * Get all outpoints for the layer.
   */
  private getOutpoints(
    element: HTMLElement,
    inpoint: number,
    index: number
  ): number[] {
    let outpoints = [inpoint + this.layerDepth];

    if (element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]) {
      const values = element.dataset[PUSH_IN_TO_DATA_ATTRIBUTE]!.split(',');
      outpoints = values.map(value => parseInt(value.trim(), 10));
    } else if (this.layerOptions[index]?.outpoints) {
      outpoints = this.layerOptions[index].outpoints;
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
    } else if (this.layerOptions[index]?.speed) {
      speed = this.layerOptions[index].speed;
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
  private setZIndex(layer: PushInLayer, total: number): void {
    layer.element.style.zIndex = (total - layer.index).toString();
  }

  /**
   * Bind event listeners to watch for page load and user interaction.
   */
  private bindEvents(): void {
    const onScroll = () => {
      this.scrollPos = window.pageYOffset;
      this.dolly();
    };
    window.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));

    const onTouchstart = (event: TouchEvent) => {
      this.touchStart = event.changedTouches[0].screenY;
    };
    window.addEventListener('touchstart', onTouchstart);
    this.cleanupFns.push(() =>
      window.removeEventListener('touchstart', onTouchstart)
    );

    const onTouchmove = (event: TouchEvent) => {
      event.preventDefault();

      const touchMove = event.changedTouches[0].screenY;
      this.scrollPos = Math.max(
        this.scrollEnd! + this.touchStart! - touchMove,
        0
      );
      this.scrollPos = Math.min(
        this.scrollPos,
        this.pageHeight! - window.innerHeight
      );

      this.dolly();
    };
    window.addEventListener('touchmove', onTouchmove);
    this.cleanupFns.push(() =>
      window.removeEventListener('touchmove', onTouchmove)
    );

    const onTouchend = () => {
      this.scrollEnd = this.scrollPos;
    };
    window.addEventListener('touchend', onTouchend);
    this.cleanupFns.push(() =>
      window.removeEventListener('touchend', onTouchend)
    );

    let resizeTimeout: number;
    const onResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = window.setTimeout(() => {
        this.resetLayerParams();
        this.setScrollLength();
        this.toggleLayers();
      }, 300);
    };
    window.addEventListener('resize', onResize);
    this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
  }

  /**
   * Reset all the layer parameters.
   *
   * This is used if the window is resized
   * and things need to be recalculated.
   */
  private resetLayerParams(): void {
    this.layers.forEach(layer => {
      layer.params = {
        inpoint: this.getInpoint(layer.ref.inpoints),
        outpoint: this.getOutpoint(layer.ref.outpoints),
        speed: layer.ref.speed,
      };
    });
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
  private setLayerStyle(layer: PushInLayer): void {
    let opacity = 0;
    const isFirst = layer.index === 0;
    const isLast = layer.index + 1 === this.layers.length;
    const { inpoint } = layer.params;
    const { outpoint } = layer.params;

    if (isFirst && this.scrollPos < inpoint) {
      opacity = 1;
    } else if (isLast && this.scrollPos > outpoint) {
      opacity = 1;
    } else if (this.isActive(layer)) {
      this.setScale(layer.element, this.getScaleValue(layer));

      let inpointDistance =
        Math.max(Math.min(this.scrollPos - inpoint, this.transitionLength), 0) /
        this.transitionLength;

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

    layer.element.style.opacity = opacity.toString();
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

    const transitions = (this.layers.length - 1) * this.speedDelta;
    const scrollLength =
      this.layers.length * (this.layerDepth + this.transitionLength);

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
    const scrollCounter = document.createElement('div');
    scrollCounter.classList.add('pushin-debug');

    const scrollTitle = document.createElement('p');
    scrollTitle.innerText = 'Pushin.js Debugger';
    scrollTitle.classList.add('pushin-debug__title');

    const debuggerContent = document.createElement('div');
    debuggerContent.classList.add('pushin-debug__content');
    debuggerContent.innerText = `Scroll position: ${window.pageYOffset}px`;

    scrollCounter.appendChild(scrollTitle);
    scrollCounter.appendChild(debuggerContent);

    document.body.appendChild(scrollCounter);

    window.addEventListener('scroll', () => {
      debuggerContent.innerText = `Scroll position: ${Math.round(
        window.pageYOffset
      )}px`;
    });
  }
}
