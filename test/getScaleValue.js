require('chai').should();

var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;

describe('getScaleValue', function () {
  before(function () {
    this.layerMock = {
      originalScale: 2,
      params: {
        inpoint: 10,
        speed: 2,
      },
    };

    // very fast layer, set up to fail quickly
    this.layerMock2 = {
      originalScale: 1,
      params: {
        inpoint: 150,
        speed: 100,
      },
    };
  });

  this.beforeEach(function () {
    var dom = new JSDOM(`<!DOCTYPE html></html>`);
    global.window = dom.window;
    global.document = window.document;

    pushIn = require('../src/pushin').PushIn;

    this.pushIn = new pushIn();
    this.pushIn.getInpoint = layer => layer.params.inpoint;
  });

  it('should return original scale if scroll position and inpoint are the same', function () {
    this.pushIn.scrollPos = 10;
    const result = this.pushIn.getScaleValue(this.layerMock);

    result.should.equal(2);
  });

  it('should reduce scale if scrollPos is less than inpoint', function () {
    this.pushIn.scrollPos = 6;
    const result = this.pushIn.getScaleValue(this.layerMock);

    result.should.be.lessThan(2);
  });

  it('should increase scale if scrollPos is greater than inpoint', function () {
    this.pushIn.scrollPos = 20;
    const result = this.pushIn.getScaleValue(this.layerMock);

    result.should.greaterThan(2);
  });

  it('should not return a negative number', function () {
    this.pushIn.scrollPos = 1;
    const result = this.pushIn.getScaleValue(this.layerMock2);

    result.should.equal(0);
  });
});
