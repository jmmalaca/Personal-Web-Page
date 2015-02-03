//Show Box ---------
function AddStatsBox() {
    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
    $("#SentiBox").append("<div id=\"PiesBox\">Available Data</div>");
    $("#PiesBox").append("<table> <tr> " +
        "<td id=\"EmoticonsPie\"> </td>" +
        "<td id=\"SubjectivityWordsPie\"> </td> </tr>" +
        "<tr> <td id=\"PolarityWordsPie\"> </td>" +
        " <td id=\"OtherWords\"> </td> </tr> </table>");
    $("#SentiBox").append("<div id=\"GroupedBarBox\"></div>");
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

function AddDataInfo(data) {
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

function AddDataInfoNull() {
    var values = [100];
    var labels = ["Null"];
    var colors = ["#001429"];
    EmoticonsPieChart("EmoticonsPie", "Emoticons", values, labels, colors);
    EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity Words", values, labels, colors);
    EmoticonsPieChart("PolarityWordsPie", "Polarity Words", values, labels, colors);
    EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors);
}

function CallServer_RequestDataInfo() {
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
            AddDataInfo(response);
        },
        error: function (err) {
            // Here's where you handle an error response.
            // Note that if the error was due to a CORS issue,
            // this function will still fire, but there won't be any additional
            // information about the error.
            //console.log("ERROR CountsData");
            AddDataInfoNull();
            //console.log(err);
        }
    });
}

function AddFeaturesInfo(featuresData, colors) {
    //console.log(data);

    var featuresValues = featuresData["Data"];
    var m = featuresValues.length;
    var n = featuresValues[0].length;
    var data = featuresValues;

    var color = d3.scale.ordinal().range(colors);

    var margin = { top: 30, right: 20, bottom: 80, left: 30 },
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var x0 = d3.scale.ordinal()
        .domain(d3.range(n))
        .rangeBands([0, width], .2);

    var x1 = d3.scale.ordinal()
        .domain(d3.range(m))
        .rangeBands([0, x0.rangeBand()]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickFormat(function (d) { return featuresData["FeaturesNames"][d]; }) //specify the x axis labels
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#GroupedBarBox").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("svg:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .attr("stroke", "white")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("stroke", "white")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", function (d) {
                return "rotate(-40)";
            });

    svg.append("g").selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + x1(i) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("id", function(d, i, j) { return j; }) //set a ID to rects
        .attr("width", x1.rangeBand())
        .attr("height", y)
        .attr("stroke", "black") //border color around the rects
        .attr("x", function(d, i) { return x0(i); })
        .attr("y", function(d) { return height - y(d); })
        .style("fill", function(d, i, j) { return color(j); })
        .on('mouseover', MouseOverEvent(d, i, j) );

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("stroke", "white")
        .text("% Words Detection");// chart title
}

function MouseOverEvent(d, i, j) {

}

function AddFeaturesInfoNull() {
    var data = [];
    data.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    data.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    data.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    var nullInfo = {
        "FeaturesNames": ["Acronyms", "Stopwords", "Retweets", "Usernames", "Negations", "Positive_Words", "Neutral_Words", "Negative_Words", "Pontuations", "Hashtags", "Repetitions", "Numbers", "Html_Chars", "URLs"],
        "PolarityNames": ["Positive", "Neutral", "Negative"],
        "Data": data
    }

    var colors = ["#001429"];
    AddFeaturesInfo(nullInfo, colors);
}

function CallServer_RequestFeaturesInfo() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/countsfeatures',
        contentType: "application/json",
        success: function (response) {
            var colors = ["#248838", "#0070BA", "#830909"];
            AddFeaturesInfo(response, colors);
        },
        error: function (err) {
            AddFeaturesInfoNull();
        }
    });
}

//document ready event ----------
$(document).ready(function () {

    AddStatsBox();
    CallServer_RequestDataInfo();
    CallServer_RequestFeaturesInfo();
});
