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
            "canvasHeight": 170,
            "canvasWidth": 170
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
    $("#ErrorMsg").css("visibility", "hidden");
    $("#PiesBox").empty();
    $("#PiesBox").append("<p>Data Available</p>");
    $("#PiesBox").append("<table>" +
        "<tr>" +
        "<td id=\"SubjectivityWordsPie\"> </td>" +
        "<td id=\"PolarityWordsPie\"></td>" +
        "<td id=\"OtherWords\"></td>" +
        "</tr>" +
        "<tr>" +
        "<td id=\"TweetsPie\"> </td>" +
        "<td id=\"EmoticonsPie\"> </td>" +
        "</tr>" +
        "</table>");

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

        colors = ["#FF6600", "#4D8BB5", "#A347FF"];
        values = [data["Acronyms"], data["Stopwords"], data["Badwords"]];
        labels = ["Acronyms", "Stopwords", "Badwords"];
        EmoticonsPieChart("OtherWords", "Other Words", values, labels, colors, showLabels);

        colors = ["#248838", "#0070BA", "#830909"];
        values = [data["Positive_Tweets"], data["Neutral_Tweets"], data["Negative_Tweets"]];
        labels = ["Positive", "Neutral", "Negative"];
        EmoticonsPieChart("TweetsPie", "Tweets", values, labels, colors, showLabels);

        $("#PiesBox").css("visibility", "visible");
    }
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
        beforeSend: function() {
            LoadingData("Prior Data");
        },
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
            ShowErrorMessage("PiesBox");
            //console.log(err);
        }
    });
}

function AddFeaturesInfo(divName, data, colors, title, widthValue) {
    $("#ErrorMsg").css("visibility", "hidden");
    $("#" + divName).empty();

    var margin = { top: 30, right: 20, bottom: 80, left: 30 },
     width = widthValue - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;

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

    var fieldName = ['positive', 'neutral', 'negative'];
    data.forEach(function (d) {
        d.compare = fieldName.map(function (name) {
            return { name: name, value: +d[name] };
        });
    });

    x0.domain(data.map(function(d) {
        //console.log(d);
        return d.name;
    }));
    x1.domain(fieldName).rangeRoundBands([0, x0.rangeBand()]);
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

    var svg = d3.select("#" + divName).append("svg:svg")
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
            .text(title);// chart title

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

    $("#" + divName).css("visibility", "visible");
}

function CallServer_RequestFeaturesInfo() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/countsfeatures',
        contentType: "application/json",
        beforeSend: function () {
            LoadingData("Words Data");
        },
        success: function (response) {
            var colors = ["#248838", "#0070BA", "#830909"];
            AddFeaturesInfo("GroupedBarBox", response, colors, "Words Detection", 800);
        },
        error: function (err) {
            ShowErrorMessage("GroupedBarBox");
        }
    });
}

function CallServer_RequestTagsInfo() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/countsTagsfeatures',
        contentType: "application/json",
        beforeSend: function () {
            LoadingData("POS-Tag Data");
        },
        success: function (response) {
            var colors = ["#248838", "#0070BA", "#830909"];
            AddFeaturesInfo("GroupedBarTagsBox", response, colors, "POS-Tags Detection", 800);
        },
        error: function (err) {
            ShowErrorMessage("GroupedBarTagsBox");
        }
    });
}

function ShowBestFeaturesData(data) {
    $("#ErrorMsg").css("visibility", "hidden");
    $("#BestFeaturesLists").empty();
    $("#BestFeaturesLists").append("<p>Selected features by <b>Mutual Information</b> Calc:</p>");
    Object.keys(data).forEach(function (key) {
        $("#BestFeaturesLists").append("<p><br>About the <b>" + key + "</b> problem:</p>");
        var dat = data[key];
        var datStr = dat[0];
        for (var i = 1; i < dat.length; i++) {
            datStr = datStr + ", " + dat[i];
        }
        $("#BestFeaturesLists").append("<p>-" + datStr + ":</p>");
    });
    $("#BestFeaturesLists").css("visibility", "visible");
}

function CallServer_RequestTopFeaturesInfo() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/bestWordsFeatures',
        contentType: "application/json",
        beforeSend: function () {
            LoadingData("Best Features Data");
        },
        success: function (response) {
            ShowBestFeaturesData(response);
        },
        error: function (err) {
            ShowErrorMessage("BestFeaturesLists");
        }
    });
}

function LoadingData(text) {
    $("#PiesBox").css("visibility", "hidden");
    $("#GroupedBarBox").css("visibility", "hidden");
    $("#GroupedBarTagsBox").css("visibility", "hidden");
    $("#BestFeaturesLists").css("visibility", "hidden");
    $("#ErrorMsg").empty();
    $("#ErrorMsg").append("<img id=\"LoadPac\" src=\"../../images/Gifs/ajaxLoader.gif\" style=\"width:13px;height:13px\">Waiting for " + text + "...</img>");
    $("#ErrorMsg").css("visibility", "visible");
}

function ShowErrorMessage(divName) {
    $("#ErrorMsg").empty();
    $("#ErrorMsg").append("<p>Data NOT Available, sry...</p>");
    $("#" + divName).empty();
    $("#ErrorMsg").css("visibility", "visible");
}

function AddButton(title) {
    $("#VerticalMenu").append("<div id=\"" + title + "Button\" class=\"VerticalMenuButton\">" +
        "<div class=\"ButtonPart\">" + title + "</div>" +
        "<div class=\"ButtonPart\" id=\"StackDot\">" +
        "<div id=\"" + title + "Circle\" class=\"circle\"></div>" +
        "</div>" +
        "</div>");
    $("#" + title + "Button").mouseenter(function () {
        $("#" + title + "Button").css("left", "10%");
        $("#" + title + "Circle").css("background", "#ff6a00");
    }).mouseleave(function () {
        $("#" + title + "Button").css("left", "0");
        $("#" + title + "Circle").css("background", "#ffffff");
    }).click(function () {
        $("#PresentProject").css("visibility", "hidden");
        $("#PiesBox").css("visibility", "hidden");
        $("#GroupedBarBox").css("visibility", "hidden");
        $("#GroupedBarTagsBox").css("visibility", "hidden");
        $("#BestFeaturesLists").css("visibility", "hidden");
        if (title === "Data") {
            CallServer_RequestDataInfo();
        } else if (title === "Words") {
            CallServer_RequestFeaturesInfo();
        } else if (title === "Tags") {
            CallServer_RequestTagsInfo();
        } else if (title === "Best") {
            CallServer_RequestTopFeaturesInfo();
        }
    });
}

function AddMenuBox() {
    $("#SentiBox").append("<div id=\"VerticalMenu\"></div>");
    $("#VerticalMenu").append("<div id=\"VerticalMenuTop\"></div>");
    AddButton("Data");
    AddButton("Words");
    AddButton("Tags");
    AddButton("Best");
}

//document ready event ----------
$(document).ready(function () {

    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
    $("#SentiBox").append("<div id=\"PresentProject\"></div>");
    $("#SentiBox").append("<div id=\"PiesBox\"></div>");
    $("#SentiBox").append("<div id=\"GroupedBarBox\"></div>");
    $("#SentiBox").append("<div id=\"GroupedBarTagsBox\"></div>");
    $("#SentiBox").append("<div id=\"BestFeaturesLists\"></div>");
    $("#SentiBox").append("<div id=\"ErrorMsg\"></div>");
    
    AddMenuBox();
});
