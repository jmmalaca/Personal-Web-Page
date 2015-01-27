//[Data Separation System: Training Data and Validation(Test) Data]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function DataSeparation() {
        
        //[Private data]
        var POSITIVE = 'positive';
        var NEUTRAL = 'neutral';
        var NEGATIVE = 'negative';
        
        var trainingDataPercentage = 70;
        
        //select data from the [beginning], from the [middle] or from the [end] of the array
        var selectDataFrom = 'beginning';
        
        var trainData = {};
        trainData[POSITIVE] = [];
        trainData[NEUTRAL] = [];
        trainData[NEGATIVE] = [];
        
        var testData = {};
        testData[POSITIVE] = [];
        testData[NEUTRAL] = [];
        testData[NEGATIVE] = [];
        
        //[Private Methods]
        function takeElements(data, classe) {
            //Math.ceil() = round up result (i.e. 0.7 = 1)
            var countTraining = Math.ceil((trainingDataPercentage / 100) * data[classe].length);
            var countValidation = data[classe].length - countTraining;
            if (selectDataFrom === 'beginning') {
                trainData[classe] = data[classe].slice(0, countTraining);
                testData[classe] = data[classe].slice(countTraining, data[classe].length);
            } else if (selectDataFrom === 'middle') {
                var divisionInTwo = Math.ceil(countValidation / 2);
                trainData[classe] = data[classe].slice(divisionInTwo, countTraining);
                testData[classe].push(data[classe].slice(0, divisionInTwo));
                testData[classe].push(data[classe].slice((divisionInTwo + countTraining), data[classe].length));
            } else if (selectDataFrom === 'end') {
                trainData[classe] = data[classe].slice(0, countValidation);
                testData[classe] = data[classe].slice(countValidation, data[classe].length);
            }
            console.log("  -For training " + classe + "[" + data[classe].length + "] are: " + countTraining + ", and for Validation = " + countValidation);
        }
        
        function separateTrainingAndValidationData(data) {
            console.log("\n -Percentage data for Training = " + trainingDataPercentage);
            console.log("  -Slice data from the " + selectDataFrom);
            takeElements(data, POSITIVE);
            takeElements(data, NEUTRAL);
            takeElements(data, NEGATIVE);
        }
        
        //[Public Methods]
        this.Start = function (data) {
            
            separateTrainingAndValidationData(data);

            var separatedData = {};
            separatedData["train"] = trainData;
            separatedData["test"] = testData;

            return separatedData;
        }
    }
    
    //[Export the DataSeparation System Object]
    module.exports = DataSeparation;
}());
