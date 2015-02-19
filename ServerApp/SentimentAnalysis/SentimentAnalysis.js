//[Sentiment Analysis System]
var DataReader = require('../ProcessingData/DataReader.js');
var TextsProcessor = require('../ProcessingData/TextsProcessor.js');
var Separator = require('../SentimentAnalysis/DataSeparation.js');
var FeaturesSelection = require('../SentimentAnalysis/FeaturesSelection.js');
var NaiveBayes = require('../SentimentAnalysis/NaiveBayesClassifier.js');
var NeuralNetwork = require('../SentimentAnalysis/NeuralNetwork.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SentimentAnalysis() {
        
        //[Private data]
        var dataFromFiles,
            processor,
        //select data from the [beginning], from the [middle] or from the [end] of the array, and percentage for training and test
            trainingDataPercentage = 70,
            from = "middle",
            separator,
            selection,
            bayes,
            perceptron;

        //[Private Methods]

        //[Public Methods]
        this.Start = function() {
            //[Read Data]
            dataFromFiles = new DataReader();
            dataFromFiles.ReadInitialData();
            
            //[Process Texts]
            processor = new TextsProcessor();
            var allDataOnProcessedTexts = processor.Preprocessor(dataFromFiles);
            
            //[Training and Validation Data]
            separator = new Separator();
            separator.Start(allDataOnProcessedTexts, from, trainingDataPercentage);
            
            //[Features Selection]
            selection = new FeaturesSelection();
            
            //[Features: all features detected in processing method]
            //var bestFeaturesBitsFreq = selection.ByFrequencyArray(separator.GetTextBitsDataArrays([]));
            //var bestFeaturesBits = selection.ByMutualInformationArray(separator.GetTextBitsDataArrays([]));
            //var dataBits = separator.GetTextBitsDataArrays(bestFeaturesBits);
            
            //[Features: all words detected in processing method]
            //var bestFeaturesWordsFreq = selection.ByFrequencyWords(processor.GetVocabulary());
            var bestFeaturesWords = selection.ByMutualInformationWords(processor.GetVocabulary());
            var dataWordsBits = separator.GetTextWordsDataArrays(bestFeaturesWords);

            //[Classifier: Naive Bayes]
            bayes = new NaiveBayes();
            bayes.Start(dataWordsBits, processor);

            //[Classifier: Simple Neural Network (Perceptron)]
            perceptron = new NeuralNetwork();
            perceptron.Start(dataWordsBits, processor);
        }

        this.GetDataInfo = function() {
            return dataFromFiles.getDataInfo();
        }
        
        this.GetProcessingResults = function() {
            return processor.GetProcessDataResults();
        }
    }
    
    //[Export the SentimentAnalysis System Object]
    module.exports = SentimentAnalysis;
}());
