function getScroll(iscroll) {
    var x, y;
    x = iscroll.x * -1;
    y = iscroll.y * -1;

    return {x: x, y: y};
}

// Get the current scale
function getElementScale(elem) {
    var transform = /matrix\([^\)]+\)/.exec(
        window.getComputedStyle(elem)['-webkit-transform']),
        scale = {'x': 1, 'y': 1};
    if( transform ) {
        transform = transform[0].replace(
            'matrix(', '').replace(')', '').split(', ');
        scale.x = parseFloat(transform[0]);
        scale.y = parseFloat(transform[3]);
    }
    return scale;
}

var scrollPos, scroll, scaleObj;


$( document ).ready(function() {
    
    var dots = $('#layer1'),
        layer2 = $('#layer2');
    
    
    
    // ========= ISCROLL ========= //
    
    var myScroller = new iScroll('wrapper', {hScroll: false, vScrollbar: false, bounce: false, momentum: false });
    
    
    // Prevent page from scrolling normally
    function preventDefaultScrolling(event) { event.preventDefault(); }
    document.addEventListener( 'touchmove', preventDefaultScrolling, false );
    
    
    // ========= PUSH-IN ========= //
    
    (function animationLoop(){
        
        window.requestAnimationFrame(animationLoop);

        scroll = getScroll( myScroller);
        
        // scroll.x  Horizontal scroll value
        // scroll.y  Verticle scroll value
        
        
        
        // Scroll position updated
        scrollPos = scroll.y;
        
        $('.layer').css('top', scrollPos);
        var layerTop = $('.layer').position().top,
            viewHeight = $(window).height(),
            pageHeight = $('#scroller').height(),
            scrollValue = scrollPos / (pageHeight - viewHeight),
            scaleValue;
        

        (function ($) {

            $.fn.extend({
                pushIn: function (options) {

                    var defaults = {
                        start: 0,
                        stop: 1,
                        speed: 0.75
                    };

                    options = $.extend(defaults, options);
                    
                    this.each(function () {
                        
                        // If scaleObj has not been defined, define it
                        if (!scaleObj) {
                            scaleObj = getElementScale(this);
                        }
                        
                        /* =============================================== 
                            scaleObj should only be defined one time
                            this allows for original CSS transforms to
                            be used as a base-point for the push-in effect
                        /* =============================================== */
                        
                        
                        scaleValue = scaleObj.x + (
                            (scrollValue - defaults.start) * defaults.speed
                        );

                    scaleValue < 0 ? scaleValue = 0 : scaleValue;

                        $(this).css({
                            '-webkit-transform':
                                'scale(' + scaleValue + ')',
                            '-moz-transform':
                                'scale(' + scaleValue + ')',
                            '-ms-transform':
                                'scale(' + scaleValue + ')',
                            '-o-transform':
                                'scale(' + scaleValue + ')',
                            'transform':
                                'scale(' + scaleValue + ')'
                        });

                    });  // this.each function

                    if (defaults.start <= scrollValue && defaults.stop >= scrollValue) {
                        this.each(function () {

                            $(this).stop().animate({ opacity: 1 }, 100);

                        });

                    } else {

                        this.each(function () {

                            $(this).stop().animate({ opacity: 0 }, 100);

                        });

                    } // else

                } // pushIn plugin
            });  // $.fn.extend

        }(jQuery)); // jQuery Plugin
        
        
        
        // ========= CUSTOM CODE ========= //
        
        
        dots.pushIn({speed: 40, stop: 0.2});
        layer2.pushIn({speed: 10, start: 0.2});
        
        
        // ============================== //
        
        
        
    })(); // Animation Loop
    
}); // DOM Ready