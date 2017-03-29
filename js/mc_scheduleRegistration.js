////Schedule specific////
function scheduleRegistration_classListSwitch(element) {
    if (event) {
        event.cancelBubble = true;
        if (event.stopPropagation) {
            //ensure only add/remove switch is affected
            event.stopPropagation();
        }
    }

    var crnTd = element.nextElementSibling;
    var crn = copy(crnTd.innerHTML); //copy just in case
    //only add if new
    if (crn in kScheduleRegistration_selectedClasses) {
        //already added, delete it from calendar and selectedClassList
        scheduleRegistration_toggleAddRemovebtn(element, false);
        scheduleRegistration_removeSideListEntry(crn);
        $("#calendar").fullCalendar('removeEvents', function (event) {
            var eventCrn = event._id.split("_")[0];
            return crn == eventCrn;
        });
        //remove from global
        delete kScheduleRegistration_selectedClasses[crn];
        //if selected remove that localStorage entry
        if (localStorage.getItem("mainContentCalendarSelectedCrn") == crn) {
            localStorage.setItem("mainContentCalendarSelectedCrn", "");
            //disable remove btn
            var removeBtn = document.getElementById("mc_scheduleRegistration_removeSelectedClassBtn");
            removeBtn.disabled = true;
            removeBtn.style.opacity = 0.4;
        }
    } else {
        scheduleRegistration_toggleAddRemovebtn(element, true);
        //add class to calendar
        var classData = kClasses[crn];
        var events = [];
        for (var t = 0; t < classData.times.length; t++) {
            var event = {
                id: crn + "_" + t, //crn stored as id
                title: classData.course, //use course name for event title
                start: classData.times[t][0],
                end: classData.times[t][1],
                dow: classData.days[t],
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: false,
                className: "calendarEvent_moreBorder",
            };
            events.push(event);
        }
        $("#calendar").fullCalendar('renderEvents', events);

        //add class to global
        kScheduleRegistration_selectedClasses[crn] = true;

        //add class to sideList
        var ul = document.getElementById("mc_scheduleRegistration_selectedClassList");
        var li = scheduleRegistration_createSelectedClassEntry(crn);
        ul.appendChild(li);
    }

    //check for overlaps
    handleOverlaps();
    $("#calendar").fullCalendar('rerenderEvents');
}

//sorts the classList by the selected column
function scheduleRegistration_classListColClick(sortAttribute) {
    var subject = localStorage.getItem("scheduleRegistration_currentSubject");
    var oldSortAttribute = localStorage.getItem("scheduleRegistration_sortAttribute");

    //get the classes in the selected subject
    if (subject in kSubjects) {
        kScheduleRegistration_subjectClasses = kSubjects[subject];
    } else {
        kScheduleRegistration_subjectClasses = [];
    }

    //sort by new column or reverse order of current sort attribute
    if (oldSortAttribute == sortAttribute) {
        //same attribute, simply reverse the classes
        kScheduleRegistration_subjectClasses.reverse();
    } else {
        //sort by attribute
        localStorage.setItem("scheduleRegistration_sortAttribute", sortAttribute);
        var sortFunc = scheduleRegistration_getSortFunc(sortAttribute);
        kScheduleRegistration_subjectClasses.sort(sortFunc);
    }
    
    //put sorted classes into the list
    scheduleRegistration_fillClassList();
}

//toggles the tdElement
//optional: on is true or false, sets tdElement to remov/add respectively
function scheduleRegistration_toggleAddRemovebtn(tdElement, on) {
    if (on === undefined) {
        //toggle
        if (element.innerHTML == "Add") {
            on = false;
        } else {
            on = true;
        }
    }

    if (on) {
        //set to remove
        tdElement.innerHTML = "Remove";
        tdElement.style.backgroundColor = "#74dd8f";
        tdElement.style.color = "black";
    } else {
        //set to Add
        tdElement.innerHTML = "Add";
        tdElement.style.backgroundColor = "#5f5f5f";
        tdElement.style.color = "#babab2";
    }
}

function scheduleRegistration_classListRowClick(element) {
    var detailRow = element.nextElementSibling;
    var detailContents = detailRow.firstElementChild.firstElementChild;
    var addRemoveBtn = element.firstElementChild;

    if (detailContents == null) {
        //nothing there so do nothing for now
        return;
    }
    if (detailRow.style.display == "none" || detailRow.style.display == "") {
        addRemoveBtn.rowSpan = 2; //add button takes up both rows
        detailRow.style.display = "table-row";
    } else {
        addRemoveBtn.rowSpan = 1; //add button takes up both rows
        detailRow.style.display = "none";
    }
}

//removes the class with the given crn
//in no crn is given, uses the currently selected class if available
function scheduleRegistration_removeClass(crn) {
    var selectedCrn;
    if (crn === undefined) {
        //get from selected class
        selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
        if (selectedCrn == "") {
            //couldn't get crn, exit
            return;
        }

        //disable remove btn
        var removeBtn = document.getElementById("mc_scheduleRegistration_removeSelectedClassBtn");
        removeBtn.disabled = true;
        removeBtn.style.opacity = 0.4;
    } else {
        selectedCrn = crn;
    }

    //remove from global
    delete kScheduleRegistration_selectedClasses[selectedCrn];
    //remove sideList entry
    scheduleRegistration_removeSideListEntry(selectedCrn);
    //deselect classList entry
    scheduleRegistration_deselectClassListEntry(selectedCrn);
    //remove from calendar
    $("#calendar").fullCalendar('removeEvents', function (event) {
        var eventCrn = event._id.split("_")[0];
        return selectedCrn == eventCrn;
    });

    //check for overlaps and rerender
    handleOverlaps();
    $("#calendar").fullCalendar('rerenderEvents');

    //clear selected crn
    localStorage.setItem("mainContentCalendarSelectedCrn", "");
    var calendar = $('#calendar');
    var events = calendar.fullCalendar('clientEvents');
    for (var i = 0; i < events.length; i++) {
        events[i].borderColor = "black";
    }
    calendar.fullCalendar("rerenderEvents");
}

//removes the class with the given crn
//in no crn is given, uses the currently selected class if available
function scheduleRegistration_removeSideListEntry(crn) {
    var selectedCrn;
    if (crn === undefined) {
        //get from selected class
        selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
        if (selectedCrn == "") {
            //couldn't get crn, exit
            return;
        }
    } else {
        selectedCrn = crn;
    }

    //remove from side list
    var ul = document.getElementById("mc_scheduleRegistration_selectedClassList");
    var crnTds = ul.getElementsByClassName("mc_scheduleRegistration_selectedClassListItem_crn");
    for (var i = 0; i < crnTds.length; i++) {
        if (crnTds[i].innerHTML == selectedCrn) {
            //found item, remove li from sideList
            var li = html_getFirstAncestorTag(crnTds[i], "li")
            if (li == null) {
                //error
                console.log("couldn't find ancestor li of sideList crn: " + selectedCrn);
                return;
            }

            ul.removeChild(li);
            return;
        }
    }
}

//deselects the class with the given crn
//in no crn is given, uses the currently selected class if available
function scheduleRegistration_deselectClassListEntry(crn) {
    var selectedCrn;
    if (crn === undefined) {
        //get from selected class
        selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
        if (selectedCrn == "") {
            //couldn't get crn, exit
            return;
        }
    } else {
        selectedCrn = crn;
    }

    //ensure that subject is currently being displayed in classList
    var currentSubject = localStorage.getItem("scheduleRegistration_currentSubject");
    var classData = kClasses[selectedCrn];
    if (classData.subject != currentSubject) {
        //classList is in different subject, do nothing
        return;
    }

    var table = document.getElementById("mc_scheduleRegistration_classTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    var crnTds = tbody.getElementsByClassName("mc_scheduleRegistration_classListItem_crn");
    for (var i = 0; i < crnTds.length; i++) {
        if (crnTds[i].innerHTML == selectedCrn) {
            //found crn, get tr ancestor
            var tr = html_getFirstAncestorTag(crnTds[i], "tr");
            if (tr == null) {
                //error
                console.log("couldn't find ancestor tr of classList crn: " + selectedCrn);
                return;
            }
            //toggle add/remove btn
            var td = tr.getElementsByClassName("mc_classList_addRemoveSwitch")[0];
            scheduleRegistration_toggleAddRemovebtn(td, false);
        }
    }
}

function scheduleRegistration_eventClickHandler(event, jsevent, view) {
    var eventCrn = event._id.split("_")[0];
    localStorage.setItem("mainContentCalendarSelectedCrn", eventCrn);
    highlightSelectedEvents();
    $('#calendar').fullCalendar('rerenderEvents');

    //set remove btn as clickable
    var removeBtn = document.getElementById("mc_scheduleRegistration_removeSelectedClassBtn");
    removeBtn.disabled = false;
    removeBtn.style.opacity = 1;
    
    //expand details in sideList
    var ul = document.getElementById("mc_scheduleRegistration_selectedClassList");
    var crnTds = ul.getElementsByClassName("mc_scheduleRegistration_selectedClassListItem_crn");
    var li;
    for (var i = 0; i < crnTds.length; i++) {
        if (crnTds[i].innerHTML == eventCrn) {
            //found item, remove li from sideList
            li = html_getFirstAncestorTag(crnTds[i], "li")
            if (li == null) {
                //error
                console.log("couldn't find ancestor li of sideList crn: " + selectedCrn);
                return;
            }
            var a = li.firstChild;
            mc_sideListDetailToggle(a, true);
            break;
        }
    }

    //highlight only selected <li><a>
    var sideItems = ul.children; 
    for (var i = 0; i < sideItems.length; i++) {
        sideItems[i].firstChild.style.backgroundColor = "#5f5f5f"; //dark grey
        sideItems[i].firstChild.style.color = "#f1f1f1"; //light grey
    }
    if (li) {
        li.firstChild.style.backgroundColor = "#e6e600";//light yellow
        li.firstChild.style.color = "black";
    }
}

//renders the initial classes
//also does other loading for this page currently
function scheduleRegistration_eventsInitialRender() {
    var selectedClasses = kScheduleRegistration_selectedClasses;

    var events = [];
    for (var crn in selectedClasses) {
        if (!(crn in kClasses)) {
            //no longer in the global, remove it
            delete selectedClasses[crn];
            continue;
        }
        var classData = kClasses[crn];
        for (var t = 0; t < classData.times.length; t++) {
            //don't need to copy anything b/c classes shouldn't be moving around
            var event = {
                id: crn + "_" + t, //crn stored as id
                title: classData.course, //use course name for event title
                start: classData.times[t][0],
                end: classData.times[t][1],
                dow: classData.days[t],
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: false,
                className: "calendarEvent_moreBorder",
            };
            events.push(event);
        }
    }
    $("#calendar").fullCalendar('renderEvents', events);
    
    //TODO: replace this section with a loading function that is called from navigation.js

    //TODO: load subjects into dropdown
    scheduleRegistration_initClassList();
    scheduleRegistration_fillSelectedClassList();
    handleOverlaps();
    $("#calendar").fullCalendar('rerenderEvents');
}

function scheduleRegistration_fillSelectedClassList() {
    var selectedClasses = kScheduleRegistration_selectedClasses;
    var sideListUl = document.getElementById("mc_scheduleRegistration_selectedClassList");
    for (var crn in selectedClasses) {
        var li = scheduleRegistration_createSelectedClassEntry(crn);
        sideListUl.appendChild(li);
    }
}

function scheduleRegistration_initClassList() {
    var subject = localStorage.getItem("scheduleRegistration_currentSubject");
    var sortAttribute = localStorage.getItem("scheduleRegistration_sortAttribute");
    var sortFunc = scheduleRegistration_getSortFunc(sortAttribute);

    //sort classes appropriately
    if (subject in kSubjects) {
        kScheduleRegistration_subjectClasses = kSubjects[subject]; //classes in that subject
    } else {
        kScheduleRegistration_subjectClasses = [];
    }
    kScheduleRegistration_subjectClasses.sort(sortFunc);

    //put classes into the list
    scheduleRegistration_fillClassList();
}

//fills the classList from kScheduleRegistration_subjectClasses in their given order
function scheduleRegistration_fillClassList() {
    var subject = localStorage.getItem("scheduleRegistration_currentSubject");
    var classTable = document.getElementById("mc_scheduleRegistration_classTable");
    var tbody = classTable.getElementsByTagName("tbody")[0];

    //clear it out
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //add the classes
    for (var i = 0; i < kScheduleRegistration_subjectClasses.length; i++) {
        var curCrn = kScheduleRegistration_subjectClasses[i];

        var selected = false;
        if (curCrn in kScheduleRegistration_selectedClasses) {
            selected = true;
        }
        var tr = scheduleRegistration_createClassListEntry(curCrn, selected);
        tbody.appendChild(tr);
        tableEmpty = false
    }

    //if no classes, add a message that there are no classes
    if (kScheduleRegistration_subjectClasses.length == 0) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var text = document.createTextNode("No Classes in " + subject);
        td.colSpan = 12;
        td.appendChild(text);
        td.style.textAlign = "center";
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function scheduleRegistration_getSortFunc(sortAttribute) {
    //get sorting function
    switch (sortAttribute) {
        case 'course':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                return a.course.localeCompare(b.course);
            };
        case 'title':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                return a.title.localeCompare(b.title);
            };
        case 'time':
        case 'times':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                //only compare startTime of first time
                return a.times[0][0].localeCompare(b.times[0][0]);
            };
        case 'day':
        case 'days':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                //only compare first day of first time
                return a.days[0][0] - b.days[0][0];
            };
        case 'teacher':
        case 'instructor':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                return a.teacher.localeCompare(b.teacher);
            };
        case 'building':
        case 'location':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                var locA = a.building + " " + a.room;
                var locB = b.building + " " + b.room;
                return locA.localeCompare(locB);
            };
        case 'hrs':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                return a.hrs - b.hrs;
            };
            //TODO: need backend for limit and enroll
        case 'limit':
        case 'enroll':
        case 'seats':
            return function (a, b) {
                a = kClasses[a];
                b = kClasses[b];
                return a.seats - b.seats;
            };
        case 'crn':
        default:
            return function (a, b) {
                return a.localeCompare(b);
            };
    }
}

//create classList entry based on crn
//if selected is true, changes the add/remove btn
function scheduleRegistration_createClassListEntry(crn, selected) {
    var dayAbbrev = {
        0: 'U',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
        6: 'S'
    };
    var classData = kClasses[crn];

    var tr = document.createElement("tr");
    //TODO: turn on if I decide there will be a detail entry
    //tr.onclick = function () { scheduleRegistration_classListRowClick(this) };

    //add/rem button
    var text;
    var td = document.createElement("td");
    if (selected) {
        text = document.createTextNode("Remove");
        td.style.backgroundColor = "#74dd8f";
        td.style.color = "black";
    } else {
        text = document.createTextNode("Add");
        td.style.backgroundColor = "#5f5f5f";
        td.style.color = "#babab2";
    }
    td.appendChild(text);
    td.className = "mc_classList_addRemoveSwitch";
    td.onclick = function () { scheduleRegistration_classListSwitch(this) };
    tr.appendChild(td);

    //crn
    td = document.createElement("td");
    td.className = "mc_scheduleRegistration_classListItem_crn";
    text = document.createTextNode(crn);
    td.appendChild(text);
    tr.appendChild(td);

    //course
    td = document.createElement("td");
    text = document.createTextNode(classData.course);
    td.appendChild(text);
    tr.appendChild(td);

    //title
    td = document.createElement("td");
    text = document.createTextNode(classData.title);
    td.appendChild(text);
    tr.appendChild(td);

    //time
    td = document.createElement("td");
    var times = classData.times;
    for (var t = 0; t < times.length; t++) {
        if (t > 0) {
            td.appendChild(document.createElement("br")); //line break between entries
        }
        text = document.createTextNode(times[t][0] + " - " + times[t][1]);
        td.appendChild(text);
    }
    tr.appendChild(td);

    //days
    td = document.createElement("td");
    var days = classData.days;
    for (var t = 0; t < days.length; t++) {
        if (t > 0) {
            td.appendChild(document.createElement("br")); //line break between entries
        }
        var dayString = "";
        for (var d = 0; d < days[t].length; d++) {
            dayString += dayAbbrev[days[t][d]] + " ";
        }
        dayString = dayString.substr(0, dayString.length - 1);
        text = document.createTextNode(dayString);
        td.appendChild(text);
    }
    tr.appendChild(td);

    //instructor
    td = document.createElement("td");
    text = document.createTextNode(classData.teacher);
    td.appendChild(text);
    tr.appendChild(td);

    //location
    td = document.createElement("td");
    text = document.createTextNode(classData.building + " " + classData.room);
    td.appendChild(text);
    tr.appendChild(td);

    //hrs
    td = document.createElement("td");
    text = document.createTextNode(classData.hrs);
    td.appendChild(text);
    tr.appendChild(td);

    //seats
    td = document.createElement("td");
    text = document.createTextNode(classData.seats);
    td.appendChild(text);
    tr.appendChild(td);

    //limit
    td = document.createElement("td");
    text = document.createTextNode(classData.seats);
    td.appendChild(text);
    tr.appendChild(td);

    //enroll
    td = document.createElement("td");
    text = document.createTextNode("0"); //TODO: can't be fixed for now, need database
    td.appendChild(text);
    tr.appendChild(td);

    return tr;
}

function scheduleRegistration_createSelectedClassEntry(crn) {
    var dayAbbrev = {
        0: 'U',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
        6: 'S'
    };
    var classData = kClasses[crn];

    var li = document.createElement("li");

    //header
    var a = document.createElement("a");
    a.onclick = function () { mc_sideListDetailToggle(this) };
    var text = document.createTextNode(classData.course);
    a.appendChild(text);
    var div = document.createElement("div");
    div.className = "mc_sideListDetailToggleIcon";
    text = document.createTextNode("+");
    div.appendChild(text);
    a.appendChild(div);
    li.appendChild(a);

    //detail div
    //table
    var table = document.createElement("table");
    table.className = "mc_sideListDetail_class";

    //title
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.colSpan = 3;
    text = document.createTextNode(classData.title);
    th.appendChild(text);
    tr.appendChild(th);
    table.appendChild(tr);

    //teacher
    tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colSpan = 3;
    text = document.createTextNode(classData.teacher);
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);

    //location
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.colSpan = 3;
    text = document.createTextNode(classData.building + " " + classData.room);
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);

    //time/days header
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.colSpan = 2;
    text = document.createTextNode("Time");
    th.appendChild(text);
    tr.appendChild(th);
    //days
    th = document.createElement("th");
    text = document.createTextNode("Days");
    th.appendChild(text);
    tr.appendChild(th);
    table.appendChild(tr);

    //time/days
    tr = document.createElement("tr");
    //times
    td = document.createElement("td");
    td.colSpan = 2;
    var times = classData.times;
    for (var i = 0; i < times.length; i++) {
        if (i > 0) {
            td.appendChild(document.createElement("br")); //line break between entries
        }
        text = document.createTextNode(times[i][0] + " - " + times[i][1]);
        td.appendChild(text);
    }
    tr.appendChild(td);
    //days
    td = document.createElement("td");
    var days = classData.days;
    for (var i = 0; i < days.length; i++) {
        if (i > 0) {
            td.appendChild(document.createElement("br")); //line break between entries
        }
        var dayString = "";
        for (var d = 0; d < days[i].length; d++) {
            dayString += dayAbbrev[days[i][d]] + " ";
        }
        dayString = dayString.substr(0, dayString.length - 1);
        text = document.createTextNode(dayString);
        td.appendChild(text);
    }
    tr.appendChild(td);
    table.appendChild(tr);

    //crn/hrs header
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.colSpan = 2;
    text = document.createTextNode("CRN");
    th.appendChild(text);
    tr.appendChild(th);
    //hrs
    th = document.createElement("th");
    text = document.createTextNode("Hrs");
    th.appendChild(text);
    tr.appendChild(th);
    table.appendChild(tr);

    //crn/hrs
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.colSpan = 2;
    td.className = "mc_scheduleRegistration_selectedClassListItem_crn";
    text = document.createTextNode(crn);
    td.appendChild(text);
    tr.appendChild(td);
    //hrs
    td = document.createElement("td");
    text = document.createTextNode(classData.hrs);
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);

    //seats/limit/enroll header
    tr = document.createElement("tr");
    th = document.createElement("th");
    text = document.createTextNode("Seats");
    th.appendChild(text);
    tr.appendChild(th);
    //limit
    th = document.createElement("th");
    text = document.createTextNode("Limit");
    th.appendChild(text);
    tr.appendChild(th);
    //enroll
    th = document.createElement("th");
    text = document.createTextNode("Enroll");
    th.appendChild(text);
    tr.appendChild(th);
    table.appendChild(tr);

    //seats/limit/enroll
    tr = document.createElement("tr");
    td = document.createElement("td");
    text = document.createTextNode(classData.seats);
    td.appendChild(text);
    tr.appendChild(td);
    //limit
    td = document.createElement("td");
    text = document.createTextNode(classData.seats);
    td.appendChild(text);
    tr.appendChild(td);
    //enroll
    td = document.createElement("td");
    text = document.createTextNode("0"); //TODO: need database to get actual enrolled
    td.appendChild(text);
    tr.appendChild(td);
    table.appendChild(tr);

    //detail div
    div = document.createElement("div");
    div.className = "mc_sideListDetail";
    div.appendChild(table);
    li.appendChild(div);

    return li;
}