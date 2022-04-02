require('chai').should();

var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;

describe('setScale', function () {
  this.beforeEach(function () {
    var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="foo">Hello World</div>
            </body>
        </html>`);

    global.window = dom.window;
    global.document = window.document;

    pushIn = require('../src/pushin').PushIn;
  });

  it('should set element scale value', function () {
    var instance = new pushIn();

    var element = document.querySelector('.foo');

    instance.setScale(element, '10');

    var result = element.style.transform;

    result.should.equal('scale(10)');
  });
});
