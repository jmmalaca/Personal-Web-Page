//[Setup Data]
var Emoticons = require('../SentimentData/Emoticons.js');
var async = require('async');
var processData = require('../ProcessingData/ProcessData.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function SetupData() {
        
        //[Private Data]
        var tweetsDictionary = {};
        tweetsDictionary['positive'] = [];
        tweetsDictionary['neutral'] = [];
        tweetsDictionary['negative'] = [];
        
        //[Private Methods]
        function processor(text) {
            
            //javascript regex... rule: "/"{regex string}"/"{modifier code, ie "g": global modifier or "i": insensitive to lower/upper cases}
            //validate your regex: www.regex101.com ;)

            //URLs to URL
            text = text.replace(/(((http|https)\:\/\/)|www\.|)(\w|\d|\_|\-)+(\~|\/|\.)\w{2,}(\/(\w|\d|\_|\-)+){0,}/gi, " URL ");
            
            //Uppercases
            text = text.replace(/(?![a-z]+)([A-Z][A-Z]+)(?![a-z]+)/g, " UPPERCASE ");

            //Replace emoticons (positive, negative, etc...) to emoticon (Positive, etc...) keywords
            var emoticonsSetup = new Emoticons();
            text = emoticonsSetup.Replace(text);
            
            //Remove pontuation...
            //Mark pontuation that may express a feeling... like ! or ?...
            text = text.replace(/[\!\?]+/g, " PONTUATION ");
            //remove all others pontuation marks... …
            //text = text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_~()]/g, " ");
            
            //numbers...
            text = text.replace(/[0-9]+/g, "NUMBER");

            //@blabla to Usernames
            text = text.replace(/@[a-zA-Z0-9\\_][a-zA-Z0-9\\_]+/g, "USERNAME");
            //#blabla to Hashtags
            text = text.replace(/#[a-zA-Z0-9_][a-zA-Z0-9_]+/g, "HASHTAG");
            //RT to Retweet
            text = text.replace(/^[Rr][Tt]/g, "RETWEET");
            
            //remove some blank extra spaces...
            text = text.replace(/ +/g, " ");
            text = text.trim();
            
            return text;
        }

        function processTweet(tweet) {
            tweet.trim();
            var classePattern = new RegExp("^[a-z]+");
            var textPattern = new RegExp("\".+\"");
            var classe = classePattern.exec(tweet);
            var text = textPattern.exec(tweet);
            text = text[0].slice(1, text[0].length - 1);
            //text = processor(text);
            //console.log(">> " + tweet);
            //console.log("> classe[" + classe[0] + "], text[" + text + "]");
            
            if (classe[0] === "positive") {
                tweetsDictionary['positive'].push(text);
            } else if (classe[0] === "neutral") {
                tweetsDictionary['neutral'].push(text);
            } else if (classe[0] === "negative") {
                tweetsDictionary['negative'].push(text);
            }
        }

        //[Public Methods]
        this.Preprocessor = function (data) {
            console.log("  -Data processing...");

            processData.StartTime();
            
            //usual forEach... TOOooo looooong...
            //data.forEach(function(tweet) {
            //    processTweet(tweet);
            //});
            
            //async forEach... +/- 6 minutes
            //async.forEach(data, function(tweet) {
            //    processTweet(tweet);
            //});

            //parallel forEach... http://justinklemm.com/node-js-async-tutorial/
            //Array to hold async tasks
            var asyncTasks = [];
            //Loop through some items
            data.forEach(function (tweet) {
                //We don't actually execute the async action here
                //We add a function containing it to an array of "tasks"
                asyncTasks.push(function (callback) {
                    //Call an async function, often a save() to DB
                    processTweet(tweet);
                    //Async call is done, alert via callback
                    callback();
                });
            });
            processData.ShowTimeCount(start, "Added all AsyncTasks");// +/- 0.005 seconds

            processData.StartTime();
            // Now we have an array of functions doing async tasks
            // Execute all async tasks in the asyncTasks array
            async.parallel(asyncTasks, function () {
                //All tasks are done now
                processData.ShowTimeCount(start, "All Taks Done."); // +/- 6 minutes
            });

            return tweetsDictionary;
        };
    }
    
    //[Export the Setup Data Object]
    module.exports = SetupData;
}());
