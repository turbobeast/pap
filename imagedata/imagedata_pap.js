"use strict";

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

    /**
     * averages out red green and blue samples values and pushes them back into array
     * @param {Array} sampleData    -- the image data
     * @param {Array} sampleOffsets -- the array of index offsets to sample data from
     */
    function blurIteration (sampleData, sampleOffsets) {

        var newData = document.createElement('canvas').getContext('2d').getImageData(0,0,sampleData.width, sampleData.height),
        i = 0,
        j = 0,
        offset = 0,
        red = 0,
        green = 0,
        blue = 0,
        numReds = 0,
        numGreens = 0,
        numBlues = 0,
        totalRedVal = 0,
        totalGreenVal = 0,
        totalBlueVal = 0;


        newData.data.set(sampleData.data);

        for(i = 0; i < sampleData.data.length; i += 4) {


            red = i;
            green = i + 1;
            blue = i + 2;

            numReds = 0;
            numGreens = 0;
            numBlues = 0;

            totalRedVal = 0;
            totalGreenVal = 0;
            totalBlueVal = 0;

            for(j = 0; j < sampleOffsets.length; j += 1) {

                offset = sampleOffsets[j];

                if(sampleData.data[red + offset ] !== undefined) {
                    totalRedVal += sampleData.data[red + offset ];
                    numReds += 1;
                }

                if(sampleData.data[green + offset ] !== undefined) {
                    totalGreenVal += sampleData.data[green + offset ];
                    numGreens += 1;
                }

                if(sampleData.data[blue + offset ] !== undefined) {
                    totalBlueVal += sampleData.data[blue + offset ];
                    numBlues += 1;
                }

            }

            newData.data[red] = ( totalRedVal / numReds );
            newData.data[green] = (totalGreenVal / numGreens );
            newData.data[blue] = (totalBlueVal / numBlues );

        }

        return newData;

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
     imagedata_pap.blur = function (radius) {

        console.warn("Pap -- Keep blur radius low to help performance");

        var newData = null,
            rowSize = imageData.width,
            columnOffsets = [],
            rowOffsets = [],
            sampleSize = ((radius * 2) + 1);

        columnOffsets = calculateColumnOffsets(radius, sampleSize );
        rowOffsets = calculateRowOffsets(radius, sampleSize, rowSize);
        newData = blurIteration(imageData, columnOffsets);
        newData = blurIteration(newData, rowOffsets);

        ctx.putImageData(newData, 0, 0);

    };


    return imagedata_pap;

};


module.exports = imagedata_pap;
