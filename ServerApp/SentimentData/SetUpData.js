//Setup Data...

(function () {
    
    "use strict";
    // Define your library strictly...
    
    function SetupData() {
        
        //Private Methods
        function Processor(data) {
            //switch a word to their representative key
            //URLs to URL
            //@blabla to Usernames
            //#blabla to Hashtags
            //RT to Retweet
            //Emoticons (positive, negative, etc...) to Emoticon (Positive, etc...)
        }

        //Public Methods
        this.Preprocessor = function (data) {
            console.log("Setup Data");

            Processor(data);
            
            var tweetsDictionary = {};
            tweetsDictionary['positive'] = [];
            tweetsDictionary['neutral'] = [];
            tweetsDictionary['negative'] = [];

            data.forEach(function (tweet) {
                var tweetsData = tweet.split(",\"");
                
                var classe = tweetsData[0];
                var text = tweetsData[1];
                
                if (classe === "positive") {
                    tweetsDictionary['positive'].push(text);
                } else if (classe === "neutral") {
                    tweetsDictionary['neutral'].push(text);
                } else if (classe === "negative") {
                    tweetsDictionary['negative'].push(text);
                }
            });
            
            console.log("There is Positive[" + tweetsDictionary['positive'].length + "], Neutral[" + tweetsDictionary['neutral'].length + "], Negative[" + tweetsDictionary['negative'].length + "] tweets.");
            return tweetsDictionary;
        };
    }
    
    //Export the class
    module.exports = SetupData;
}());
