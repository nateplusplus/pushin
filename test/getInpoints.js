require('chai').should();

var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;

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
                        <div id="layer-1" class="pushin-layer" data-pushin-from="300">Layer 1</div>
                        <div id="layer-2" class="pushin-layer" data-pushin-from="300,500">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;

    pushIn = require('../src/pushin').pushIn;

    this.pushIn = new pushIn();
    this.pushIn.scene = document.querySelector('.pushin-scene');
    this.pushIn.scene.getBoundingClientRect = () => {
      return { top: 10 };
    };
    this.pushIn.speedDelta = 100;

    this.pushIn.layers = [
      null,
      null,
      {
        params: {
          outpoint: 1000,
        },
      },
    ];
  });

  it('Should return scene top value as the default for first layer', function () {
    const elem = document.querySelector('#layer-0');
    const result = this.pushIn.getInpoints(elem, 0);
    result.should.deep.equal([10]);
  });

  it('Should return value provided by data attribute', function () {
    const elem = document.querySelector('#layer-1');
    const result = this.pushIn.getInpoints(elem, 1);
    result.should.deep.equal([300]);
  });

  it('Should return array of values provided by data attribute', function () {
    const elem = document.querySelector('#layer-2');
    const result = this.pushIn.getInpoints(elem, 2);
    result.should.deep.equal([300, 500]);
  });

  it('Should return generated value based on previous layer outpoint', function () {
    const elem = document.querySelector('#layer-3');
    const result = this.pushIn.getInpoints(elem, 3);
    result.should.deep.equal([900]);
  });
});
