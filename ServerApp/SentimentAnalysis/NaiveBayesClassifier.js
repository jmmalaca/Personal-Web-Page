//[Naive Bayes Classifier System]
var fs = require('fs');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function NaiveBayesClassifier() {
        
        //[Private data]
        
        var trainData = {};
        var testData = {};

        var dataClasses = [];
        var classesProbabilities = {};

        //[Private Methods]
        function trainSystem() {
            //Classes Prior Probabilities
            //Count total of texts in train data...
            //Count total of texts for each class in train data...
            //Calc probabilities for each class in train data...
            
            //Features Prior Probabilities
            //Count total of features(words) in train data...
            //Count total of features(words) in each class of train data...
            //Calc probabilities for each feature(word) in train data...
        }
        
        //[Public Methods]
        this.Start = function (data) {
            console.log("\n -Start Naive Bayes Classifier...");

            trainData = data["train"];
            testData = data["test"];

            //Train...
            console.log("  -System not trained... Train it:");
            trainSystem();
            
            //Or read trained system...

        }
    }
    
    //[Export the Naive Bayes System Object]
    module.exports = NaiveBayesClassifier;
}());
