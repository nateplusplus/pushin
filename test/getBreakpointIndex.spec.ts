require('chai').should();

let jsdom = require('jsdom');
let JSDOM = jsdom.JSDOM;

import { PushIn } from '../src/pushin';

describe('getBreakpointIndex', function () {
  this.beforeEach(function () {
    var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">${this.textContent}</div>
                </div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;

    const container = document.querySelector<HTMLElement>('.pushin');
    this.pushIn = new PushIn(container);
    this.pushIn.breakpoints = [0, 768, 1440, 1920];
  });

  it('Should return 0 by default', function () {
    this.pushIn.breakpoints = [];
    const result = this.pushIn.getBreakpointIndex();
    result.should.equal(0);
  });

  it('Should return the index of the nearest breakpoint that is less than current window width', function () {
    window.innerWidth = 800;
    const result = this.pushIn.getBreakpointIndex();
    result.should.equal(1);
  });
});
