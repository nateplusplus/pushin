import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';

describe('setScrollTarget', () => {
  let mockPushIn: PushIn;

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

    mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        container: document.querySelector('.pushin'),
        settings: {},
      }
    );
  });

  it('Should return "window" by default', () => {
    mockPushIn['setScrollTarget']();
    expect(mockPushIn['scrollTarget']).toEqual('window');
  });

  it('Should return scrollTarget from HTML Attribute', () => {
    document.querySelector('.pushin')?.setAttribute('data-pushin-scroll-target', '#target');
    mockPushIn['setScrollTarget']();
    const expected = document.querySelector('#target');
    expect(mockPushIn['scrollTarget']).toEqual(expected);
  });

  it('Should return scrollTarget from JavasScript API', () => {
    mockPushIn.settings.scrollTarget = '#target';
    mockPushIn['setScrollTarget']();
    const expected = document.querySelector('#target');
    expect(mockPushIn['scrollTarget']).toEqual(expected);
  });

  it('Should fall back to target element', () => {
    const expected = document.querySelector('#target');
    mockPushIn['target'] = <HTMLElement>expected;
    mockPushIn['setScrollTarget']();
    expect(mockPushIn['scrollTarget']).toEqual(expected);
  });
});
