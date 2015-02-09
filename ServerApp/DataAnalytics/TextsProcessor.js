//[Setup Data]
var fs = require('fs');
var async = require('async');
var Emoticons = require('../DataAnalytics/Emoticons.js');
var ProcessData = require('../ProcessingData/ProcessData.js');
var TextData = require('../DataAnalytics/TextData.js');

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
        var allDataOnProcessedTexts = [];

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

        function regexProcessor(text, textPolarity, processedTextData) {
            //javascript regex... rule: "/"{regex string}"/"{modifier code, ie "g": global modifier or "i": insensitive to lower/upper cases}
            //validate your regex: www.regex101.com ;)
            
            var count = [];
            
            //acentos e caracteres especiais em HTML
            var pattern = /\&.+;/g;
            count = text.match(pattern);
            text = text.replace(pattern, " htmlchar ");
            if (count != null) {
                count.forEach(function(value) {
                    processedTextData.AddHtmlChar(value);
                });
                addToDataInfo("Html_Chars", count.length, textPolarity);
            }

            //Uppercases
            pattern = /(?!RT)[A-Z][A-Z]+/g;
            count = text.match(pattern);
            text = text.replace(pattern, " uppercase ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddUppercase(value);
                });
                addToDataInfo("Uppercases", count.length, textPolarity);
            }

            //RT to Retweet
            pattern = /^RT /g;
            count = text.match(pattern);
            text = text.replace(pattern, "retweet ");
            if (count != null) {
                processedTextData.SetRetweet();
                addToDataInfo("Retweets", count.length, textPolarity);
            }

            //URLs to URL
            pattern = /((http|https)\:\/\/){0,1}(www\.){0,1}([a-z]|[0-9]|\_|\-)+(\~|\/|\.)[a-z]{2,}(\/([a-zA-Z]|[0-9]|_|-)+){0,}/g;
            count = text.match(pattern);
            text = text.replace(pattern, " url ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddUrl(value);
                });
                addToDataInfo("URLs", count.length, textPolarity);
            }

            //Replace emoticons (positive, negative, etc...) to emoticon (Positive, etc...) keywords
            text = emoticonsSetup.Replace(text, textPolarity, processedTextData);
            
            //Remove pontuation...
            //Mark pontuation that may express a feeling... like ! or ?...
            pattern = /[\!\?]+/g;
            count = text.match(pattern);
            text = text.replace(pattern, " pontuation ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddPontuation(value);
                });
                addToDataInfo("Pontuations", count.length, textPolarity);
            }

            //@blabla to Usernames
            pattern = /\@[a-zA-Z0-9_]+/g;
            count = text.match(pattern);
            text = text.replace(pattern, " username ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddUsername(value);
                });
                addToDataInfo("Usernames", count.length, textPolarity);
            }
            
            //#blabla to Hashtags
            pattern = /\#[a-zA-Z0-9_][a-zA-Z0-9_]+/g;
            count = text.match(pattern);
            text = text.replace(pattern, " hashtag ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddHashtag(value);
                });
                addToDataInfo("Hashtags", count.length, textPolarity);
            }

            //numbers...
            pattern = /(?![a-z])[0-9]+(?![a-z])/g;
            count = text.match(pattern);
            text = text.replace(pattern, " number ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddNumber(value);
                });
                addToDataInfo("Numbers", count.length, textPolarity);
            }

            //repetitions
            pattern = /([a-z])\1{2,}/g;
            count = text.match(pattern);
            text = text.replace(pattern, " repetition ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddRepetition(value);
                });
                addToDataInfo("Repetitions", count.length, textPolarity);
            }

            //negations
            pattern = /([a-z]+\'t|not|no|never|neither|seldom|hardly|nobody|none|nor|nothing|nowhere)/g;
            count = text.match(pattern);
            text = text.replace(pattern, " negation ");
            if (count != null) {
                count.forEach(function (value) {
                    processedTextData.AddNegation(value);
                });
                addToDataInfo("Negations", count.length, textPolarity);
            }

            //remove all others pontuation marks …
            text = text.replace(/(\\|\.|,|\"|\/|\#|\!|\$|\%|\^|\&|\;|\:|\{|\}|\=|\~|\(|\)|(?![a-z0-9])\_(?![a-z0-9]))/g, " ");
            
            //remove any [ "\r", "\n", "\t", "\f" ]
            text = text.replace(/\s+/g, " ");
            text = text.trim();
            
            return text;
        }
        
        function dataProcessor(text, textPolarity, processedTextData) {
            
            text = text.toLowerCase();

            var count = [];

            var acronyms = allDataAvailable.getAcronyms();
            acronyms.forEach(function (acronym) {
                var reg = new RegExp(" " + acronym[0].toLowerCase() + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddAcronym(value);
                    });
                    addToDataInfo("Acronyms", count.length, textPolarity);
                    text = text.replace(" " + acronym[0] + " ", " " + acronym[1] + " ");
                }
            });

            var positiveWords = allDataAvailable.getPositiveWords();
            positiveWords.forEach(function (word) {
                var reg = new RegExp(" " + word + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddPositiveWord(value);
                    });
                    addToDataInfo("Positive_Words", count.length, textPolarity);
                    text = text.replace(reg, " positive_word ");
                }
            });

            var neutralWords = allDataAvailable.getNeutralWords();
            neutralWords.forEach(function (word) {
                var reg = new RegExp(" " + word + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddNeutralWord(value);
                    });
                    addToDataInfo("Neutral_Words", count.length, textPolarity);
                    text = text.replace(" " + word.toLowerCase() + " ", " neutral_word ");
                }
            });
            
            var badwordsWords = allDataAvailable.getBadWords();
            badwordsWords.forEach(function (word) {
                var reg = new RegExp(" " + word + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddBadword(value);
                    });
                    addToDataInfo("Badwords", count.length, textPolarity);
                    text = text.replace(" " + word.toLowerCase() + " ", " badword ");
                }
            });
            
            var negativeWords = allDataAvailable.getNegativeWords();
            negativeWords.forEach(function (word) {
                var reg = new RegExp(" " + word + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddNegativeWord(value);
                    });
                    addToDataInfo("Negative_Words", count.length, textPolarity);
                    text = text.replace(" " + word.toLowerCase() + " ", " negative_word ");
                }
            });
            
            var stopwordsWords = allDataAvailable.getStopWords();
            stopwordsWords.forEach(function (word) {
                var reg = new RegExp(" " + word + " ");
                count = text.match(reg);
                if (count != null) {
                    count.forEach(function (value) {
                        processedTextData.AddStopword(value);
                    });
                    addToDataInfo("Stopwords", count.length, textPolarity);
                    text = text.replace(" " + word.toLowerCase() + " ", " stopword ");
                }
            });
            
            //remove all others pontuation marks
            text = text.replace(/(\*|\-)/g, " ");
            
            //remove any [ "\r", "\n", "\t", "\f" ]
            text = text.replace(/\s+/g, " ");
            text = text.trim();
            
            return text;
        }
        
        function processText(text, textPolarity) {
            var processedTextData = new TextData();

            text.trim();
            text = text.slice(0, text.length - 2);

            processedTextData.SetOriginalText(text);
            processedTextData.SetPriorPolarity(textPolarity);

            text = regexProcessor(text, textPolarity, processedTextData);
            
            text = text.toLowerCase();
            text = dataProcessor(text, textPolarity, processedTextData);
            
            processedTextData.SetProcessedText(text);
            allDataOnProcessedTexts.push(processedTextData);

            return text;
        }

        function textsProcessor(texts, textPolarity) {
            
            //for debug
            //var dat = texts.slice(0, 100);
            
            //usual forEach...
            texts.forEach(function (text) {
                text = processText(text, textPolarity);
                processedTexts[textPolarity].push(text);
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
        
        function addTextFeaturesData(info) {
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
            return info;
        }

        function addEmoticonsData(info) {
            var emoticons = emoticonsSetup.GetEmoticonsCounts();
            var emoticonsOnPositiveTexts = emoticons["positive"];
            var emoticonsOnNeutralTexts = emoticons["neutral"];
            var emoticonsOnNegativeTexts = emoticons["negative"];
            
            var keyData = {};
            keyData["name"] = "Emoticons_Pos";
            var total = emoticonsOnPositiveTexts["positive"] + emoticonsOnNeutralTexts["positive"] + emoticonsOnNegativeTexts["positive"];
            keyData["positive"] = (emoticonsOnPositiveTexts["positive"] * 100) / total;
            keyData["neutral"] = (emoticonsOnNeutralTexts["positive"] * 100) / total;
            keyData["negative"] = (emoticonsOnNegativeTexts["positive"] * 100) / total;
            info.push(keyData);
            keyData = {};
            total = emoticonsOnPositiveTexts["negative"] + emoticonsOnNeutralTexts["negative"] + emoticonsOnNegativeTexts["negative"];
            keyData["name"] = "Emoticons_Neg";
            keyData["positive"] = (emoticonsOnPositiveTexts["negative"] * 100) / total;
            keyData["neutral"] = (emoticonsOnNeutralTexts["negative"] * 100) / total;
            keyData["negative"] = (emoticonsOnNegativeTexts["negative"] * 100) / total;
            info.push(keyData);
            return info;
        }

        //[Public Methods]
        this.Preprocessor = function (dataReceivedFromFiles) {

            allDataAvailable = dataReceivedFromFiles;
            allDataOnProcessedTexts = [];

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
            emoticonsSetup.PrintResults();
            
            //[Debug]
            //var jsonString = JSON.stringify(allDataOnProcessedTexts);
            //fs.writeFileSync("./DataAnalytics/ProcessedTextsInfo.json", jsonString);
            
            return allDataOnProcessedTexts;
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
            info = addTextFeaturesData(info);
            info = addEmoticonsData(info);
            return info;
        }
    }
    
    //[Export the Texts Processor Object]
    module.exports = TextsProcessor;
}());
