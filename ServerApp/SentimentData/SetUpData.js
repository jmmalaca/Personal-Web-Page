//[Setup Data]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SetupData() {
        
        //[Private Methods]
        function Processor(data) {
            //switch a word to their representative key
            //URLs to URL
            //@blabla to Usernames
            //#blabla to Hashtags
            //RT to Retweet
            //Emoticons (positive, negative, etc...) to Emoticon (Positive, etc...)
        }

        //[Public Methods]
        this.Preprocessor = function (data) {
            console.log("  -Data processing...");

            Processor(data);
            
            var tweetsDictionary = {};
            tweetsDictionary['positive'] = [];
            tweetsDictionary['neutral'] = [];
            tweetsDictionary['negative'] = [];

            data.forEach(function (tweet) {

                tweet.trim();
                var classePattern = new RegExp("^[a-z]+");
                var textPattern = new RegExp("\".+\"");
                
                var classe = classePattern.exec(tweet);
                var text = textPattern.exec(tweet);
                text = text[0].slice(1, text[0].length-1);
                //console.log(">> " + tweet);
                console.log("> classe[" + classe[0] + "], text[" + text + "]");

                if (classe[0] === "positive") {
                    tweetsDictionary['positive'].push(text);
                } else if (classe[0] === "neutral") {
                    tweetsDictionary['neutral'].push(text);
                } else if (classe[0] === "negative") {
                    tweetsDictionary['negative'].push(text);
                }
            });
            return tweetsDictionary;
        };
    }
    
    //[Export the Setup Data Object]
    module.exports = SetupData;
}());
