import { setupJSDOM } from '../setup';
import { PushInLayer } from '../../src/pushInLayer';
import { DEFAULT_SPEED } from '../../src/constants';
import { layerOptions } from '../__mocks__/layers';

describe('getSpeed', () => {
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
              <div class="pushin">
                  <div class="pushin-scene">
                      <div id="layer-0" class="pushin-layer">Layer 0</div>
                      <div id="layer-1" class="pushin-layer" data-pushin-speed="50">Layer 1</div>
                      <div id="layer-2" class="pushin-layer" data-pushin-speed="abc">Layer 2</div>
                  </div>
              </div>
          </body>
      </html>`);

    mockPushInLayer = Object.create(PushInLayer.prototype);
  });

  it('Should return 8 by default', () => {
    const elem = <HTMLElement> document.querySelector('#layer-0');
    const result = mockPushInLayer['getSpeed'](elem);
    expect(result).toEqual(DEFAULT_SPEED);
  });

  it('Should return integer value from data-pushin-speed attribute', () => {
    const elem = <HTMLElement> document.querySelector('#layer-1');
    const result = mockPushInLayer['getSpeed'](elem);
    expect(result).toEqual(50);
  });

  it('Should return default if NaN', () => {
    const elem = <HTMLElement> document.querySelector('#layer-2');
    const result = mockPushInLayer['getSpeed'](elem);
    expect(result).toEqual(DEFAULT_SPEED);
  });

  it('Should use javascript API', () => {
    const elem = <HTMLElement> document.querySelector('#layer-0');
    const options = Object.apply(
      {},
      layerOptions
    );
    options.speed = 10;
    mockPushInLayer['options'] = options;
    const result = mockPushInLayer['getSpeed'](elem);
    expect(result).toEqual(10);
  });
});
