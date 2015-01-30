//[Data Separation System: Training Data and Validation(Test) Data]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function DataSeparation() {
        
        //[Private data]
        var trainingDataPercentage = 70;
        
        //select data from the [beginning], from the [middle] or from the [end] of the array
        var selectDataFrom = 'beginning';
        
        //subjectivity...
        var subjectivityTrainData = {};
        subjectivityTrainData["subjective"] = [];
        subjectivityTrainData["objective"] = [];
        var subjectivityTestData = {};
        subjectivityTestData["subjective"] = [];
        subjectivityTestData["objective"] = [];

        //polarity...
        var trainData = {};
        trainData["positive"] = [];
        trainData["neutral"] = [];
        trainData["negative"] = [];
        var testData = {};
        testData["positive"] = [];
        testData["neutral"] = [];
        testData["negative"] = [];

        //[Private Methods]
        function takePolarityElements(data, classe) {
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
        }
        
        function separateTrainingAndValidationData(problem, data) {
            console.log("\n -Percentage data for Training = " + trainingDataPercentage);
            console.log("  -Slice data from the " + selectDataFrom);
            takePolarityElements(data, "positive");
            takePolarityElements(data, "neutral");
            takePolarityElements(data, "negative");
            
            if (problem === "subjectivity") {
                //Array.prototype.push.apply(a, b); copy all elements from uma array to the other...
                
                Array.prototype.push.apply(subjectivityTrainData["subjective"], trainData["positive"]);
                Array.prototype.push.apply(subjectivityTrainData["objective"], trainData["neutral"]);
                Array.prototype.push.apply(subjectivityTrainData["subjective"], trainData["negative"]);
                
                Array.prototype.push.apply(subjectivityTestData["subjective"], testData["positive"]);
                Array.prototype.push.apply(subjectivityTestData["objective"], testData["neutral"]);
                Array.prototype.push.apply(subjectivityTestData["subjective"], testData["negative"]);
                
                trainData = {};
                trainData = subjectivityTrainData;
                testData = {};
                testData = subjectivityTestData;
            }
        }
        
        //[Public Methods]
        this.Start = function (data, fromWhere, problem) {
            
            selectDataFrom = fromWhere;

            separateTrainingAndValidationData(problem, data);
            
            var separatedData = {};
            separatedData["train"] = trainData;
            separatedData["test"] = testData;

            Object.keys(trainData).forEach(function(key) {
                console.log("  -Train Data[ " + key +" ]: " + trainData[key].length);
            });
            Object.keys(testData).forEach(function (key) {
                console.log("  -Test Data[ " + key + " ]: " + testData[key].length);
            });

            return separatedData;
        }
    }
    
    //[Export the DataSeparation System Object]
    module.exports = DataSeparation;
}());
