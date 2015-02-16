//[Sentiment Analysis System]
var DataReader = require('../ProcessingData/DataReader.js');
var SetupData = require('../ProcessingData/TextsProcessor.js');
var Separator = require('../SentimentAnalysis/DataSeparation.js');
var FeaturesSelection = require('../SentimentAnalysis/FeaturesSelection.js');
var NaiveBayes = require('../SentimentAnalysis/NaiveBayesClassifier.js');
var NeuralNetwork = require('../SentimentAnalysis/NeuralNetwork.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SentimentAnalysis() {
        
        //[Private data]
        var dataFromFiles;
        var setupData;
        //select data from the [beginning], from the [middle] or from the [end] of the array, and percentage for training and test
        var trainingDataPercentage = 70;
        var from = "middle";
        var separator;
        var selection;
        var bayes;
        var perceptron;

        //[Private Methods]

        //[Public Methods]
        this.Start = function() {
            //[Read Data]
            dataFromFiles = new DataReader();
            dataFromFiles.ReadInitialData();
            
            //[Process Texts]
            setupData = new SetupData();
            var allDataOnProcessedTexts = setupData.Preprocessor(dataFromFiles);
            
            //[Training and Validation Data]
            separator = new Separator();
            separator.Start(allDataOnProcessedTexts, from, trainingDataPercentage);
            var data = separator.GetTextDataArrays([]);
            
            //[Features Selection]
            selection = new FeaturesSelection();
            //var bestFeatures = selection.ByFrequency(data);
            var bestFeatures = selection.ByMutualInformation(data);
            data = separator.GetTextDataArrays(bestFeatures);

            //[Classifier: Naive Bayes]
            bayes = new NaiveBayes();
            bayes.Start(data, setupData);

            //[Classifier: Simple Neural Network (Perceptron)]
            perceptron = new NeuralNetwork();
            perceptron.Start(data, setupData);
        }

        this.GetDataInfo = function() {
            return dataFromFiles.getDataInfo();
        }
        
        this.GetProcessingResults = function() {
            return setupData.GetProcessDataResults();
        }
    }
    
    //[Export the SentimentAnalysis System Object]
    module.exports = SentimentAnalysis;
}());
