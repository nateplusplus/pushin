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
    const element = <HTMLElement>document.querySelector('.foo');
    mockPushInLayer.container = element;
    mockPushInLayer['setScale'](10);
    const result = element.style.transform;
    expect(result).toEqual('scale(10)');
  });
});
