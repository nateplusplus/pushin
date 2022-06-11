import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInLayer } from '../../src/pushInLayer';
import { PushInScene } from '../../src/pushInScene';
import { layerParams } from '../__mocks__/layers';

describe('setScrollLength', () => {
  let mockPushIn: PushIn;
  let container: HTMLElement;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin" style="height:5000px;"></div>
            </body>
        </html>`);

    container = <HTMLElement>document.querySelector('.pushin');

    const mockPushinLayer = Object.create(PushInLayer.prototype);
    mockPushinLayer['params'] = Object.create(layerParams);
    Object.assign(
      mockPushinLayer['params'],
      {
        depth: 1000,
        overlap: 100,
      }
    );

    const mockScene = Object.create(PushInScene.prototype);
    Object.assign(
      mockScene,
      {
        layerDepth: 1000,
        layers: [
          Object.create(mockPushinLayer),
          Object.create(mockPushinLayer),
          Object.create(mockPushinLayer),
        ]
      }
    );

    // First layer always has 0 overlap
    mockScene.layers[0].params = Object.create(layerParams);
    mockScene.layers[0].params.overlap = 0;

    mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        container,
        scene: mockScene
      }
    );
  });

  it('Should set the container height to its original value if it is higher than calculated value', () => {
    mockPushIn['setScrollLength']();
    const result = container.style.height;
    expect(result).toEqual('5000px');
  });

  it('Should calculate container height based on number of layers, their depth, and their overlap', () => {
    container!.style!.height = '0';

    mockPushIn['setScrollLength']();
    const result = container.style.height;
    expect(result).toEqual('2800px');
  });
});
