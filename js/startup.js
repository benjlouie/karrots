//initialize everything as needed
//should be called in order of declaration

//globals
kClasses = {
    //this also serves as a template for how classes are stored
    //These classes will only be loaded on first startup
    '62729': {
        subject: "Computer Science",
        title: "Intro to C Programming",
        course: "CSE 113",
        teacher: "TBD",
        hrs: 3,
        seats: 58,
        building: "CRAMER",
        room: "203",
        times: [["09:00", "10:50"]], //times: [start, end]
        days: [[1, 3, 5]], //days for each time section
    },
    '62651': {
        subject: "Computer Science",
        title: "Computer System Organization",
        course: "CSE 221",
        teacher: "TBD",
        hrs: 3,
        seats: 50,
        building: "CRAMER",
        room: "239",
        times: [["09:00", "10:15"]],
        days: [[2, 4]],
    },
    '63119': {
        subject: "Computer Science",
        title: "Internet and Web Programming",
        course: "CSE 321",
        teacher: "TBD",
        hrs: 3,
        seats: 30,
        building: "CRAMER",
        room: "203",
        times: [["11:00", "12:15"]],
        days: [[1, 3]],
    },
    '62650': {
        subject: "Computer Science",
        title: "Algorithms & Data Structures",
        course: "CSE 122",
        teacher: "TBD",
        hrs: 3,
        seats: 50,
        building: "CRAMER",
        room: "239",
        times: [["11:00", "12:15"]],
        days: [[2, 4]],
    },
    '62653': {
        subject: "Computer Science",
        title: "Design & Analysis of Algorithms",
        course: "CSE 344",
        teacher: "TBD",
        hrs: 3,
        seats: 30,
        building: "CRAMER",
        room: "203",
        times: [["11:00", "12:15"], ["10:00", "11:50"]],
        days: [[2, 4], [5]],
    },
    '62656': {
        subject: "Computer Science",
        title: "Compiler Writing",
        course: "CSE 423",
        teacher: "TBD",
        hrs: 4,
        seats: 30,
        building: "CRAMER",
        room: "203",
        times: [["14:00", "15:15"], ["15:30", "18:30"]],
        days: [[2, 4], [4]],
    },
    '62038': {
        subject: "Chemistry",
        title: "General Chemistry I",
        course: "CHEM 121-01",
        teacher: "Praveen Patidar",
        hrs: 3,
        seats: 70,
        building: "WORKC",
        room: "101",
        times: [["08:00", "08:50"]],
        days: [[1, 3, 5]],
    }
};
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