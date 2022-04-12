require('chai').should();

let jsdom = require('jsdom');
let JSDOM = jsdom.JSDOM;

import { PushIn } from '../src/pushin';

describe('getLayers', function () {
  this.beforeEach(function () {
    var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer">Layer 1</div>
                        <div id="layer-2" class="pushin-layer">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;

    const container = document.querySelector<HTMLElement>('.pushin');
    this.pushIn = new PushIn(container);
    const scene = document.querySelector('.pushin-scene');
    this.pushIn.scene = scene;

    this.layers = [...document.querySelectorAll('.pushin-layer')];

    // Mock some methods
    this.pushIn.getInpoints = () => [1, 2];
    this.pushIn.getInpoint = () => 1;
    this.pushIn.getOutpoints = () => [3, 4];
    this.pushIn.getOutpoint = () => 3;
    this.pushIn.getElementScaleX = () => 123;
    this.pushIn.getSpeed = () => 5;
    this.pushIn.setZIndex = () => {};
  });

  it('Should set the layers property to contain all .pushin-layer elements', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers.length;
    const expected = this.layers.length;
    result.should.equal(expected);
  });

  it('Should include the element for each layer', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].element.id;
    result.should.equal('layer-0');
  });

  it('Should include the index of each layer', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].index;
    result.should.equal(0);
  });

  it('Should include the original scale of each layer', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[1].originalScale;
    result.should.equal(123);
  });

  it('Should include reference inpoints array', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[2].ref.inpoints;
    result.should.deep.equal([1, 2]);
  });

  it('Should include reference outpoints array', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].ref.outpoints;
    result.should.deep.equal([3, 4]);
  });

  it('Should include the inpoint param', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].params.inpoint;
    result.should.equal(1);
  });

  it('Should include the outpoint param', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].params.outpoint;
    result.should.equal(3);
  });

  it('Should include the speed param', function () {
    this.pushIn.getLayers();
    const result = this.pushIn.layers[0].params.speed;
    result.should.equal(5);
  });
});
