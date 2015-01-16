//[Setup Data]
var Emoticons = require('../SentimentData/Emoticons.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SetupData() {
        
        //[Private Methods]
        function processor(text) {
            //remove some blank extra spaces
            var patt = new RegExp(" +");
            text = text.replace(patt, " ");

            //replaces to Twitter Keywords
            //URLs to URL
            patt = new RegExp("((http|HTTP)://([a-zA-Z]|[0-9]|\\~|/|\\.)+|www\\.([a-zA-Z]|[0-9]|\\~|/|\\.)+)");
            text = text.replace(patt, "URL");
            //@blabla to Usernames
            patt = new RegExp("@[a-zA-Z0-9_][a-zA-Z0-9_]+");
            text = text.replace(patt, "USERNAME");
            //#blabla to Hashtags
            patt = new RegExp("#[a-zA-Z0-9_][a-zA-Z0-9_]+");
            text = text.replace(patt, "HASHTAG");
            //RT to Retweet
            patt = new RegExp("^[Rr][Tt]");
            text = text.replace(patt, "RETWEET");
            //Emoticons (positive, negative, etc...) to Emoticon (Positive, etc...)
            var emoticonsPlayer = new Emoticons();
            text = emoticonsPlayer.Replace(text);
            
            return text;
        }

        //[Public Methods]
        this.Preprocessor = function (data) {
            console.log("  -Data processing...");

            var tweetsDictionary = {};
            tweetsDictionary['positive'] = [];
            tweetsDictionary['neutral'] = [];
            tweetsDictionary['negative'] = [];

            data.forEach(function(tweet) {

                tweet.trim();
                var classePattern = new RegExp("^[a-z]+");
                var textPattern = new RegExp("\".+\"");
                var classe = classePattern.exec(tweet);
                var text = textPattern.exec(tweet);
                text = text[0].slice(1, text[0].length - 1);
                text = processor(text);
                //console.log(">> " + tweet);
                //console.log("> classe[" + classe[0] + "], text[" + text + "]");

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
