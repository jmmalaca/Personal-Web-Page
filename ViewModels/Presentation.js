//Show My First Page Data ---------
var images = [
    "<img class=\"Me_Picture\" src=\"images/Presentation/Me.PNG\" />",
    "<img class=\"Me_Picture\" src=\"images/Presentation/tOOn.PNG\" />"
];

function AddPresentationData() {
    var rand = Math.floor((Math.random() * images.length) + 1);

    //Add data for Presentation Box
    $("#Presentation-Page").append("<div class=\"Presentation-Box animated bounceInRight\"></div>");

    $(".Presentation-Box").append(images[rand - 1]);

    $(".Presentation-Box").append("<p class=\"Resume BlockSelection\">Born and educated in the city that hosts one of the oldest universities of the world, <b>Coimbra</b> (Portugal). Finished in 2014 his <b>Masters</b> at University of Coimbra, <b>Informatics Engineering</b>, with focus on Sentiment Analysis on Microblogging. A <b>Full Stack Engineer</b> ready for new challenges, always learning, growing, and enjoying his life.</p>");

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
