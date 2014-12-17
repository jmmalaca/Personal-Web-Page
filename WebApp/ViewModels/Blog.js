//Connect to the blog and resquest data...
function GetHtmlBlogData() {
    var blogID = "2110626611689613378";
    var key = "AIzaSyBt-RNvjfvthZri5tAbc6bgFi53P2AqPQ8";
    var theUrl = "https://www.googleapis.com/blogger/v3/blogs/" + blogID + "/posts?maxResults=1&key=" + key;
    
    // code for IE7+, Firefox, Chrome, Opera, Safari
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlHttp.open("GET", theUrl, false);
    xmlHttp.setRequestHeader("dataType", "jsonp");
    xmlHttp.send();
    var resp = JSON.parse(xmlHttp.responseText);
    var items = resp.items;
    $("#Blog-Box").append(items[0].content);
}

//document ready event ----------
$(document).ready(function() {

    //add div-box
    $("#Blog-Page").append("<div id=\"BlogTitle\"> my last <b>post</b>... </div>");
    $("#Blog-Page").append("<div id=\"Blog-Box\"></div>");

    //set data...
    GetHtmlBlogData();
});