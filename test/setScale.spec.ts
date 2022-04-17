import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('setScale', () => {
  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="foo">Hello World</div>
            </body>
        </html>`);
  });

  it('should set element scale value', () => {
    const instance = new PushIn(null);

    const element = document.querySelector<HTMLElement>('.foo');

    instance['setScale'](element, 10);

    const result = element.style.transform;

    try {
      expect(result).toEqual('scale(10)');
    } finally {
      instance.destroy();
    }
  });
});
