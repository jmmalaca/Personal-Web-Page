//[Emoticons System]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function Emoticons() {
        //[Private Data]
        
        //[Positive Emoticons]
        var patternHappy = ":\\)+|\\(+:|:>+|<+:|:-\\)|\\(-:|:\\]|=\\]|B-\\)";
        var patternLaughing = ":-D|:D|:d|8-D|x-D| xD | xd |X-D| XD |=-D|=D|=-3|=3|B\^D";
        var patternTearsHappy = ":\'-\\)|:\'\\)";
        var patternSurprise = ">:O|:-O|:O|°o°|°O°|:O|o_O|o_0|o\.O|8-0";
        var patternKiss = ":\\*|:\^\\*";
        var patternWink = ";-\\)|;\\)|\\*\-\\)|\\*\\)|;\-\]|;\]|;D|;\^\\)|:\-,\\)";
        var patternPlayful = ">:P|:-P|:P|X-P|x-p| xp | XP |:-p|:p|=p|:-Þ|:Þ|:-b|:b";
        var patternAngel = "(o|O):-\\)|0:-3|0:3|0:-\\)|0:\\)|0;\^\\)";
        var patternCheer = "\\o/";
        var patternParty = "#-\\)";
        var patternDrunk = "%-\\)|%\\)";
        var patternCool = ";-\\\\";
        var patternHighF = "o/\\o|\^5|>_>\^|\^<_<";
        
        var positivePatterns = [
            patternHappy,
            patternLaughing,
            patternTearsHappy,
            patternSurprise,
            patternKiss,
            patternWink,
            patternPlayful,
            patternAngel,
            patternCheer,
            patternParty,
            patternParty,
            patternDrunk,
            patternCool,
            patternHighF
        ];
        
        //[Negative Emoticons]
        var patternSad = "(:|=)\\(+|\\)+(:|=)|:<+|>+:|>:\\[|:-\\(|:<|:<|:-\\[|:\\[|\\]:|\\]-:|:\\{|D:<|D:|D;|D=| DX |v\\.v";
        var patternAngry = ":-\\\|:@|>:\\(";
        var patternCrying = ":\'-\\(|:\'\\(|QQ";
        var patternSkeptical = ">:\\|>:/|:-/|:-\\\.|:/|:\\|=/|=\\|:L|=L|:S|>\.<";
        var patternNoExpression = ":-\\||:\\|";
        var patternEmbaraced = ":\$";
        var patternEvil = ">:\\)|>;\\)|>:-\\)";
        var patternSick = ":-###\.\.|:###\.\.";
        var patternBored = "-O|-o";

        var negativePatterns = [
            patternSad,
            patternAngry,
            patternCrying,
            patternSkeptical,
            patternNoExpression,
            patternEmbaraced,
            patternEvil,
            patternSick,
            patternBored
        ];

        //[Private Methods]
        function replaceEmoticons(text, patterns, keyword) {
            patterns.forEach(function (pattern) {
                var patt = new RegExp(pattern);
                if (patt.test(text)) {
                    //console.log(">",text);
                    text = text.replace(patt, keyword);
                    //console.log(">",text);
                }
            });
            return text;
        }

        //[Public Methods]
        this.Replace = function (text) {
            
            text = replaceEmoticons(text, positivePatterns, "POSITIVE_EMOTICON");
            text = replaceEmoticons(text, negativePatterns, "NEGATIVE_EMOTICON");

            return text;
        }
    }
    
    //[Export the Emoticons System Object]
    module.exports = Emoticons;
}());
