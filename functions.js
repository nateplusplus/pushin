$(document).ready(function () {
    
    // Get the desired layers
    var dots = $('#layer1'),
        layer2 = $('#layer2');

    
    // On scroll...
    $(window).scroll(function () {
        
        // Apply the push-in effect to desired layers, with options
        dots.pushIn({speed: 40, stop: 0.2});
        layer2.pushIn({speed: 10, start: 0.2});
        
        
    });
    
});