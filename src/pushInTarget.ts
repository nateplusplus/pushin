import PushInBase from './pushInBase';
import { PushIn } from './pushin';
import { TargetSettings } from './types';

export class PushInTarget extends PushInBase {
  public container: HTMLElement | null;
  public scrollTarget: HTMLElement | string;
  public height: number;

  /* istanbul ignore next */
  constructor(public pushin: PushIn, public settings: TargetSettings) {
    super();

    // set defaults
    this.container = null;
    this.scrollTarget = 'window';
    this.height = 0;
  }

  start(): void {
    this.setTargetElement();
    this.setScrollTarget();
    this.setTargetHeight();
    this.setTargetOverflow();
  }

  /**
   * Set the target parameter and make sure
   * pushin is always a child of that target.
   *
   * @param options
   */
  setTargetElement(): void {
    const value = <string>this.getStringOption('target');

    if (value) {
      const element = <HTMLElement | undefined>document.querySelector(value);
      if (element) {
        this.container = element;
      }
    }

    if (
      this.container &&
      this.pushin.container.parentElement !== this.container
    ) {
      // Move pushin into the target container
      this.container.appendChild(this.pushin.container);
    }
  }

  /**
   * Get scrollTarget option from data attribute
   * or JavaScript API.
   */
  setScrollTarget(): void {
    const value = this.getStringOption('scrollTarget', this.pushin.container);
    let scrollTarget;

    if (value && typeof value === 'string') {
      if (value === 'window') {
        scrollTarget = value;
      } else {
        scrollTarget = <HTMLElement | undefined>document.querySelector(value);
      }
    }

    if (!scrollTarget && this.container) {
      scrollTarget = this.container;
    }

    if (scrollTarget) {
      this.scrollTarget = scrollTarget;
    }
  }

  /**
   * Set the target height on initialization.
   *
   * This will be used to calculate scroll length.
   *
   * @see setScrollLength
   */
  setTargetHeight() {
    this.height = window.innerHeight;
    if (this.container) {
      const computedHeight = getComputedStyle(this.container).height;

      // Remove px and convert to number
      this.height = +computedHeight.replace('px', '');
    }
  }

  /**
   * Set overflow-y and scroll-behavior styles
   * on the provided target element.
   */
  private setTargetOverflow(): void {
    if (this.container && this.scrollTarget !== 'window') {
      this.container.style.overflowY = 'scroll';
      this.container.style.scrollBehavior = 'smooth';
    }
  }
}
