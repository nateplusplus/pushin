import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('setLayerStyle', () => {
  let pushIn: PushIn;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin-layer demo-layer-1">
                    Lorem Ipsum
                </div>
                <div class="pushin-layer demo-layer-2">
                    Dolor sit amet
                </div>
                <div class="pushin-layer demo-layer-3">
                    Hello World
                </div>
            </body>
        </html>`);

    const layers = [
      {
        element: document.querySelector<HTMLElement>('.demo-layer-1'),
        index: 0,
        originalScale: 1,
        params: {
          inpoint: 200,
          outpoint: 500,
          speed: 8,
        },
      },
      {
        element: document.querySelector<HTMLElement>('.demo-layer-2'),
        index: 1,
        originalScale: 1,
        params: {
          inpoint: 500,
          outpoint: 800,
          speed: 8,
        },
      },
      {
        element: document.querySelector<HTMLElement>('.demo-layer-3'),
        index: 2,
        originalScale: 1,
        params: {
          inpoint: 800,
          outpoint: 1200,
          speed: 8,
        },
      },
    ];

    pushIn = new PushIn(null);
    Object.assign(pushIn, {
      isActive: () => true,
      layers,
      transitionLength: 200,
    });
  });

  afterEach(() => pushIn.destroy());

  it('should set opacity to 1 if its the first layer and the scroll position is before its inpoint', () => {
    pushIn['scrollPos'] = 10;
    const element = document.querySelector<HTMLElement>('.demo-layer-1');
    pushIn['setLayerStyle'](pushIn['layers'][0]);
    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the first layer and it is active', () => {
    pushIn['scrollPos'] = 205;
    const element = document.querySelector<HTMLElement>('.demo-layer-1');
    pushIn['setLayerStyle'](pushIn['layers'][0]);
    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the last layer and the scroll position is after its outpoint', () => {
    pushIn['scrollPos'] = 1300;
    const element = document.querySelector<HTMLElement>('.demo-layer-3');
    pushIn['setLayerStyle'](pushIn['layers'][2]);

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 1 if its the last layer and it is active', () => {
    pushIn['scrollPos'] = 1195;
    const element = document.querySelector<HTMLElement>('.demo-layer-3');
    pushIn['setLayerStyle'](pushIn['layers'][2]);

    const result = element.style.opacity;

    expect(result).toEqual('1');
  });

  it('should set opacity to 0 if its a middle layer and scroll position is exactly equal to its inpoint', () => {
    pushIn['scrollPos'] = 500;
    const element = document.querySelector<HTMLElement>('.demo-layer-2');

    pushIn['setLayerStyle'](pushIn['layers'][1]);

    const result = element.style.opacity;

    expect(result).toEqual('0');
  });

  it('should set opacity to 0.5 if its a middle layer and scroll position is 100px from its inpoint', () => {
    pushIn['scrollPos'] = 600;
    const element = document.querySelector<HTMLElement>('.demo-layer-2');

    pushIn['setLayerStyle'](pushIn['layers'][1]);

    const result = element.style.opacity;

    expect(result).toEqual('0.5');
  });

  it('should set opacity to 0 if its a middle layer and scroll position is exactly equal to its outpoint', () => {
    pushIn['scrollPos'] = 800;
    const element = document.querySelector<HTMLElement>('.demo-layer-2');

    pushIn['setLayerStyle'](pushIn['layers'][1]);

    const result = element.style.opacity;

    expect(result).toEqual('0');
  });

  it('should set opacity to 0.5 if its a middle layer and scroll position is 100px from its outpoint', () => {
    pushIn['scrollPos'] = 700;
    const element = document.querySelector<HTMLElement>('.demo-layer-2');

    pushIn['setLayerStyle'](pushIn['layers'][1]);

    const result = element.style.opacity;

    expect(result).toEqual('0.5');
  });
});
