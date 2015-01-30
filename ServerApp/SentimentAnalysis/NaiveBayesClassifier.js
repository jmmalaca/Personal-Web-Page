//[Naive Bayes Classifier System]
var fs = require('fs');
var Separator = require('../SentimentAnalysis/DataSeparation.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function NaiveBayesClassifier() {
        
        //[Private data]
        var trainData = {};
        var testData = {};

        var classesProbabilities = {};
        var classesProbabilitiesJsonPath = "./SentimentAnalysis/ClassesProbabilities.txt";

        var wordsClassePriorProbabilities = {};
        var wordsClassePriorProbabilitiesJsonPath = "./SentimentAnalysis/WordsProbabilities.txt";

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
            classesProbabilities['positive'] = totalPositiveTexts / totalTexts;
            classesProbabilities['neutral'] = totalNeutralTexts / totalTexts;
            classesProbabilities['negative'] = totalNegativeTexts / totalTexts;
            console.log("  -Classes Prior Probabilities: [positive] = " + classesProbabilities['positive'] +
            ", [neutral] = " + classesProbabilities['neutral'] +
            ", [negative] = " + classesProbabilities['negative']
            );
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

            Object.keys(wordsData).forEach(function(key) {
                var classeWordsData = wordsData[key];
                var classeWordsProbabilites = {};
                Object.keys(classeWordsData).forEach(function (word) {
                    classeWordsProbabilites[word] = classeWordsData[word] / wordsTotalData[word];
                });
                wordsClassePriorProbabilities[key] = classeWordsProbabilites;
            });
            console.log("  -Words Prior Probabilities calculated.");
        }
        
        function saveData() {
            var jsonString = JSON.stringify(classesProbabilities);
            fs.writeFileSync(classesProbabilitiesJsonPath, jsonString);
            
            jsonString = JSON.stringify(wordsClassePriorProbabilities);
            fs.writeFileSync(wordsClassePriorProbabilitiesJsonPath, jsonString);

            console.log("  -Classes/Words Prior Probabilities saved on file.");
        }

        function trainSystem() {
            calcClassesPriorProbabilities();
            calcWordsPriorProbabilities();
            saveData();

            console.log("  -Naive Bayes system data saved (system trained).");
        }
        
        //[Public Methods]
        this.Start = function (processedTexts) {
            
            //[Separate data from training and validation]
            var separator = new Separator();
            //select data from the [beginning], from the [middle] or from the [end] of the array
            //select problem [subjectivity] ou [polarity]
            var data = separator.Start(processedTexts, "beginning", "subjectivity");
            trainData = data["train"];
            testData = data["test"];
            
            console.log("\n -Start Naive Bayes Classifier...");
            //var dataClasses = fs.readFileSync(classesProbabilitiesJsonPath);
            //var dataWords = fs.readFileSync(wordsClassePriorProbabilitiesJsonPath);
            //classesProbabilities = JSON.parse(dataClasses);
            //wordsClassePriorProbabilities = wordsClassePriorProbabilities = JSON.parse(dataWords);
            //console.log("  -Naive Bayes data loaded.");

            console.log("  -System not trained... Train it:");
            trainSystem();
            console.log("  -Naive Bayes system ready.");
        }
    }
    
    //[Export the Naive Bayes System Object]
    module.exports = NaiveBayesClassifier;
}());
