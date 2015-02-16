//[Data Separation System: Training Data and Validation(Test) Data]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function DataSeparation() {
        
        //[Private data]
        var trainingDataPercentage = 70;
        
        //select data from the [beginning], from the [middle] or from the [end] of the array
        var selectDataFrom = 'beginning';
        
        //train data...
        var trainData = {};
        
        //test data...
        var testData = {};
        
        //[Private Methods]
        function takeElements(data, classe, newClasse) {
            //Math.ceil() = round up result (i.e. 0.7 = 1)
            var countTraining = Math.ceil((trainingDataPercentage / 100) * data[classe].length);
            var countValidation = data[classe].length - countTraining;
            if (selectDataFrom === 'beginning') {
                trainData[newClasse] = data[classe].slice(0, countTraining);
                testData[newClasse] = data[classe].slice(countTraining, data[classe].length);
            } else if (selectDataFrom === 'middle') {
                var divisionInTwo = Math.ceil(countValidation / 2);
                trainData[newClasse] = data[classe].slice(divisionInTwo, (divisionInTwo + countTraining));
                testData[newClasse] = data[classe].slice(0, divisionInTwo);
                testData[newClasse].push(data[classe].slice((divisionInTwo + countTraining), data[classe].length));
            } else if (selectDataFrom === 'end') {
                trainData[newClasse] = data[classe].slice(countValidation, data[classe].length);
                testData[newClasse] = data[classe].slice(0, countValidation);
            }
        }
        
        function separateTrainingAndValidationData(data) {
            //console.log("  -Slice data from the " + selectDataFrom + ", Training percentage = " + trainingDataPercentage);
            
            takeElements(data, "positive", "positive");
            takeElements(data, "negative", "negative");
            takeElements(data, "neutral", "objective");

            trainData["subjective"] = trainData["positive"].slice(0);
            Array.prototype.push.apply(trainData["subjective"], trainData["negative"]);
            testData["subjective"] = testData["positive"].slice(0);
            Array.prototype.push.apply(testData["subjective"], testData["negative"]);
        }
        
        function getTextDataArraysOnly(featuresPositions) {
            var separatedData = {};
            //Just retreive the Text Arrays Data
            var trainArrays = {};
            var testArrays = {};
            if (featuresPositions.length === 0) {
                Object.keys(trainData).forEach(function(key) {
                    trainArrays[key] = [];
                    trainData[key].forEach(function(textData) {
                        if (textData.textDataArray != null) {
                            trainArrays[key].push(textData.textDataArray);
                        }
                    });
                    testArrays[key] = [];
                    testData[key].forEach(function(textData) {
                        if (textData.textDataArray != null) {
                            testArrays[key].push(textData.textDataArray);
                        }
                    });
                });
            } else {
                //retrive the values just in the given positions
                Object.keys(trainData).forEach(function (key) {
                    trainArrays[key] = [];
                    trainData[key].forEach(function (textData) {
                        if (textData.textDataArray != null) {
                            var newDataArray = [];
                            var positions = [];
                            if (key === "positive" || key === "negative") {
                                positions = featuresPositions["polarity"];
                            } else {
                                positions = featuresPositions["subjectivity"];
                            }
                            positions.forEach(function(position) {
                                newDataArray.push(textData.textDataArray[position]);
                            });
                            trainArrays[key].push(newDataArray);
                        }
                    });
                    testArrays[key] = [];
                    testData[key].forEach(function (textData) {
                        if (textData.textDataArray != null) {
                            var newDataArray = [];
                            var positions = [];
                            if (key === "positive" || key === "negative") {
                                positions = featuresPositions["polarity"];
                            } else {
                                positions = featuresPositions["subjectivity"];
                            }
                            positions.forEach(function (position) {
                                newDataArray.push(textData.textDataArray[position]);
                            });
                            testArrays[key].push(newDataArray);
                        }
                    });
                });
            }
            separatedData["train"] = trainArrays;
            separatedData["test"] = testArrays;
            return separatedData;
        }

        //[Public Methods]
        this.Start = function (data, fromWhere, percentage) {
            selectDataFrom = fromWhere;
            trainingDataPercentage = percentage;

            separateTrainingAndValidationData(data);
            
            console.log("\n -Data Separation:");
            Object.keys(trainData).forEach(function (key) {
                console.log("  -"+key+": Train[" + trainData[key].length + "], Test[" + testData[key].length + "]");
            });
        }

        this.GetTextDataArrays = function(featuresPositions) {
            var separatedData = getTextDataArraysOnly(featuresPositions);
            return separatedData;
        }
    }
    
    //[Export the DataSeparation System Object]
    module.exports = DataSeparation;
}());
