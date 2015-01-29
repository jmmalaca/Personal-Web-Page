//Show Box ---------
function AddBox() {
    $("#TwitterSentiment-Page").append("<div id=\"SentiBox\"></div>");
}

function AddCountersBox() {
    //Counts Data
    $("#SentiBox").append("<div id=\"Counters\"> Counters </div>");
}

//document ready event ----------
$(document).ready(function () {

    AddBox();
    AddCountersBox();

    //localhost:8080/countsdata
    //$.ajax("localhost:8080/countsdata", function (data) {

    //    console.log(data);
    //})
    //.done(function (data) {
    //    console.log(data);
    //})
    //.fail(function (error) {
    //    console.log(error);
    //});

    $.ajax({
        url: "localhost:8080/countsdata",
        crossDomain: true,
        dataType: "json",
        error: function(erro) {
            console.log(erro);
        }
    }).done(function () {
        $(this).addClass("done");
    });
});
