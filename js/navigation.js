/*login page calls*/
////////////////////////////
function startupLogin() {
    var accountType = localStorage.getItem("accountType");
    if (accountType == "none") {
        //not logged in yet, load the login page
        $("#loginContent").load(localStorage.getItem("loginContentFile"));
    }
}

function loginStudent() {
    localStorage.setItem("topNavFile", "html/topnav/student.html");
    localStorage.setItem("accountType", "student");
    login();
}
function loginTeacher() {
    localStorage.setItem("topNavFile", "html/topnav/teacher.html");
    localStorage.setItem("accountType", "teacher");
    login();
}
function loginDebug() {
    localStorage.setItem("topNavFile", "html/topnav/debug.html");
    localStorage.setItem("accountType", "debug");
    login();
}
function login() {
    localStorage.setItem("mainContentFile", "html/maincontent/startpage.html");
    localStorage.setItem("topNavDisplay", "show");

    removeLogin();
    startupTopNav();
    startupMainContent();
}

function removeLogin() {
    var loginContent = document.getElementById("loginContent");
    while (loginContent.firstChild) {
        loginContent.removeChild(loginContent.firstChild);
    }
}
////////////////////////////

/* topnav opening/closing */
////////////////////////////
function startupTopNav() {
    var topNavDisplay = localStorage.getItem("topNavDisplay");
    var topNav = document.getElementById("topNav");
    if (topNavDisplay == "hidden") {
        topNav.style.display = "hidden";
    } else if (topNavDisplay == "show") {
        topNav.style.display = "initial";
        //highlight correct selection after load
        $("#topNav").load(localStorage.getItem("topNavFile"), highlightSelectionTopNav);
    }
}

//highlights the current topnav element
function highlightSelectionTopNav() {
    //clear previous
    var topNav = document.getElementById("topNav");
    var ul = topNav.firstElementChild;
    var lis = ul.children;
    var topNavSelection = localStorage.getItem("topNavSelection");
    for (var i = 0; i < lis.length; i++) {
        //firstChild is <a>
        var a = lis[i].firstChild;
        if (a.innerHTML == topNavSelection) {
            a.className = "navActive";
        } else {
            a.className = "";
        }
    }
}
////////////////////////////

//go back to start page
function logoClick() {
    localStorage.setItem("sideNavFile", "html/sidenav/account.html");
    localStorage.setItem("mainContentFile", "html/maincontent/startpage.html");
    localStorage.setItem("topNavSelection", "");

    highlightSelectionTopNav()
    hideSideNav();
    //open mainContent
    $("#mainContent").load(localStorage.getItem("mainContentFile")); //load maincontent
    var mainContent = document.getElementById("mainContent");
    mainContent.style.marginLeft = "0px";
}

/*sidenav opening/closing*/
////////////////////////////

//opens the sidenav to it's localStorage setting
function startupSideNav() {
    var sideNavDisplay = localStorage.getItem("sideNavDisplay");
    if (sideNavDisplay == "maximized") {
        maximizeSideNav();
    } else if (sideNavDisplay == "minimized") {
        minimizeSideNav();
    } else if (sideNavDisplay == "hidden_minimized") {
        hideSideNav();
    } else if (sideNavDisplay == "hidden_maximized") {
        hideSideNav();
    }
}

//for when a button is pressed and it goes from hidden to previous display
function setSideNavVisible() {
    var sideNavDisplay = localStorage.getItem("sideNavDisplay");
    if (sideNavDisplay == "hidden_minimized") {
        localStorage.setItem("sideNavDisplay", "minimized");
    } else if (sideNavDisplay == "hidden_maximized") {
        localStorage.setItem("sideNavDisplay", "maximized");
    }
}

function openSideNavAccount(element) {
    localStorage.setItem("sideNavFile", "html/sidenav/account.html");
    localStorage.setItem("topNavSelection", element.innerHTML);
    setSideNavVisible();
    startupSideNav();
    highlightSelectionTopNav();
}
function openSideNavRegistration(element) {
    localStorage.setItem("sideNavFile", "html/sidenav/registration.html");
    localStorage.setItem("topNavSelection", element.innerHTML);
    setSideNavVisible();
    startupSideNav();
    highlightSelectionTopNav();
}
function openSideNavClasses(element) {
    localStorage.setItem("sideNavFile", "html/sidenav/classes.html");
    localStorage.setItem("topNavSelection", element.innerHTML);
    setSideNavVisible();
    startupSideNav();
    highlightSelectionTopNav();
}
function openSideNavEmployee(element) {
    localStorage.setItem("sideNavFile", "html/sidenav/employee.html");
    localStorage.setItem("topNavSelection", element.innerHTML);
    setSideNavVisible();
    startupSideNav();
    highlightSelectionTopNav();
}

function minimizeSideNav() {
    var sideNav = document.getElementById("sideNav");
    sideNav.style.minWidth = "40px";
    sideNav.style.borderRightWidth = "3px";
    localStorage.setItem("sideNavDisplay", "minimized");/*save sidenav as minimized*/

    //load sidenav, minimize after done loading
    $("#sideNav").load(localStorage.getItem("sideNavFile"), function () {
        setSideNavMinimizedContents();
        highlightSelectionSideNav();
    });

    var mainContent = document.getElementById("mainContent");
    mainContent.style.marginLeft = "42px";
}

function maximizeSideNav() {
    var sideNav = document.getElementById("sideNav");
    sideNav.style.minWidth = "200px";
    sideNav.style.borderRightWidth = "3px";

    //load currently selected tab
    $("#sideNav").load(localStorage.getItem("sideNavFile"), highlightSelectionSideNav);
    var mainContent = document.getElementById("mainContent");
    mainContent.style.marginLeft = "202px";

    localStorage.setItem("sideNavDisplay", "maximized"); //save sidenav as maximized
}

function hideSideNav() {
    //hide sideNav
    var sideNav = document.getElementById("sideNav");
    sideNav.style.minWidth = "0px";
    sideNav.style.borderRightWidth = "0px";

    var prevDisplay = localStorage.getItem("sideNavDisplay");
    if (prevDisplay == "minimized" || prevDisplay == "maximized") {
        localStorage.setItem("sideNavDisplay", "hidden_" + prevDisplay);
    }
}

function setSideNavMinimizedContents() {
    var sideNav = document.getElementById("sideNav");
    var ulElm = sideNav.firstChild;
    var listElms = ulElm.children;

    //change icon to the minimized one
    listElms[0].innerHTML = '<a class="sidenav_maxbtn" onclick="maximizeSideNav()">+</a>'//&#9776;</a>';

    //change the string for each <li><a> link
    for (var i = 1; i < listElms.length; i += 1) {
        listElms[i].firstChild.innerHTML = listElms[i].firstChild.innerHTML[0];
    }
}

function setMainContentLeftMargin() {
    var sideNav = document.getElementById("sideNav");
    var width = getElementWidth(sideNav);

    var mainContent = document.getElementById("mainContent");
    mainContent.style.marginLeft = width + "px";
}

//highlights the current sidenav element
function highlightSelectionSideNav(element) {
    //clear previous
    var sideNav = document.getElementById("sideNav");
    var ul = sideNav.firstElementChild;
    var lis = ul.children;
    var sideNavSelection = parseInt(localStorage.getItem("sideNavSelection"));


    for (var i = 0; i < lis.length; i++) {
        //firstChild is <a>
        var a = lis[i].firstChild;
        //max/min button, leave alone
        if (a.className == "sidenav_closebtn" || a.className == "sidenav_maxbtn") {
            continue;
        }

        if (i == sideNavSelection) {
            a.className = "navActive";
        } else {
            a.className = "";
        }
    }

}
////////////////////////////

/*MainContent opening/closing*/
////////////////////////////
function startupMainContent() {
    var mainContentFile = localStorage.getItem("mainContentFile");
    if (mainContentFile != "") {
        //there is a file, load it
        $("#mainContent").load(localStorage.getItem("mainContentFile"));
        //TODO: add localStorage to know if there is a calendar or not on that page
        $("#mainContent").ready(makeCalendar); //make calendar if it's there
    }
}

//Account
function openMainContent_Account_Summary(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/account/summary.html");
    localStorage.setItem("sideNavSelection", "1");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Account_Balance(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/account/balance.html");
    localStorage.setItem("sideNavSelection", "2");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Account_Settings(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/account/settings.html");
    localStorage.setItem("sideNavSelection", "3");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}

//Registration
function openMainContent_Registration_Status(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/registration/status.html");
    localStorage.setItem("sideNavSelection", "1");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Registration_Schedule(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/registration/schedule.html");
    localStorage.setItem("sideNavSelection", "2");
    $("#mainContent").load(localStorage.getItem("mainContentFile"), makeCalendar);
    highlightSelectionSideNav(element);
}
function openMainContent_Registration_Classes(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/registration/classes.html");
    localStorage.setItem("sideNavSelection", "3");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}

//Classes
function openMainContent_Classes_List(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/classes/list.html");
    localStorage.setItem("sideNavSelection", "1");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Classes_Enrollment(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/classes/enrollment.html");
    localStorage.setItem("sideNavSelection", "2");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Classes_Grades(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/classes/grades.html");
    localStorage.setItem("sideNavSelection", "3");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}

//employee
function openMainContent_Employee_Job(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/employee/job.html");
    localStorage.setItem("sideNavSelection", "1");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Employee_Timesheet(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/employee/timesheet.html");
    localStorage.setItem("sideNavSelection", "2");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}
function openMainContent_Employee_Pay(element) {
    localStorage.setItem("mainContentFile", "html/maincontent/employee/pay.html");
    localStorage.setItem("sideNavSelection", "3");
    $("#mainContent").load(localStorage.getItem("mainContentFile"));
    highlightSelectionSideNav(element);
}

function makeCalendar() {
    //init calendar
    var calendar = document.getElementById("calendar");
    if (!calendar) {
        //no calendar, stop
        return;
    }

    $("#calendar").fullCalendar({
        //put options and callbacks here
        dayClick: function () {
            alert("you clicked a day!");
        }
    });

    //change calendar view to weekly adenda style
    $("#calendar").fullCalendar("changeView", "agendaWeek");
}
////////////////////////////


function getElementWidth(element) {
    var elmRect = element.getBoundingClientRect();
    var borderLeft = parseInt(element.style.borderLeftWidth, 10);
    var borderRight = parseInt(element.style.borderRightWidth, 10);
    var paddingLeft = parseInt(element.style.paddingLeft, 10);
    var paddingRight = parseInt(element.style.paddingRight, 10);

    var width = elmRect.width;
    if (borderLeft) width += borderLeft;
    if (borderRight) width += borderRight;
    if (paddingLeft) width += paddingLeft;
    if (paddingRight) width += paddingRight;

    return width;
}