var Pap = (function () {
    'use strict';


    var pap = {};

    function powerofTwo (num) {
        return !!( (num & (num - 1)) === 0 );
    }




    function pushPixelsIntoChunks (pixelData, chunkSize, totalChunkColumns) {

        var chunks = [],
        currentColumn = 0,
        currentRow = 0,
        pixelRow = 0,
        pixel = {},
        c = 0,
        i = 0;

        for(i = 0; i < pixelData.length; i += 4) {
            c += 1;

            pixel = {
                r : pixelData[i],
                g : pixelData[i + 1],
                b : pixelData[i + 2],
                a : pixelData[i + 3]
            };


            if((c % chunkSize) === 0) {

                currentColumn += 1;

                if(currentColumn === totalChunkColumns) {

                    currentColumn = 0;
                    pixelRow += 1;

                    if(pixelRow % chunkSize === 0) {
                        currentRow += 1;
                        pixelRow = 0;
                    }

                }
            }


            if(chunks[currentRow] === undefined) {
                chunks[currentRow] = [];
            }

            if(chunks[currentRow][currentColumn] === undefined) {
                chunks[currentRow][currentColumn] = [];
            }

            chunks[currentRow][currentColumn].push(pixel);

        }

        return chunks;
    }


    /**
     * loop through sample data and average out RGB channels
     * @param {Array} chunks -- a sample set of image data
     * @return {Array} returned sample with averaged out colors
     */
    function averageOutChunkColors (chunks) {

        var i = 0,
        q = 0,
        h = 0,
        roe,
        callem,
        totalRed = 0,
        totalGreen = 0,
        totalBlue = 0,
        averageRed = 0,
        averageGreen = 0,
        averageBlue = 0;

        for(i = 0; i < chunks.length; i += 1) {

            roe = chunks[i];

            for(h = 0; h < roe.length; h += 1) {

                callem = roe[h];
                totalRed = 0;
                totalGreen = 0;
                totalBlue = 0;

                averageRed = 0;
                averageGreen = 0;
                averageBlue = 0;

                for(q = 0; q < callem.length; q += 1) {

                    totalRed += callem[q].r;
                    totalGreen += callem[q].g;
                    totalBlue += callem[q].b;

                }

                averageRed = totalRed / callem.length;
                averageGreen = totalGreen / callem.length;
                averageBlue = totalBlue / callem.length;

                for(q = 0; q < callem.length; q += 1) {
                    callem[q].r = averageRed;
                    callem[q].g = averageGreen;
                    callem[q].b = averageBlue;
                }

            }
        }

        return chunks;
    }



    function pushChunksIntoImageData (newData, chunks, chunkSize, totalChunkColumns) {

        var i = 0,
        c = 0,
        currentRow = 0,
        currentColumn = 0,
        pixelRow = 0,
        blur;

        for(i = 0; i < newData.data.length; i += 4) {

            c += 1;

            if((c % chunkSize) === 0) {

                currentColumn += 1;

                if(currentColumn === totalChunkColumns) {

                    currentColumn = 0;
                    pixelRow += 1;

                    if(pixelRow % chunkSize === 0) {
                        currentRow += 1;
                        pixelRow = 0;
                    }

                }
            }

            blur = chunks[currentRow][currentColumn][0];

            newData.data[i] = blur.r;
            newData.data[i + 1] = blur.g;
            newData.data[i + 2] = blur.b;

        }

        return newData;
    }


    /**
     * blur effect
     * hopefully pixelated, but who knows
     * @param  {Array} imageData -- the array of image data
     * @param  {Number} size      -- sample size for pixelation
     * @return {Array}           -- pixelated image data
     */
    pap.smear = function (imageData, size) {


        if(!powerofTwo(size)) {
            console.warn('pixel size should be power of two for best results');
        }

        var newData,
        chunkSize = size,
        chunks = [],
        totalChunkColumns = imageData.width / chunkSize;

        newData = document.createElement('canvas').getContext('2d').getImageData(0,0,imageData.width, imageData.height);
        newData.data.set(imageData.data);

        chunks = pushPixelsIntoChunks(imageData.data, chunkSize, totalChunkColumns);
        chunks = averageOutChunkColors(chunks);
        newData = pushChunksIntoImageData(newData, chunks, chunkSize, totalChunkColumns);

        return newData;

    };

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

    /**
     * takes in image data, returns blurred image data
     * @param  {Array} imageData -- array of image data (context.getImageData())
     * @param  {Number} radius    -- desired radius of blur, more is blurrier, but slower
     * @return {Array}           -- blurry version of image data
     */
    pap.gaussian = function (imageData, radius) {

        var newData = null,
        rowSize = imageData.width,
        columnOffsets = [],
        rowOffsets = [],
        sampleSize = ((radius * 2) + 1);

        columnOffsets = calculateColumnOffsets(radius, sampleSize );
        rowOffsets = calculateRowOffsets(radius, sampleSize, rowSize);
        newData = blurIteration(imageData, columnOffsets);
        newData = blurIteration(newData, rowOffsets);

        return newData;


    };


    /**
     * takes in image data, returns blurred image data
     * same as gaussian but only blurred horizontally
     * @param  {Array} imageData -- array of image data (context.getImageData())
     * @param  {Number} radius    -- desired distance of blur, more is blurrier
     * @return {Array}           -- motion blurred version of image data
     */
     pap.motionBlur = function (imageData, dist) {

         var newData = null,
         rowSize = imageData.width,
         columnOffsets = [],
         sampleSize = ((dist * 2) + 1);

         columnOffsets = calculateColumnOffsets(dist, sampleSize );
         newData = blurIteration(imageData, columnOffsets);

         return newData;

     };

     

    return pap;

}());


module.exports = Pap;
