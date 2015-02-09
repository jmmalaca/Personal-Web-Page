//Show Box ---------
function AddStatsBox() {
    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
    $("#SentiBox").append("<div id=\"PiesBox\">Bags of Words</div>");
    $("#PiesBox").append("<table> <tr> " +
        "<td id=\"EmoticonsPie\"> </td>" +
        "<td id=\"SubjectivityWordsPie\"> </td> </tr>" +
        "<tr> <td id=\"PolarityWordsPie\"> </td>" +
        " <td id=\"OtherWords\"> </td> </tr> </table>");
    $("#SentiBox").append("<div id=\"GroupedBarBox\"></div>");
}

function EmoticonsPieChart(divName, pieTitle, values, labels, colors, showLabels) {
    var content = [];
    var count = 0;
    if (showLabels) {
        values.forEach(function(value) {
            var data = {
                "value": value,
                "color": colors[count],
                "caption": labels[count]
            };
            content.push(data);
            count++;
        });
    } else {
        values.forEach(function (value) {
            var data = {
                "value": value,
                "color": colors[count]
            };
            content.push(data);
            count++;
        });
    }
    var pie = new d3pie(divName, {
        "header": {
            "subtitle": {
                "text": pieTitle,
                "color": "#fdfbfb",
                "font": "open sans"
            }
        },
        "size": {
            "pieInnerRadius": "30%",
            "pieOuterRadius": "100%",
            "canvasHeight": 135,
            "canvasWidth": 135
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

        var showLabels = true;

        var values = [data["Positive_Emoticons"], data["Negative_Emoticons"]];
        var labels = ["Positive", "Negative"];
        var colors = ["#248838", "#830909"];
        EmoticonsPieChart("EmoticonsPie", "Emoticons", values, labels, colors, showLabels);

        colors = ["#248838", "#0070BA"];
        values = [data["Subjective_Words"], data["Objective_Words"]];
        labels = ["Subjective", "Objective"];
        EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity Words", values, labels, colors, showLabels);

        colors = ["#248838", "#0070BA", "#830909"];
        values = [data["Positive_Words"], data["Neutral_Words"], data["Negative_Words"]];
        labels = ["Positive", "Neutral", "Negative"];
        EmoticonsPieChart("PolarityWordsPie", "Polarity Words", values, labels, colors, showLabels);

        colors = ["#4D8BB5", "#FF6600", "#A347FF"];
        values = [data["Acronyms"], data["Stopwords"], data["Badwords"]];
        labels = ["Acronyms", "Stopwords", "Badwords"];
        EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors, showLabels);
    }
}

function AddDataInfoNull() {
    var values = [0];
    var colors = ["#001429"];
    var showLabels = false;
    var labels = [];
    EmoticonsPieChart("EmoticonsPie", "Emoticons", values, labels, colors, showLabels);
    EmoticonsPieChart("SubjectivityWordsPie", "Subjectivity Words", values, labels, colors, showLabels);
    EmoticonsPieChart("PolarityWordsPie", "Polarity Words", values, labels, colors, showLabels);
    EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors, showLabels);
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

function AddFeaturesInfo(data, colors) {
    
    //console.log(data);

    var margin = { top: 30, right: 20, bottom: 80, left: 30 },
     width = 550 - margin.left - margin.right,
     height = 350 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
       .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var color = d3.scale.ordinal()
        .range(colors);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var field_name = ['positive', 'neutral', 'negative'];
    data.forEach(function (d) {
        d.compare = field_name.map(function (name) {
            return { name: name, value: +d[name] };
        });
    });

    x0.domain(data.map(function (d) { console.log(d); return d.name; }));
    x1.domain(field_name).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function (d) {
        return d3.max(d.compare, function (d) {
            return d.value + 10;
        });
    })]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<span style='color:white'>"+ (Math.round(d.value*100)/100) + "% </span>";
        }
    );

    var svg = d3.select("#GroupedBarBox").append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
       .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "x axis")
        .style("fill", "white")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
           .style("text-anchor", "end")
           .attr("transform", function (d) {
               return "rotate(-40)";
           });

    svg.append("g")
        .attr("class", "y axis")
        .style("fill", "white")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percentage");

    var name = svg.selectAll(".name")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) { return "translate(" + x0(d.name) + ",0)"; });
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (0 - (margin.top / 2)) + 35)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("Words Detection");// chart title

    name.selectAll(".bar")
            .data(function(d) { return d.compare; })
        .enter().append("rect")
            .attr("class", "bar")
            .attr("stroke", "black")
            .attr("x", function(d) { return x1(d.name); })
            .attr("width", x1.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d) { return color(d.name); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    //var legend = svg.selectAll(".legend")
    //    .data(field_name.slice().reverse())
    //  .enter().append("g")
    //    .attr("class", "legend")
    //    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    //legend.append("rect")
    //    .attr("x", width - 18)
    //    .attr("width", 18)
    //    .attr("height", 18)
    //    .style("fill", color);

    //legend.append("text")
    //    .attr("x", width - 24)
    //    .attr("y", 9)
    //    .style("fill", "white")
    //    .attr("dy", ".30em")
    //    .style("text-anchor", "end")
    //    .text(function (d) { return d; });
}

function AddFeaturesInfoNull() {
    var emptyData = [
        {"name":"Acronyms","positive":0,"neutral":0,"negative":0},
        {"name":"Stopwords","positive":0,"neutral":0,"negative":0},
        {"name":"Retweets","positive":0,"neutral":0,"negative":0},
        {"name":"Usernames","positive":0,"neutral":0,"negative":0},
        {"name":"Negations","positive":0,"neutral":0,"negative":0},
        {"name":"Positive_Words","positive":0,"neutral":0,"negative":0},
        {"name":"Neutral_Words","positive":0,"neutral":0,"negative":0},
        {"name":"Negative_Words","positive":0,"neutral":0,"negative":0},
        {"name":"Pontuations","positive":0,"neutral":0,"negative":0},
        {"name":"Hashtags","positive":0,"neutral":0,"negative":0},
        {"name":"Repetitions","positive":0,"neutral":0,"negative":0},
        {"name":"Numbers","positive":0,"neutral":0,"negative":0},
        {"name":"Html_Chars","positive":0,"neutral":0,"negative":0},
        { "name": "URLs", "positive": 0, "neutral": 0, "negative": 0 },
        { "name": "Badwords", "positive": 0, "neutral": 0, "negative": 0 },
        { "name": "Uppercases", "positive": 0, "neutral": 0, "negative": 0 }
    ];

    var colors = ["#001429"];

    AddFeaturesInfo(emptyData, colors);
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
