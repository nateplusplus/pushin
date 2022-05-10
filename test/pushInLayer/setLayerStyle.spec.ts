import { setupJSDOM } from '../setup';
import { PushInLayer } from '../../src/pushInLayer';
import { PushIn } from '../../src/pushin';
import { PushInScene } from '../../src/pushInScene';
import { LayerParams } from '../../src/types';

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

    element = document.querySelector<HTMLElement>('.pushin-layer');

    const mockScene = Object.create(PushInScene.prototype);
    Object.assign(
      mockScene,
      {
        transitionLength: 200,
      }
    );

    mockPushInLayer = Object.create(PushInLayer.prototype);
    Object.assign(
      mockPushInLayer,
      {
        element: document.querySelector<HTMLElement>('.pushin-layer'),
        index: 0,
        'params': <LayerParams>{
          inpoint: 200,
          outpoint: 500,
        },
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
    mockPushInLayer['scene']['pushin']['scrollY'] = 450;
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

  it('should set opacity to 0.5 if its a middle layer and scroll position is 100px from its inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 300;
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

  it('should set opacity to 0.5 if its a middle layer and scroll position is 100px from its outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 400;
    mockPushInLayer['index'] = 1;
    mockPushInLayer['setLayerStyle']();

    const result = element.style.opacity;

    expect(result).toEqual('0.5');
  });
});
