//Show Box ---------
function AddStatsBox() {
    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
    $("#SentiBox").append("<div id=\"CountersBox\"></div>");
    $("#CountersBox").append("<table> <tr> " +
        "<td id=\"EmoticonsPie\"> </td>" +
        "<td id=\"SubjectivityWordsPie\"> </td> </tr>" +
        "<tr> <td id=\"PolarityWordsPie\"> </td>" +
        " <td id=\"OtherWords\"> </td> </tr> </table>");
}

function EmoticonsPieChart(divName, pieTitle, values, labels, colors) {
    var content = [];
    var count = 0;
    values.forEach(function (value) {
        var data = {
            "value": value,
            "color": colors[count],
            "caption": labels[count]
        };
        content.push(data);
        count++;
    });
    var pie = new d3pie(divName, {
        "header": {
            "subtitle": {
                "text": pieTitle,
                "color": "#fdfbfb",
                "font": "open sans"
            }
        },
        "size": {
            "pieInnerRadius": "35%",
            "pieOuterRadius": "100%",
            "canvasHeight": 125,
            "canvasWidth": 125
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
        },
        tooltips: {
            enabled: true,
            type: "caption"
        }
    });
}

function AddData(data) {
    //console.log(data);
    if (Object.keys(data).length > 0) {

        var values = [data["Positive_Emoticons"], data["Negative_Emoticons"]];
        var labels = ["Positive", "Negative"];
        var colors = ["#248838", "#830909"];
        EmoticonsPieChart("EmoticonsPie", "Emoticons", values, labels, colors);

        colors = ["#248838", "#0070BA"];
        values = [data["Subjective_Words"], data["Objective_Words"]];
        labels = ["Subjective", "Objective"];
        EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity Words", values, labels, colors);
        
        colors = ["#248838", "#0070BA", "#830909"];
        values = [data["Positive_Words"], data["Neutral_Words"], data["Negative_Words"]];
        labels = ["Positive", "Neutral", "Negative"];
        EmoticonsPieChart("PolarityWordsPie", "Polarity Words", values, labels, colors);

        colors = ["#4D8BB5", "#FF6600", "#A347FF"];
        values = [data["Acronyms"], data["Stopwords"], data["Badwords"]];
        labels = ["Acronyms", "Stopwords", "Badwords"];
        EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors);
    }
}

function AddDataNull() {
    var values = [100];
    var labels = ["Null"];
    var colors = ["#001429"];
    EmoticonsPieChart("EmoticonsPie", "Emoticons", values, labels, colors);
    EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity Words", values, labels, colors);
    EmoticonsPieChart("PolarityWordsPie", "Polarity Words", values, labels, colors);
    EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors);
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
            //console.log("ERROR CountsData");
            AddDataNull();
            //console.log(err);
        }
    });
}

//document ready event ----------
$(document).ready(function () {

    AddStatsBox();
    CallServer_RequestStatisticsData();
});
