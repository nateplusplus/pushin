import { setupJSDOM } from '../setup';
import { PushInLayer } from '../../src/pushInLayer';

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
    const mockPushInLayer = Object.create(PushInLayer.prototype);
    const element = document.querySelector<HTMLElement>('.foo');
    mockPushInLayer['setScale'](element, 10);
    const result = element.style.transform;
    expect(result).toEqual('scale(10)');
  });
});
