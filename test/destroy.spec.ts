import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('destroy', () => {
  let textContent: string;

  beforeEach(() => {
    textContent = 'FooBar';
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">${textContent}</div>
                </div>
            </body>
        </html>`);
  });

  it('should remove event listeners once the `PushIn` is destroyed', () => {
    const spy = jest.spyOn(window, 'removeEventListener');

    const container = document.querySelector<HTMLElement>('.pushin');
    const pushIn = new PushIn(container);
    pushIn.start();
    pushIn.destroy();

    try {
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
