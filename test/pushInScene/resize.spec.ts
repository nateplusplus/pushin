import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInScene } from '../../src/pushInScene';

describe('resize', () => {
  let mockPushInScene;
  let sceneContainer;

  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div id="target">
                  <div class="pushin">
                    <div class="pushin-scene"></div>
                  </div>
                </div>
            </body>
        </html>`);

    sceneContainer = document.querySelector('.pushin-scene');

    const mockPushIn = Object.create(PushIn.prototype);
    Object.assign(
      mockPushIn,
      {
        container: document.querySelector('.pushin'),
        scrollTarget: 'window',
      }
    );

    mockPushInScene = Object.create(PushInScene.prototype);
    Object.assign(
      mockPushInScene,
      {
        container: sceneContainer,
        pushin: mockPushIn,
      }
    );
  });

  it('Should not adjust container size by default', () => {
    mockPushInScene['resize']();
    const result = sceneContainer.style.height;
    expect(result).toEqual('');
  });

  it('Should not adjust container size if there is no target', () => {
    mockPushInScene['pushin']['scrollTarget'] = document.getElementById('target');

    mockPushInScene['resize']();
    const result = sceneContainer.style.height;
    expect(result).toEqual('');
  });

  it('Should not adjust container size if scrollTarget is "window"', () => {
    mockPushInScene['pushin']['scrollTarget'] = 'window';
    mockPushInScene['pushin']['target'] = document.getElementById('target');

    mockPushInScene['resize']();
    const result = sceneContainer.style.height;
    expect(result).toEqual('');
  });

  it('Should should set width and height of scene to match the target container', () => {
    mockPushInScene['pushin']['target'] = document.getElementById('target');
    mockPushInScene['pushin']['target']['getBoundingClientRect'] = () => {
      return {
        width: 100,
        height: 200,
      };
    };
    mockPushInScene['pushin']['scrollTarget'] = mockPushInScene['pushin']['target'];

    mockPushInScene['resize']();
    const result = [sceneContainer.style.width, sceneContainer.style.height];

    expect(result).toEqual(['100px', '200px']);
  });
});
