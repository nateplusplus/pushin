import { PushInLayer } from '../../src/pushInLayer';
import { PushInScene } from '../../src/pushInScene';
import { layerParams } from '../__mocks__/layers';

describe('getOverlap', () => {
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    const mockLayer = Object.create(PushInLayer.prototype);
    mockLayer.params = Object.create(layerParams);

    const mockPushInScene = Object.create(PushInScene.prototype);
    mockPushInScene.layers = [
      Object.create(mockLayer),
      Object.create(mockLayer),
      Object.create(mockLayer),
    ];

    mockPushInLayer = Object.create(PushInLayer.prototype);
    mockPushInLayer['index'] = 0;
    mockPushInLayer['scene'] = mockPushInScene;
    mockPushInLayer['params'] = Object.create(layerParams);
  });

  it('Should return 0 for first layer', () => {
    const result = mockPushInLayer['getOverlap']();

    expect(result).toEqual(0);
  });

  it('Should calculate based on average transition lengths of previous layer and current layer', () => {
    mockPushInLayer['index'] = 1;
    mockPushInLayer['params'].transitionStart = 250;
    mockPushInLayer.scene.layers[0]['params'].transitionEnd = 200;
    const result = mockPushInLayer['getOverlap']();

    expect(result).toEqual(112.5);
  });

  it('Should not exceed current layer transition start', () => {
    mockPushInLayer['index'] = 1;
    mockPushInLayer['params'].transitionStart = 20;
    mockPushInLayer.scene.layers[0]['params'].transitionEnd = 500;
    const result = mockPushInLayer['getOverlap']();

    expect(result).toEqual(20);
  });
});
