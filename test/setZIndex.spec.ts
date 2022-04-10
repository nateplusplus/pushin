require('chai').should();

let jsdom = require('jsdom');
let JSDOM = jsdom.JSDOM;

import { PushIn } from '../src/pushin';

describe('setZIndex', function () {
  this.beforeEach(function () {
    var dom = new JSDOM(`
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

    global.window = dom.window;
    global.document = window.document;

    const container = document.querySelector<HTMLElement>('.pushin');
    this.pushIn = new PushIn(container);
  });

  it('Should return the difference between the total number of layers and the current layer index', function () {
    const mockLayer = {
      element: {
        style: {
          zIndex: null,
        },
      },
      index: 1,
    };

    this.pushIn.setZIndex(mockLayer, 10);
    const result = mockLayer.element.style.zIndex;
    result.should.equal('9');
  });
});
