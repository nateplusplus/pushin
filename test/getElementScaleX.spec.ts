import { setupJSDOM } from './setup';
import { PushInLayer } from '../src/pushinLayer';

describe('getElementScaleX', () => {
  let pushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
              <div class="foo">Hello World!</div>
          </body>
      </html>`);

    pushInLayer = new PushInLayer(null);
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
