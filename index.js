var Pap = (function () {
    'use strict';


    var pap = {};

    function powerofTwo (num) {
        return !!( (num & (num - 1)) == 0 );
    }


    pap.smear = function (imageData, radius) {


        if(!powerofTwo(radius)) {
            console.warn('pixel size should be power of two for best results');
        }
        
        var newData = document.createElement('canvas').getContext('2d').getImageData(0,0,imageData.width, imageData.height);

        newData.data.set(imageData.data);

        var columns = imageData.width;
        var rows = imageData.height;
        var chunkWidth = radius; //112;
        var chunks = [];

        var currentRow = 0;
        var currentColumn = 0;

        var currentPixel = 0;
        var pixelRow = 0;


        var totalPixels = imageData.data.length / 4;
        var pixels = [];

        for(var i = 0; i < imageData.data.length; i += 4) {
            pixels.push({
                r : imageData.data[i],
                g : imageData.data[i + 1],
                b : imageData.data[i + 2],
                a : imageData.data[i + 3]
            });
        }


        var c = 0;
        var totalChunkColumns = imageData.width / chunkWidth;
        var totalChunkRows = imageData.height / chunkWidth;

        for(var k = 0; k < imageData.data.length; k += 4) {
            c += 1;

            var pixel = {
                r : imageData.data[k],
                g : imageData.data[k + 1],
                b : imageData.data[k + 2],
                a : imageData.data[k + 3]
            };


            if((c % chunkWidth) === 0) {

                currentColumn += 1;

                if(currentColumn === totalChunkColumns) {

                    currentColumn = 0;
                    pixelRow += 1;

                    if(pixelRow % chunkWidth === 0) {
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


        for(var j = 0; j < chunks.length; j += 1) {

            var roe = chunks[j];


            for(var h = 0; h < roe.length; h += 1) {
                var callem = roe[h];
                var totalRed = 0;
                var totalGreen = 0;
                var totalBlue = 0;

                var averageRed,
                averageGreen,
                averageBlue;

                for(var q = 0; q < callem.length; q += 1) {
                    totalRed += callem[q].r;
                    totalGreen += callem[q].g;
                    totalBlue += callem[q].b;
                }


                averageRed = totalRed / callem.length;
                averageGreen = totalGreen / callem.length;
                averageBlue = totalBlue / callem.length;

                for(var q = 0; q < callem.length; q += 1) {
                    callem[q].r = averageRed;
                    callem[q].g = averageGreen;
                    callem[q].b = averageBlue;
                }

            }
        }

        currentRow = 0;
        currentColumn = 0;
        c = 0;


        for(var k = 0; k < imageData.data.length; k += 4) {


            c += 1;

            if((c % chunkWidth) === 0) {

                currentColumn += 1;

                if(currentColumn === totalChunkColumns) {

                    currentColumn = 0;
                    pixelRow += 1;

                    if(pixelRow % chunkWidth === 0) {
                        currentRow += 1;
                        pixelRow = 0;
                    }

                }
            }

            var blur = chunks[currentRow][currentColumn][0];

            newData.data[k] = blur.r;
            newData.data[k + 1] = blur.g;
            newData.data[k + 2] = blur.b;

        }

        return newData;

    };

    return pap;

}());


module.exports = Pap;
