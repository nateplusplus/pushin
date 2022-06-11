import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInLayer } from '../../src/pushInLayer';
import { PushInScene } from '../../src/pushInScene';

describe('setScrollLength', () => {
  let mockPushIn: PushIn;
  let container: HTMLElement;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin" style="height:500px;"></div>
            </body>
        </html>`);

    container = <HTMLElement>document.querySelector('.pushin');

    const mockScene = Object.create(PushInScene.prototype);
    Object.assign(
      mockScene,
      {
        speedDelta: 100,
        layerDepth: 100,
        transitionLength: 100,
        layers: [
          Object.create(PushInLayer.prototype),
          Object.create(PushInLayer.prototype),
          Object.create(PushInLayer.prototype),
        ]
      }
    );

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
    expect(result).toEqual('500px');
  });

  it('Should calculate container height based on number of layers, their depth, and their overlap', () => {
    /**
     * add each layer's depth - overlap
     */
    mockPushIn['scene']['speedDelta'] = 0;
    mockPushIn['scene']['layerDepth'] = 200;

    mockPushIn['setScrollLength']();
    const result = container.style.height;
    expect(result).toEqual('600px');
  });

  it('Should reduce container height to account for overlapping transition length', () => {
    mockPushIn['scene']['speedDelta'] = 100;
    mockPushIn['scene']['layerDepth'] = 200;
    mockPushIn['scene']['transitionLength'] = 200;

    mockPushIn['setScrollLength']();
    const result = container.style.height;
    expect(result).toEqual('1000px');
  });
});
