function getScroll(iscroll) {
    var x, y;
    x = iscroll.x * -1;
    y = iscroll.y * -1;

    return {x: x, y: y};
}

var scrollPos, scroll;


$( document ).ready(function() {
    
    var dots = $('#layer1'),
        layer2 = $('#layer2');
    
    
    
    // ========= ISCROLL ========= //
    
    var myScroller = new iScroll('wrapper', {hScroll: false, vScrollbar: false, bounce: false, momentum: false });
    
    
    // Prevent page from scrolling normally
    function preventDefaultScrolling(event) { event.preventDefault(); }
    document.addEventListener( 'touchmove', preventDefaultScrolling, false );
    
    
    (function animationLoop(){
        
        window.requestAnimationFrame(animationLoop);

        scroll = getScroll( myScroller);
        
        // scroll.x  Horizontal scroll value
        // scroll.y  Verticle scroll value
        
        
        
        // ========= PUSH-IN ========= //

        // Scroll position updated
        scrollPos = scroll.y;
        
        // Stop scroller from scrolling
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
                    
                    
                    
                    /* =========== TO DO: ============ */
                    
                    // test getting current computed style of css transform
                    
                    // newComputedStyle = current computed style - scaleValue
                    
                    // If scroll.y - start <= 0
                        // scaleValue = original computed style on CSS document
                    // Else...
                        // scaleValue = newComputedStyle + scaleValue
                               
                    
                    /* =============================== */
                    
                    

                    scaleValue = 1 + (
                            (scrollValue - defaults.start) * defaults.speed
                        );

                    scaleValue < 0 ? scaleValue = 0 : scaleValue;

                    this.each(function () {

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

                    });

                    if (defaults.start <= scrollValue && defaults.stop >= scrollValue) {
                        this.each(function () {

                            $(this).stop().animate({ opacity: 1 }, 100);

                        });

                    } else {

                        this.each(function () {

                            $(this).stop().animate({ opacity: 0 }, 100);

                        });

                    }

                }
            });

        }(jQuery)); // jQuery Plugin
        
        
        
        // ========= CUSTOM CODE ========= //
        
        
        dots.pushIn({speed: 40, stop: 0.2});
        layer2.pushIn({speed: 10, start: 0.2});
        
        
        // ============================== //
        
        
        
    })(); // Animation Loop
    
}); // DOM Ready