import { setupJSDOM } from './setup';
import { PushInLayer } from '../src/pushInLayer';
import { PushInScene } from '../src/pushInScene';
import { PushIn } from '../src/pushin';
import { LayerParams } from '../src/types';

describe('getScaleValue', () => {
  let layerMock: PushInLayer;
  let layerMock2: PushInLayer;
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`<!DOCTYPE html></html>`);
    layerMock = Object.create(PushInLayer.prototype);
    layerMock['originalScale'] = 2;
    layerMock['params'] = <LayerParams>{
      inpoint: 10,
      speed: 2,
    };

    layerMock2 = Object.create(PushInLayer.prototype);
    layerMock2['originalScale'] = 1;
    layerMock2['params'] = <LayerParams>{
      inpoint: 150,
      speed: 100,
    };

    mockPushInLayer = Object.create(PushInLayer.prototype);
    mockPushInLayer['scene'] = Object.create(PushInScene.prototype);
    mockPushInLayer['scene']['pushin'] = <PushIn>{scrollY:0};
  });

  it('should return original scale if scroll position and inpoint are the same', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 10;
    const result = mockPushInLayer['getScaleValue'](layerMock);

    expect(result).toEqual(2);
  });

  it('should reduce scale if scrollY is less than inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 6;
    const result = mockPushInLayer['getScaleValue'](layerMock);

    expect(result).toEqual(1.9992);
  });

  it('should increase scale if scrollY is greater than inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 20;
    const result = mockPushInLayer['getScaleValue'](layerMock);

    expect(result).toEqual(2.002);
  });

  it('should not return a negative number', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 1;
    const result = mockPushInLayer['getScaleValue'](layerMock2);

    expect(result).toEqual(0);
  });
});
