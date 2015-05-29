pushIn.js
=========

I'm working on making a JQuery plugin that simulates a dolly-in or push-in effect on a div element.

Working Example: http://natehub.net/pushin/

All child elements within the div should remain relative to eachother, which creates a decent illusion of perspective as objects grow/shrink.

### Installation

1. Include **pushIn.js** and **pushIn.css** in your website directory.
2. Link to **pushIn.css** after your css stylesheet.
3. Link to **pushIn.js** at the end of your HTML document and after calling any JS libraries.
4. Be sure to include the latest version of JQuery as well, BEFORE calling **pushIn.js**.
5. The plugin is ready to use!

### Usage

In your own JavaScript, just use `.pushIn()` on a JQuery object.

#### Options:

To customize this effect, use the following plugin options:

* **Start** - Number between 0 - 1, reprecenting the percentage of total scroll duration at which the object should fade in and begin to grow. Default is set to 0, which is the top of the page.
* **Stop** - Number between 0 - 1, reprecenting the percentage of total scroll duration at which the object should fade out. Default is set to 1 (100%), which is the bottom of the page.
* **Speed** - The speed at which the object will grow/shrink when scrolling. Default is 0.75.

Include items as objects, like this:  
`$(div).pushIn({Start: 0.5, Stop: 0.75, Speed: 1.3});`


### To Do:

Lots of kinks to sort through. Future updates to come!

* Mobile support
* Cross-browser testing