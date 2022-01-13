require('chai').should();

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

describe( 'shouldHide', function() {
    before( function() {
        this.layersMock = [
            {
                index: 0,
                params : {
                    inpoint : 10,
                    outpoint: 20
                }
            },
            {
                index: 1,
                params : {
                    inpoint : 20,
                    outpoint : 30
                }
            },
            {
                index: 2,
                params : {
                    inpoint : 30,
                    outpoint : 40
                }
            }
        ];
    } );

    this.beforeEach( function() {
        var dom         = new JSDOM(`<!DOCTYPE html></html>`);
        global.window   = dom.window;
        global.document = window.document;

        pushIn = require( '../src/index' ).pushIn;
    } );

    it( 'should return false if it is the first layer and window top is above inpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 9;
        instance.layers = this.layersMock;

        var result = instance.shouldHide( instance.layers[0] );

        result.should.be.false;
    } );

    it( 'should return false if it is the last layer and window top is below outpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 50;
        instance.layers = this.layersMock;

        var result = instance.shouldHide( instance.layers[2] );

        result.should.be.false;
    } );

    it( 'should return false if it is not the first or last layer but it is active', function() {
        var instance = new pushIn();

        instance.scrollPos = 25;
        instance.layers = this.layersMock;
        instance.isActive = function() {
            return true;
        }

        var result = instance.shouldHide( instance.layers[1] );

        result.should.be.false;
    } );

    it( 'should return true if it is not active', function() {
        var instance = new pushIn();

        instance.scrollPos = 35;
        instance.layers = this.layersMock;
        instance.isActive = function() {
            return false;
        }

        var result = instance.shouldHide( instance.layers[1] );

        result.should.be.true;
    } );
} );