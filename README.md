pushIn.js
=========

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/nateplusplus/pushin-js/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/maintainer-nateplusplus-blue)
[![GitHub license](https://img.shields.io/github/license/nateplusplus/pushin-js.svg)](https://github.com/nateplusplus/pushin-js/blob/main/LICENSE)
[![Node.js CI](https://github.com/nateplusplus/pushIn-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/nateplusplus/pushIn-js/actions/workflows/node.js.yml)


PushIn.js is a lightweight parallax effect built in JavaScript, which simulates an interactive dolly-in or push-in animation on a webpage.

Check out the [live demo](http://nateplusplus.github.io/pushIn-js/) for a working example.

## Getting started

### 1. Download and include the JavaScript

Download the CSS and JavaScript files from this repo: [dist/](dist/) and include them in your project. These two files will include all the functionality for the effect.

**Example:**
```html
<html>
    <head>
        <link rel='stylesheet' href='pushin.min.css'>
        <script type="text/javascript" src="pushin.js">
    </head>
    <body>
        <!-- page content... -->
    </body>
</html>
```

### 2. Required HTML structure

At the most basic level, there are a few things you need to set up on your page in order for this to work properly.

First, you will need at least one parent element where the effect should be applied. It's helpful to have a unique selector for these parent elements so that you can target them easily.

Inside that parent element, you'll also need to have one or more elements with the class name: `layer`. Each "layer" element will hold the content that grows or shinks to create the aninated push-in effect.

**Example:**
```html
<div class="push-in">
    <div class="layer">
        This is the first layer you'll see.
    </div>
    <div class="layer">
        This is a second layer, which will be positioned behind the first one.
    </div>
</div>
```

### 3. Initialize the effect

Once you have your HTML set up, you just need to call the `pushInStart()` function, and give it the selector for your parent element.

**IMPORTANT:** you need to call this function **after** the `pushin.js` file has been included. For best results, call this function at the bottom of the `<body>` tag.

**Example:**
```html
    <div class="push-in">
        <div class="layer">
            <!-- layer content... -->
        </div>
    </div>
    <script type="text/javascript">
        // initialize push-in effect on the .push-in parent element
        pushInStart( '.push-in' );
    </script>
</body>
```

### 4. Layer configuration and animation timing

By default, all layers will push in at once. You can configure each layer to enter and exit the frame at specific times by using the following data parameters:

#### **data-pushin-from**

The point at which the layer **should be visible** and at its **smallest scale** (beginning of the push-in effect). Expects a numerical value, representing the pageYOffset – the top of the viewport when scrolling.

```html
<div class="layer" data-pushin-from="300">
    <!--
    This layer will be active when the window top
    scrolls 300px below the top of the page.
    -->
</div>
```

#### **data-pushin-to**

The point at which the layer should **stop growing** and no longer be visible. Expects a numerical value, representing the pageYOffset – the top of the viewport when scrolling.

```html
<div class="layer" data-pushin-to="600">
    <!--
    This layer will no longer be active when the
    window top scrolls 600px below the top of the page.
    -->
</div>
```

#### **data-pushin-speed**

A numerical value representing how fast or slow the element should move when scrolling. Expects a numerical value. Default: 8.

```html
<div class="layer" data-pushin-speed="25">
    <!--
    This layer will move faster than the default speed.
    -->
</div>
```

## Contributing

I appreciate and welcome any contributions to this project. Please submit an issue if you find a bug or need help.
