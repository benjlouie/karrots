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

function logout() {
    localStorage.clear();
    location.reload();
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
        topNav.style.display = "none";
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
    localStorage.setItem("sideNavFile", "");
    localStorage.setItem("mainContentFile", "html/maincontent/startpage.html");
    localStorage.setItem("topNavSelection", "");

    highlightSelectionTopNav()
    hideSideNav();
    //open mainContent
    $("#mainContent").load(localStorage.getItem("mainContentFile")); //load maincontent
    var mainContent = document.getElementById("mainContent");
    mainContent.style.left = "0px";
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

function openSideNav_master(sideNavFile, element) {
    if (localStorage.getItem("sideNavFile") == sideNavFile) {
        //already loaded, do nothing
        return;
    }
    //different tab, continue
    localStorage.setItem("sideNavFile", sideNavFile);
    localStorage.setItem("topNavSelection", element.innerHTML);
    localStorage.setItem("sideNavSelection", ""); //new tab, no sidenav selection
    setSideNavVisible();
    startupSideNav();
    highlightSelectionTopNav();
}

function openSideNavAccount(element) {
    openSideNav_master("html/sidenav/account.html", element);
}
function openSideNavRegistration(element) {
    openSideNav_master("html/sidenav/registration.html", element);
}
function openSideNavClasses(element) {
    openSideNav_master("html/sidenav/classes.html", element);
}
function openSideNavEmployee(element) {
    openSideNav_master("html/sidenav/employee.html", element);
}
function openSideNavMockups(element) {
    openSideNav_master("html/sidenav/mockups.html", element);
}

function minimizeSideNav() {
    var sideNav = document.getElementById("sideNav");
    sideNav.style.minWidth = "40px";
    sideNav.style.borderRightWidth = "2px";
    localStorage.setItem("sideNavDisplay", "minimized");/*save sidenav as minimized*/

    //load sidenav, minimize after done loading
    $("#sideNav").load(localStorage.getItem("sideNavFile"), function () {
        setSideNavMinimizedContents();
        highlightSelectionSideNav();
    });

    var mainContent = document.getElementById("mainContent");
    mainContent.style.left = "42px";
}

function maximizeSideNav() {
    var sideNav = document.getElementById("sideNav");
    sideNav.style.minWidth = "200px";
    sideNav.style.borderRightWidth = "2px";

    //load currently selected tab
    $("#sideNav").load(localStorage.getItem("sideNavFile"), highlightSelectionSideNav);
    var mainContent = document.getElementById("mainContent");
    mainContent.style.left = "202px";

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
    var sideNavSelection = localStorage.getItem("sideNavSelection"); //actually a string, but javascript?

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
        $("#mainContent").load(localStorage.getItem("mainContentFile"), mainContentLoader);
    } else {
        //clear main content
        var mainContent = document.getElementById("mainContent");
        while (mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild);
        }
    }
}

function mainContentLoader() {
    var mainContentFile = localStorage.getItem("mainContentFile");

    //load calendar after everything else, need these
    var d1 = new $.Deferred();
    //var d2 = new $.Deferred();
    if (localStorage.getItem("mainContentCalendar") == "true") {
        $.when(d1/*, d2*/).then(function () {
            makeCalendar();
        })
    }

    //menuBar loading
    if (localStorage.getItem("mainContentMenuBar") == "true") {
        var splitPos = mainContentFile.length - 5; //string without ending ".html"
        var menuBarFile = mainContentFile.substr(0, splitPos) + "_menuBar.html";
        $("#mc_menuBar").load(menuBarFile, function () { d1.resolve(); });
    } else {
        d1.resolve();
    }
}

//loads in the mainContent
function openMainContent_master(element, mainContentFile, sideNavSelection, calendar, menuBar) {
    localStorage.setItem("mainContentFile", mainContentFile);
    localStorage.setItem("sideNavSelection", sideNavSelection);
    localStorage.setItem("mainContentCalendar", calendar);
    localStorage.setItem("mainContentMenuBar", menuBar);

    $("#mainContent").load(localStorage.getItem("mainContentFile"), mainContentLoader);

    highlightSelectionSideNav(element);
}

//Account
function openMainContent_Account_Summary(element) {
    openMainContent_master(element, "html/maincontent/account/summary.html", 1, false, false);
}
function openMainContent_Account_Balance(element) {
    openMainContent_master(element, "html/maincontent/account/balance.html", 2, false, false);
}
function openMainContent_Account_Settings(element) {
    openMainContent_master(element, "html/maincontent/account/settings.html", 3, false, false);
}

//Registration
function openMainContent_Registration_Status(element) {
    openMainContent_master(element, "html/maincontent/registration/status.html", 1, false, false);
}
function openMainContent_Registration_Schedule(element) {
    openMainContent_master(element, "html/maincontent/registration/schedule.html", 2, true, false);
}
function openMainContent_Registration_Classes(element) {
    openMainContent_master(element, "html/maincontent/registration/classes.html", 3, false, false);
}

//Classes
function openMainContent_Classes_List(element) {
    openMainContent_master(element, "html/maincontent/classes/list.html", 1, false, false);
}
function openMainContent_Classes_Enrollment(element) {
    openMainContent_master(element, "html/maincontent/classes/enrollment.html", 2, false, false);
}
function openMainContent_Classes_Grades(element) {
    openMainContent_master(element, "html/maincontent/classes/grades.html", 3, false, false);
}

//employee
function openMainContent_Employee_Job(element) {
    openMainContent_master(element, "html/maincontent/employee/job.html", 1, false, false);
}
function openMainContent_Employee_Timesheet(element) {
    openMainContent_master(element, "html/maincontent/employee/timesheet.html", 2, false, false);
}
function openMainContent_Employee_Pay(element) {
    openMainContent_master(element, "html/maincontent/employee/pay.html", 3, false, false);
}

//mockups
function openMainContent_Mockups_ClassSchedule(element) {
    openMainContent_master(element, "html/maincontent/mockups/schedule.html", 1, true, true);
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