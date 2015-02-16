//[Features Selection System]
var Math = require('mathjs');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function FeaturesSelection() {
        
        //[Private data]
        var trainData = {};
        var frequencyMinValue = 0.3;
        var mutualInfTopSize = 5;

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
                if (diff > frequencyMinValue) {
                    best.push(i);
                }
            }
            return best;
        }
        
        function countTotalFeaturesOnData(classAData, classBData) {
            var total = 0;
            for (var i = 0; i < classAData.length; i++) {
                total = total + classAData[i] + classBData[i];
            }
            return total;
        }

        function calcNotFeatureOnClass(feature, classData) {
            var result = 0;
            for (var i = 0; i < classData.length; i++) {
                if (i != feature) {
                    result = result + classData[i];
                }
            }
            return result;
        }
        
        function calcMutualInf(classAData, classBData) {
            var mutInf = [];
            for (var feature = 0; feature < classAData.length; feature++) {
                var f1C1 = classAData[feature];//feature = true, class = true
                var f1C0 = classBData[feature];//feature = true, class = false
                var f0C1 = calcNotFeatureOnClass(feature, classAData);//feature = false, class = true
                var f0C0 = calcNotFeatureOnClass(feature, classBData);//feature = false, class = false
                var totalFeatures = f1C1 + f1C0 + f0C1 + f0C0;
                //just for DEBUG: totalFeatures must be equal total, True ;)
                //var total = countTotalFeaturesOnData(classAData, classBData);
                mutInf.push(0);
                var x = ((totalFeatures * f1C1) / ((f1C1 + f1C0) * (f1C1 + f0C1)));
                var log = Math.log(x, 2);
                var firstValue = (f1C1 / totalFeatures) * log;

                x = ((totalFeatures * f1C0) / ((f1C0 + f1C1) * (f1C0 + f0C0)));
                log = Math.log(x, 2);
                var secondValue = (f1C0 / totalFeatures) * log;

                x = ((totalFeatures * f0C1) / ((f0C1 + f0C0) * (f1C1 + f0C1)));
                log = Math.log(x, 2);
                var thirdValue = (f0C1 / totalFeatures) * log;

                x = ((totalFeatures * f0C0) / ((f0C0 + f0C1) * (f1C0 + f0C0)));
                log = Math.log(x, 2);
                var fourthValue = (f0C0 / totalFeatures) * log;

                mutInf[feature] = firstValue + secondValue + thirdValue + fourthValue;
                if (isNaN(mutInf[feature])) {
                    mutInf[feature] = 0;
                }
            }
            return mutInf;
        }

        function mutualInfCalcs(totalCounts, nameClassA, nameClassB) {
            var results = {};
            results[nameClassA] = calcMutualInf(totalCounts[nameClassA], totalCounts[nameClassB]);
            results[nameClassB] = calcMutualInf(totalCounts[nameClassB], totalCounts[nameClassA]);
            return results;
        }
        
        function selectTheBiggest(miResults) {
            //Select the 3 biggest values = top features for each class...
            var best = [];
            Object.keys(miResults).forEach(function(key) {
                var data = miResults[key].slice(0);
                //sort array in the descending way...
                data.sort(function (a, b) { return b - a; });
                for (var i = 0; i < mutualInfTopSize; i++) {
                    var valuePosition = miResults[key].indexOf(data[i]);
                    if (best.indexOf(valuePosition) == -1) {
                        best.push(valuePosition);
                    }
                }
            });
            return best;
        }

        //[Public Methods]
        
        this.ByFrequency = function (data) {
            /*
             * frequency-based feature selection: selecting the features that are most common in the class C
             */
            console.log("\n -Feature Selection: By Frequency");
            
            //[get data]
            trainData = data["train"];

            var totalCounts = countClassesData();
            
            var frequencyResults = {};
            frequencyResults["polarity"] = frequencyCalcs(totalCounts, "positive", "negative");
            frequencyResults["subjectivity"] = frequencyCalcs(totalCounts, "subjective", "objective");
            //printResults(frequencyResults);

            var bestFeatures = {};
            bestFeatures["polarity"] = selectTheBest(frequencyResults["polarity"]);
            bestFeatures["subjectivity"] = selectTheBest(frequencyResults["subjectivity"]);
            return bestFeatures;
        }

        this.ByMutualInformation = function (data) {
            /*
             * MI measures how much information the presence/absence of a feature f contributes to making the correct classification decision on class C
             */
            console.log("\n -Feature Selection: By Mutual Information");

            //[get data]
            trainData = data["train"];

            var totalCounts = countClassesData();
            var miResults = {};
            miResults["polarity"] = mutualInfCalcs(totalCounts, "positive", "negative");
            miResults["subjectivity"] = mutualInfCalcs(totalCounts, "subjective", "objective");
            //printResults(miResults);

            var bestFeatures = {};
            bestFeatures["polarity"] = selectTheBiggest(miResults["polarity"]);
            bestFeatures["subjectivity"] = selectTheBiggest(miResults["subjectivity"]);
            return bestFeatures;
        }
    }
    
    //[Export the FeaturesSelection System Object]
    module.exports = FeaturesSelection;
}());