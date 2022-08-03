import { PushInScene } from './pushInScene';
import { CompositionOptions } from './types';
import PushInBase from './pushInBase';

export class PushInComposition extends PushInBase {
  /* istanbul ignore next */
  constructor(public scene: PushInScene, private options: CompositionOptions) {
    super();
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
      this.setRatio();
    }
  }

  /**
   * Set the aspect ratio based setting.
   */
  private setRatio(): void {
    const ratio = <number[]>this.getOption('ratio', this.options);
    if (ratio) {
      const paddingTop = ratio.reduce((prev, cur) => cur / prev) * 100;
      this.container!.style.paddingTop = `${paddingTop.toString()}%`;
    }
  }
}
