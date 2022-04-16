import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';
import { DEFAULT_SPEED } from '../src/constants';

describe('getSpeed', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer" data-pushin-speed="50">Layer 1</div>
                        <div id="layer-2" class="pushin-layer" data-pushin-speed="abc">Layer 2</div>
                    </div>
                </div>
            </body>
        </html>`);

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
  });

  afterEach(() => pushIn.destroy());

  it('Should return 8 by default', () => {
    const elem = document.querySelector<HTMLElement>('#layer-0');
    const result = pushIn['getSpeed'](elem);
    expect(result).toEqual(DEFAULT_SPEED);
  });

  it('Should return integer value from data-pushin-speed attribute', () => {
    const elem = document.querySelector<HTMLElement>('#layer-1');
    const result = pushIn['getSpeed'](elem);
    expect(result).toEqual(50);
  });

  it('Should return default if NaN', () => {
    const elem = document.querySelector<HTMLElement>('#layer-2');
    const result = pushIn['getSpeed'](elem);
    expect(result).toEqual(DEFAULT_SPEED);
  });
});
