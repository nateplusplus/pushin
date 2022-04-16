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
    pushIn['scrollPos'] = 15;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to inpoint', () => {
    pushIn['scrollPos'] = 10;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be true if screen top is equal to outpoint', () => {
    pushIn['scrollPos'] = 20;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(true);
  });

  it('should be false if screen top is less than inpoint', () => {
    pushIn['scrollPos'] = 5;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(false);
  });

  it('should be false if screen top is greater than outpoint', () => {
    pushIn['scrollPos'] = 25;
    const result = pushIn['isActive'](layer);

    expect(result).toEqual(false);
  });
});
