//initialize everything as needed
//should be called in order of declaration

window.onload = function () {
    startup_localStorage();
    startup_contentCalls();
};

function startup_localStorage() {
    //array of [LSItem, defaultValue]
    var LSVars = [
        ["topNavDisplay", "hidden"],
        ["topNavFile", "html/topnav/student"],
        ["sideNavDisplay", "hidden_maximized"],
        ["sideNavFile", "html/sidenav/account.html"],
        ["mainContentFile", ""],
        ["loginContentFile", "html/login.html"],
        ["accountType", "none"]
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