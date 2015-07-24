/*$(document).ready(function () {
    
    var dots = $('#layer1'),
        layer2 = $('#layer2');

    $(window).scroll(function () {
        
        dots.pushIn({speed: 40, stop: 0.2});
        layer2.pushIn({speed: 10, start: 0.2});
        
        
    });
    
});*/


var myScroll;
function loaded() {
	myScroll = new iScroll('wrapper', { hScroll: false, vScrollbar: false });
}
document.addEventListener('DOMContentLoaded', loaded, false);


function getScroll(elem, iscroll) {
  var x, y;

  if (iscroll) {
    x = iscroll.x * -1;
    y = iscroll.y * -1;
  } else {
    x = elem.scrollTop;
    y = elem.scrollLeft;
  }

  return {x: x, y: y};
}


(function animationLoop(){
    window.requestAnimationFrame(animationLoop);
    
    // Now we'll use our 'getScroll' function
    var scroll = getScroll(window, myScroller);

    // Values are now normalised cross platform:
    scroll.x;
    scroll.y;
})();