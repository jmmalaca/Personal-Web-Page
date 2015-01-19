//[Setup Data]
var Emoticons = require('../SentimentData/Emoticons.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SetupData() {
        
        //[Private Methods]
        function processor(text) {
            
            //URLs to URL
            patt = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
            text = text.replace(patt, "URL");

            //Replace emoticons (positive, negative, etc...) to emoticon (Positive, etc...) keywords
            var emoticonsPlayer = new Emoticons();
            text = emoticonsPlayer.Replace(text);
            
            //Remove pontuation...
            //Mark pontuation that may express a feeling... like ! or ?...
            var patt = new RegExp(/[\!\?]+/g);
            text = text.replace(patt, " PONTUATION ");
            //remove all others pontuation marks... …
            //text = text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_~()]/g, " ");
            
            //@blabla to Usernames
            patt = new RegExp(/@[a-zA-Z0-9\\_][a-zA-Z0-9\\_]+/g);
            text = text.replace(patt, "USERNAME");
            //#blabla to Hashtags
            patt = new RegExp(/#[a-zA-Z0-9_][a-zA-Z0-9_]+/g);
            text = text.replace(patt, "HASHTAG");
            //RT to Retweet
            patt = new RegExp(/^[Rr][Tt]/g);
            text = text.replace(patt, "RETWEET");
            
            //remove some blank extra spaces...
            text = text.replace(/ +/g, " ");
            text = text.trim();
            
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
