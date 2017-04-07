//initialize everything as needed
//should be called in order of declaration

//globals
//kClasses   in classes.js
kSubjects = {}; //for getting classes by subject

kScheduleRegistration_selectedClasses = {}; //selected classes in schedule/registration page
kScheduleRegistration_subjectClasses = []; //classes currently in the classList

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
        ["manageClasses_eventDragSave", "{}"],
        ["manageClasses_revertColorEvents", "{}"],
        ["manageClasses_currentSubject","Computer Science"],
        ["scheduleRegistration_selectedClasses", "{}"],
        ["scheduleRegistration_currentSubject", "Computer Science"],
        ["scheduleRegistration_subjectClasses", "[]"], //sortable array of classes currently being shown
        ["scheduleRegistration_sortAttribute", "crn"], //what the class list is sorted by (crn by default)
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
    //all classes
    var classesString = localStorage.getItem("kClasses");
    if (classesString != "") {
        // not first load, get kClasses from localStorage
        kClasses = JSON.parse(classesString); //set global classes
        if (kClasses == null) {
            kClasses = {};
        }
    }

    //load class subjects
    for (key in kClasses) {
        var subject = kClasses[key].subject;
        if (!(subject in kSubjects)) {
            //start array of CRNs for new subject
            kSubjects[subject] = [];
        }
        kSubjects[subject].push(key); //append crn to that subject
    }

    //selected classes CRNs for schedule/Registration page
    var selectedCrns = localStorage.getItem("scheduleRegistration_selectedClasses")
    kScheduleRegistration_selectedClasses = JSON.parse(selectedCrns);
    if (kScheduleRegistration_selectedClasses == null) {
        kScheduleRegistration_selectedClasses = {};
    }
}

function shutdown_saveClasses() {
    var classesString = JSON.stringify(kClasses);
    localStorage.setItem("kClasses", classesString);

    var selectedCrns = JSON.stringify(kScheduleRegistration_selectedClasses);
    localStorage.setItem("scheduleRegistration_selectedClasses", selectedCrns);
}