import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('setZIndex', () => {
  let pushIn: PushIn;

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

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
  });

  afterEach(() => pushIn.destroy());

  it('Should return the difference between the total number of layers and the current layer index', () => {
    const mockLayer: any = {
      element: {
        style: {
          zIndex: null,
        },
      },
      index: 1,
    };

    pushIn['setZIndex'](mockLayer, 10);
    const result = mockLayer.element.style.zIndex;
    expect(result).toEqual('9');
  });
});
