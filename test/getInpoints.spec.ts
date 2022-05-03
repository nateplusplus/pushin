import { setupJSDOM } from './setup';
import { PushInLayer } from '../src/pushInLayer';
import { PushInScene } from '../src/pushInScene';

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

    const mockLayer1 = Object.create(PushInLayer.prototype);
    mockLayer1['params'] = {
      outpoint: 1000,
    };

    mockPushInScene = Object.create(PushInScene.prototype);
    mockPushInScene['getTop'] = () => 0;
    mockPushInScene['getInpoints'] = () => [10];
    mockPushInScene['layers'] = [
      null,
      null,
      mockLayer1
    ];
    mockPushInScene['speedDelta'] = 100;

    mockPushInLayer = Object.create(PushInLayer.prototype);
    mockPushInLayer['scene'] = mockPushInScene;
  });

  it('Should return scene top value as the default for first layer', () => {
    const elem = document.querySelector<HTMLElement>('#layer-0');
    const result = mockPushInLayer['getInpoints'](elem, 0);
    expect(result).toEqual([10]);
  });

  it('Should return value provided by data attribute', () => {
    const elem = document.querySelector<HTMLElement>('#layer-1');
    const result = mockPushInLayer['getInpoints'](elem, 1);
    expect(result).toEqual([300]);
  });

  it('Should return array of values provided by data attribute', () => {
    const elem = document.querySelector<HTMLElement>('#layer-2');
    const result = mockPushInLayer['getInpoints'](elem, 2);
    expect(result).toEqual([300, 500]);
  });

  it('Should return generated value based on previous layer outpoint', () => {
    const elem = document.querySelector<HTMLElement>('#layer-3');
    const result = mockPushInLayer['getInpoints'](elem, 3);
    expect(result).toEqual([900]);
  });
});
