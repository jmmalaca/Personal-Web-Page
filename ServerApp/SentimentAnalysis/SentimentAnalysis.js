//Sentiment Analysis System
var DataReader = require('../SentimentData/DataReader.js');

(function() {
    
    "use strict";
    // Define your library strictly...

    function SentimentAnalysis() {

        this.filePath = "";

        //Private Methods
        function Train() {
            console.log(" -SA training step...");
        }
        
        //Public Methods
        this.Start = function() {
            console.log(" -Start SA system...");

            //Read Data...
            var reader = new DataReader();
            var data = reader.Read();
            reader.PrintData(data);

            //Train... or read System trained...

        }
    }

    //Export the SA System Object
    module.exports = SentimentAnalysis;
}());
