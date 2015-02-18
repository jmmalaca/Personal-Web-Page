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
        var dataFromFiles;
        var processor;
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
            processor = new TextsProcessor();
            var allDataOnProcessedTexts = processor.Preprocessor(dataFromFiles);
            
            //[Training and Validation Data]
            separator = new Separator();
            separator.Start(allDataOnProcessedTexts, from, trainingDataPercentage);
            
            //[Features Selection]
            selection = new FeaturesSelection();
            
            //[Features with Array Bits]
            var dataBits = separator.GetTextBitsDataArrays([]);       
            var bestFeaturesBitsFreq = selection.ByFrequencyArray(dataBits);
            var bestFeaturesBits = selection.ByMutualInformationArray(dataBits);
            dataBits = separator.GetTextBitsDataArrays(bestFeaturesBits);
            
            //[Features with Words]
            var dataWords = separator.GetTextData();
            var vocabulary = processor.GetVocabulary();
            var bestFeaturesWordsFreq = selection.ByFrequencyWords(vocabulary);
            var bestFeaturesWords = selection.ByMutualInformationWords(vocabulary);
            var dataWordsBits = separator.GetTextWordsDataArrays(bestFeaturesWords);

            //[Classifier: Naive Bayes]
            bayes = new NaiveBayes();
            //bayes.Start(data, processor);

            //[Classifier: Simple Neural Network (Perceptron)]
            //perceptron = new NeuralNetwork();
            //perceptron.Start(data, Processor);
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
