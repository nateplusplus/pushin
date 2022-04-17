import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('getLayers', () => {
  let pushIn: PushIn;
  let layers: HTMLElement[];

  beforeEach(() => {
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

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
    const scene = document.querySelector<HTMLElement>('.pushin-scene');
    pushIn['scene'] = scene;

    layers = [...document.querySelectorAll<HTMLElement>('.pushin-layer')];

    // Mock some methods
    Object.assign(pushIn, {
      getInpoints: () => [1, 2],
      getInpoint: () => 1,
      getOutpoints: () => [3, 4],
      getOutpoint: () => 3,
      getElementScaleX: () => 123,
      getSpeed: () => 5,
      setZIndex: () => {},
    });
  });

  afterEach(() => pushIn.destroy());

  it('Should set the layers property to contain all .pushin-layer elements', () => {
    pushIn['getLayers']();
    expect(pushIn['layers'].length).toEqual(layers.length);
  });

  it('Should include the element for each layer', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].element.id;
    expect(result).toEqual('layer-0');
  });

  it('Should include the index of each layer', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].index;
    expect(result).toEqual(0);
  });

  it('Should include the original scale of each layer', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][1].originalScale;
    expect(result).toEqual(123);
  });

  it('Should include reference inpoints array', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][2].ref.inpoints;
    expect(result).toEqual([1, 2]);
  });

  it('Should include reference outpoints array', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].ref.outpoints;
    expect(result).toEqual([3, 4]);
  });

  it('Should include the inpoint param', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].params.inpoint;
    expect(result).toEqual(1);
  });

  it('Should include the outpoint param', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].params.outpoint;
    expect(result).toEqual(3);
  });

  it('Should include the speed param', () => {
    pushIn['getLayers']();
    const result = pushIn['layers'][0].params.speed;
    expect(result).toEqual(5);
  });
});
