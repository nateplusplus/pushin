pushIn
=========

I'm developing a technique that simulates a dolly-in or push-in effect on a div element.

Working Example: http://natehub.net/pushin/

All child elements within the div should remain relative to eachother, which creates a decent illusion of perspective as objects grow/shrink.

Please note that this is still heavily under development and is not ready for production sites, but feel free to take it and improve on it for your own use!

### Installation

In order to be cross-compatible, I found iScroll and jQuery to be very useful. So at this point those are the two dependencies for this effect.

1. Download and include **jQuery** and **iScroll** in your website directory.
2. Include **pushIn.js** and **pushIn.css** in your website directory.
2. Link to **pushIn.css** after your css stylesheet.
3. Link to **pushIn.js** at the end of your HTML document and after calling any JS libraries.
4. The plugin is ready to use!

### Usage

Just use `.pushIn()` on a JQuery object.

This needs to be within the customCode function to work properly. See the bottom of the `index.html` file for an example.

#### Options:

To customize this effect, use the following plugin options:

* **Start** - Number between 0 - 1, reprecenting the percentage of total scroll duration at which the object should fade in and begin to grow. Default is set to 0, which is the top of the page.
* **Stop** - Number between 0 - 1, reprecenting the percentage of total scroll duration at which the object should fade out. Default is set to 1 (100%), which is the bottom of the page.
* **Speed** - The speed at which the object will grow/shrink when scrolling. Default is 0.75.

Include items as objects, like this:  
`$(div).pushIn({Start: 0.5, Stop: 0.75, Speed: 1.3});`


### To Do:

- Mobile support works, but is a little buggy.
- slight "bouncing" effect when scrolling fast.