//Connect to the blog and resquest data...
function GetHtmlBlogData() {
    var blogId = "2110626611689613378";
    var key = "AIzaSyBt-RNvjfvthZri5tAbc6bgFi53P2AqPQ8";
    var theUrl = "https://www.googleapis.com/blogger/v3/blogs/" + blogId + "/posts?maxResults=1&key=" + key;
    
    $.ajax({
        // The 'type' property sets the HTTP method.
        type: 'GET',
        // The URL to make the request to.
        url: theUrl,
        // The 'contentType' property sets the 'Content-Type' header.
        contentType: "text/plain",
        success: function (response) {
            // Here's where you handle a successful response.
            //console.log(data);
            var data = response.items;
            if (data != null) {
                $("#Blog-Box").append(data[0].content);
            }
        },
        error: function (err) {
            // Here's where you handle an error response.
            // Note that if the error was due to a CORS issue,
            // this function will still fire, but there won't be any additional
            // information about the error.
            console.log("ERRO Blog.");
            //console.log(err);
        }
    });
}

//document ready event ----------
$(document).ready(function() {

    //add div-box
    $("#Blog-Page").append("<div id=\"BlogTitle\">last <b>post</b>...</div>");
    $("#Blog-Page").append("<div id=\"Blog-Box\"></div>");

    //set data...
    GetHtmlBlogData();
});