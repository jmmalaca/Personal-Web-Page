//Sentiment Analysis System
var DataReader = require('../SentimentData/DataReader.js');
var SetupData = require('../SentimentData/SetupData.js');
var NaiveBayes = require('../SentimentAnalysis/NaiveBayesClassifier.js');

(function() {
    
    "use strict";
    // Define your library strictly...

    function SentimentAnalysis() {

        //Private Methods

        //Public Methods
        this.Start = function() {
            console.log(" -Start SA system...");

            //Read Data...
            var reader = new DataReader();
            var data = reader.Read();
            reader.PrintData(data);

            //Set up data...
            var setup = new SetupData();
            data = setup.Preprocessor(data);

            //Train... or read System trained...
            var nb = new NaiveBayesClassifier();
            nb.Start();

        }
    }

    //Export the SA System Object
    module.exports = SentimentAnalysis;
}());
