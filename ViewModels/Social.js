function AddSocialData() {
    //Add Social Box... Social Linnks...
    $("#Social-Page").append("<div class=\"Social-Box\"></div>");
    $(".Social-Box").append("<a class=\"Facebook tooltipstered\" href=\"https://www.facebook.com/cartOOnPT\" target=\"_blank\" title=\"Facebook\"> <img src=\"../../images/Social/facebook.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"Instagram tooltipstered\" href=\"http://instagram.com/josemiguelmalaca\" target=\"_blank\" title=\"Instagram\"> <img src=\"../../images/Social/instagram.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"GitHub tooltipstered\" href=\"https://github.com/tOOnPT\" target=\"_blank\" title=\"GitHub\"> <img src=\"../../images/Social/gitHub.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"GooglePlus tooltipstered\" href=\"https://plus.google.com/u/0/108123132092292147984/posts\" target=\"_blank\" title=\"Google+\"> <img src=\"../../images/Social/googlePlus.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"LinkedIn tooltipstered\" href=\"http://lnkd.in/D3YEs4\" target=\"_blank\" title=\"LinkedIn\"> <img src=\"../../images/Social/linkedIn.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"YouTube tooltipstered\" href=\"http://www.youtube.com/user/tOOnPT\" target=\"_blank\" title=\"Youtube\"> <img src=\"../../images/Social/youTube.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"CoderBits tooltipstered\" href=\"https://coderbits.com/cartoon\" target=\"_blank\" title=\"CoderBits\"> <img src=\"../../images/Social/coderBits.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"Blogger tooltipstered\" href=\"http://tecknologicus.blogspot.pt/\" target=\"_blank\" title=\"Tecknologicus Blog\"> <img src=\"../../images/Social/Blogger.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"Twitter tooltipstered\" href=\"https://twitter.com/tOOnPT\" target=\"_blank\" title=\"Twitter\"> <img src=\"../../images/Social/Twitter.png\" /> </a> ");
    $(".Social-Box").append("<a class=\"Codeacademy tooltipstered\" href=\"http://www.codecademy.com/pt/jose.miguel.malaca\" target=\"_blank\" title=\"Codeacademy\"> <img src=\"../../images/Social/Codeacademy.png\" /> </a>");
    //ShareMe Box...
    $(".Social-Box").append("<div class=\"share\"><div class=\"share-button\"></div></div>");

    //Twitter Widget
    //$("#Social-Page").append("<a id=\"Twitter-Box\" class=\"twitter-timeline\" href=\"https://twitter.com/tOOnPT\" data-widget-id=\"489022777085526016\">Tweets de @tOOnPT</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>");

    //Mail Box...
    $("#Social-Page").append("<div class=\"Mail-Box\"></div>");
    $(".Mail-Box").append("<img class=\"Mail\" src=\"../../images/Social/mail.png\" />");
    $(".Mail-Box").append("<p id=\"TitleMail\" class=\"BlockSelection\"> Drop me a line </p>");
    $(".Mail-Box").append("<form class=\"MailMe\" id =\"MailForm\" action=\"mailto:jose.miguel.malaca@me.com\" method=\"post\">"
        + "<input type=\"text\" name=\"name\" value=\"name\" required=\"required\" size=\"15\">"
        + "<input type=\"text\" name=\"mail\" value=\"email\" required=\"required\" size=\"25\">"
        + "<br><br><input type=\"text\" name=\"comment\" value=\"comment\" required=\"required\" size=\"50\">"
        + "<br><br><input type=\"submit\" value=\"Send it to me\">"
        + "</form>");
}

//document ready event ----------
$(document).ready(function() {

    AddSocialData();

    //what happens in the Mail-Box...
    $("#MailForm").submit(function (event) {
        alert("Thank you for your comment!");
        event.preventDefault();
        $("#MailForm").reset();
    });

    //and with the Share button...
    var share = new Share(".share-button", {
        networks: {
            pinterest: {
                enabled: false,
            }
        }
    });

});