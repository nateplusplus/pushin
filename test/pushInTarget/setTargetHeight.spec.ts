import { setupJSDOM } from '../setup';
import { PushInTarget } from '../../src/pushInTarget';

describe('setTargetHeight', () => {
  let mockPushInTarget: PushInTarget;
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

    mockPushInTarget = Object.create(PushInTarget.prototype);
  });

  it('Should use the window height by default', () => {
    mockPushInTarget['setTargetHeight']();
    expect(mockPushInTarget['height']).toEqual(2000);
  });

  it('Should match computed target height', () => {
    mockPushInTarget['container'] = target;
    mockPushInTarget['setTargetHeight']();
    expect(mockPushInTarget['height']).toEqual(1000);
  });
});
