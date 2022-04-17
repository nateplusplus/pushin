import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';
import { PushInLayer } from '../src/types';

describe('isActive', () => {
  let pushIn: PushIn;

  const layer = {
    params: {
      inpoint: 10,
      outpoint: 20,
    },
  } as PushInLayer;

  beforeEach(() => {
    setupJSDOM(`<!DOCTYPE html></html>`);
    pushIn = new PushIn(null);
  });

  afterEach(() => pushIn.destroy());

  it('should be true if screen top is greater than inpoint and less than outpoint', () => {
    pushIn['scrollY'] = 15;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to inpoint', () => {
    pushIn['scrollY'] = 10;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to outpoint', () => {
    pushIn['scrollY'] = 20;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be false if screen top is less than inpoint', () => {
    pushIn['scrollY'] = 5;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(false);
  });

  it('should be false if screen top is greater than outpoint', () => {
    pushIn['scrollY'] = 25;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(false);
  });
});
