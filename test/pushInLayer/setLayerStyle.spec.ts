import { setupJSDOM } from '../setup';
import { PushInLayer } from '../../src/pushInLayer';
import { PushIn } from '../../src/pushin';
import { PushInScene } from '../../src/pushInScene';
import { LayerParams } from '../../src/types';
import { layerParams } from '../__mocks__/layers';

describe('setLayerStyle', () => {
  let mockPushInLayer: PushInLayer;
  let element: HTMLElement;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin-layer">
                    Lorem Ipsum
                </div>
            </body>
        </html>`);

    element = <HTMLElement>document.querySelector('.pushin-layer');

    const mockPushinParams = Object.create(layerParams);
    Object.assign(
      mockPushinParams,
      {
        inpoint: 200,
        outpoint: 500,
        transitionStart: 50,
        transitionEnd: 50,
      }
    );

    const mockScene = Object.create(PushInScene.prototype);

    mockPushInLayer = Object.create(PushInLayer.prototype);
    Object.assign(
      mockPushInLayer,
      {
        container: document.querySelector<HTMLElement>('.pushin-layer'),
        index: 0,
        'params': mockPushinParams,
        'scene': mockScene,
      });

    const mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        scrollY: 0,
      }
    );

    Object.assign(
      mockPushInLayer['scene'],
      {
        pushin: mockPushIn,
        layers: [
          Object.create(PushInLayer.prototype),
          Object.create(PushInLayer.prototype),
          Object.create(PushInLayer.prototype)
        ],
      }
    );

    // stub methods
    Object.assign(
      mockPushInLayer,
      {
        isActive: () => true,
        setScale: () => null,
        getScaleValue: () => null,
      }
    );
  });

  it('should set opacity to 1 if its the first layer and the scroll position is before its inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 10;
    mockPushInLayer['setLayerStyle']();
    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the first layer and it is active', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 205;
    mockPushInLayer['setLayerStyle']();
    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the last layer and the scroll position is after its outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 600;
    mockPushInLayer['index'] = 2;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the last layer and it is active', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 440;
    mockPushInLayer['index'] = 2;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 0 if its a middle layer and scroll position is exactly equal to its inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 200;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('0');
  });

  it('should set opacity to 0.5 if its a middle layer and scroll position is halfway through transitionStart', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 225;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('0.5');
  });

  it('should set opacity to 0 if its a middle layer and scroll position is exactly equal to its outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 500;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('0');
  });

  it('should set opacity to 0.5 if its a middle layer and scroll position is halfway through transitionEnd', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 475;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('0.5');
  });

  it('should set opacity to 1 if transitions disabled and scroll point is before inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 100;
    mockPushInLayer['params'].transitions = false;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if transitions disabled and scroll point is after outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 600;
    mockPushInLayer['params'].transitions = false;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if transitionStart is -1 and scroll point is before inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 100;
    mockPushInLayer['params'].transitionStart = -1;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if transitionEnd is -1 and scroll point is after outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 600;
    mockPushInLayer['params'].transitionEnd = -1;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });
});
