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

        this.pushIn = new pushIn();
        this.pushIn.getInpoint = ( layer ) => layer.params.inpoint;
        this.pushIn.getOutpoint = ( layer ) => layer.params.outpoint;
    } );

    it( 'should be true if screen top is greater than inpoint and less than outpoint', function() {
        this.pushIn.scrollPos = 15;
        const result = this.pushIn.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be true if screen top is equal to inpoint', function() {
        this.pushIn.scrollPos = 10;
        const result = this.pushIn.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be true if screen top is equal to outpoint', function() {
        this.pushIn.scrollPos = 20;
        const result = this.pushIn.isActive( this.layer );

        result.should.be.true;
    } );

    it( 'should be false if screen top is less than inpoint', function() {
        this.pushIn.scrollPos = 5;
        var result = this.pushIn.isActive( this.layer );

        result.should.be.false;
    } );

    it( 'should be false if screen top is greater than outpoint', function() {
        this.pushIn.scrollPos = 25;
        const result = this.pushIn.isActive( this.layer );

        result.should.be.false;
    } );
} );