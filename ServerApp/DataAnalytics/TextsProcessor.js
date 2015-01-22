//[Setup Data]
var Emoticons = require('../DataAnalytics/Emoticons.js');
var async = require('async');
var ProcessData = require('../ProcessingData/ProcessData.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function TextsProcessor() {
        
        //[Private Data]
        var processedTexts = {};
        processedTexts['positive'] = [];
        processedTexts['neutral'] = [];
        processedTexts['negative'] = [];
        
        //[Private Methods]
        function regexProcessor(text) {
            //javascript regex... rule: "/"{regex string}"/"{modifier code, ie "g": global modifier or "i": insensitive to lower/upper cases}
            //validate your regex: www.regex101.com ;)

            //Uppercases
            text = text.replace(/(!?^RT)[A-Z][A-Z]+/g, " uppercase ");
            
            //URLs to URL
            text = text.replace(/((http|https)\:\/\/){0,1}(www\.){0,1}([a-z]|[0-9]|\_|\-)+(\~|\/|\.)[a-z]{2,}(\/([a-zA-Z]|[0-9]|_|-)+){0,}/g, " url ");
            
            //RT to Retweet
            text = text.replace(/^RT /g, "retweet ");

            //Replace emoticons (positive, negative, etc...) to emoticon (Positive, etc...) keywords
            var emoticonsSetup = new Emoticons();
            text = emoticonsSetup.Replace(text);
            
            //Remove pontuation...
            //Mark pontuation that may express a feeling... like ! or ?...
            text = text.replace(/[\!\?]+/g, " pontuation ");
            
            //@blabla to Usernames
            text = text.replace(/\@[a-zA-Z0-9_]+/g, " username ");
            
            //#blabla to Hashtags
            text = text.replace(/\#[a-zA-Z0-9_][a-zA-Z0-9_]+/g, " hashtag ");
            
            //numbers...
            text = text.replace(/(?![a-z])[0-9]+(?![a-z])/g, " number ");
            
            //acentos e caracteres especiais em HTML
            text = text.replace(/\&.+;/g, " htmlchar ");
            
            //repetitions...
            text = text.replace(/([a-z])\1{2,}/g, " repetition ");
            
            //negations
            text = text.replace(/([a-z]+\'t|not|no|never|neither|seldom|hardly|nobody|none|nor|nothing|nowhere)/g," negation ");

            //remove all others pontuation marks... …
            text = text.replace(/(\\|\.|,|\"|\/|\#|\!|\$|\%|\^|\&|\*|\;|\:|\{|\}|\=|\-|\~|\(|\)|(?![a-z0-9])\_(?![a-z0-9]))/g, " ");
            
            //remove any [ "\r", "\n", "\t", "\f" ]...
            text = text.replace(/\s+/g, " ");
            text = text.trim();
            
            return text;
        }
        
        function dataProcessor(text, allDataAvailable) {

            var acronyms = allDataAvailable.getAcronyms();
            acronyms.forEach(function (acronym) {
                text = text.replace(" " + acronym[0] + " ", " " + acronym[1] + " ");
            });

            var positiveWords = allDataAvailable.getPositiveWords();
            positiveWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " positive_word ");
            });
            
            var neutralWords = allDataAvailable.getNeutralWords();
            neutralWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " neutral_word ");
            });
            
            var negativeWords = allDataAvailable.getNegativeWords();
            negativeWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " negative_word ");
            });

            var stopwordsWords = allDataAvailable.getStopWords();
            stopwordsWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " stopword ");
            });

            var badwordsWords = allDataAvailable.getBadWords();
            badwordsWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " badword ");
            });

            //remove some blank extra spaces...
            text = text.replace(/\s+/g, " ");
            text = text.trim();

            return text;
        }

        function processTweet(text, allDataAvailable, textPolarity) {
            
            text.trim();
            text = text.slice(0, text.length - 2);
            text = regexProcessor(text);
            text = text.toLowerCase();
            text = dataProcessor(text, allDataAvailable);
            processedTexts[textPolarity].push(text);
        }
        
        function textsProcessor(texts, allDataAvailable, textPolarity) {
            
            //usual forEach...
            var dat = texts.slice(0, 100);
            dat.forEach(function (text) {
                processTweet(text, allDataAvailable, textPolarity);
            });
            
            //async forEach...
            //async.forEach(texts, function(text) {
            //    processTweet(text, allDataAvailable, textPolarity);
            //});

            ////parallel forEach... http://justinklemm.com/node-js-async-tutorial/
            ////Array to hold async tasks
            //var asyncTasks = [];
            ////Loop through some items
            //data.forEach(function (tweet) {
            //    //We don't actually execute the async action here
            //    //We add a function containing it to an array of "tasks"
            //    asyncTasks.push(function (callback) {
            //        //Call an async function, often a save() to DB
            //        processTweet(tweet);
            //        //Async call is done, alert via callback
            //        callback();
            //    });
            //});
            //measures.ShowTimeCount("Added all AsyncTasks");// +/- 0.005 seconds

            //measures.StartTime();
            //// Now we have an array of functions doing async tasks
            //// Execute all async tasks in the asyncTasks array
            //async.parallel(asyncTasks, function () {
            //    //All tasks are done now
            //    measures.ShowTimeCount("All Taks Done."); // +/- ? minutes
            //});
        }

        //[Public Methods]
        this.Preprocessor = function (allDataAvailable) {
            console.log("\n -Process: ");
            var measures = new ProcessData();
            measures.StartTime();
            
            var data = allDataAvailable.getPositiveTweets();
            var countTexts = data.length;
            var type = "positive";
            console.log("  -"+ type +" texts[" + data.length + "]...");
            textsProcessor(data, allDataAvailable, type);

            data = allDataAvailable.getNeutralTweets();
            countTexts = countTexts + data.length;
            type = "neutral";
            console.log("  -" + type + " texts[" + data.length + "]...");
            textsProcessor(data, allDataAvailable, type);
            
            data = allDataAvailable.getNegativeTweets();
            countTexts = countTexts + data.length;
            type = "negative";
            console.log("  -" + type + " texts[" + data.length + "]...");
            textsProcessor(data, allDataAvailable, type);
            
            measures.ShowTimeCount(countTexts, "All " + countTexts + " texts Done.");

            return processedTexts;
        };
    }
    
    //[Export the Texts Processor Object]
    module.exports = TextsProcessor;
}());
