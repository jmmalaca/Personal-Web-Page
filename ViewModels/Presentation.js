//Show My First Page Data ---------
function AddPresentationData() {
    //Add data for Presentation Box
    $("#Presentation-Page").append("<div class=\"Presentation-Box animated bounceInRight\"></div>");
    $(".Presentation-Box").append("<img class=\"Me_Picture\" src=\"images/Presentation/Me.PNG\" />");
    $(".Presentation-Box").append("<p class=\"Resume BlockSelection\"> José Miguel was born in <b>Coimbra</b>, Portugal, and since younger age has the <b>passion</b> about informatics. His academic path on informatics started with a enormous <b>curiosity</b> to discover and play with some little robots in the primary school. Much later in the univerisity, this path founds his end with a project about Sentiment Analysis in Microblogging. The academic year 2013/14 was the last in the <b>Faculty of Sciences and Technology</b>, University of Coimbra, so now, he's a <b>proud</b> member of MSc in Informatics Engineering family. A <b>Full-Stack Software Engineer</b> enjoying his work and his life. </p>");

    //Add data for Map Box
    $("#Presentation-Page").append("<div class=\"Location_Map animated bounceInLeft\"></div>");
    $(".Location_Map").append("<div class=\"Location_Logo hover-shadow tooltipstered\" title=\"Coimbra\"></div>");
    $(".Location_Logo").append("<img src=\"images/Presentation/Location_transp.png\" />");
    $(".Location_Map").append("<img src=\"../../images/Presentation/Europe.png\" alt=\"Europe\">");
    
    //Add data for Labels Box
    $("#Presentation-Page").append("<div class=\"Labels_Wordle animated bounceInRight\"></div>");
    $(".Labels_Wordle").append("<img src=\"../../images/Presentation/Wordle.PNG\" alt=\"Wordle\">");

    //Add data for Quote Box
    $("#Presentation-Page").append("<div class=\"Quote-Box animated bounceInLeft\"></div>");
    $(".Quote-Box").append("<p id=\"Quote_Text\" class=\"BlockSelection\"></p>");
    $(".Quote-Box").append("<p id=\"Quote_Sign\" class=\"BlockSelection\"></p>");
}

var quote = function(who, said) {
    this.who = "– " + who;
    this.said = said;
};

var quotes = [
    new quote("Stephen Hawking", "<q>Quiet people have the <b>loudest</b> minds.</q>"),
    new quote("Benjamin Franklin", "<q>Tell me and I forget, teach me and I may remember, <b>involve</b> me and I learn.</q>")
];

function AddQuotes() {
    var rand = Math.floor((Math.random() * quotes.length) + 1);

    $("#Quote_Text").empty();
    $("#Quote_Text").append(quotes[rand-1].said);

    $("#Quote_Sign").empty();
    $("#Quote_Sign").append(quotes[rand-1].who);
}

//document ready event ----------
$(document).ready(function() {

    //Add Data to the WebSite...
    AddPresentationData();

    //Add Quotes...
    AddQuotes();

    //What happens to the map logo click...
    $(".Location_Logo").click(function () {
        window.open("https://goo.gl/maps/FyaBm");
    });

});
