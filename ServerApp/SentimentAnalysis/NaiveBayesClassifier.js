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
        var wordsClassesPriorProbabilities = {};
        
        var classesProbabilitiesJsonPath = "./SentimentAnalysis/ClassesProbabilities.json";
        var wordsClassesPriorProbabilitiesJsonPath = "./SentimentAnalysis/ClassesWordsProbabilities.json";
        
        //[Private Methods]
        function calcClassesPriorProbabilities() {
            //Classes Prior Probabilities
            //Count total of texts in train data... and total of texts for each classe...
            var countTotalTexts = 0;
            var countClassesTexts = {};
            Object.keys(trainData).forEach(function(key) {
                countClassesTexts[key] = trainData[key].length;
                countTotalTexts = countTotalTexts + countClassesTexts[key];
            });
            //Calc probabilities for each class...
            console.log("  -Classes Prior Probabilities:");
            Object.keys(trainData).forEach(function(key) {
                classesProbabilities[key] = countClassesTexts[key] / countTotalTexts;
                console.log("  -[" + key + "] = " + classesProbabilities[key]);
            });
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
            //Count total of features(words) in train data...
            var wordsTotalData = searchAndCountWordsAvailable();
            //Count total of features(words) in each class of train data...
            var wordsData = searchAndCountWordsClassesAvailable();

            Object.keys(wordsData).forEach(function(key) {
                var classeWordsData = wordsData[key];
                var classeWordsProbabilites = {};
                Object.keys(classeWordsData).forEach(function (word) {
                    
                    //Laplace Smoothing...
                    classeWordsProbabilites[word] = ( classeWordsData[word] + 1) / (wordsTotalData[word] + wordsTotalData.length);

                });
                wordsClassesPriorProbabilities[key] = classeWordsProbabilites;
            });
            console.log("  -Words Prior Probabilities calculated.");
        }
        
        function saveData() {
            var jsonString = JSON.stringify(classesProbabilities);
            fs.writeFileSync(classesProbabilitiesJsonPath, jsonString);

            jsonString = JSON.stringify(wordsClassesPriorProbabilities);
            fs.writeFileSync(wordsClassesPriorProbabilitiesJsonPath, jsonString);

            console.log("  -Classes/Words Prior Probabilities saved on file.");
        }

        function trainSystem() {

            calcClassesPriorProbabilities();
            calcWordsPriorProbabilities();
            saveData();

            console.log("  -Naive Bayes system data saved (system trained).");
        }

        function testSystem() {

            //Object.keys(testData).forEach(function(key) {
            //    var texts = testData[key];

            //    texts.forEach(function(text) {

            //        //First... attack Subjective VS Objective
            //        var subjective = 0;
            //        var objective = 0;
                    
            //        var words = text.split(' ');
            //        words.forEach(function(word) {

            //        });
            //    });
            //});
        }

        //[Public Methods]
        this.Start = function (processedTexts) {
            
            //Check if there is a system already trained...
            var systemAlreadyTrained = false;
            
            //Subjectivity data...
            var dataClasses;
            try {
                dataClasses = fs.readFileSync(classesProbabilitiesJsonPath);
                classesProbabilities = JSON.parse(dataClasses);

                var dataWords;
                try {
                    dataWords = fs.readFileSync(wordsClassesPriorProbabilitiesJsonPath);
                    wordsClassesPriorProbabilities = JSON.parse(dataWords);

                    systemAlreadyTrained = true;
                    console.log("  -Naive Bayes System Data Loaded.");

                } catch (e) {
                    console.log("ERROR: reading Words Classes Probabilities");
                    //console.log(e);
                }
            } catch (e) {
                console.log("ERROR: reading Classes Probabilities");
                //console.log(e);
            }

            if (systemAlreadyTrained != true) {
                console.log("  -System not trained... Train it:");

                //[Separate data from training and validation]
                var separator = new Separator();

                //select problem [subjectivity] ou [polarity]
                var problems = ["subjectivity", "polarity"];

                problems.forEach(function(problem) {
                    //select data from the [beginning], from the [middle] or from the [end] of the array
                    var from = "beginning";

                    var data = separator.Start(processedTexts, from, problem);
                    trainData = data["train"];
                    testData = data["test"];
                    trainSystem(problem);

                    testSystem();

                    console.log("\n -Naive Bayes for " + problem + " ready...");
                });
            }

            console.log("  -Naive Bayes System Ready.");
        }
    }
    
    //[Export the Naive Bayes System Object]
    module.exports = NaiveBayesClassifier;
}());
