"use strict";

var GLContext = function (canv) {
    var cTexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var i = 0; i < cTexts.length; i += 1) {
        try {
            context = canv.getContext(cTexts[i]);
        } catch (e) {
            continue;
        }

        if(context) {
            break;
        }
    }

    return context;
};

module.exports = GLContext;
