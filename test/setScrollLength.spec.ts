import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('setScrollLength', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin" style="height:500px;"></div>
            </body>
        </html>`);

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);

    (pushIn as any).layers = [1, 2, 3];
    pushIn['speedDelta'] = 100;
    pushIn['layerDepth'] = 100;
    pushIn['transitionLength'] = 100;
  });

  afterEach(() => pushIn.destroy());

  it('Should set the container height to its original value if it is higher than calculated value', () => {
    pushIn['setScrollLength']();
    const result = pushIn['container'].style.height;
    expect(result).toEqual('500px');
  });

  it('Should calculate container height based on layerDepth and transitionLength properties', () => {
    pushIn['speedDelta'] = 0;
    pushIn['layerDepth'] = 200;
    pushIn['transitionLength'] = 200;

    pushIn['setScrollLength']();
    const result = pushIn['container'].style.height;
    expect(result).toEqual('1200px');
  });

  it('Should reduce container height to account for overlapping transition length', () => {
    pushIn['speedDelta'] = 100;
    pushIn['layerDepth'] = 200;
    pushIn['transitionLength'] = 200;

    pushIn['setScrollLength']();
    const result = pushIn['container'].style.height;
    expect(result).toEqual('1000px');
  });
});
