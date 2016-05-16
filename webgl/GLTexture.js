"use strict";

var GLTexture = function (mage) {
    this.image = mage;
};

GLTexture.prototype.texture = null;
GLTexture.prototype.image = null;
GLTexture.prototype.uniform = null;

GLTexture.prototype.create = function (gl) {
    this.texture = gl.createTexture();

    if(!this.texture) {
        return console.error('failed to create texture');
    }

    return this;
};

GLTexture.prototype.bind = function (gl, program, uniformName, textureNum) {
    this.uniform = gl.getUniformLocation(program, uniformName);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    if (this.image) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
    }
    gl.uniform1i(this.uniform, textureNum);

    return this;
};

module.exports = GLTexture;
