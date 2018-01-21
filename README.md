pushIn
=========

I'm developing a technique that simulates a dolly-in or push-in effect on a div element.

Working Example: http://natehub.net.s3-website-us-west-2.amazonaws.com/projects/pushin/

All child elements within the div should remain relative to eachother, which creates a decent illusion of perspective as objects grow/shrink.

I've targeted touch and scroll actions, and used the requestAnimationFrame method to make this as memory efficient as possible.

Feel free to take it and improve on it for your own use, or talk to me about any ideas!

### Installation

All the functionality is just in that one **pushIn.js** file. Easy peasy!

1. Download and include **pushIn.js** in your website directory.
2. Link to **pushIn.js** at the end of your HTML document and after calling any JS libraries.
3. The plugin is ready to use!

### Usage

To make an element scroll, just include "layer" in its class list.

Ex: `<p class='layer'>I'm gonna move!</p>`

#### Options:

To customize this effect, plugin options can be typed into an HTML attribute named `data-params` on each element you want to scroll.

The options need to be comma separated without white space in the following order: **data-params="[start],[stop],[speed]"**

Ex: `<p class='layer' data-params='30,500,10000'>I'm gonna move really slow!</p>`

* **Start** - How many pixels you want to scroll down before animation begins. (Default: 0)
* **Stop** - How many pixels you want to scroll down before animation ends. (Default: current page height)
* **Speed** - How fast you want this element to fly at you. (Default: 200). Higher numbers produce slower results, anything lower than 100 becomes lightning speed. Negative values flip the world upside down!! AAAH!

### To Do:

- How to add inertia to mobile scroll?
