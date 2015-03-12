var links = [
    "../CurriculumVitae/cv_JoseMMalaca.pdf",
    "https://twitter.com/tOOnPT",
    "https://www.facebook.com/cartOOnPT",
    "http://instagram.com/josemiguelmalaca",
    "https://github.com/tOOnPT",
    "https://plus.google.com/u/0/108123132092292147984/posts",
    "http://lnkd.in/D3YEs4",
    "http://www.codecademy.com/pt/jose.miguel.malaca",
    "https://coderbits.com/cartoon",
    "http://tecknologicus.blogspot.pt",
    "http://www.youtube.com/user/tOOnPT",
    "https://codebits.eu/cartOOn",
    "http://lxmls.it.pt/2014/",
    "http://rawopendata.ipn.pt"
];

//Start, Prompt commands...
function firstCommands(terminal, command) {
    if (command.match("^who$")) {
        terminal.echo("> José Miguel was born and educated in the city that hosts one of the oldest universities of the world, [[b;#ffffff;#000000]Coimbra] (Portugal).");
        terminal.echo("> Finished in 2014 his [[b;#ffffff;#000000]Masters] at University of Coimbra, [[b;#ffffff;#000000]Informatics Engineering], with focus on Sentiment Analysis on Microblogging.");
        terminal.echo("> A [[b;#ffffff;#000000]Full Stack Engineer] ready for new challenges, always learning, growing, and enjoying his life.");

    } else if (command.match("^education$")) {
        terminal.echo(">Faculty of Science and Technology, University of Coimbra, Portugal");
        terminal.echo(" [[b;#009900;#000000]☑] [[b;#ffffff;#000000]Masters] in Informatics Engineering (Mestrado em Engenharia Informática)");
        terminal.echo(" [[b;#009900;#000000]☑] Informatics Engineering [[b;#ffffff;#000000]Graduate] (Licenciatura em Engenharia Informática)");
        terminal.echo(">High School Avelar Brotero, Coimbra, Portugal");
        terminal.echo(" [[b;#009900;#000000]☑] Informatics [[b;#ffffff;#000000]Technician] (Técnico Informático)");

    } else if (command.match("^carrer$")) {
        terminal.echo(">[[b;#ffffff;#000000]Software Engineer] @ BroadScope.Lda, Coimbra, Portugal, 2014/...");
        terminal.echo(">[[b;#ffffff;#000000]Software Engineer Trainee] @ BroadScope.Lda, Coimbra, Portugal, 2013/14");
        terminal.echo(" [[b;#009900;#000000]ϟ] Trainee: Research and develop solutions, analyze results and present reports. Turn raw data into useful data, was the project presented to me by the BroadScope involving");
        terminal.echo("  three major areas: \"Social/Text Mining\", \"Natural Language Processing\" and \"Machine Learning\".");

    } else if (command.match("^social$")) {
        terminal.echo(" [[b;#009900;#000000]ϟ] Twitter, href=\""+ links[1] +"\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] Facebook, href=\"" + links[2] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] Instagram, href=\"" + links[3] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] GitHub, href=\"" + links[4] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] GooglePlus, href=\"" + links[5] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] LinkedIn, href=\"" + links[6] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] Codeacademy, href=\"" + links[7] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] CoderBits, href=\"" + links[8] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] Blogger, href=\"" + links[9] + "\"");
        terminal.echo(" [[b;#009900;#000000]ϟ] YouTube, href=\"" + links[10] + "\"");

    } else if (command.match("^events$")) {
        terminal.echo("> [[b;#009900;#000000]☑] SAPO <Codebits> 2014, href=\"" + links[11] + "\"");
        terminal.echo("> [[b;#009900;#000000]☑] Lisbon Machine Learning School <LxMLS> 2014, href=\"" + links[12] + "\"");
        terminal.echo("> [[b;#009900;#000000]☑] Raising Awareness <RAW> Of Open Data 2014, href=\"" + links[13] + "\"");

    } else if (command.match("^mail$")) {
        terminal.echo("mail me < mailto:jose.miguel.malaca@me.com >");

    } else if (command.match("^open [a-zA-Z]+$")) {
        openWhat(terminal, command);

    } else if (command.match("^send")) {
        sendMail(terminal, command);

    }else if (command.match("^help$")) {
        terminal.echo(">available [[b;#ffffff;#000000]commands] (for now...) {" +
            "\n [[b;#ffffff;#000000]<who>] is José Miguel;" +
            "\n [[b;#ffffff;#000000]<education>] path;" +
            "\n [[b;#ffffff;#000000]<career>];" +
            "\n [[b;#ffffff;#000000]<social>] networks;" +
            "\n [[b;#ffffff;#000000]<events>] he went" +
            "\n [[b;#ffffff;#000000]<mail>] see contact;" +
            "\n --- \\ --" +
            "\n [[b;#ffffff;#000000]<open> <what?>]" +
            "\n [[b;#ffffff;#000000]<send>] mail;" +
            "\n [[b;#ffffff;#000000]<help> or <help> <what?>]" +
            "\n [[b;#ffffff;#000000]<clear>] clear the prompt" +
            "\n [[b;#ffffff;#000000]<history>] of commands" +
            "\n [[b;#ffffff;#000000]<version>];" +
            "\n}");
    } else if (command.match("^help [a-zA-Z]+$")) {
        helpWhat(terminal, command);

    } else if (command.match("^history$")) {
        if (terminal.history().data().length > 0) {
            terminal.echo(">last [max = 10] commands:");
            for (var elem in terminal.history().data())
                terminal.echo(" >" + terminal.history().data()[elem]);
        } else {
            terminal.echo(">No history available...");
        }

    } else if (command.match("^version$")) {
        terminal.echo(">...currently in the v1.0... :P \n> updates always in progress...");

    } else {
        terminal.error(">Unknown command or some sintax error \"" + command + "\"" +
            "\n type \"help\"... ;)");
    }
    terminal.echo(">");
}
//end----

//start, send mail...
function sendMail(terminal, command) {
    var regexRule = "<[a-zA-Z ]+>" + //name
        " <[a-zA-Z0-9\\_\\-\\.]+@(([a-zA-Z0-9-]+\\.)+)([a-zA-Z]{2,4})>" + //mail
        " <.+>$"; //text

    //console.log("<[a-zA-Z0-9\\_\\-\\.]+@(([a-zA-Z0-9-]+\\.)+)([a-zA-Z]{2,4})>"); //see if everything is right about the mail ;)

    if (command.match(regexRule) != null) {
        var atributes = command.split("<");
        var name = atributes[1].substring(0, atributes[1].length - 2);
        var mail = atributes[2].substring(0, atributes[2].length - 2);
        var text = atributes[3].substring(0, atributes[3].length - 1);
        terminal.echo("> Data check: " +
            "\n  Name: " + name +
            "\n  Mail: " + mail +
            "\n  Text: " + text);

        if (name == "")
            terminal.error(">Couldn't send your mail... miss your name");
        else if (mail == "")
            terminal.error(">Couldn't send your mail... miss your mail");
        else if (text == "")
            terminal.error(">Couldn't send your mail... miss you message");
        else {
            var mailData = name + ", " + mail + ", " + text;
            window.open("mailto:jose.miguel.malaca@me.com?subject=Contact&body=" + mailData);
            terminal.echo("[[b;#009900;#000000]Sended]. Thx, i will responde you shortly... ;)");
        }
    } else {
        terminal.error(">Couldn't send your mail... use \"help send\" ;)");
    }
}
//end---

//start, help commands...
function helpWhat(terminal, command) {
    var what = command.replace("help", "");
    //terminal.echo(">HELP: " + what);
    if (what.match("who$")) {
        terminal.echo(">[[b;#388E8E;#000000]A text about me.]");

    }else if (what.match("education$")) {
        terminal.echo(">[[b;#388E8E;#000000]My education path.]");

    }else if (what.match("carrer$")) {
        terminal.echo(">[[b;#388E8E;#000000]My professional path.]");

    }else if (what.match("social$")) {
        terminal.echo(">[[b;#388E8E;#000000]My social networks links.]");

    }else if (what.match("events$")) {
        terminal.echo(">[[b;#388E8E;#000000]A list of some events I went and recomend.]");

    }else if (what.match("mail$")) {
        terminal.echo(">[[b;#388E8E;#000000]My email.]");

    }else if (what.match("open$")) {
        terminal.echo(">[[b;#388E8E;#000000]Use this command to <open> some <social>, <event> link or my <curriculum>.]");
        terminal.echo(">[[b;#388E8E;#000000]For example: \"open twitter\", \"open raw\" or \"open curriculum\"");

    }else if (what.match("send$")) {
        terminal.echo(">[[b;#388E8E;#000000]Use this to send me a email.]");
        terminal.echo(">[[b;#388E8E;#000000]Example: write: send <your name> <your email> <your message> and press enter ;D]");
        terminal.echo(">[[b;#FF0000;#000000]Important:] [[b;#388E8E;#000000]Please insert the \"<\" and \">\" marks. They're used to separate and retrieve your data. :) Thx.]");

    } else if (what.match("clear$")) {
        terminal.echo(">[[b;#388E8E;#000000]Clear the prompt.]");

    } else if (what.match("help$")) {
        terminal.echo(">[[b;#388E8E;#000000]Examples and data to Help you with the prompt.]");

    } else if (what.match("history$")) {
        terminal.echo(">[[b;#388E8E;#000000]See the last 10 commands.]");

    } else if (what.match("version$")) {
        terminal.echo(">[[b;#388E8E;#000000]The prompt version.]");

    } else {
        terminal.error(">Unknown command or some sintax error \"" + command + "\"" +
            "\n type \"help open\"... ;)");
    }
}
//end---

//start, open commands...
function openWhat(terminal, command) {
    var what = command.replace("open", "");
    //terminal.echo(">OPEN: " + what);
    var link = "";
    if (what.match("curriculum$")) {
        link = links[0];
    }
    else if (what.match("twitter$")) {
        link = links[1];
    }
    else if (what.match("facebook$")) {
        link = links[2];
    }
    else if (what.match("instagram$")) {
        link = links[3];
    }
    else if (what.match("github$")) {
        link = links[4];
    }
    else if (what.match("googleplus$")) {
        link = links[5];
    }
    else if (what.match("linkedin$")) {
        link = links[6];
    }
    else if (what.match("codeacademy$")) {
        link = links[7];
    }
    else if (what.match("coderbits$")) {
        link = links[8];
    }
    else if (what.match("blogger$")) {
        link = links[9];
    }
    else if (what.match("youtube$")) {
        link = links[10];
    }
    else if (what.match("sapo$")) {
        link = links[11];
    }
    else if (what.match("lxmls$")) {
        link = links[12];
    }
    else if (what.match("raw$")) {
        link = links[13];
    }
    else {
        terminal.error(">Unknown command or some sintax error \"" + command + "\"" +
            "\n type \"help open\"... ;)");
    }

    if (link.length > 0)
        window.open(link);
}
//end----
