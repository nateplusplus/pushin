$(document).ready(function () {
    
    
    var scrollPos = window.pageYOffset,
        viewHeight = $(window).height(),
        pageHeight = $('body').height(),
        scrollValue = scrollPos / (pageHeight - viewHeight);

    $(window).scroll(function () {

        // Once user scrolls, scroll position updated
        scrollPos = window.pageYOffset;

        // Scroll percentage value
        scrollValue = scrollPos / (pageHeight - viewHeight);

    });
    
    

    (function ($) {
        
        $.fn.extend({
            pushIn: function (options) {
                
                var defaults = {
                    start: 0,
                    stop: 1,
                    speed: 0.75
                };
                
                options = $.extend(defaults, options);
                
                var scaleValue = 1 + (
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
        
    }(jQuery));

    
});