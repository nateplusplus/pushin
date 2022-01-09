require('chai').should();

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

describe( 'getScaleValue', function() {

    before(function(){
        this.layerMock = {
            originalScale : 2,
            params: {
                inpoint: 10,
                speed: 2
            }
        };

        // very fast layer, set up to fail quickly
        this.layerMock2 = {
            originalScale : 1,
            params: {
                inpoint: 150,
                speed: 100
            }
        };
    });

    this.beforeEach( function() {
        var dom         = new JSDOM(`<!DOCTYPE html></html>`);
        global.window   = dom.window;
        global.document = window.document;

        pushIn = require( '../js/pushIn' ).pushIn;
    } );

    it( 'should return original scale if scroll position and inpoint are the same', function() {
        var instance = new pushIn();

        instance.scrollPos = 10;

        var result = instance.getScaleValue( this.layerMock );

        result.should.equal(2);
    } );

    it( 'should reduce scale if scrollPos is less than inpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 6;

        var result = instance.getScaleValue( this.layerMock );

        result.should.be.lessThan( 2 );
    } );

    it( 'should increase scale if scrollPos is greater than inpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 20;

        var result = instance.getScaleValue( this.layerMock );

        result.should.greaterThan(2);
    } );

    it( 'should not return a negative number', function() {
        var instance = new pushIn();

        instance.scrollPos = 1;

        var result = instance.getScaleValue( this.layerMock2 );

        result.should.equal(0);
    } );
} );