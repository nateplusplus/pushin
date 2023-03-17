import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInTarget } from '../../src/pushInTarget';

describe('getScrollY', () => {
  let mockPushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
          </body>
      </html>`);

    const mockPushInTarget = Object.create(PushInTarget.prototype);

    mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        target: mockPushInTarget,
      }
    );
  });

  it('Should return scrollTop of scrollTarget', () => {
    mockPushIn.target!['scrollTarget'] = <HTMLElement>{ scrollTop: 15 };
    const result = mockPushIn['getScrollY']();
    expect(result).toEqual(15);
  });

  it('Should return scrollY property of window', () => {
    mockPushIn.target!['scrollTarget'] = 'window';

    window.scrollY = 20;
    const result = mockPushIn['getScrollY']();
    expect(result).toEqual(20);
  });
});
