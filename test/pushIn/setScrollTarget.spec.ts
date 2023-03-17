import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInTarget } from '../../src/pushInTarget';

describe('setScrollTarget', () => {
  let mockPushInTarget: PushInTarget;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
            <div id="target">
              <div class="pushin">
              </div>
            </div>
          </body>
      </html>`);

    const mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        container: document.querySelector('.pushin'),
      }
    );

    mockPushInTarget = Object.create(PushInTarget.prototype);
    Object.assign(
      mockPushInTarget,
      {
        container: null,
        scrollTarget: 'window',
        height: 0,
        settings: {},
        pushin: mockPushIn
      }
    );
  });

  it('Should return "window" by default', () => {
    mockPushInTarget['setScrollTarget']();
    expect(mockPushInTarget['scrollTarget']).toEqual('window');
  });

  it('Should return scrollTarget from HTML Attribute', () => {
    document.querySelector('.pushin')?.setAttribute('data-pushin-scroll-target', '#target');
    mockPushInTarget['setScrollTarget']();
    const expected = document.querySelector('#target');
    expect(mockPushInTarget['scrollTarget']).toEqual(expected);
  });

  it('Should return scrollTarget from JavasScript API', () => {
    mockPushInTarget.settings.scrollTarget = '#target';
    mockPushInTarget['setScrollTarget']();
    const expected = document.querySelector('#target');
    expect(mockPushInTarget['scrollTarget']).toEqual(expected);
  });

  it('Should fall back to target element', () => {
    const expected = document.querySelector('#target');
    mockPushInTarget['container'] = <HTMLElement>expected;
    mockPushInTarget['setScrollTarget']();
    expect(mockPushInTarget['scrollTarget']).toEqual(expected);
  });
});
