import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('setBreakpoints', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene"></div>
                </div>
            </body>
        </html>`);

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
    const scene = document.querySelector<HTMLElement>('.pushin-scene');
    pushIn['scene'] = scene;
  });

  afterEach(() => pushIn.destroy());

  it('Should set the default breakpoints', () => {
    pushIn['setBreakpoints']();
    const result = pushIn['sceneOptions'].breakpoints;
    const expected = [0, 768, 1440, 1920];
    expect(result).toEqual(expected);
  });

  it('Should set the breakpoints provided by data-attributes', () => {
    pushIn['scene'].setAttribute('data-pushin-breakpoints', '1,2,3');
    pushIn['setBreakpoints']();
    const result = pushIn['sceneOptions'].breakpoints;
    const expected = [0, 1, 2, 3];
    expect(result).toEqual(expected);
  });
});
