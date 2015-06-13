"use strict";

var imagedata_pap = require('./imagedata/imagedata_pap');
var webgl_pap = require('./webgl/webgl_pap');

var Pap = (function () {

    var canvas = document.createElement('canvas');
    var cTexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = false;

    for(var i = 0; i < cTexts.length; i+= 1) {
        try {
            context = canvas.getContext(cTexts[i]);
        } catch (e) {
            continue;
        }

        if(context !== false) {
            break;
        }
    }

    if(context === false) {
        console.warn("Pap -- WebGL Not Supported. Image blur performance will suffer greatly");
        return imagedata_pap;
    }

    return webgl_pap;

}());



module.exports = Pap;
