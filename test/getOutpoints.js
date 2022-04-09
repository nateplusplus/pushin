require('chai').should();

var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;

import { PushIn } from '../src/pushin';

describe('getInpoints', function () {
  before(function () {
    this.layerMock = {
      originalScale: 2,
      params: {
        inpoint: 10,
        speed: 2,
      },
    };
  });

  this.beforeEach(function () {
    var dom = new JSDOM(`
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

    global.window = dom.window;
    global.document = window.document;
  });

  it('Should return inpoint + layerDepth by default for first layer', function () {
    var instance = new PushIn();
    instance.layerDepth = 300;

    const inpoint = 100;

    const elem = document.querySelector('#layer-0');
    const result = instance.getOutpoints(elem, inpoint, 0);

    result.should.deep.equal([400]);
  });

  it('Should return data-attribute value if set', function () {
    var instance = new PushIn();
    instance.layerDepth = 300;

    const inpoint = 100;

    const elem = document.querySelector('#layer-1');
    const result = instance.getOutpoints(elem, inpoint, 0);

    result.should.deep.equal([300]);
  });

  it('Should return array of data from data-attribute if set', function () {
    var instance = new PushIn();
    instance.layerDepth = 300;

    const inpoint = 100;

    const elem = document.querySelector('#layer-2');
    const result = instance.getOutpoints(elem, inpoint, 0);

    result.should.deep.equal([300, 500]);
  });

  it('Should generate value based on previous inpoint', function () {
    var instance = new PushIn();
    instance.layerDepth = 300;

    const inpoint = 500;

    const elem = document.querySelector('#layer-3');
    const result = instance.getOutpoints(elem, inpoint, 0);

    result.should.deep.equal([800]);
  });
});
