//[Processing Data Measures System]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function ProcessData() {
        //[Private Data]
        var start = 0; //javascript Date Object
        var startHR = 0; //nodejs high-resolution real time [seconds, nanoseconds] array

        //[Private Methods]
        function showData() {
            var end = new Date().getTime();
            var endHR = process.hrtime(hrstart); //[seconds, milliseconds = nanoseconds/1000000]

            var time = end - startTime; //in miliseconds, seconds = 0.001 * time
            var seconds = 0.001 * time;
            if (seconds > 60) {
                var minutes = seconds / 60;
                console.log("   -" + text + ", execution time: " + minutes + " minutes");
            } else {
                console.log("   -" + text + ", execution time: " + seconds + " seconds");
            }
            console.info("   -" + text + ", execution time (hr): " + endHR[0] + "s " + (endHR[1] / 1000000) + "ms");
        }

        //[Public Methods]
        this.StartTime = function () {
            start = new Date().getTime();
            startHR = process.hrtime();
        }

        this.ShowTimeCount = function(startTime, text) {
            showData(startTime, text);
        }
    }
    
    //[Export the ProcessData System Object]
    module.exports = ProcessData;
}());
