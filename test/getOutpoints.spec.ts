import { setupJSDOM } from './setup';
import { PushInScene } from '../src/pushInScene';
import { PushInLayer } from '../src/pushInLayer';

describe('getInpoints', () => {
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
        <body>
          <div class="pushin">
            <div class="pushin-scene">
              <div id="layer-0" class="pushin-layer">Layer 0</div>
              <div id="layer-1" class="pushin-layer" data-pushin-to="300">Layer 1</div>
              <div id="layer-2" class="pushin-layer" data-pushin-to="300,500">Layer 2</div>
              <div id="layer-3" class="pushin-layer">Layer 3</div>
            </div>
          </div>
        </body>
      </html>`);

    mockPushInLayer = Object.create(PushInLayer.prototype);
    mockPushInLayer['scene'] = <PushInScene>{};
  });

  it('Should return inpoint + layerDepth by default for first layer', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = document.querySelector<HTMLElement>('#layer-0');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([400]);
  });

  it('Should return data-attribute value if set', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = document.querySelector<HTMLElement>('#layer-1');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([300]);
  });

  it('Should return array of data from data-attribute if set', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = document.querySelector<HTMLElement>('#layer-2');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([300, 500]);
  });

  it('Should generate value based on previous inpoint', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 500;

    const elem = document.querySelector<HTMLElement>('#layer-3');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([800]);
  });
});
