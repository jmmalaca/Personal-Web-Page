//Home Button ---------
function Home_Button_Action() {
    $(".Home_button").css("visibility", "hidden");
    $(".Work_button").css("visibility", "visible");
    $(".Social_button").css("visibility", "visible");
    $(".Console_button").css("visibility", "visible");
}

$(".Home_button").click(function () {
    Home_Button_Action();
});

//Work Button ---------
function Work_Button_Action() {
    $(".Home_button").css("visibility", "visible");
    $(".Work_button").css("visibility", "hidden");
    $(".Social_button").css("visibility", "visible");
    $(".Console_button").css("visibility", "visible");
}

$(".Work_button").click(function () {
    Work_Button_Action();
});

//Social Button ---------
function Social_Button_Action() {
    $(".Home_button").css("visibility", "visible");
    $(".Work_button").css("visibility", "visible");
    $(".Social_button").css("visibility", "hidden");
    $(".Console_button").css("visibility", "visible");
}

$(".Social_button").click(function () {
    Social_Button_Action();
});

//Console Button --------
function Prompt_Button_Action() {
    $(".Home_button").css("visibility", "visible");
    $(".Work_button").css("visibility", "visible");
    $(".Social_button").css("visibility", "visible");
    $(".Console_button").css("visibility", "hidden");
}

$(".Console_button").click(function () {
    Prompt_Button_Action();
});

//document ready event ----------
$(document).ready(function () {
    Home_Button_Action();
});
