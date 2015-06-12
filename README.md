## Pap

[![NPM](https://nodei.co/npm/pap.png)](https://www.npmjs.org/package/pap)

Renders blurred versions of images to canvas.

Import the module.

```javascript
var pap = require('pap')();
```

Load an image and draw it on a canvas.

```javascript
var myImage = document.createElement('image');

myImage.addEventListener("load", function () {

    pap.initialize(myImage);
    pap.blur(64);
    document.body.appendChild(pap.canvas);

});

myImage.src = "/path/to_image.jpg";

```


![lennablur](https://cloud.githubusercontent.com/assets/1766472/8122391/30a330aa-1087-11e5-8443-607cbd2371a1.png)
