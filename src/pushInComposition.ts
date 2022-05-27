import { PushInScene } from './pushInScene';

export class PushInComposition {
  public container: HTMLElement;

  constructor(public scene: PushInScene) {
    const container = this.scene.container.querySelector<HTMLElement>(
      '.pushin-composition'
    );

    if (container) {
      this.container = container;
    } else {
      this.container = document.createElement('div');
      this.container.classList.add('pushin-composition');

      this.container.innerHTML = this.scene.container.innerHTML;
      this.scene.container.innerHTML = '';
      this.scene.container.appendChild(this.container);
      this.scene.pushin.cleanupFns.push(() => {
        this.scene.container.innerHTML = this.container.innerHTML;
      });
    }
  }
}
