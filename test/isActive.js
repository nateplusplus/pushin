require('chai').should();

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

describe( 'isActive', function() {

    this.beforeEach( function() {
        var dom   = new JSDOM(`<!DOCTYPE html></html>`);

        global.window   = dom.window;
        global.document = window.document;

        pushIn = require( '../src/pushin' ).pushIn;

        this.layer = {
            params : {
                inpoint : 10,
                outpoint: 20
            }
        };
    } );

    it( 'should be true if screen top is greater than inpoint and less than outpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 15;

        var result = instance.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be true if screen top is equal to inpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 10;

        var result = instance.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be true if screen top is equal to outpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 20;

        var result = instance.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be false if screen top is less than inpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 5;

        var result = instance.isActive( this.layer );

        result.should.be.false;
    } );

    it( 'should be false if screen top is greater than outpoint', function() {
        var instance = new pushIn();

        instance.scrollPos = 25;

        var result = instance.isActive( this.layer );

        result.should.be.false;
    } );
} );