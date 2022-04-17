import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';
import { PushInLayer } from '../src/types';

describe('getScaleValue', () => {
  let pushIn: PushIn;
  const layerMock = {
    originalScale: 2,
    params: {
      inpoint: 10,
      speed: 2,
    },
  } as PushInLayer;

  const layerMock2 = {
    originalScale: 1,
    params: {
      inpoint: 150,
      speed: 100,
    },
  } as PushInLayer;

  beforeEach(() => {
    setupJSDOM(`<!DOCTYPE html></html>`);
    pushIn = new PushIn(null);
  });

  afterEach(() => pushIn.destroy());

  it('should return original scale if scroll position and inpoint are the same', () => {
    pushIn['scrollY'] = 10;
    const result = pushIn['getScaleValue'](layerMock);

    expect(result).toEqual(2);
  });

  it('should reduce scale if scrollY is less than inpoint', () => {
    pushIn['scrollY'] = 6;
    const result = pushIn['getScaleValue'](layerMock);

    expect(result).toEqual(1.9992);
  });

  it('should increase scale if scrollY is greater than inpoint', () => {
    pushIn['scrollY'] = 20;
    const result = pushIn['getScaleValue'](layerMock);

    expect(result).toEqual(2.002);
  });

  it('should not return a negative number', () => {
    pushIn['scrollY'] = 1;
    const result = pushIn['getScaleValue'](layerMock2);

    expect(result).toEqual(0);
  });
});
