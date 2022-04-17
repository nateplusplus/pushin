import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('getElementScaleX', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="foo">Hello World!</div>
            </body>
        </html>`);

    pushIn = new PushIn(null);
  });

  afterEach(() => pushIn.destroy());

  it('Should return default element scale if never altered', () => {
    const element = document.querySelector<HTMLElement>('.foo');
    const result = pushIn['getElementScaleX'](element);

    expect(result).toEqual(1);
  });

  it('Should return element scale if it was previously set', () => {
    const element = document.querySelector<HTMLElement>('.foo');

    element.style.transform = 'scale(5)';

    const result = pushIn['getElementScaleX'](element);

    expect(result).toEqual(5);
  });
});
