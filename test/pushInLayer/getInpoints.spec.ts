import { setupJSDOM } from '../setup';
import { PushInLayer } from '../../src/pushInLayer';
import { PushInScene } from '../../src/pushInScene';
import { layerParams } from '../__mocks__/layers';

describe('getInpoints', () => {
  let mockPushInLayer: PushInLayer;
  let mockPushInScene: PushInScene;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer" data-pushin-from="300">Layer 1</div>
                        <div id="layer-2" class="pushin-layer" data-pushin-from="300,500">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

    const mockLayerParams = Object.create(layerParams);
    Object.assign(
      mockLayerParams,
      {
        overlap: 100,
        outpoint: 1000,
      }
    );

    const mockLayer = Object.create(PushInLayer.prototype);
    mockLayer['params'] = mockLayerParams;

    mockPushInScene = Object.create(PushInScene.prototype);
    Object.assign(
      mockPushInScene,
      {
        getTop: () => 0,
        getInpoints: () => [10],
        layers: [
          mockLayer,
          mockLayer,
          mockLayer,
        ],
        getMode: () => 'sequential',
      }
    );

    mockPushInLayer = Object.create(mockLayer);
    mockPushInLayer['scene'] = mockPushInScene;

    // Stub functions
    Object.assign(
      mockPushInLayer,
      {
        getOverlap: () => mockLayerParams.overlap,
      }
    );
  });

  it('Should return scene top value as the default for first layer', () => {
    const elem = <HTMLElement>document.querySelector('#layer-0');
    const result = mockPushInLayer['getInpoints'](elem, 0);
    expect(result).toEqual([10]);
  });

  it('Should return value provided by data attribute', () => {
    const elem = <HTMLElement>document.querySelector('#layer-1');
    const result = mockPushInLayer['getInpoints'](elem, 1);
    expect(result).toEqual([300]);
  });

  it('Should return array of values provided by data attribute', () => {
    const elem = <HTMLElement>document.querySelector('#layer-2');
    const result = mockPushInLayer['getInpoints'](elem, 2);
    expect(result).toEqual([300, 500]);
  });

  it('Should return generated value based on previous layer outpoint', () => {
    const elem = <HTMLElement>document.querySelector('#layer-3');
    const result = mockPushInLayer['getInpoints'](elem, 3);
    expect(result).toEqual([900]);
  });
});
