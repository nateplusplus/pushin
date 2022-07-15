import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';

describe('setTargetHeight', () => {
  let mockPushIn: PushIn;
  let target: HTMLElement;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="target" style="height:1000px"></div>
            </body>
        </html>`);

    target = <HTMLElement>document.querySelector('.target');

    window.innerHeight = 2000;

    mockPushIn = Object.create(PushIn.prototype);
  });

  it('Should use the window height by default', () => {
    mockPushIn['setTargetHeight']();
    expect(mockPushIn['targetHeight']).toEqual(2000);
  });

  it('Should match computed target height', () => {
    mockPushIn['target'] = target;
    mockPushIn['setTargetHeight']();
    expect(mockPushIn['targetHeight']).toEqual(1000);
  });
});
