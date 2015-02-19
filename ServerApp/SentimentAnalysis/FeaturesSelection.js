//[Features Selection System]
var Math = require('mathjs');
var ProcessMonitor = require('../ProcessingMonitor/ProcessMonitor.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function FeaturesSelection() {
        
        //[Private data]
        var trainData = {};
        var frequencyMinValue = 0.3;
        var mutualInfTopSize = 5;
        var topWordsForEachClass = 6;

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
        
        function mutualInformationCalculation(totalFeatures, f1C1, f1C0, f0C1, f0C0) {
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
            
            return (firstValue + secondValue + thirdValue + fourthValue);
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
                mutInf[feature] = mutualInformationCalculation(totalFeatures, f1C1, f1C0, f0C1, f0C0);
                if (isNaN(mutInf[feature])) {
                    mutInf[feature] = 0;
                }
            }
            return mutInf;
        }
        
        function calcNotWordOnClass(word, classData) {
            var result = 0;
            Object.keys(classData).forEach(function(key) {
                if (key != word) {
                    result = result + classData[key];
                }
            });
            return result;
        }
        
        function countTotalOfWords(data) {
            var count = 0;
            Object.keys(data).forEach(function(key) {
                count = count + data[key];
            });
            return count;
        }

        function calcWordsMutualInf(classAData, classBData) {
            var mutInf = {};
            Object.keys(classAData).forEach(function(word) {
                var f1C1 = classAData[word];//feature = true, class = true
                var f1C0 = classBData[word];//feature = true, class = false
                var f0C1 = calcNotWordOnClass(word, classAData);//feature = false, class = true
                var f0C0 = calcNotWordOnClass(word, classBData);//feature = false, class = false
                var totalFeatures = f1C1 + f1C0 + f0C1 + f0C0;
                //just for DEBUG: totalFeatures must be equal total, True ;)
                //var countA = countTotalOfWords(classAData),
                //    countB = countTotalOfWords(classBData),
                //    total = countA + countB;
                mutInf[word] = mutualInformationCalculation(totalFeatures, f1C1, f1C0, f0C1, f0C0);
                if (isNaN(mutInf[word])) {
                    mutInf[word] = 0;
                }
            });
            return mutInf;
        }

        function mutualInfCalcs(totalCounts, nameClassA, nameClassB) {
            var results = {};
            results[nameClassA] = calcMutualInf(totalCounts[nameClassA], totalCounts[nameClassB]);
            results[nameClassB] = calcMutualInf(totalCounts[nameClassB], totalCounts[nameClassA]);
            return results;
        }
        
        function mutualWordsInfCalcs(totalCounts, nameClassA, nameClassB) {
            var results = {};
            results[nameClassA] = calcWordsMutualInf(totalCounts[nameClassA], totalCounts[nameClassB]);
            results[nameClassB] = calcWordsMutualInf(totalCounts[nameClassB], totalCounts[nameClassA]);
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
        
        function selectTheWordsBiggest(miResults) {
            var best = [];
            topWordsForEachClass = 6;
            Object.keys(miResults).forEach(function (key) {
                var data = miResults[key];
                var sortedValues = arrayToDic(sortDictionary(data).slice(0, topWordsForEachClass));
                Object.keys(sortedValues).forEach(function(word) {
                    if (best.indexOf(word) < 0) {
                        best.push(word);
                    }
                });
            });
            return best;
        }
        
        function sortDictionary(dictionary) {
            var sorted = [];
            Object.keys(dictionary).forEach(function (word) {
                sorted.push([word, dictionary[word]]);
            });
            sorted.sort(function (a, b)
            { return b[1] - a[1]; });//descending order...
            return sorted;
        }
        
        function arrayToDic(array) {
            var dic = {};
            array.forEach(function(value) {
                dic[value[0]] = value[1];
            });
            return dic;
        }

        function selectTheBestWords(data, problem) {
            var topValues = [];
            if (problem === "subjectivity") {
                var top = arrayToDic(sortDictionary(data["neutral"]).slice(0, topWordsForEachClass));
                Object.keys(top).forEach(function(key) {
                    if (topValues.indexOf(key) < 0) {
                        topValues.push(key);
                    }
                });
                topWordsForEachClass = topWordsForEachClass / 2;
            }
            top = arrayToDic(sortDictionary(data["positive"]).slice(0, topWordsForEachClass));
            Object.keys(top).forEach(function (key) {
                if (topValues.indexOf(key) < 0) {
                    topValues.push(key);
                }
            });
            top = arrayToDic(sortDictionary(data["negative"]).slice(0, topWordsForEachClass));
            Object.keys(top).forEach(function (key) {
                if (topValues.indexOf(key) < 0) {
                    topValues.push(key);
                }
            });
            return topValues;
        }

        //[Public Methods]
        
        this.ByFrequencyArray = function (data) {
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
        
        this.ByFrequencyWords = function (data) {
            console.log("\n -Feature Selection: By Frequency");

            var bestFeatures = {};
            bestFeatures["polarity"] = selectTheBestWords(data, "polarity");
            bestFeatures["subjectivity"] = selectTheBestWords(data, "subjectivity");
            return bestFeatures;
        }

        this.ByMutualInformationArray = function (data) {
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

        this.ByMutualInformationWords = function(data) {
            console.log("\n -Feature Selection: By Mutual Information");
            var measures = new ProcessMonitor();
            measures.StartTime();

            var miResults = {};
            miResults["polarity"] = mutualWordsInfCalcs(data, "positive", "negative");
            miResults["subjectivity"] = mutualWordsInfCalcs(data, "subjective", "neutral");
            console.log("");

            var bestFeatures = {};
            bestFeatures["polarity"] = selectTheWordsBiggest(miResults["polarity"]);
            bestFeatures["subjectivity"] = selectTheWordsBiggest(miResults["subjectivity"]);
            
            measures.ShowTimeCount("nothing to show", "Mutual Info calculated.");

            return bestFeatures;
        }
    }
    
    //[Export the FeaturesSelection System Object]
    module.exports = FeaturesSelection;
}());