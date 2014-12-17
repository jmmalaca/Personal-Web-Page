//Show Education and Work Data ----------
function AddWorkData() {
    $("#Work-Page").append("<div class=\"Work-Box\"></div>");
    $(".Work-Box").append("<img class=\"Work_Logo\" src=\"../../images/Work/Work.png\" title=\"Work\"/>");
    $(".Work-Box").append("<a class=\"CV_Logo hover tooltipstered\" href=\"../../CurriculumVitae/cv_JoseMMalaca.pdf\" target=\"_blank\" title=\"Download Resume\"> <img src=\"../../images/Work/CV.png\"/> </a>");
    $(".Work-Box").append("<div id=\"Works-List\" data-bind=\"foreach: WorksData\"> " +
        "<p class=\"WorkTitle BlockSelection\" data-bind=\"html: paragraphOne\"></p>" +
        "<p class=\"WorkDescription BlockSelection\" data-bind=\"html: paragraphTwo\"></p> " +
        "</div>");
    
    //Add Events Box
    $("#Work-Page").append("<div class=\"Events-Box\"></div>");
    $(".Events-Box").append("<img class=\"Events-Logo\" src=\"../../images/Work/Events.png\" />");
    $(".Events-Box").append("<div class=\"Events-List\" data-bind=\"foreach: EventsData\"> " +
        "<a class=\"Event\" data-bind=\"html: data, attr: {'id': title, href: url}\" target=\"_blank\"> </a> " +
        "</div>");

    //Add Education Box
    $("#Education-Page").append("<div class=\"Education-Box\"></div>");
    $(".Education-Box").append("<img class=\"Education_Logo\" src=\"../../images/Work/Education.png\" title=\"Education\" />");
    $(".Education-Box").append("<div id=\"University\">" +
        "<p class=\"BlockSelection\"> \><a id=\"DEI\" href=\"http://www.uc.pt/en/fctuc/dei\" target=\"_blank\">Department of Informatics Engineering</a>, Faculty of Science and Technology, University of Coimbra, Portugal</p> " +
        "<p id=\"Master\" class=\"BlockSelection\"><font size=\"3\" color=\"green\">☑</font> <b>Masters</b> in Informatics Engineering </p> " +
        "<p id=\"Graduate\" class=\"BlockSelection\"><font size=\"3\" color=\"green\">☑</font> Informatics Engineering <b>Graduate</b> </p> </div>");
    $(".Education-Box").append("<div id=\"School\"> " +
        "<p class=\"BlockSelection\"> \><a id=\"Brotero\" href=\"http://www.brotero.pt/\" target=\"blank\">High School Avelar Brotero</a>, Coimbra, Portugal</p> " +
        "<p id=\"Tecnichian\" class=\"BlockSelection\"><font size=\"3\" color=\"green\">☑</font> Informatics <b>Technician</b> (Técnico Informático)</p> </div>");

    //Add data for Labels Box
    $("#Education-Page").append("<div class=\"WorkLabels_Wordle\"></div>");
    $(".WorkLabels_Wordle").append("<img src=\"../../images/Work/Wordle_Work.PNG\" alt=\"Wordle\">");
}

var workData = function(title, company, companyUrl, date, description) {
    this.paragraphOne = "<font size=\"3\" color=\"green\"> ϟ </font> <b>"+title+"</b>, <a class=\"url\" href=\""+companyUrl+"\" target=\"_blank\"> "+company+"</a>, " + date + " </p>";
    this.paragraphTwo = description;
}

var eventData = function (title, url, data) {
    this.title = title;
    this.url = url;
    this.data = "<p class=\"BlockSelection\"> <font size=\"3\" color=\"green\">☑</font> " + data + " </p>";
}

// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModelData = {
    WorksData: [
        new workData("Junior Software Engineer", "BroadScope, Lda", "http://www.broadscope.eu/", "'14/..", "The traineeship focus on R&D has been closed, the result was positive, and so I have been <b>invited</b> to continue on the company and be part of the BroadScope <b>team</b>. With this I'm inserted in the BroadScope team and in the processs of building of the main project of the company."),
        new workData("Software Engineer Trainee", "BroadScope, Lda", "http://www.broadscope.eu/", "'13/14", "<b>Research and develop</b> solutions, analyze results and present reports. Turn raw data into useful data, was the project presented by the BroadScope involving three major areas: <b>\"Social/Text Mining\", \"Natural Language Processing\" and \"Machine Learning\"</b>.")
    ],

    EventsData: [
        new eventData("RAW", "http://rawopendata.ipn.pt/", "Raising Awareness Of Open Data '14"),
        new eventData("LxMLS", "http://lxmls.it.pt/2014/", "Lisbon Machine Learning School '14"),
        new eventData("Sapo", "https://codebits.eu/cartOOn\\", "SAPO Codebits '14")
    ]

};

//document ready event ----------
$(document).ready(function() {

    AddWorkData();

    ko.applyBindings(viewModelData);

});
