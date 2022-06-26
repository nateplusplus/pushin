import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';

describe('getScrollY', () => {
  let mockPushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
          </body>
      </html>`);

    mockPushIn = Object.create(PushIn.prototype);
  });

  it('Should return 0 by default', () => {
    global.window = undefined;
    const result = mockPushIn['getScrollY']();
    expect(result).toEqual(0);
  });

  it('Should return scrollTop of target', () => {
    mockPushIn['target'] = <HTMLElement>{ scrollTop: 15 };
    const result = mockPushIn['getScrollY']();
    expect(result).toEqual(15);
  });

  it('Should return scrollY property of window', () => {
    window.scrollY = 20;
    const result = mockPushIn['getScrollY']();
    expect(result).toEqual(20);
  });
});
