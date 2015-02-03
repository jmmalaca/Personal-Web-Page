//[Naive Bayes Classifier System]
var fs = require('fs');
var math = require('mathjs');
var Separator = require('../SentimentAnalysis/DataSeparation.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function NaiveBayesClassifier() {
        
        //[Private data]

        var dataProcessor;//needed to process thw new texts the system receive...

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
            //console.log("  -Classes Prior Probabilities:");
            Object.keys(trainData).forEach(function(key) {
                classesProbabilities[key] = countClassesTexts[key] / countTotalTexts;
            //    console.log("  -[" + key + "] = " + classesProbabilities[key]);
            });
            console.log("  -Classes Prior Probabilities calculated.");
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
                    classeWordsProbabilites[word] = classeWordsData[word] / wordsTotalData[word];
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
            
            console.log("  -Naive Bayes system trained.");
        }
        
        function extractWordsAndValues(processedText) {
            var results = {};
            var words = processedText.split(' ');
            words.forEach(function(word) {
                if (results.hasOwnProperty(word)) {
                    results[word] = results[word] + 1;
                } else {
                    results[word] = 1;
                }
            });
            return results;
        }

        function classifyProblemResolve(stringToClassifiy, classA, classB) {
            var processedText = dataProcessor.IndependentStringProcessor(stringToClassifiy);
            var stringData = extractWordsAndValues(processedText);

            var classAData = wordsClassesPriorProbabilities[classA];
            var classAResult = math.log(classesProbabilities[classA], 10);

            var classBData = wordsClassesPriorProbabilities[classB];
            var classBResult = math.log(classesProbabilities[classB], 10);

            Object.keys(stringData).forEach(function (word) {
                
                /*
                * W = word
                * C = Classe ( positive, negative, etc... )
                * 
                * Probability(W|C) = counts W in class C / counts of words in class C
                * 
                * But, what happens with unknown words... the probability will be 0.
                * The solution: Laplace Smoothing:
                * 
                * Probability(W|C) = count(W,C) + 1 / count(W,C) + |V| + 1, where |V| represents the Vocabulary
                */

                var conditionalProbA = 1;
                if (classAData.hasOwnProperty(word)) {
                    conditionalProbA = classAData[word];
                }
                var conditionalProbB = 1;
                if (classBData.hasOwnProperty(word)) {
                    conditionalProbB = classBData[word];
                }
                
                var countsAppear = stringData[word];

                var powA = math.pow(conditionalProbA, countsAppear);
                var powB = math.pow(conditionalProbB, countsAppear);
                
                var logA = math.log(powA, 10);
                var logB = math.log(powB, 10);

                classAResult = classAResult + logA;
                classBResult = classBResult + logB;
            });

            if (classAResult > classBResult) {
                return classA;
            } else {
                return classB;
            }
        }

        function testSystem() {
            console.log("  -Testing the available System...");
            
            var rightSubjectiveClassifications = 0;
            var wrongSubjectiveClassifications = 0;
            
            var rightPositiveClassifications = 0;
            var wrongPositiveClassifications = 0;
            
            var rightNeutralClassifications = 0;
            var wrongNeutralClassifications = 0;
            
            var rightNegativeClassifications = 0;
            var wrongNegativeClassifications = 0;
            
            var truePositiveSubjectivity = 0; //result class Subjective and tweet with class Subjective
            var trueNegativeSubjectivity = 0; //result class Subjective but tweet com a class Objective
            var falsePositiveSubjectivity = 0; //result class Objective and tweet com a class Objective
            var falseNegativeSubjectivity = 0; //result class Objective but tweet com a class Subjective
            
            var truePositivePolarity = 0; //result class Positive and tweet with class Positive
            var trueNegativePolarity = 0; //result class Positive but tweet with class Negative
            var falsePositivePolarity = 0; //result class Negative and tweet with class Negative
            var falseNegativePolarity = 0; //result class Negative but tweet with class Positive

            Object.keys(testData).forEach(function (key) {

                var textsToClassify = testData[key];
                textsToClassify.forEach(function (text) {
                    
                    var classification = classifyProblemResolve(text, "subjective", "objective");
                    if (classification === "subjective") {
                        if (key === "subjective") {
                            rightSubjectiveClassifications++;
                            truePositiveSubjectivity++;
                        } else {
                            wrongSubjectiveClassifications++;
                            falsePositiveSubjectivity++;
                        }

                        classification = classifyProblemResolve(text, "positive", "negative");
                        if (classification === "positive") {
                            if (key === "positive") {
                                rightPositiveClassifications++;
                                truePositivePolarity++;
                            } else {
                                wrongPositiveClassifications++;
                                falsePositivePolarity++;
                            }
                        } else {
                            if (key === "negative") {
                                rightNegativeClassifications++;
                                trueNegativePolarity++;
                            } else {
                                wrongNegativeClassifications++;
                                falseNegativePolarity++;
                            }
                        }
                    } else {
                        if (key === "objective") {
                            rightNeutralClassifications++;
                            trueNegativeSubjectivity++;
                        } else {
                            wrongNeutralClassifications++;
                            falseNegativeSubjectivity++;
                        }
                    }
                });
            });

            console.log("\n  -Results:");
            console.log("   -Correct Subjective Classifications: " + rightSubjectiveClassifications + ", wrong: " + wrongSubjectiveClassifications);
            console.log("   -Correct Neutral Classifications: " + rightNeutralClassifications + ", wrong: " + wrongNeutralClassifications);
            console.log("   -Correct Positive Classifications: " + rightPositiveClassifications + ", wrong: " + wrongPositiveClassifications);
            console.log("   -Correct Negative Classifications: " + rightNegativeClassifications + ", wrong: " + wrongNegativeClassifications);

            var positiveCount = testData["positive"].length;
            var neutralCount = testData["objective"].length;
            var negativeCount = testData["negative"].length;
            var totalCount = positiveCount + neutralCount + negativeCount;

            console.log("\n  -By Percentages:");
            console.log("   -Subjective: " + ((rightSubjectiveClassifications * 100) / (positiveCount + negativeCount)) + "% Correct");
            console.log("   -Neutral: " + ((rightNeutralClassifications * 100) / neutralCount) + "% Correct");
            console.log("   -Positive: " +((rightPositiveClassifications * 100) / positiveCount) + "% Correct");
            console.log("   -Negative: " + ((rightNegativeClassifications * 100) / negativeCount) + "% Correct");

            console.log("  Total Correct Classification Percentage: " + (rightPositiveClassifications + rightNeutralClassifications + rightNegativeClassifications) * 100 / totalCount + "%.");

        }

        //[Public Methods]
        this.Start = function (processedTexts, setupData) {

            dataProcessor = setupData;

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
                    console.log("\n -ERROR: reading Words Classes Probabilities");
                    //console.log(e);
                }
            } catch (e) {
                console.log("\n -ERROR: reading Classes Probabilities");
                //console.log(e);
            }

            if (systemAlreadyTrained != true) {
                console.log("  -System not trained... Train it:");

                //[Separate data from training and validation]
                var separator = new Separator();
                var problems = ["subjectivity", "polarity"];
                problems.forEach(function(problem) {
                    //select data from the [beginning], from the [middle] or from the [end] of the array
                    var from = "beginning";

                    var data = separator.Start(processedTexts, from, problem);
                    trainData = data["train"];
                    testData = data["test"];

                    console.log("\n -Naive Bayes data for " + problem + " ready...");
                });
                
                //All data ready... train it... save it... and test it...
                trainSystem();
                //saveData();
                //testSystem();
            }

            console.log("\n  -Naive Bayes System Ready.");
        }
    }
    
    //[Export the Naive Bayes System Object]
    module.exports = NaiveBayesClassifier;
}());
