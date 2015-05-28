$(document).ready(function () {
    
    var dots = $('#layer1'),
        layer2 = $('#layer2');

    $(window).scroll(function () {
        
        dots.pushIn({speed: 40, stop: 0.2});
        layer2.pushIn({speed: 10, start: 0.2});
        
        
    });
    
});