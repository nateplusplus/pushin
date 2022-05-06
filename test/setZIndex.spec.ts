import { setupJSDOM } from './setup';
import { PushInLayer } from '../src/pushInLayer';

describe('setZIndex', () => {
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
    mockPushInLayer['element'] = document.querySelector('#layer-1');
    mockPushInLayer['index'] = 1;
  });

  it('Should return the difference between the total number of layers and the current layer index', () => {
    mockPushInLayer['setZIndex'](3);
    const result = mockPushInLayer['element'].style.zIndex;
    expect(result).toEqual('2');
  });
});
