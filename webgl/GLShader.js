"use strict";

var GLShader = function () {};

GLShader.prototype.makeShader = function (gl, shader, srcCode) {

    gl.shaderSource(shader, srcCode);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);

        return null;
    }

    return shader;
};


GLShader.prototype.fragment = function (gl, srcCode) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    return this.makeShader(gl, shader, srcCode);
};


GLShader.prototype.vertex = function (gl, srcCode) {
    var shader = gl.createShader(gl.VERTEX_SHADER);
    return this.makeShader(gl, shader, srcCode);
};

module.exports = GLShader;
