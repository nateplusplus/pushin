require('chai').should();

let jsdom = require('jsdom');
let JSDOM = jsdom.JSDOM;

import { PushIn } from '../src/pushin';

describe('addScene', function () {
  this.beforeEach(function () {
    var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene"></div>
                </div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;

    const container = document.querySelector<HTMLElement>('.pushin');
    this.pushIn = new PushIn(container);
    const scene = document.querySelector('.pushin-scene');
    this.pushIn.scene = scene;
  });

  it('Should set the default breakpoints', function () {
    this.pushIn.setBreakpoints();
    const result = this.pushIn.breakpoints;
    const expected = [0, 768, 1440, 1920];
    result.should.deep.equal(expected);
  });

  it('Should set the breakpoints provided by data-attributes', function () {
    this.pushIn.scene.setAttribute('data-pushin-breakpoints', '1,2,3');
    this.pushIn.setBreakpoints();
    const result = this.pushIn.breakpoints;
    const expected = [0, 1, 2, 3];
    result.should.deep.equal(expected);
  });
});
