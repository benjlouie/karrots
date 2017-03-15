//initialize everything as needed
//should be called in order of declaration

//globals
kClasses = {
    //this also serves as a template for how classes are stored
    //These classes will only be loaded on first startup
    '00000': {
        section: "none", //like computer science, biology, etc
        title: "Test Class",
        course: "Test 123",
        teacher: "TBD",
        hrs: 3,
        seats: 99,
        building: "test building",
        room: "test room",
        times: [["11:00", "12:15"],["16:00","17:00"]], //times: [start, end]
        days: [[1, 3],[2]], //days for each time section
    }
};

window.onload = function () {
    //when page loads
    startup_localStorage();
    startup_loadClasses();
    startup_contentCalls();
};

window.onbeforeunload = function () {
    shutdown_saveClasses();
}

window.onresize = function () {
    adjustCalendarHeight();
};

function startup_localStorage() {
    //array of [LSItem, defaultValue]
    var LSVars = [
        ["loginContentFile", "html/login.html"],
        ["accountType", "none"],
        ["topNavDisplay", "hidden"],
        ["topNavFile", ""],
        ["topNavSelection", ""],
        ["sideNavDisplay", "hidden_maximized"],
        ["sideNavFile", ""],
        ["sideNavSelection", 1],
        ["mainContentFile", ""],
        ["mainContentCalendar", false],
        ["mainContentCalendarEventOverlap", false],
        ["mainContentCalendarSelectedCrn", ""],
        ["mainContentMenuBar", false],
        ["kClasses", ""] //classes saved using JSON and loaded on startup
    ];

    for (var i = 0; i < LSVars.length; i++) {
        // if item doesn't exist, set to default
        if (localStorage.getItem(LSVars[i][0]) == null) {
            localStorage.setItem(LSVars[i][0], LSVars[i][1]);
        }
    }
}

function startup_contentCalls() {
    startupTopNav();
    startupSideNav();
    startupMainContent();
    startupLogin();
}

function startup_loadClasses() {
    var classesString = localStorage.getItem("kClasses");
    if (classesString == "") {
        //first time, just leave kClasses as is
        return;
    }
    kClasses = JSON.parse(classesString); //set global classes
    if (kClasses == null) {
        kClasses = {};
    }
}

function shutdown_saveClasses() {
    var classesString = JSON.stringify(kClasses);
    localStorage.setItem("kClasses", classesString);
}