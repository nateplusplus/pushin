import { setupJSDOM } from '../setup';
import { PushIn } from '../../src/pushin';
import { PushInScene } from '../../src/pushInScene';
import { PushInLayer } from '../../src/pushInLayer';

describe('getOutpoints', () => {
  let mockPushInLayer: PushInLayer;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
        <body>
          <div class="pushin">
            <div class="pushin-scene">
              <div id="layer-0" class="pushin-layer">Layer 0</div>
              <div id="layer-1" class="pushin-layer" data-pushin-to="300">Layer 1</div>
              <div id="layer-2" class="pushin-layer" data-pushin-to="300,500">Layer 2</div>
              <div id="layer-3" class="pushin-layer">Layer 3</div>
            </div>
          </div>
        </body>
      </html>`);

    // Mock layer
    mockPushInLayer = Object.create(PushInLayer.prototype);

    // Mock scene
    mockPushInLayer['scene'] = Object.create(PushInScene);
    Object.assign(
       mockPushInLayer['scene'],
       {
        getMode: () => 'sequential',
       }
    );

    // Mock PushIn
    mockPushInLayer['scene']['pushin'] = Object.create( PushIn );
    Object.assign(
       mockPushInLayer['scene']['pushin'],
       {
        container: <HTMLElement>document.querySelector('.pushin'),
       }
    );
  });

  it('Should return inpoint + layerDepth by default for first layer', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = <HTMLElement>document.querySelector('#layer-0');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([400]);
  });

  it('Should return data-attribute value if set', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = <HTMLElement>document.querySelector('#layer-1');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([300]);
  });

  it('Should return array of data from data-attribute if set', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 100;

    const elem = <HTMLElement>document.querySelector('#layer-2');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([300, 500]);
  });

  it('Should generate value based on previous inpoint', () => {
    mockPushInLayer['scene']['layerDepth'] = 300;

    const inpoint = 500;

    const elem = <HTMLElement>document.querySelector('#layer-3');
    const result = mockPushInLayer['getOutpoints'](elem, inpoint);

    expect(result).toEqual([800]);
  });

  it('Should return -1 if outpoint not set and using "continuous" mode', () => {
    mockPushInLayer['scene']['getMode'] = () => 'continuous';

    const elem = <HTMLElement>document.querySelector('#layer-0');
    const result = mockPushInLayer['getOutpoints'](elem, 0);

    expect(result).toEqual([-1]);
  });
});
