//[Naive Bayes Classifier System]
var fs = require('fs');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function NaiveBayesClassifier() {
        
        //[Private data]
        
        var trainData = {};
        var testData = {};

        //[Private Methods]
        function calcClassesPriorProbabilities() {
            //Classes Prior Probabilities
            //Count total of texts in train data...
            var totalTexts = trainData['positive'].length + trainData['neutral'].length + trainData['negative'].length;
            //Count total of texts for each class in train data...
            var totalPositiveTexts = trainData['positive'].length;
            var totalNeutralTexts = trainData['neutral'].length;
            var totalNegativeTexts = trainData['negative'].length;
            //Calc probabilities for each class in train data...
            var classesProbabilities = {};
            classesProbabilities['positive'] = totalPositiveTexts / totalTexts;
            classesProbabilities['neutral'] = totalNeutralTexts / totalTexts;
            classesProbabilities['negative'] = totalNegativeTexts / totalTexts;
            console.log("  -Prior probability[positive] = " + classesProbabilities['positive'] +
            "  -Prior probability[neutral] = " + classesProbabilities['neutral'] +
            "  -Prior probability[negative] = " + classesProbabilities['negative']
            );
            return classesProbabilities;
        }
        
        function searchAndCountWordsAvailable() {
            var wordsList = {};
            Object.keys(trainData).forEach(function (key) {
                var texts = trainData[key];
                texts.forEach(function (text) {
                    var words = text.split(' ');
                    words.forEach(function (word) {
                        if (wordsList.hasOwnProperty(word)) {
                            wordsList[word] = wordsList[word] + 1;
                        } else {
                            wordsList[word] = 1;
                        }
                    });
                });
            });
            return wordsList;
        }

        function searchAndCountWordsClassesAvailable() {
            var wordsClassesList = {};
            Object.keys(trainData).forEach(function (key) {
                var texts = trainData[key];
                var wordsList = {};
                texts.forEach(function(text) {
                    var words = text.split(' ');
                    words.forEach(function(word) {
                        if (wordsList.hasOwnProperty(word)) {
                            wordsList[word] = wordsList[word] + 1;
                        } else {
                            wordsList[word] = 1;
                        }
                    });
                });
                wordsClassesList[key] = wordsList;
            });
            return wordsClassesList;
        }

        function calcWordsPriorProbabilities() {
            //Features Prior Probabilities
            //Count total of features(words) in train data...
            var wordsTotalData = searchAndCountWordsAvailable();
            //Count total of features(words) in each class of train data...
            var wordsData = searchAndCountWordsClassesAvailable();

            var wordsClassePriorProbabilities = {};
            Object.keys(wordsData).forEach(function(key) {
                var classeWordsData = wordsData[key];
                var classewordsProbabilites = {};
                Object.keys(classeWordsData).forEach(function (word) {
                    classewordsProbabilites[word] = classeWordsData[word] / wordsTotalData[word];
                });
                wordsClassePriorProbabilities[key] = classewordsProbabilites;
            });
            return wordsClassePriorProbabilities;
        }

        function trainSystem() {
            var classesProbabilities = calcClassesPriorProbabilities();
            var wordsClassePriorProbabilities = calcWordsPriorProbabilities();

            console.log();
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
