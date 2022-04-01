require('chai').should();

let pushIn;

let jsdom = require("jsdom");
let JSDOM = jsdom.JSDOM;

describe( 'setScrollLength', function() {

    this.beforeEach( function() {
        var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin" style="height:500px;"></div>
            </body>
        </html>`);

        global.window   = dom.window;
        global.document = window.document;
        global.getComputedStyle = window.getComputedStyle;

        pushIn = require( '../src/pushin' ).pushIn;

        const container = document.querySelector( '.pushin' );
        this.pushIn = new pushIn( container );

        this.pushIn.layers           = [1, 2, 3];
        this.pushIn.speedDelta       = 100;
        this.pushIn.layerDepth       = 100;
        this.pushIn.transitionLength = 100;
    } );

    it( 'Should set the container height to its original value if it is higher than calculated value', function() {
        this.pushIn.setScrollLength();
        const result = this.pushIn.container.style.height;
        result.should.equal( '500px' );
    } );

    it( 'Should calculate container height based on layerDepth and transitionLength properties', function() {
        this.pushIn.speedDelta       = 0;
        this.pushIn.layerDepth       = 200;
        this.pushIn.transitionLength = 200;

        this.pushIn.setScrollLength();
        const result = this.pushIn.container.style.height;
        result.should.equal( '1200px' );
    } );

    it( 'Should reduce container height to account for overlapping transition length', function() {
        this.pushIn.speedDelta       = 100;
        this.pushIn.layerDepth       = 200;
        this.pushIn.transitionLength = 200;

        this.pushIn.setScrollLength();
        const result = this.pushIn.container.style.height;
        result.should.equal( '1000px' );
    } );
} );