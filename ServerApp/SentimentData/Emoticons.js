//[Emoticons System]

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function Emoticons() {
        //[Private Data]
        
        //[Positive Emoticons]
        var patternHappy = "(?<!0|>):\)+|\(+:|:>+|<+:|(?<!>|0|o|O):-\)|\(-:(?<!<)|:\]|=\]";
        var patternLaughing = ":-D|:D|:d|8-D|x-D| xD | xd |X-D| XD |=-D|=D|=-3|=3|B\^D";
        var patternTearsHappy = ":\'-\)|:\'\)";
        var patternSurprise = ">:O|:-O|:O|°o°|°O°|:O|o_O|o_0|o\.O|8-0";
        var patternKiss = ":\*|:\^\*";
        var patternWink = ";-\)|(?<!>);\)|\*\-\)|\*\)|;\-\]|;\]|;D|(?<!0);\^\)|:\-,\)";
        var patternPlayful = ">:P|:-P|:P|X-P|x-p| xp | XP |:-p|:p|=p|:-Þ|:Þ|:-b|:b";
        var patternAngel = "(o|O):-\)|0:-3|0:3|0:-\)|0:\)|0;\^\)";
        var patternCheer = "\\o/";
        var patternParty = "#-\)";
        var patternDrunk = "%-\)|%\)";
        var patternCool = ";-\\";
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
        var patternSad = "(?<!>)(:|=)\(+|\)+(:|=)|(?<!-|>):<+|>+:(?!-|\)|\(|<|/|\\|\[)|>:\[|:-\(|:-c|:c|:<|:っC|:<|:-\[|:\[|\]:|\]-:|:\{|D:<|D:|D;|D=| DX |v\.v";
        var patternAngry = ":-\\(?!\.)|:@|>:\(";
        var patternCrying = ":\'-\(|:\'\(|QQ";
        var patternSkeptical = ">:\\|>:/|:-/|:-\\\.|(?<!http|>):/|(?<!>):\\|=/|=\\|:L|=L|:S|>\.<";
        var patternNoExpression = ":-\||:\|";
        var patternEmbaraced = ":\$";
        var patternEvil = ">:\)|>;\)|>:-\)";
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
                text = text.replace(patt, keyword);
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
