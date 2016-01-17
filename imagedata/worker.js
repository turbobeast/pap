module.exports = function (self) {

    /**
     * averages out red green and blue samples values and pushes them back into array
     * @param {Array} sampleData    -- the image data
     * @param {Array} sampleOffsets -- the array of index offsets to sample data from
     */
    function blurIteration (newData, sampleData, sampleOffsets) {

        console.dir(arguments);
        var i = 0,
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

    self.addEventListener('message',function (e) {
        var direction = e.data.direction;
        var imageData = blurIteration(e.data.blankData, e.data.imageData, e.data.offsets);
        self.postMessage({imageData: imageData, direction: direction });
    });
};
