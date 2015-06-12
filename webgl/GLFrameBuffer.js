"use strict";

var GLFrameBuffer = function () {};


GLFrameBuffer.prototype.fbo = null;
GLFrameBuffer.prototype.rbo = null;

GLFrameBuffer.prototype.bind = function (gl, texture, width, height) {

    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    return this;

};


GLFrameBuffer.prototype.release = function (gl) {

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

};

GLFrameBuffer.prototype.create = function (gl) {

    this.fbo = gl.createFramebuffer();

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.error(gl.checkFramebufferStatus(gl.FRAMEBUFFER));
        return null;
    }

    return this;

};


module.exports = GLFrameBuffer;
