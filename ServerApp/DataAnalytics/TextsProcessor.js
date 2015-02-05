//[Setup Data]
var async = require('async');
var Emoticons = require('../DataAnalytics/Emoticons.js');
var ProcessData = require('../ProcessingData/ProcessData.js');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function TextsProcessor() {
        
        //[Private Data]
        var emoticonsSetup = new Emoticons();
        
        var processedTexts = {};
        processedTexts['positive'] = [];
        processedTexts['neutral'] = [];
        processedTexts['negative'] = [];

        var allDataAvailable = {};
        
        //[Counters]
        var countersInfoPositive = {"Acronyms": 0, "Stopwords": 0, "Retweets": 0, "Usernames": 0, "Negations": 0, "Positive_Words": 0, "Neutral_Words": 0, "Negative_Words": 0, "Pontuations": 0, "Hashtags": 0, "Repetitions": 0, "Numbers": 0, "Html_Chars": 0, "URLs": 0, "Badwords": 0, "Uppercases": 0};
        var countersInfoNeutral = { "Acronyms": 0, "Stopwords": 0, "Retweets": 0, "Usernames": 0, "Negations": 0, "Positive_Words": 0, "Neutral_Words": 0, "Negative_Words": 0, "Pontuations": 0, "Hashtags": 0, "Repetitions": 0, "Numbers": 0, "Html_Chars": 0, "URLs": 0, "Badwords": 0, "Uppercases": 0};
        var countersInfoNegative = { "Acronyms": 0, "Stopwords": 0, "Retweets": 0, "Usernames": 0, "Negations": 0, "Positive_Words": 0, "Neutral_Words": 0, "Negative_Words": 0, "Pontuations": 0, "Hashtags": 0, "Repetitions": 0, "Numbers": 0, "Html_Chars": 0, "URLs": 0, "Badwords": 0, "Uppercases": 0};
        
        //[Private Methods]
        function addToDataInfo(key, value, textPolarity){
            if (textPolarity === "positive") {
                countersInfoPositive[key] = countersInfoPositive[key] + value;
            } else if (textPolarity === "neutral") {
                countersInfoNeutral[key] = countersInfoNeutral[key] + value;
            } else if (textPolarity === "negative") {
                countersInfoNegative[key] = countersInfoNegative[key] + value;
            }
        }

        function regexProcessor(text, textPolarity) {
            //javascript regex... rule: "/"{regex string}"/"{modifier code, ie "g": global modifier or "i": insensitive to lower/upper cases}
            //validate your regex: www.regex101.com ;)
            
            var count = [];

            //Uppercases
            text = text.replace(/(!?^RT)[A-Z][A-Z]+/g, " uppercase ");
            count = text.match(/uppercase/g);
            if (count != null) {
                addToDataInfo("Uppercases", count.length, textPolarity);
            }

            //URLs to URL
            text = text.replace(/((http|https)\:\/\/){0,1}(www\.){0,1}([a-z]|[0-9]|\_|\-)+(\~|\/|\.)[a-z]{2,}(\/([a-zA-Z]|[0-9]|_|-)+){0,}/g, " url ");
            count = text.match(/url/g);
            if (count != null) {
                addToDataInfo("URLs", count.length, textPolarity);
            }

            //RT to Retweet
            text = text.replace(/^RT /g, "retweet ");
            count = text.match(/retweet/g);
            if (count != null) {
                addToDataInfo("Retweets", count.length, textPolarity);
            }

            //Replace emoticons (positive, negative, etc...) to emoticon (Positive, etc...) keywords
            text = emoticonsSetup.Replace(text, textPolarity);
            
            //Remove pontuation...
            //Mark pontuation that may express a feeling... like ! or ?...
            text = text.replace(/[\!\?]+/g, " pontuation ");
            count = text.match(/pontuation/g);
            if (count != null) {
                addToDataInfo("Pontuations", count.length, textPolarity);
            }

            //@blabla to Usernames
            text = text.replace(/\@[a-zA-Z0-9_]+/g, " username ");
            count = text.match(/username/g);
            if (count != null) {
                addToDataInfo("Usernames", count.length, textPolarity);
            }

            //#blabla to Hashtags
            text = text.replace(/\#[a-zA-Z0-9_][a-zA-Z0-9_]+/g, " hashtag ");
            count = text.match(/hashtag/g);
            if (count != null) {
                addToDataInfo("Hashtags", count.length, textPolarity);
            }

            //numbers...
            text = text.replace(/(?![a-z])[0-9]+(?![a-z])/g, " number ");
            count = text.match(/number/g);
            if (count != null) {
                addToDataInfo("Numbers", count.length, textPolarity);
            }

            //acentos e caracteres especiais em HTML
            text = text.replace(/\&.+;/g, " htmlchar ");
            count = text.match(/htmlchar/g);
            if (count != null) {
                addToDataInfo("Html_Chars", count.length, textPolarity);
            }

            //repetitions...
            text = text.replace(/([a-z])\1{2,}/g, " repetition ");
            count = text.match(/repetition/g);
            if (count != null) {
                addToDataInfo("Repetitions", count.length, textPolarity);
            }

            //negations
            text = text.replace(/([a-z]+\'t|not|no|never|neither|seldom|hardly|nobody|none|nor|nothing|nowhere)/g, " negation ");
            count = text.match(/negation/g);
            if (count != null) {
                addToDataInfo("Negations", count.length, textPolarity);
            }

            //remove all others pontuation marks... …
            text = text.replace(/(\\|\.|,|\"|\/|\#|\!|\$|\%|\^|\&|\*|\;|\:|\{|\}|\=|\-|\~|\(|\)|(?![a-z0-9])\_(?![a-z0-9]))/g, " ");
            
            //remove any [ "\r", "\n", "\t", "\f" ]...
            text = text.replace(/\s+/g, " ");
            text = text.trim();
            
            return text;
        }
        
        function dataProcessor(text, textPolarity) {

            var count = [];

            var acronyms = allDataAvailable.getAcronyms();
            acronyms.forEach(function (acronym) {
                var reg = new RegExp(acronym[0]);
                count = text.match(reg);
                if (count != null) {
                    addToDataInfo("Acronyms", count.length, textPolarity);
                }
                text = text.replace(" " + acronym[0] + " ", " " + acronym[1] + " ");
            });

            var positiveWords = allDataAvailable.getPositiveWords();
            positiveWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " positive_word ");
            });
            count = text.match(/positive_word/g);
            if (count != null) {
                addToDataInfo("Positive_Words", count.length, textPolarity);
            }

            var neutralWords = allDataAvailable.getNeutralWords();
            neutralWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " neutral_word ");
            });
            count = text.match(/neutral_word/g);
            if (count != null) {
                addToDataInfo("Neutral_Words", count.length, textPolarity);
            }
            
            var badwordsWords = allDataAvailable.getBadWords();
            badwordsWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " badword ");
            });
            count = text.match(/badword/g);
            if (count != null) {
                addToDataInfo("Badwords", count.length, textPolarity);
            }

            var negativeWords = allDataAvailable.getNegativeWords();
            negativeWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " negative_word ");
            });
            count = text.match(/negative_word/g);
            if (count != null) {
                addToDataInfo("Negative_Words", count.length, textPolarity);
            }

            var stopwordsWords = allDataAvailable.getStopWords();
            stopwordsWords.forEach(function (word) {
                text = text.replace(" " + word + " ", " stopword ");
            });
            count = text.match(/stopword/g);
            if (count != null) {
                addToDataInfo("Stopwords", count.length, textPolarity);
            }

            //remove some blank extra spaces...
            text = text.replace(/\s+/g, " ");
            text = text.trim();

            return text;
        }
        
        function processText(text, textPolarity) {
            text.trim();
            text = text.slice(0, text.length - 2);
            text = regexProcessor(text, textPolarity);
            text = text.toLowerCase();
            text = dataProcessor(text, textPolarity);
            return text;
        }

        function processTweet(text, textPolarity) {
            text = processText(text, textPolarity);
            processedTexts[textPolarity].push(text);
        }

        function textsProcessor(texts, textPolarity) {
            
            //for debug
            //var dat = texts.slice(0, 100);
            
            //usual forEach...
            texts.forEach(function (text) {
                processTweet(text, textPolarity);
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
        
        function printResults() {
            console.log("\n -Process Results: [Positive] [Neutral] [Negative]");
            Object.keys(countersInfoPositive).forEach(function(key) {
                console.log("  -" + key +":  ["+ countersInfoPositive[key] +"] ["+ countersInfoNeutral[key] +"] ["+ countersInfoNegative[key] +"] ");
            });
        }

        //[Public Methods]
        this.Preprocessor = function (dataReveivedFromFiles) {

            allDataAvailable = dataReveivedFromFiles;

            console.log("\n -Process: ");
            var measures = new ProcessData();
            measures.StartTime();
            
            var data = allDataAvailable.getPositiveTweets();
            var countTexts = data.length;
            var type = "positive";
            console.log("  -"+ type +" texts[" + data.length + "]...");
            textsProcessor(data, type);

            data = allDataAvailable.getNeutralTweets();
            countTexts = countTexts + data.length;
            type = "neutral";
            console.log("  -" + type + " texts[" + data.length + "]...");
            textsProcessor(data, type);
            
            data = allDataAvailable.getNegativeTweets();
            countTexts = countTexts + data.length;
            type = "negative";
            console.log("  -" + type + " texts[" + data.length + "]...");
            textsProcessor(data, type);
            
            measures.ShowTimeCount(countTexts, "All " + countTexts + " texts Done.");

            printResults();

            return processedTexts;
        };
        
        this.IndependentStringProcessor = function (string) {
            return processText(string);
        }

        this.GetProcessDataResults = function () {
            var info = [];
            
            /*Data to send example:
             * var info = [
                {"name":"Acronyms","positive":0,"neutral":0,"negative":0},
                {"name":"Stopwords","positive":0,"neutral":0,"negative":0},
                {"name":"Retweets","positive":0,"neutral":0,"negative":0},
                {"name":"Usernames","positive":0,"neutral":0,"negative":0},
                ......
             */

            Object.keys(countersInfoPositive).forEach(function (key) {
                var total = countersInfoPositive[key] + countersInfoNeutral[key] + countersInfoNegative[key];

                var valuePositive = (countersInfoPositive[key] * 100) / total;
                var valueNeutral = (countersInfoNeutral[key] * 100) / total;
                var valueNegative = (countersInfoNegative[key] * 100) / total;

                var keyData = {};
                keyData["name"] = key;
                keyData["positive"] = valuePositive;
                keyData["neutral"] = valueNeutral;
                keyData["negative"] = valueNegative;
                info.push(keyData);
            });
            
            var emoticonsResults = emoticonsSetup.GetEmoticonsCounts();

            return info;
        }
    }
    
    //[Export the Texts Processor Object]
    module.exports = TextsProcessor;
}());
