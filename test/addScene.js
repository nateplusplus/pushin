require('chai').should();

let pushIn;

let jsdom = require("jsdom");
let JSDOM = jsdom.JSDOM;

describe( 'addScene', function() {

    this.beforeEach( function() {
        this.textContent = 'FooBar';
        var dom = new JSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">${this.textContent}</div>
                </div>
            </body>
        </html>`);

        global.window   = dom.window;
        global.document = window.document;

        pushIn = require( '../src/pushin' ).PushIn;

        const container = document.querySelector( '.pushin' );
        this.pushIn = new pushIn( container );
    } );

    it( 'Should assign existing .pushin-scene element to the scene property', function() {
        this.pushIn.addScene();
        const result = this.pushIn.scene.textContent;
        result.should.equal( this.textContent );
    } );

    it( 'Should create new .pushin-scene element if it doesn\'t yet exist', function() {
        document.querySelector( '.pushin-scene' ).remove();
        this.pushIn.addScene();
        const result = this.pushIn.scene.classList.contains( 'pushin-scene' );
        result.should.be.true;
    } );

    it( 'Should move any inner HTML into the new scene element as children', function() {
        const innerHTML = '<span>FooBar</span>';
        document.querySelector( '.pushin-scene' ).remove();
        document.querySelector( '.pushin' ).innerHTML = innerHTML
        this.pushIn.addScene();
        const result = this.pushIn.scene.innerHTML;
        result.should.equal( innerHTML );
    } );
} );