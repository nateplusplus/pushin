require('chai').should();

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

describe( 'setLayerStyle', function() {

    this.beforeEach( function() {
        var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin-layer demo-layer-1">
                    Lorem Ipsum
                </div>
                <div class="pushin-layer demo-layer-2">
                    Dolor sit amet
                </div>
                <div class="pushin-layer demo-layer-3">
                    Hello World
                </div>
            </body>
        </html>`);

        global.window   = dom.window;
        global.document = window.document;

        this.layers = [
            {
                elem     : document.querySelector('.demo-layer-1'),
                index    : 0,
                originalScale: 1,
                params: {
                    inpoint  : '200',
                    outpoint : '500',
                    speed    : 8,
                }
            },
            {
                elem     : document.querySelector('.demo-layer-2'),
                index    : 1,
                originalScale: 1,
                params: {
                    inpoint  : '500',
                    outpoint : '800',
                    speed    : 8,
                }
            },
            {
                elem     : document.querySelector('.demo-layer-3'),
                index    : 2,
                originalScale: 1,
                params: {
                    inpoint  : '800',
                    outpoint : '1200',
                    speed    : 8,
                }
            }
        ];

        pushIn = require( '../src/pushin' ).pushIn;
    });

    it( 'should set opacity to 1 if its the first layer and the scroll position is before its inpoint', function() {
        let instance = new pushIn();
        instance.scrollPos = 10;

        let element  = document.querySelector('.demo-layer-1');

        instance.setLayerStyle( this.layers[0] );

        const result = element.style.opacity;

        result.should.equal('1');
    } );

    it( 'should set opacity to 1 if its the last layer and the scroll position is after its outpoint', function() {
        let instance       = new pushIn();
        instance.scrollPos = 1300;
        instance.layers    = this.layers;

        let element  = document.querySelector('.demo-layer-3');

        instance.setLayerStyle( this.layers[2] );

        const result = element.style.opacity;

        result.should.equal('1');
    } );

    it( 'should set opacity to 0 if its a middle layer and scroll position is exactly equal to its inpoint', function() {
        let instance       = new pushIn();
        instance.scrollPos = 500;
        instance.layers    = this.layers;
        instance.isActive  = () => true;

        let element  = document.querySelector('.demo-layer-2');

        instance.setLayerStyle( this.layers[1] );

        const result = element.style.opacity;

        result.should.equal('0');
    } );

    it( 'should set opacity to 0.5 if its a middle layer and scroll position is 100px from its inpoint', function() {
        let instance       = new pushIn();
        instance.scrollPos = 600;
        instance.layers    = this.layers;
        instance.isActive  = () => true;

        let element  = document.querySelector('.demo-layer-2');

        instance.setLayerStyle( this.layers[1] );

        const result = element.style.opacity;

        result.should.equal('0.5');
    } );

    it( 'should set opacity to 0 if its a middle layer and scroll position is exactly equal to its outpoint', function() {
        let instance       = new pushIn();
        instance.scrollPos = 800;
        instance.layers    = this.layers;
        instance.isActive  = () => true;

        let element  = document.querySelector('.demo-layer-2');

        instance.setLayerStyle( this.layers[1] );

        const result = element.style.opacity;

        result.should.equal('0');
    } );

    it( 'should set opacity to 0.5 if its a middle layer and scroll position is 100px from its outpoint', function() {
        let instance       = new pushIn();
        instance.scrollPos = 700;
        instance.layers    = this.layers;
        instance.isActive  = () => true;

        let element  = document.querySelector('.demo-layer-2');

        instance.setLayerStyle( this.layers[1] );

        const result = element.style.opacity;

        result.should.equal('0.5');
    } );
} );