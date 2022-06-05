# PushIn.js - HTML attributes reference

HTML attributes can be used to customize the timing and speed at which elements are animated on your project. The following is a detailed reference of all available HTML attribute configurations.

---

## PushIn configuration

Global settings that affect the entire pushin container can be set on the element with the class "pushin".

### **data-pushin-target**

By default, PushIn.js will attach the effect to the viewport and target the window object for any scrolling behaviors.

Alternatively, you can use the `data-pushin-target` attribute to attach the PushIn effect to an element on the page. This will automatically make the element scrollable, and will constrain the effect within it.

To specify a target element, provide any element selector, like in the example below:

```html
<div class="my-parent">
  <div class="pushin" data-pushin-target=".my-parent">
    <!-- ... -->
  </div>
</div>
```

_**NOTE:** If the pushin element is a direct child of this target, it will simply attach the effect as is. If it is not a direct child of the target, it will move pushin into the container in order for the effect to work._

---

## Scene configuration

The "scene" is the container element for all layers. There are some scene configurations you can customize for your unique project, which will affect all layers.

### **data-pushin-from**

The point at which the first layer should begin pushing in (begin animating). This can be useful if your animation is further down on the page. This expects one or more comma-separated numerical values. By specifying more than one value, you can specify different values for each breakpoint.

_NOTE: This will be overriden if `data-pushin-from` is also added to the first layer._

```html
<div class="pushin-scene" data-pushin-from="300,500">
  <div class="pushin-layer">
    <!--
        This layer will be active when the window top
        scrolls down to 300px on mobile devices,
        and 500px on tablets or larger.
        -->
  </div>
</div>
```

### **data-pushin-breakpoints**

This can be used to specify custom breakpoints for responsive design. The default breakpoints are: 760px, 1440px and 1920px. Other comma-separated configurations will correspond to each of your breakpoints in the order provided.

```html
<div class="pushin-scene" data-pushin-breakpoints="300,500,1000">
  <div class="pushin-layer" data-pushin-from="200,150,100">
    <!--
        This layer will begin scrolling on screens
        that are between 500-1000px wide when the
        page has scrolled at least 150px down.
        -->
  </div>
</div>
```

See a working demo of breakpoints and responsive design here: [Responsive design](http://nateplusplus.github.io/pushin/responsive.html)

### **data-pushin-fixed-ratio**

This can be used to specify the aspect ratio that you want your scene to be. Setting a fixed aspect ratio helps a lot when using absolute positioning on items within your scene. The default ratio is 1:2 because this includes most mobile devices. There can only be one fixed aspect ratio, so it's recommended to compose your scene with the mobile experience in mind.

```html
<div class="pushin-scene" data-pushin-fixed-ratio="2,3">
  <div class="pushin-layer">
    <!--
        This layer (and all others) will be a fixed
        aspect ratio of 2:3 on any window size.
        -->
  </div>
</div>
```

See a working demo of a complex scene that uses a fixed 1:2 ratio here: [Building scenes with images - The cat](http://nateplusplus.github.io/pushin/cat.html)

---

## Layer configuration and animation timing

By default, all layers will push in at once. You can configure each layer to enter and exit the frame at specific times by using the following data parameters:

### **data-pushin-from**

The point at which the layer **should be visible** and at its **smallest scale** (beginning of the push-in effect). Expects one or more comma-separated numerical values, representing the pageYOffset – the top of the viewport when scrolling.

```html
<div class="pushin-layer" data-pushin-from="600,300,200">
  <!--
    This layer will be active when the page is scrolled
    at least 600px on mobile screens, 300px on tablet
    screens, or 200px on desktop screens.
    -->
</div>
```

### **data-pushin-to**

The point at which the layer should **stop growing** and no longer be visible. Expects one or more comma-separated numerical values, representing the pageYOffset – the top of the viewport when scrolling.

```html
<div class="pushin-layer" data-pushin-to="600,300,200">
  <!--
    This layer will no longer be active when the page is scrolled
    at least 600px on mobile screens, 300px on tablet
    screens, or 200px on desktop screens.
    -->
</div>
```

### **data-pushin-speed**

A numerical value representing how fast or slow the element should move when scrolling. Expects a numerical value. Default: 8.

```html
<div class="pushin-layer" data-pushin-speed="25">
  <!--
    This layer will move faster than the default speed.
    -->
</div>
```
