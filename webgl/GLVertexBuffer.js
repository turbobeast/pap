"use strict";

var GLVertexBuffer = function (gl, program, verts, dimensions, attrName) {
    var vertices, buffer, attribute;

    vertices = new Float32Array(verts);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    attribute = gl.getAttribLocation(program, attrName);

    gl.vertexAttribPointer(attribute, dimensions, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute);

};

module.exports = GLVertexBuffer;
