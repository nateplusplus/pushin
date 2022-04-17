import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('getBreakpointIndex', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">Text</div>
                </div>
            </body>
        </html>`);

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
    pushIn['sceneOptions'].breakpoints = [0, 768, 1440, 1920];
  });

  afterEach(() => pushIn.destroy());

  it('Should return 0 by default', () => {
    pushIn['sceneOptions'].breakpoints = [];
    const result = pushIn['getBreakpointIndex']();
    expect(result).toEqual(0);
  });

  it('Should return the index of the nearest breakpoint that is less than current window width', () => {
    window.innerWidth = 800;
    const result = pushIn['getBreakpointIndex']();
    expect(result).toEqual(1);
  });
});
