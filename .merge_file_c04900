/* Show Windows Size... follow the resizing events...*/
function SayWho () {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

//what happens when resize is done to the browser window...
$(window).resize(function () {
    ShowBrowserDetails();
});

//insert data showing browser name, width and height...
function ShowBrowserDetails() {
    $(".WindowSize").empty();
    $(".WindowSize").append("<p>" + SayWho() + " [" + $(window).width() + "," + $(window).height() + "] </p>");
}

//document ready event ----------
$(document).ready(function () {

    //Browser details
    ShowBrowserDetails();
    
    //Titles - TextFX
    $("#Menu_Title2").letterfx({ "fx": "spin", "backwards": false, "timing": 50, "fx_duration": "2200ms", "letter_end": "restore", "element_end": "restore" });

    //ToolTips...
    $(".tooltipstered").tooltip({
        arrow: true,
        timer: 10
    });

    //Start he TourTip ----
    var showTourTip = null;
    //If the html5 browser support Local Storage:
    //if (typeof (Storage) !== "undefined") {
    //    showTourTip = localStorage.getItem("tourTip");
    //}
    if (showTourTip == null) {
        //Tourtip - Prompt Button
        $(".Console_button").tourTip({
            description: "Like prompts?... Click here! ;)",
            close: true,
            position: 'left'
        });

        $.tourTip.start();

        //if (typeof (Storage) !== "undefined") {
        //    showTourTip = localStorage.setItem("tourTip", "true");
        //}
    }
    
    //Start... fullPage
    $("#fullPage").fullpage({
        anchors: ['Presentation', 'Work', 'Social', 'Prompt'],
        menu: '#Menu_Buttons',
        css3: true,
        easing: 'easeOutBack',
        afterLoad: function (anchorLink, index) {
            //using anchorLink
            if (anchorLink == 'Presentation') {
                //Home_Button_Action();
            }
            else if (anchorLink == 'Work') {
                //Work_Button_Action();
                //$(".fp-prev").css("visibility", 'hidden');
                //$(".fp-next").css("visibility", 'visible');
            }
            //else if (anchorLink == 'Work' && index == 1) {
            //    $(".fp-prev").css("visibility", 'visible');
            //    $(".fp-next").css("visibility", 'hidden');
            //}
            else if (anchorLink == 'Social') {
                //Social_Button_Action();
            }
            else if (anchorLink == 'Prompt') {
                //Prompt_Button_Action();
                StartPrompt('#Console-Box');
            }
        }
    });
});
