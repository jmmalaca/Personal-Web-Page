//[Features Selection System]
var Math = require('mathjs');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function FeaturesSelection() {
        
        //[Private data]
        var trainData = {};

        //[Private Methods]
        function countClassesData() {
            var totalCounts = {};
            Object.keys(trainData).forEach(function (key) {
                totalCounts[key] = [];
                trainData[key].forEach(function (dataVector) {
                    if (totalCounts[key].length == 0) {
                        totalCounts[key] = dataVector.slice(0);
                    } else {
                        for (var i = 0; i < totalCounts[key].length; i++) {
                            totalCounts[key][i] = totalCounts[key][i] + dataVector[i];
                        }
                    }
                });
            });
            return totalCounts;
        }
        
        function calcFrequency(classAData, classBData) {
            var freqs = [];
            for (var i = 0; i < classAData.length; i++) {
                freqs[i] = classAData[i] / (classAData[i] + classBData[i]);
            }
            return freqs;
        }

        function frequencyCalcs(totalCounts, nameClassA, nameClassB) {
            var results = {};
            results[nameClassA] = calcFrequency(totalCounts[nameClassA], totalCounts[nameClassB]);
            results[nameClassB] = calcFrequency(totalCounts[nameClassB], totalCounts[nameClassA]);
            return results;
        }
        
        function printResults(frequencyResults) {
            Object.keys(frequencyResults).forEach(function (problem) {
                console.log("  -" + problem + ":");
                var problemData = frequencyResults[problem];
                Object.keys(problemData).forEach(function (classe) {
                    var line = "   -" + classe + ":";
                    problemData[classe].forEach(function(featureValue) {
                        line = line + " " + featureValue;
                    });
                    console.log(line);
                });
            });
        }

        function selectTheBest(frequencyResults) {
            var best = [];
            var classes = Object.keys(frequencyResults);
            var dataA = frequencyResults[classes[0]];
            var dataB = frequencyResults[classes[1]];
            for (var i = 0; i < dataA.length; i++) {
                var diff = Math.abs(dataA[i] - dataB[i]);
                if (diff > 0.3) {
                    best.push(i);
                }
            }
            return best;
        }

        //[Public Methods]
        
        //[simple method: calculus of the relative frequency]
        this.ByFrequency = function(data) {
            console.log("\n -Feature Selection: By Frequency");
            
            //[get data]
            trainData = data["train"];

            var totalCounts = countClassesData();
            
            var frequencyResults = {};
            frequencyResults["Polarity"] = frequencyCalcs(totalCounts, "positive", "negative");
            frequencyResults["Subjectivity"] = frequencyCalcs(totalCounts, "subjective", "objective");
            //printResults(frequencyResults);

            var bestFeatures = {};
            bestFeatures["Polarity"] = selectTheBest(frequencyResults["Polarity"]);
            bestFeatures["Subjectivity"] = selectTheBest(frequencyResults["Subjectivity"]);
            return bestFeatures;
        }

        this.ByMutualInformation = function(data) {
            //[get data]
            trainData = data["train"];


        }

    }
    
    //[Export the FeaturesSelection System Object]
    module.exports = FeaturesSelection;
}());