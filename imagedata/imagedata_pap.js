"use strict";
var workify = require('webworkify');
var worker = workify(require('./worker.js'));

var imagedata_pap = function () {

    var imagedata_pap = {
        canvas : null
    },
    ctx,
    imageData;

    /**
     * calculates the positions of sample offset indices
     * from pixels vertical to current pixel
     * @param {Number} radius     -- how far to go
     * @param {Number} sampleSize -- how many indices to push into array
     */
    function calculateRowOffsets (radius, sampleSize, rowSize) {
        var i = 0,
        sampleOffsets = [],
        rowOffset = 0;

        for(i = 0; i < sampleSize; i += 1) {
            rowOffset = ( (-radius + i) * rowSize ) * 4;
            sampleOffsets.push(rowOffset);
        }
        return sampleOffsets;
    }

    /**
     * calculates positions of the sample offset indices
     * from pixels horizontal to current pixel
     * @param {Number} radius     -- how far to go
     * @param {Number} sampleSize -- how many indices to push into array
     */
    function calculateColumnOffsets (radius, sampleSize) {
        var c = 0,
        sampleOffsets = [],
        columnOffset = 0;

        for(c = 0; c < sampleSize; c += 1) {
            columnOffset = (-radius + c) * 4;
            sampleOffsets.push( columnOffset );
        }

        return sampleOffsets;
    }


    function blurIteration (imageData, offsets, direction) {
        var blankData = document.createElement('canvas').getContext('2d').getImageData(0,0,imageData.width, imageData.height)
        worker.postMessage({
          blankData: blankData,
          imageData: imageData,
          offsets: offsets,
          direction: direction
        });
    }

    imagedata_pap.initialize = function (image) {

        imagedata_pap.canvas = document.createElement('canvas');
        imagedata_pap.canvas.width = image.width;
        imagedata_pap.canvas.height = image.height;

        ctx = imagedata_pap.canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, imagedata_pap.canvas.width, imagedata_pap.canvas.height, 0, 0, imagedata_pap.canvas.width, imagedata_pap.canvas.height);

        imageData = ctx.getImageData(0, 0, imagedata_pap.canvas.width, imagedata_pap.canvas.height );

    };

    /**
     * takes in image data, returns blurred image data
     * @param  {Array} imageData -- array of image data (context.getImageData())
     * @param  {Number} radius    -- desired radius of blur, more is blurrier, but slower
     * @return {null}
     */
     imagedata_pap.blur = function (radius, callback) {

        console.warn("Pap -- Keep blur radius low to help performance");

        var newData = null,
            rowSize = imageData.width,
            columnOffsets = [],
            rowOffsets = [],
            sampleSize = ((radius * 2) + 1);

        columnOffsets = calculateColumnOffsets(radius, sampleSize );
        rowOffsets = calculateRowOffsets(radius, sampleSize, rowSize);

        worker.addEventListener("message", function (e) {
          if(e.data.direction === "horizontal") {
            return blurIteration(e.data.imageData, rowOffsets, "vertical");
          }
          newData = e.data.imageData;
          ctx.putImageData(newData, 0, 0);
          if(typeof callback === "function") {
            callback();
          }
        });

        blurIteration(imageData, columnOffsets, "horizontal");

    };


    return imagedata_pap;

};


module.exports = imagedata_pap;
