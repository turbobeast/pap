## Pap

[![NPM](https://nodei.co/npm/pap.png)](https://www.npmjs.org/package/pap)

Renders blurred versions of images to canvas.

Import the module.

```javascript
var pap = require('pap')();
```

Load an image and draw it on a canvas.

```javascript
var mage = document.createElement('image');

mage.addEventListener("load", function () {

    pap.initialize(mage);
    pap.blur(64);
    document.body.appendChild(pap.canvas);

});

mage.src = "images/Lenna.png";

```


![lennablur](https://cloud.githubusercontent.com/assets/1766472/8122391/30a330aa-1087-11e5-8443-607cbd2371a1.png)

Initialize once, and update blur live. 


```javascript
var Pap = require('pap');
var mage = document.createElement('img');
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
mage.src = "images/Lenna.png";
```
