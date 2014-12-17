//Show Console ---------
function AddConsoleBox() {
    $("#Prompt-Page").append("<div id=\"Console-Box\"></div>");
}

//Start Prompt...
function StartPrompt(id) {
    //Start, Animated Text---
    var anim = false;
    var delay = 100;
    function typed(finishTyping) {
        return function (term, message, finish) {
            anim = true;
            var prompt = term.get_prompt();
            var c = 0;
            if (message.length > 0) {
                term.set_prompt('');
                var interval = setInterval(function () {
                    term.insert(message[c++]);
                    if (c == message.length) {
                        clearInterval(interval);
                        // execute in next interval
                        setTimeout(function () {
                            // swap command with prompt
                            finishTyping(term, message, prompt);
                            anim = false;
                            //finish && finish();
                        }, delay);
                    }
                }, delay);
            }
        };
    }
    var typedMessage = typed(function (term, message, prompt) {
        term.set_command('');
        term.echo(message);
        term.set_prompt(prompt);
    });
    //end---

    //Prompt Init...
    $(id).terminal(function (command, term) {
        firstCommands(term, command);
    }, {
        name: 'Prompt',
        history: true,
        historySize: 10,
        greetings: null,
        onInit: function(term) {
            var msg = ">Welcome..." +
            "\n just type \"help\" for a quick start...\n>";
            typedMessage(term, msg, 100);
        }
    });
    //end----
}

//document ready event ----------
$(document).ready(function() {

    AddConsoleBox();

});