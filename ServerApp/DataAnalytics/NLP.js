//[Natural Language Processing ( ReText: https://github.com/wooorm/retext ) System]
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var pos = require('retext-pos');

(function () {
    
    "use strict";
    //[Define your library strictly]
    
    function NLP() {
        //[Private Data]
        var retext = new Retext()
            .use(visit)
            .use(inspect)
            .use(pos);

        //[Private Methods]
        function process(text, processedTextData) {
            
            retext.parse(
                text,
                function(err, tree) {
                    tree.visit(tree.WORD_NODE, function(wordNode) {
                        var data = wordNode.data;
                        var partOfSpeechTag = data['partOfSpeech'];
                        //console.log(partOfSpeechTag);
                        if (partOfSpeechTag === "JJ" || partOfSpeechTag === "JJR" || partOfSpeechTag === "JJS") {
                            processedTextData.AddAdjective(partOfSpeechTag);
                        }else if (partOfSpeechTag === "NN" || partOfSpeechTag === "NNP" || partOfSpeechTag === "NNPS" || partOfSpeechTag === "NNS") {
                            processedTextData.AddNoun(partOfSpeechTag);
                        } else if (partOfSpeechTag === "VB" || partOfSpeechTag === "VBD" || partOfSpeechTag === "VBG" || partOfSpeechTag === "VBN") {
                            processedTextData.AddVerb(partOfSpeechTag);
                        } else if (partOfSpeechTag === "RB" || partOfSpeechTag === "RBR" || partOfSpeechTag === "RBS") {
                            processedTextData.AddAdverb(partOfSpeechTag);
                        }
                    });
                }
            );
        }

        //[Public Methods]
        this.ProcessText = function(text, processedTextData) {
            process(text, processedTextData);
        }
    }

    //[Export the Emoticons System Object]
    module.exports = NLP;
}());


/*
 * Thanks to Mark Watson for writing FastTag, which served as the basis for jspos.
 * https://github.com/dariusk/pos-js
    TAGS:
    
    CC Coord Conjuncn           and,but,or
    CD Cardinal number          one,two
    DT Determiner               the,some
    EX Existential there        there
    FW Foreign Word             mon dieu
    IN Preposition              of,in,by
    JJ Adjective                big
    JJR Adj., comparative       bigger
    JJS Adj., superlative       biggest
    LS List item marker         1,One
    MD Modal                    can,should
    NN Noun, sing. or mass      dog
    NNP Proper noun, sing.      Edinburgh
    NNPS Proper noun, plural    Smiths
    NNS Noun, plural            dogs
    POS Possessive ending       Õs
    PDT Predeterminer           all, both
    PP$ Possessive pronoun      my,oneÕs
    PRP Personal pronoun         I,you,she
    RB Adverb                   quickly
    RBR Adverb, comparative     faster
    RBS Adverb, superlative     fastest
    RP Particle                 up,off
    SYM Symbol                  +,%,&
    TO ÒtoÓ                     to
    UH Interjection             oh, oops
    VB verb, base form          eat
    VBD verb, past tense        ate
    VBG verb, gerund            eating
    VBN verb, past part         eaten
    VBP Verb, present           eat
    VBZ Verb, present           eats
    WDT Wh-determiner           which,that
    WP Wh pronoun               who,what
    WP$ Possessive-Wh           whose
    WRB Wh-adverb               how,where
    , Comma                     ,
    . Sent-final punct          . ! ?
    : Mid-sent punct.           : ; Ñ
    $ Dollar sign               $
    # Pound sign                #
    " quote                     "
    ( Left paren                (
    ) Right paren               )
 */