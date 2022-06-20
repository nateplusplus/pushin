import { PushInScene } from './pushInScene';
import { CompositionOptions } from './types';

export class PushInComposition {
  public container?: HTMLElement;

  /* istanbul ignore next */
  constructor(public scene: PushInScene, private options: CompositionOptions) {
    this.options = options;

    const container = this.scene.container.querySelector<HTMLElement>(
      '.pushin-composition'
    );

    if (container) {
      this.container = container;
    } else if (this.options?.ratio) {
      this.container = document.createElement('div');
      this.container.classList.add('pushin-composition');

      this.container.innerHTML = this.scene.container.innerHTML;
      this.scene.container.innerHTML = '';
      this.scene.container.appendChild(this.container);
      this.scene.pushin.cleanupFns.push(() => {
        this.scene.container.innerHTML = this!.container!.innerHTML;
      });
    }

    if (this.container) {
      this.getRatio();
      this.setRatio();
    }
  }

  /**
   * Get the composition ratio based on
   * what has been passed in through the JavaScript API
   * and/or what has been passed in via HTML data-attributes.
   *
   * @return {number[] | undefined}
   */
  private getRatio(): number[] | undefined {
    let ratio;

    if (this.container!.hasAttribute('data-pushin-ratio')) {
      const value = this.container!.dataset.pushinRatio;
      ratio = value?.split(',').map(val => parseInt(val, 10));
    } else if (this.options?.ratio) {
      ratio = this.options.ratio;
    }

    return ratio;
  }

  /**
   * Set the aspect ratio based setting.
   */
  private setRatio(): void {
    if (this.options?.ratio) {
      const paddingTop =
        this.options!.ratio.reduce((prev, cur) => cur / prev) * 100;
      this.container!.style.paddingTop = `${paddingTop.toString()}%`;
    }
  }
}
