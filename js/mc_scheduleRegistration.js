//TODO: add remove button to the menuBar when a class is selected on the calendar
////Schedule specific////
function scheduleRegistration_classListSwitch(element) {
    if (event) {
        event.cancelBubble = true;
        if (event.stopPropagation) {
            //ensure only add/remove switch is affected
            event.stopPropagation();
        }
    }

    //TODO: put this in the crn if checks below
    if (element.innerHTML == "Add") {
        element.innerHTML = "Remove";
        element.style.backgroundColor = "#74dd8f";
        element.style.color = "black";
    } else {
        element.innerHTML = "Add";
        element.style.backgroundColor = "#5f5f5f";
        element.style.color = "#babab2";
    }

    var crnTd = element.nextElementSibling;
    var crn = copy(crnTd.innerHTML); //copy just in case
    //only add if new
    if (crn in kScheduleRegistration_selectedClasses) {
        //TODO: already added, delete it from stuff
    } else {
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

function scheduleRegistration_eventsInitialRender() {
    var selectedClasses = kScheduleRegistration_selectedClasses;

    var events = [];
    for (var crn in selectedClasses) {
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

    //TODO: fill selectedClasses sideList

    //TODO: move this somewhere better
    //should be thing in navigation.js
    scheduleRegistration_fillClassList("Computer Science"); //"Computer Science"
    scheduleRegistration_fillSelectedClassList();
}

//TODO: funciton that changes the add/remove buttons based on the currently selected classes
//used when first loading the classList

function scheduleRegistration_fillSelectedClassList() {
    var selectedClasses = kScheduleRegistration_selectedClasses;
    var sideListUl = document.getElementById("mc_scheduleRegistration_selectedClassList");
    for (var crn in selectedClasses) {
        var li = scheduleRegistration_createSelectedClassEntry(crn);
        sideListUl.appendChild(li);
    }
}

function scheduleRegistration_fillClassList(subject) {
    //TODO: have global list of CRNs that hold the current subject classes
    //load from that list here
    //will allow for sorting by arbitrary columns
    var classTable = document.getElementById("mc_scheduleRegistration_classTable");
    var tbody = classTable.getElementsByTagName("tbody")[0];

    //clear it out
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    //add the classes
    var tableEmpty = true;
    for (var key in kClasses) {
        var curClass = kClasses[key];
        if (curClass.subject == subject) {
            var tr = scheduleRegistration_createClassListEntry(key);
            tbody.appendChild(tr);
            tableEmpty = false
        }
    }

    //if no classes, add a message that there are no classes
    if (tableEmpty) {
        var tr = document.createElement("tr");
        //var td = document.createElement("td");
        //td.colSpan = 12;
        var text = document.createTextNode("No Classes in " + subject);
        //td.appendChild(text);
        //tr.appendChild(td);
        tr.appendChild(text);
        tr.style.textAlign = "center";
        tbody.appendChild(tr);
    }
}

function scheduleRegistration_createClassListEntry(crn) {
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
    var td = document.createElement("td");
    var text = document.createTextNode("Add");
    td.appendChild(text);
    td.className = "mc_classList_addRemoveSwitch";
    td.onclick = function () { scheduleRegistration_classListSwitch(this) };
    tr.appendChild(td);

    //crn
    td = document.createElement("td");
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