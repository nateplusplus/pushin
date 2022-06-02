import { PushInScene } from './pushInScene';
import { CompositionOptions } from './types';

export class PushInComposition {
  public container?: HTMLElement;

  constructor(public scene: PushInScene, private options: CompositionOptions) {
    const container = this.scene.container.querySelector<HTMLElement>(
      '.pushin-composition'
    );

    if (container) {
      this.container = container;
    } else if (this.options?.isFixed) {
      this.container = document.createElement('div');
      this.container.classList.add('pushin-composition');

      this.container.innerHTML = this.scene.container.innerHTML;
      this.scene.container.innerHTML = '';
      this.scene.container.appendChild(this.container);
      this.scene.pushin.cleanupFns.push(() => {
        this.scene.container.innerHTML = this!.container!.innerHTML;
      });
    }

    this.setRatio();
  }

  setRatio() {
    if (this.options?.isFixed && this.options?.ratio) {
      const paddingTop =
        this.options!.ratio.reduce((prev, cur) => cur / prev) * 100;
      this.container!.style.paddingTop = `${paddingTop.toString()}%`;
    }
  }
}
