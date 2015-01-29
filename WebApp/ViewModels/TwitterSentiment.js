//Show Box ---------
function AddBox() {
    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
}

function EmoticonsPieChart(divName, pieTitle, values, colors) {
    var content = [];
    var countColor = 0;
    values.forEach(function (value) {
        var data = {
            "label": "Shell",
            "value": value,
            "color": colors[countColor]
        };
        content.push(data);
        countColor++;
    });
    
    $("#CountersBox").append("<div id=\"" + divName + "\" style=\"width:40%; height:35%; margin:0;\"></div>");
    var pie = new d3pie(divName, {
        "header": {
            "subtitle": {
                "text": pieTitle,
                "color": "#fdfbfb",
                "font": "open sans"
            }
        },
        "size": {
            "canvasHeight": 150,
            "canvasWidth": 150
        },
        "data": {
            "sortOrder": "value-desc",
            "content": content
        },
        "labels": {
            "outer": {
                "format": "none"
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 1
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            }
        }
    });
}

function AddData(data) {
    //console.log(data);
    //console.log(data["Acronyms"]);
    if (Object.keys(data).length > 0) {

        $("#SentiBox").append("<div id=\"CountersBox\"></div>");
        $("#Counters").append("<h3> Data Stats </h3>");

        var values = [data["Positive_Emoticons"], data["Negative_Emoticons"]];
        var colors = ["#248838", "#830909"];
        EmoticonsPieChart("EmoticonsPie", "Emoticons", values, colors);

        colors = ["#248838", "#0070BA"];
        values = [data["Subjective_Words"], data["Objective_Words"]];
        EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity", values, colors);
        
        colors = ["#248838", "#0070BA", "#830909"];
        values = [data["Positive_Words"], data["Neutral_Words"], data["Negative_Words"]];
        EmoticonsPieChart("PolarityWordsPie", "Polarity", values, colors);

        colors = ["#4D8BB5", "#FF6600", "#A347FF"];
        values = [data["Acronyms"], data["Stopwords"], data["Badwords"]];
        EmoticonsPieChart("OtherWords", "Other_Words", values, colors);
    }
}

function CallServer_RequestStatisticsData() {
    $.ajax({
        // The 'type' property sets the HTTP method.
        type: 'GET',
        // The URL to make the request to.
        url: 'http://localhost:8080/countsdata',

        // The 'contentType' property sets the 'Content-Type' header.
        contentType: "application/json",

        //Asynchronous... or not
        //async: false,

        success: function (response) {
            // Here's where you handle a successful response.
            //console.log(data);
            AddData(response);
        },
        error: function (err) {
            // Here's where you handle an error response.
            // Note that if the error was due to a CORS issue,
            // this function will still fire, but there won't be any additional
            // information about the error.
            console.log("ERROR CountsData");
            //console.log(err);
        }
    });
}

//document ready event ----------
$(document).ready(function () {

    AddBox();
    CallServer_RequestStatisticsData();
});
