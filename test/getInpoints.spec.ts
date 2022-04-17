import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('getInpoints', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer" data-pushin-from="300">Layer 1</div>
                        <div id="layer-2" class="pushin-layer" data-pushin-from="300,500">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

    pushIn = new PushIn(null);
    pushIn['scene'] = document.querySelector('.pushin-scene');
    pushIn['scene'].getBoundingClientRect = () => {
      return { top: 10 } as unknown as DOMRect;
    };
    pushIn['speedDelta'] = 100;

    (pushIn as any).layers = [
      null,
      null,
      {
        params: {
          outpoint: 1000,
        },
      },
    ];
  });

  afterEach(() => pushIn.destroy());

  it('Should return scene[pushinFrom] value, if available for first layer', () => {
    // const scene = document.querySelector( '.pushin-scene' );
    pushIn['scene'].setAttribute('data-pushin-from', '30');

    const elem = document.querySelector<HTMLElement>('#layer-0');
    const result = pushIn['getInpoints'](elem, 0);
    expect(result).toEqual([30]);
  });

  it('Should return scene top value as the default for first layer', () => {
    const elem = document.querySelector<HTMLElement>('#layer-0');
    const result = pushIn['getInpoints'](elem, 0);
    expect(result).toEqual([10]);
  });

  it('Should return value provided by data attribute', () => {
    const elem = document.querySelector<HTMLElement>('#layer-1');
    const result = pushIn['getInpoints'](elem, 1);
    expect(result).toEqual([300]);
  });

  it('Should return array of values provided by data attribute', () => {
    const elem = document.querySelector<HTMLElement>('#layer-2');
    const result = pushIn['getInpoints'](elem, 2);
    expect(result).toEqual([300, 500]);
  });

  it('Should return generated value based on previous layer outpoint', () => {
    const elem = document.querySelector<HTMLElement>('#layer-3');
    const result = pushIn['getInpoints'](elem, 3);
    expect(result).toEqual([900]);
  });
});
