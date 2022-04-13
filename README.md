<img src="docs/images/pushin-logo.svg" width="100">

# pushIn.js

[![made-with-javascript](https://img.shields.io/badge/Made%20with-TypeScript-1f425f.svg)](https://www.typescriptlang.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/nateplusplus/pushin/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/maintainer-nateplusplus-blue)
[![GitHub license](https://img.shields.io/github/license/nateplusplus/pushin.svg)](https://github.com/nateplusplus/pushin/blob/main/LICENSE)
[![Node.js CI](https://github.com/nateplusplus/pushin/actions/workflows/node.js.yml/badge.svg)](https://github.com/nateplusplus/pushin/actions/workflows/node.js.yml)

PushIn.js is a lightweight parallax effect, built with JavaScript, that simulates an interactive dolly-in or push-in animation on a webpage.

Check out the [live demo](http://nateplusplus.github.io/pushin/) for a working example.

## Compatibility

PushIn.js supports all browsers that are [ES5-compliant](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported).

## Getting started

### 1a. Install pushin with NPM

If you're using npm, you can install the package by running:

```bash
npm install --save pushin
```

Then, in your Javascript, you can import the `PushIn` class:

```js
import { PushIn } from 'pushin';
```

And also require assets in your CSS:

```css
@import 'pushin/pushin.css';
```

- _**NOTE:** If you don't have a CSS Loader setup, you may not be able to import the CSS this way. If that's the case, you may need to manually download and include the CSS using the instructions in the next step below..._

### 1b. Manually download and include the JavaScript and CSS

If you're not using npm, just download the CSS and JavaScript files from this repo: [dist/](dist/) and include them in your project. These two files will include all the functionality for the effect.

**Example:**

```html
<html>
  <head>
    <link rel="stylesheet" href="pushin.css" />
    <script type="text/javascript" src="pushin.js"></script>
  </head>
  <body>
    <!-- page content... -->
  </body>
</html>
```

### 2. Required HTML structure

At the most basic level, there are a few things you need to set up on your page in order for this to work properly.

Use the following example snippet to create a "scene" for the pushin effect.

**Example:**

```html
<div class="pushin">
  <div class="pushin-scene">
    <div class="pushin-layer">This is the first layer you'll see.</div>
    <div class="pushin-layer">
      This is a second layer, which will be positioned behind the first one.
    </div>
  </div>
</div>
```

Each div with the class `pushin-layer` can hold the content that you want to grow or shrink when scrolling.

### 3. Initialize the effect

Once you have your HTML set up, there're two ways to initialize the effect:

- call `new PushIn().start()`:

```js
import { PushIn } from 'pushin';

const container = document.querySelector('.pushin');
new PushIn(container).start();
```

- call `pushInStart()` function (which is exported onto the global scope):

```js
import 'pushin';

pushInStart();
```

To assist in setting up your effect, you can use the debug tool to easily deterimine where you want effects to begin and end when scrolling down your page. To enable this feature, simply pass a config object with `debug: true` into the helper function.

See a working demo of this tool here: [Responsive design](http://nateplusplus.github.io/pushin/responsive.html)

**Example:**

```js
import 'pushin';

// initialize push-in effect
pushInStart({ debug: true });
```

### 4. Destroying the effect

The `PushIn` has a `destroy()` method that may be called to do all cleanups once the view is destroyed. For instance, this is how you would want to do this in React:

```jsx
import { PushIn } from 'pushin';

export default function PushInComponent() {
  const pushInContainer = useRef();

  useEffect(() => {
    const pushIn = new PushIn(pushInContainer.current);
    pushIn.start();

    return () => pushIn.destroy();
  });

  return (
    <div class="pushin" {ref}="pushInContainer">
      <div class="pushin-scene">
        <div class="pushin-layer">This is the first layer you'll see.</div>
        <div class="pushin-layer">
          This is a second layer, which will be positioned behind the first one.
        </div>
      </div>
    </div>
  );
}
```

### 5. Scene configuration

The "scene" is the container element for all layers. There are some scene configurations you can customize for your unique project, which will affect all layers.

**Refer to [docs/html-attributes](docs/html-attributes.md) for a detailed breakdown of available scene configurations.**

### 6. Layer configuration and animation timing

By default, all layers will push in at once. You can configure each layer to enter and exit the frame at specific times by using the following data parameters:

**Refer to [docs/html-attributes](docs/html-attributes.md) for a detailed breakdown of available layer configurations.**

## Contributing

I appreciate and welcome any contributions to this project. Please submit an issue if you find a bug or need help.

### Development Setup

1. Clone this repo
2. Run `npm ci` to install all dependencies
3. Run `npm run docs` to set up test pages
4. Run `npm start` to start up development environment

The `npm start` command will compile all code and begin running a node server at [localhost:8080](). The page will automatically refresh whenever you make a change to the source code.

Once your code is ready to be pushed, run `npm run build` to bundle your assets into the `/dist` folder.
