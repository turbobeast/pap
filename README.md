## Pap

[![NPM](https://nodei.co/npm/pap.png)](https://www.npmjs.org/package/pap)

Terrible little module that pixelates imageData then returns it.

Import the module.

```javascript
var Pap = require('pap');
```

Load an image and draw it on a canvas.

```javascript
var myImage = document.createElement('image');
myImage.addEventListener("load", function () {

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = myImage.width * window.devicePixelRatio;
    canvas.height = myImage.height * window.devicePixelRatio;
    context.drawImage(myImage, 0, 0, myImage.width, myImage.height);

});
```

Grab the image data.

```javascript
var imageData = context.getImageData(0,0,myImage.width, myImage.height);
```

Pixelate it and draw it to the canvas.

```javascript
var pixelated = Pap.smear(imageData, 16);
context.putImageData(pixelated, 0, 0);
```

Gaussian blur is nice too.

```javascript
var blurry = Pap.gaussian(imageData, 16);
context.putImageData(blurry, 0, 0 );
```

![blurry jenelle](https://cloud.githubusercontent.com/assets/1766472/6281175/0170a502-b889-11e4-9dac-b304c2ade08b.png)


There is also motion blur for horizontal only blurring.

```javascript
var speedy = Pap.motionBlur(imageData, 24);
context.putImageData(speedy, 0, 0);
```
