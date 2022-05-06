import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';
import { PushInLayer } from '../src/pushInLayer';
import { PushInScene } from '../src/pushInScene';
import { LayerParams } from '../src/types';

describe('isActive', () => {
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`<!DOCTYPE html></html>`);
    mockPushInLayer = Object.create(PushInLayer.prototype);

    Object.assign(
      mockPushInLayer,
      {
        'params': <LayerParams>{
          inpoint: 10,
          outpoint: 20
        },
        'scene': Object.create(PushInScene.prototype),
      });

    mockPushInLayer['scene']['pushin'] = Object.create(PushIn.prototype);
  });

  it('should be true if screen top is greater than inpoint and less than outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 15;
    const result = mockPushInLayer['isActive']();

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 10;
    const result = mockPushInLayer['isActive']();

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 20;
    const result = mockPushInLayer['isActive']();

    expect(result).toEqual(true);
  });

  it('should be false if screen top is less than inpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 5;
    const result = mockPushInLayer['isActive']();

    expect(result).toEqual(false);
  });

  it('should be false if screen top is greater than outpoint', () => {
    mockPushInLayer['scene']['pushin']['scrollY'] = 25;
    const result = mockPushInLayer['isActive']();

    expect(result).toEqual(false);
  });
});
