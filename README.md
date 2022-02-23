## Pap

[![NPM](https://nodei.co/npm/pap.png)](https://www.npmjs.org/package/pap)

Renders blurred versions of images to canvas.

Import the module.

```javascript
const pap = require('pap')();
```

Load an image and draw it on a canvas.

```javascript
const imageElement = document.createElement('image');

imageElement.addEventListener("load", function () {
    pap.initialize(imageElement);
    pap.blur(64);
    document.body.appendChild(pap.canvas);
});

imageElement.src = "images/kittens.jpg";
```

Initialize once, and update blur live.


```javascript
const Pap = require('pap');
const mage = document.createElement('img');

mage.onload = function () {
    var pap = Pap();
    pap.initialize(mage);
    document.body.appendChild(pap.canvas);
    var inc = 0;
    var blurWave = function () {
        inc += 0.02;
        pap.blur(Math.sin(inc) * 32 + 32);
        requestAnimationFrame(blurWave);
    };

    blurWave();
};

mage.src = "images/kittens.jpg";
```
