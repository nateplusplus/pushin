// For iscroll testing


function getScroll(iscroll) {
  var x, y;
    x = iscroll.x * -1;
    y = iscroll.y * -1;

  return {x: x, y: y};
}


$( document ).ready(function() {
    
    var myScroller = new iScroll('wrapper', {hScroll: false, vScrollbar: false, bounce: false });
    
    
    
    function preventDefaultScrolling(event)
    {
      event.preventDefault(); //this stops the page from scrolling.
    }
    
    document.addEventListener('touchmove',preventDefaultScrolling,false);
    
    
  
    (function animationLoop(){
        
        window.requestAnimationFrame(animationLoop);

        // Now we'll use our 'getScroll' function
        var scroll = getScroll( myScroller);

        // Values are now normalised cross platform:
        scroll.x;
        scroll.y;
        
        $('#scrollConsole').html(scroll.y);
        
    })(); // Animation Loop
    
}); // DOM Ready