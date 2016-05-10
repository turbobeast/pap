"use strict";

var getContext = require('./GLContext');
var glslify = require('glslify');
var GLProgram = require('./GLProgram');
var quad = require('./geometry/quad');
var VertexBuffer = require('./GLVertexBuffer');
var GLTexture = require('./GLTexture');
var GLFrameBuffer = require('./GLFrameBuffer');

//shaders
var fragmentShader = glslify('../shaders/blur.fragment.glsl');
var vertexShader = glslify('../shaders/vertex.glsl');

var webgl_pap = function webgl_pap() {

    var pap = {
        canvas : null,
    },
    width = 0,
    height = 0,
    gl,
    texture,
    program,
    emptyTex,
    frameBuffer,
    uRad,
    uWidth,
    uHeight,
    uHorizontal,
    uSampler;

    function getDimensions (elem) {
        var w = 0;
        var h = 0;
        switch (elem.nodeName) {
            case 'VIDEO':
                w = elem.videoWidth;
                h = elem.videoHeight;
            break;
            default:
                w = elem.width;
                h = elem.height;
        }

        return {
            width: w,
            height: h
        };
    }

    /**
     * creates webgl program
     * initializes texture
     * sets up uniforms
     * @param {HTMLImageElement} image
     * @return {null}
     */
    pap.initialize = function initialize(textureElement) {
        var dimensions = getDimensions(textureElement);
        width = dimensions.width;
        height = dimensions.height;

        pap.canvas = document.createElement('canvas');
        pap.canvas.width = width;
        pap.canvas.height = height;
        gl = getContext(pap.canvas);
        texture = new GLTexture(textureElement);
        texture.create(gl);

        program = new GLProgram().create(gl, vertexShader, fragmentShader);

        VertexBuffer(gl, program, quad, 3, "aVertexPos");
        VertexBuffer(gl, program, [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0], 2, "aTexCoord");

        emptyTex = new GLTexture().create(gl);
        frameBuffer = new GLFrameBuffer().create(gl);

        gl.useProgram(program);

        //bind empty tex to horizontal program
        uSampler = gl.getUniformLocation(program, "uSampler");

        uRad = gl.getUniformLocation(program, "uRadius");
        uWidth = gl.getUniformLocation(program, "uWidth");
        uHeight = gl.getUniformLocation(program, "uHeight");
        uHorizontal = gl.getUniformLocation(program, "uHorizontal");

        gl.uniform1i(uSampler, 0);
        gl.uniform1i(uWidth, width);
        gl.uniform1i(uHeight, height);

    };

    /**
     * renders blurred version of image to canvas property
     * @param {Number} - radius
     * @return {null}
     */
    pap.blur = function blur(radius, callback) {

        gl.useProgram(program);
        gl.uniform1i(uRad, radius);

        //first pass
        gl.uniform1i(uHorizontal, false);
        frameBuffer.bind(gl, emptyTex.texture, width, height);
        texture.bind(gl, program, "uSampler", 0 );

        gl.clearColor(0.0,0.0,0.0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        frameBuffer.release(gl); //release frame buffer

        //second pass
        gl.uniform1i(uHorizontal, true);
        emptyTex.bind(gl, program, "uSampler", 0);

        gl.clearColor(0.0,0.0,0.0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if(typeof callback === "function") {
          callback();
        }
    };

    return pap;
};


module.exports = webgl_pap;
