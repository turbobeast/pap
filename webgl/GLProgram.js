"use strict";

var GLShader = require('./GLShader');
var GLProgram = function () {};


GLProgram.prototype.create = function (gl, vShaderSrc, fShaderSrc) {

    var shader, vertexShader, fragmentShader, program;

    shader = new GLShader();

    vertexShader = shader.vertex(gl, vShaderSrc);
    fragmentShader = shader.fragment(gl, fShaderSrc);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return null;
    }

    return program;
};


module.exports = GLProgram;
