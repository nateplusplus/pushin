import { setupJSDOM } from '../setup';
import { PushInScene } from '../../src/pushInScene';
import { PushInLayer } from '../../src/pushInLayer';
jest.mock('../../src/pushInLayer');

describe('getLayers', () => {
  let mockPushInScene: PushInScene;
  let layers: HTMLElement[];

  beforeEach(() => {
    (PushInLayer as jest.Mock<PushInLayer>).mockClear();
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer">Layer 1</div>
                        <div id="layer-2" class="pushin-layer">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

    mockPushInScene = Object.create(PushInScene.prototype);
    mockPushInScene['container'] = document.querySelector<HTMLElement>('.pushin-scene');
    mockPushInScene['layers'] = [];

    layers = [ ...document.querySelectorAll<HTMLElement>('.pushin-layer')];
  });

  it('Should set the layers property to contain all .pushin-layer elements', () => {
    mockPushInScene['getLayers']();
    expect(mockPushInScene['layers'].length).toEqual(layers.length);
  });

  it('Should create pushInLayer with correct arguments', () => {
    mockPushInScene['getLayers']();
    expect(PushInLayer).toHaveBeenCalledWith(layers[1], 1, mockPushInScene, {});
  });
});
