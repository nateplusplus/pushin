import * as chai from 'chai';

chai.should();
chai.use(require('chai-spies'));

import { JSDOM } from 'jsdom';

import { PushIn } from '../src/pushin';

describe('destroy', function () {
  this.beforeEach(function () {
    this.textContent = 'FooBar';
    const dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">${this.textContent}</div>
                </div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;
    global.getComputedStyle = window.getComputedStyle;
    global.cancelAnimationFrame = () => {};
  });

  it('should remove event listeners once the `PushIn` is destroyed', function () {
    chai.spy.on(window, 'removeEventListener');

    const container = document.querySelector<HTMLElement>('.pushin');
    const pushIn = new PushIn(container);
    pushIn.start();
    pushIn.destroy();

    chai.expect(window.removeEventListener).to.have.been.called();
  });
});
