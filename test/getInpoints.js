require('chai').should();

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

describe( 'getInpoints', function() {

    before(function(){
        this.layerMock = {
            originalScale : 2,
            params: {
                inpoint: 10,
                speed: 2
            }
        };
    });

    this.beforeEach( function() {
        var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">
                        <div id="layer-0" class="pushin-layer">Layer 0</div>
                        <div id="layer-1" class="pushin-layer" data-pushin-from="300">Layer 1</div>
                        <div id="layer-2" class="pushin-layer" data-pushin-from="300,500">Layer 2</div>
                        <div id="layer-3" class="pushin-layer">Layer 3</div>
                    </div>
                </div>
            </body>
        </html>`);

        global.window   = dom.window;
        global.document = window.document;

        pushIn = require( '../src/pushin' ).pushIn;
    } );

    it( 'Should return scene top value as the default for first layer', function() {
        var instance   = new pushIn();
        instance.scene = document.querySelector( '.pushin-scene' );
        instance.scene.getBoundingClientRect = () => {
            return { top: 10 };
        };

        const elem = document.querySelector( '#layer-0' );
        result     = instance.getInpoints( elem, 0 );

        result.should.deep.equal( [ 10 ] );
    } );

    it( 'Should return value provided by data attribute', function() {
        var instance   = new pushIn();
        instance.scene = document.querySelector( '.pushin-scene' );
        instance.scene.getBoundingClientRect = () => {
            return { top: 10 };
        };

        const elem = document.querySelector( '#layer-1' );
        result     = instance.getInpoints( elem, 1 );

        result.should.deep.equal( [ 300 ] );
    } );

    it( 'Should return array of values provided by data attribute', function() {
        var instance   = new pushIn();
        instance.scene = document.querySelector( '.pushin-scene' );
        instance.scene.getBoundingClientRect = () => {
            return { top: 10 };
        };

        const elem = document.querySelector( '#layer-2' );
        result     = instance.getInpoints( elem, 2 );

        result.should.deep.equal( [ 300, 500 ] );
    } );

    it( 'Should return generated value based on previous layer outpoint', function() {
        var instance   = new pushIn();
        instance.scene = document.querySelector( '.pushin-scene' );
        instance.scene.getBoundingClientRect = () => {
            return { top: 10 };
        };
        instance.layers = [
            null,
            null,
            {
                params: {
                    outpoints: [ 1000 ]
                }
            }
        ];
        instance.speedDelta = 100;

        const elem = document.querySelector( '#layer-3' );
        result     = instance.getInpoints( elem, 3 );

        result.should.deep.equal( [ 900 ] );
    } );
} );