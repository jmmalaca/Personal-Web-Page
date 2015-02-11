//[Neural Network (Perceptron) System]
var fs = require('fs');
var math = require('mathjs');
var Separator = require('../SentimentAnalysis/DataSeparation.js');

(function() {

    "use strict";
    //[Define your library strictly]

    function NeuralNetwork() {

        //[Private data]
        var trainData = {};
        var testData = {};

        var weightsValues = {};
        var weightsJsonPath = "./SentimentAnalysis/Weights.json";

        //[Private Methods]
        function saveData() {
            var jsonString = JSON.stringify(weightsValues);
            fs.writeFileSync(weightsJsonPath, jsonString);
            
            console.log("  -Weights values saved on file.");
        }

        function readNeuralNetworkSystemData() {
            var systemAlreadyTrained = false;
            var data;
            try {
                data = fs.readFileSync(weightsJsonPath);
                weightsValues = JSON.parse(data);

                systemAlreadyTrained = true;
                console.log("  -Neural Network (Perceptron) Data Loaded.");
            } catch (e) {
                console.log("\n -ERROR: reading Weights File.");
                //console.log(e);
            }
            return systemAlreadyTrained;
        }

        //[Public Methods]
        this.Start = function (allDataOnProcessedTexts, setupData) {

            //Check if there is a system already trained...
            var systemAlreadyTrained = readNeuralNetworkSystemData();
            
            var separator = new Separator();
            //select data from the [beginning], from the [middle] or from the [end] of the array and percentage for training and test
            var trainingDataPercentage = 70;
            var from = "middle";
            var data = separator.Start(allDataOnProcessedTexts, from, trainingDataPercentage);
            
            if (systemAlreadyTrained != true) {
                console.log("  -System not trained... Train it...");
                
                //[Separate data from training and validation]
                trainData = data["train"];
                testData = data["test"];
                
                //All data ready... train it... save it... and test it...
                //trainSystem();
                //saveData();
                //testSystem();

            } else {
                console.log("  -System trained...");
                
                //[Separate data from training and validation]
                testData = data["test"];
                
                //All data ready... test it... before start...
                //testSystem();
            }
            
            console.log("\n  -Neural Network (Perceptron) System Ready.");
        }
    }

    //[Export the Neural Network System Object]
    module.exports = NeuralNetwork;
}());
