////ManageClasses Specific////


//sets subject and classList based on selection
function manageClasses_subjectOnclick(element) {
    var subject = element.innerText;
    var oldSubject = localStorage.getItem("manageClasses_currentSubject");
    if (oldSubject == subject) {
        //no chenge don't do anything
        return;
    }
    
    //load the new subject's classes
    localStorage.setItem("manageClasses_currentSubject", element.innerText);
    //load classes to calendar based on subject
    manageClasses_loadSubjectEvents();
}

function manageClasses_addTime(element) {
    var startTime = document.getElementById("mc_manageClasses_timeStart");
    var endTime = document.getElementById("mc_manageClasses_timeEnd");
    var checkedDays = [];
    var dayAbbrev = {
        0: 'U',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
        6: 'S',
        U: 0,
        M: 1,
        T: 2,
        W: 3,
        R: 4,
        F: 5,
        S: 6
    };

    //check times
    if (startTime.value == "" || endTime.value == ""
        || startTime.value > endTime.value) {
        //TODO: add a popup or something (no time/bad time)
        return;
    }

    //check days
    var validDay = false;
    var dayString = "";
    var days = {};
    //list of <div><label \><input \></div> elements
    var timeData = document.getElementById("mc_manageClasses_addTime_container").children;
    for (var i = 0; i < 7; i++) {
        //get checkbox
        var dayCheckbox = timeData[i].lastElementChild;
        checkedDays[i] = dayCheckbox;
        validDay |= checkedDays[i].checked;
        if (checkedDays[i].checked) {
            dayString += dayAbbrev[i] + " ";
            days[dayAbbrev[i]] = true; //for use when checking for time conflicts
        }
    }
    dayString = dayString.substr(0, dayString.length - 1);
    if (!validDay) {
        //TODO: add a popup or something (no days selected)
        return;
    }

    var startTimeMeridian = time_24ToMeridian(startTime.value);
    var endTimeMeridian = time_24ToMeridian(endTime.value);

    //ensure time isn't already in list
    var timesListBody = document.getElementById("mc_manageClasses_timesList");
    var times = timesListBody.children;
    //go through each timeList entry
    for (var i = 0; i < times.length; i++) {
        var timeData = times[i].children;
        var curStart = time_meridianTo24(timeData[0].innerHTML);
        var curEnd = time_meridianTo24(timeData[1].innerHTML);
        //check for time conflict
        if (curStart < endTime.value && curEnd > startTime.value) {
            //is it on an overlapping day?
            var curDays = timeData[2].innerHTML.split(" ");
            for (var d = 0; d < curDays.length; d++) {
                if (curDays[d] in days) {
                    //overlapping time conflict, don't add
                    //TODO: add a popup or something (day-time overlap)
                    return;
                }
            }
        }
    }

    //make new node
    var timeEntry = document.createElement("tr");
    //startTime
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(startTimeMeridian));
    timeEntry.appendChild(td);
    //endTime
    td = document.createElement("td");
    td.appendChild(document.createTextNode(endTimeMeridian));
    timeEntry.appendChild(td);
    //days
    td = document.createElement("td");
    td.appendChild(document.createTextNode(dayString));
    timeEntry.appendChild(td);
    //remove clickable
    td = document.createElement("td");
    td.appendChild(document.createTextNode("Remove"));
    td.onclick = function () { manageClasses_timeListRemove(this) }; //needed lambda for function arg
    timeEntry.appendChild(td);

    timesListBody.appendChild(timeEntry);

    return;
}

function manageClasses_timeListRemove(element) {
    var tr = element.parentNode;
    var tbody = tr.parentNode;

    tbody.removeChild(tr);

    return;
}

function manageClasses_addClass() {
    resetRevertColors();
    var dayAbbrev = {
        U: 0,
        M: 1,
        T: 2,
        W: 3,
        R: 4,
        F: 5,
        S: 6
    };
    var subject = localStorage.getItem("manageClasses_currentSubject");
    var crn = document.getElementById("mc_manageClasses_input_crn");
    var title = document.getElementById("mc_manageClasses_input_title");
    var course = document.getElementById("mc_manageClasses_input_course");
    var hrs = document.getElementById("mc_manageClasses_input_hrs");
    var seats = document.getElementById("mc_manageClasses_input_seats");
    var building = document.getElementById("mc_manageClasses_input_building");
    var room = document.getElementById("mc_manageClasses_input_room");

    var errorList = document.getElementById("mc_manageClasses_errorList");
    //clear errorList
    while (errorList.firstChild) {
        errorList.removeChild(errorList.firstChild);
    }
    //init errorList
    errorList.appendChild(document.createTextNode("Missing/Errors:"));
    errorList.appendChild(document.createElement("br"));

    var validAdd = true;

    if (crn.value == "") {
        errorList.appendChild(document.createTextNode("CRN #"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    } else if (crn.value in kClasses) {
        //crn is already in global class list
        errorList.appendChild(document.createTextNode("CRN # Already taken"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }
    if (title.value == "") {
        errorList.appendChild(document.createTextNode("Title"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }
    if (course.value == "") {
        errorList.appendChild(document.createTextNode("Course Name"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }
    if (hrs.value == "") {
        errorList.appendChild(document.createTextNode("Hrs #"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }
    if (seats.value == "") {
        errorList.appendChild(document.createTextNode("Seats #"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }
    if (building.value == "") {
        building.value = "TBD";
    }
    if (room.value == "") {
        room.value = "TBD";
    }

    var timeListBody = document.getElementById("mc_manageClasses_timesList");
    var times = timeListBody.children;
    if (times.length == 0) {
        errorList.appendChild(document.createTextNode("At least one time"));
        errorList.appendChild(document.createElement("br"));
        validAdd = false;
    }

    if (validAdd) {
        //valid, hide errorList
        errorList.style.display = "none";
    } else {
        //not valid, display errors and exit
        errorList.style.display = "initial";
        return;
    }

    //add events to calendar (1 for each time)
    var events = [];
    var classTimes = [];
    var classDays = [];
    for (var i = 0; i < times.length; i++) {
        var timeData = times[i].children;
        var startTime = timeData[0].innerHTML;
        var endTime = timeData[1].innerHTML;
        startTime = time_meridianTo24(startTime);
        endTime = time_meridianTo24(endTime);
        //get days
        var eventDays = [];
        var days = timeData[2].innerHTML;
        days = days.split(" ");
        for (var d = 0; d < days.length; d++) {
            eventDays.push(dayAbbrev[days[d]]);
        }

        classTimes.push([startTime, endTime]);
        classDays.push(eventDays);

        events[i] = {
            id: crn.value + "_" + i,
            title: course.value,
            start: startTime,
            end: endTime,
            dow: eventDays,
            color: '#5f5f5f',
            borderColor: 'black',
            textColor: 'black',
            editable: true,
            className: "calendarEvent_moreBorder",
        };
    }

    //add class to global list of classes
    var newClass = {
        subject: subject,
        title: title.value,
        course: course.value,
        teacher: "TBD",
        hrs: hrs.value,
        seats: seats.value,
        building: building.value,
        room: room.value,
        times: classTimes, //times: [start, end]
        days: classDays, //days for each time section
    };

    //add to global classes and subject lists
    kClasses[crn.value] = newClass;
    kSubjects[subject].push(crn.value);

    //render events on calendar
    $("#calendar").fullCalendar('renderEvents', events);
}

function manageClasses_updateClass() {
    resetRevertColors();
    //remove selected CRN from classList
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    delete kClasses[selectedCrn];
    //remove selected CRN from calendar
    $("#calendar").fullCalendar('removeEvents', function (event) {
        selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
        eventCrn = event._id.split("_")[0];
        if (eventCrn == selectedCrn) {
            return true;
        }
        return false;
    });

    //add the class and times like normal
    manageClasses_addClass();

    highlightSelectedEvents();
    $("#calendar").fullCalendar('rerenderEvents');
}

function manageClasses_clearSelection() {
    resetRevertColors();
    //clear selection from localStorage
    localStorage.setItem("mainContentCalendarSelectedCrn", "");

    var crn = document.getElementById("mc_manageClasses_input_crn");
    var title = document.getElementById("mc_manageClasses_input_title");
    var course = document.getElementById("mc_manageClasses_input_course");
    var hrs = document.getElementById("mc_manageClasses_input_hrs");
    var seats = document.getElementById("mc_manageClasses_input_seats");
    var building = document.getElementById("mc_manageClasses_input_building");
    var room = document.getElementById("mc_manageClasses_input_room");
    var timesListBody = document.getElementById("mc_manageClasses_timesList");

    //clear data from input area
    crn.value = "";
    title.value = "";
    course.value = "";
    hrs.value = "";
    seats.value = "";
    building.value = "";
    room.value = "";
    while (timesListBody.firstChild) {
        timesListBody.removeChild(timesListBody.firstChild);
    }

    //deselect classes in calendar
    var calendar = $('#calendar');
    var events = calendar.fullCalendar('clientEvents');
    for (var i = 0; i < events.length; i++) {
        events[i].borderColor = "black";
    }
    calendar.fullCalendar("rerenderEvents");

    //change selection buttons
    var addClassBtn = document.getElementById("mc_manageClasses_addClassBtn");
    var updateClassBtn = document.getElementById("mc_manageClasses_updateClassBtn");
    var clearSelectionBtn = document.getElementById("mc_manageClasses_clearSelectionBtn");
    var deleteSelectionBtn = document.getElementById("mc_manageClasses_deleteSelectionBtn");
    addClassBtn.disabled = false;
    addClassBtn.style.opacity = 1;
    updateClassBtn.disabled = true;
    updateClassBtn.style.opacity = 0.4;
    clearSelectionBtn.disabled = true;
    clearSelectionBtn.style.opacity = 0.4;
    deleteSelectionBtn.disabled = true;
    deleteSelectionBtn.style.opacity = 0.4;
}

function manageClasses_deleteSelection() {
    resetRevertColors();
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (selectedCrn == "") {
        return;
    }

    //delete class from global kClasses
    delete kClasses[selectedCrn];

    //remove class events from calendar
    $('#calendar').fullCalendar('removeEvents', function (event) {
        var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
        var eventCrn = event._id.split("_")[0];
        if (eventCrn == selectedCrn) {
            return true;
        }
        return false;
    });

    //clear selection
    manageClasses_clearSelection();
}

//previews the selected class in the input area, includes all class data and times
function manageClasses_previewSelected() {
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (selectedCrn == "") {
        return;
    }
    var crn = document.getElementById("mc_manageClasses_input_crn");
    var title = document.getElementById("mc_manageClasses_input_title");
    var course = document.getElementById("mc_manageClasses_input_course");
    var hrs = document.getElementById("mc_manageClasses_input_hrs");
    var seats = document.getElementById("mc_manageClasses_input_seats");
    var building = document.getElementById("mc_manageClasses_input_building");
    var room = document.getElementById("mc_manageClasses_input_room");

    //put the selected class into the form
    //fill form from event.title, times by selected Crn
    //get class data from global
    var classData = kClasses[selectedCrn];
    crn.value = selectedCrn;
    title.value = classData.title;
    course.value = classData.course;
    hrs.value = classData.hrs;
    seats.value = classData.seats;
    building.value = classData.building;
    room.value = classData.room;

    manageClasses_previewSelected_times();
}

//updates the timelist with the selected CRN's times
//if optional CRN is specified, will show for that specific CRN
function manageClasses_previewSelected_times(optionalCRN) {
    var selectedCrn = optionalCRN;
    if (selectedCrn === undefined || parseInt(selectedCrn) == NaN) {
        selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    }
    var dayAbbrev = {
        0: 'U',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
        6: 'S'
    };
    var classData = kClasses[selectedCrn];
    var classTimes = classData.times;
    var classDays = classData.days;
    var timesListBody = document.getElementById("mc_manageClasses_timesList");
    //clear timesList first
    while (timesListBody.firstChild) {
        timesListBody.removeChild(timesListBody.firstChild);
    }

    for (var i = 0; i < classTimes.length; i++) {
        var startTime = classTimes[i][0];
        var endTime = classTimes[i][1];
        var days = classDays[i];
        var dayString = "";
        for (var d = 0; d < days.length; d++) {
            dayString += dayAbbrev[days[d]] + " ";
        }
        dayString = dayString.substr(0, dayString.length - 1); //remove final ' '

        //make new node
        var timeEntry = document.createElement("tr");
        //startTime
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(time_24ToMeridian(startTime)));
        timeEntry.appendChild(td);
        //endTime
        td = document.createElement("td");
        td.appendChild(document.createTextNode(time_24ToMeridian(endTime)));
        timeEntry.appendChild(td);
        //days
        td = document.createElement("td");
        td.appendChild(document.createTextNode(dayString));
        timeEntry.appendChild(td);
        //remove clickable
        td = document.createElement("td");
        td.appendChild(document.createTextNode("Remove"));
        td.onclick = function () { manageClasses_timeListRemove(this) }; //needed lambda for function arg
        timeEntry.appendChild(td);

        //append to timesList
        timesListBody.appendChild(timeEntry);
    }
}

function manageClasses_eventClickHandler(event, jsevent, view) {
    //set selected CRN
    var eventCrn = event._id.split("_")[0]; //#####_# we just want the first part
    localStorage.setItem("mainContentCalendarSelectedCrn", eventCrn);

    //change border colors for each event
    highlightSelectedEvents();
    //put class data class input section
    manageClasses_previewSelected();

    //change available buttons
    var addClassBtn = document.getElementById("mc_manageClasses_addClassBtn");
    var updateClassBtn = document.getElementById("mc_manageClasses_updateClassBtn");
    var clearSelectionBtn = document.getElementById("mc_manageClasses_clearSelectionBtn");
    var deleteSelectionBtn = document.getElementById("mc_manageClasses_deleteSelectionBtn");
    addClassBtn.disabled = true;
    addClassBtn.style.opacity = 0.4;
    updateClassBtn.disabled = false;
    updateClassBtn.style.opacity = 1;
    clearSelectionBtn.disabled = false;
    clearSelectionBtn.style.opacity = 1;
    deleteSelectionBtn.disabled = false;
    deleteSelectionBtn.style.opacity = 1;

    //clear errorList
    var errorList = document.getElementById("mc_manageClasses_errorList");
    errorList.style.display = "none";
}

function manageClasses_eventDragStartHandler(event, jsEvent, ui, view) {
    //save only the needed data
    var startHours = event.start._d.getUTCHours();
    var startMinutes = event.start._d.getUTCMinutes();
    startHours = string_pad(startHours, 2);
    startMinutes = string_pad(startMinutes, 2);
    var dow = event.dow;
    var saveData = {
        dow: dow,
        startHours: startHours,
        startMinutes: startMinutes
    };
    localStorage.setItem("manageClasses_eventDragSave", JSON.stringify(saveData));
}

function manageClasses_eventDropHandler(event, delta, revertFunc, jsEvent, ui, view) {
    //update time entry in global
    var startHours = string_pad(event.start._d.getUTCHours(), 2);
    var startMinutes = string_pad(event.start._d.getUTCMinutes(), 2);
    var startTime = startHours + ":" + startMinutes;
    var endHours = string_pad(event.end._d.getUTCHours(), 2);
    var endMinutes = string_pad(event.end._d.getUTCMinutes(), 2);
    var endTime = endHours + ":" + endMinutes;
    var newDays = event.dow;
    for (var i = 0; i < newDays.length; i++) {
        newDays[i] += delta._days;
    }

    //get original times
    var oldEventData = JSON.parse(localStorage.getItem("manageClasses_eventDragSave"));
    var oldStartTime = oldEventData.startHours + ":" + oldEventData.startMinutes;
    var oldDays = oldEventData.dow;

    //replace old times with new
    var eventCrn = event._id.split("_")[0];
    var curClass = kClasses[eventCrn];
    var times = curClass.times;
    var days = curClass.days;

    for (var t = 0; t < times.length; t++) {
        if (oldStartTime == times[t][0]) {
            //original startTime are equal
            if (days[t].length != oldDays.length) {
                continue;
            }
            var daysEqual = true;
            for (var d = 0; d < days[t].length; d++) {
                if (days[t][d] != oldDays[d]) {
                    daysEqual = false;
                    break;
                }
            }

            if (daysEqual) {
                //found time, check for overlaps with same CRN
                var overlaps = getOverlappingEvents(eventCrn);
                if (overlaps.length > 0 || startTime > endTime) {
                    //overlaps, revert
                    revertFunc();
                    //IMPORTANT, revertFunc() doesn't correctly reset the dow for these events
                    var revertedEvents = $("#calendar").fullCalendar('clientEvents', event._id);
                    for (var e = 0; e < revertedEvents.length; e++) {
                        revertedEvents[e].dow = copy(oldDays);
                    }
                    //save overlapping events to revert their color on next change
                    var overlapTable = {};
                    for (var e = 0; e < overlaps.length; e++) {
                        var event1 = overlaps[e][0];
                        var event2 = overlaps[e][1];
                        overlapTable[event1._id] = true;
                        overlapTable[event2._id] = true;
                    }
                    localStorage.setItem("manageClasses_revertColorEvents", JSON.stringify(overlapTable));
                } else {
                    //no overlaps, set data
                    times[t] = copy([startTime, endTime]);
                    days[t] = copy(newDays);

                    //IMPORTANT, revertFunc() doesn't correctly reset the dow for these events
                    //and just shit in general
                    var revertedEvents = $("#calendar").fullCalendar('clientEvents', event._id);
                    for (var e = 0; e < revertedEvents.length; e++) {
                        revertedEvents[e].dow = copy(newDays);
                    }
                }
                break;
            }
        }
    }

    //update timeList if applicable
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (eventCrn == selectedCrn) {
        //only show times event crn is currently selected
        manageClasses_previewSelected_times();
    }
}

function manageClasses_eventResizeHandler(event, delta, revertFunc, jsEvent, ui, view) {
    //update time entry in global
    var startHours = string_pad(event.start._d.getUTCHours(), 2);
    var startMinutes = string_pad(event.start._d.getUTCMinutes(), 2);
    var startTime = startHours + ":" + startMinutes;
    var endHours = string_pad(event.end._d.getUTCHours(), 2);
    var endMinutes = string_pad(event.end._d.getUTCMinutes(), 2);
    var endTime = endHours + ":" + endMinutes;
    var newDays = event.dow;

    //replace old times with new
    var eventCrn = event._id.split("_")[0];
    var curClass = kClasses[eventCrn];
    var times = curClass.times;
    var days = curClass.days;

    if (delta._days != 0) {
        //can't go across a day
        revertFunc();
    }

    for (var t = 0; t < times.length; t++) {
        if (startTime == times[t][0]) {
            //original startTime are equal
            if (days[t].length != newDays.length) {
                continue;
            }
            var daysEqual = true;
            for (var d = 0; d < days[t].length; d++) {
                if (days[t][d] != newDays[d]) {
                    daysEqual = false;
                    break;
                }
            }

            if (daysEqual) {
                //found time, check for overlaps with same CRN
                var overlaps = getOverlappingEvents(eventCrn);
                if (overlaps.length > 0) {
                    //overlaps, or across days, revert
                    revertFunc();

                    //save overlapping events to revert their color on next change
                    var overlapTable = {};
                    for (var e = 0; e < overlaps.length; e++) {
                        var event1 = overlaps[e][0];
                        var event2 = overlaps[e][1];
                        overlapTable[event1._id] = true;
                        overlapTable[event2._id] = true;
                    }
                    localStorage.setItem("manageClasses_revertColorEvents", JSON.stringify(overlapTable));
                } else {
                    //no overlaps, set data
                    times[t] = copy([startTime, endTime]);
                    days[t] = copy(newDays);
                }
                break;
            }
        }
    }

    //update timeList if applicable
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (eventCrn == selectedCrn) {
        //only show times event crn is currently selected
        manageClasses_previewSelected_times();
    }
    return;
}

function manageClasses_eventOverlapHandler(stillEvent, movingEvent) {
    var stillId = stillEvent._id.split("_")[0];
    var movingId = movingEvent._id.split("_")[0];

    //only allowed to overlap if ids are different
    return stillId != movingId;
}

//performs the initial rendering of events to the calendar
//does any other necessary calls to load the page
function manageClasses_eventsInitialRender() {
    //populate subject dropdown
    manageClasses_fillSubjectDropdown();
    //load events based on subject
    manageClasses_loadSubjectEvents();
}

//popoulate subject dropdown with the available subjects
function manageClasses_fillSubjectDropdown() {
    var ul = document.getElementById("mc_manageClasses_subjectDropdown");
    //empty the ul
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    //fill ul with each subject
    for (var subject in kSubjects) {
        var li = document.createElement('li');
        li.className = 'mc_dropdownItem';
        var a = document.createElement('a');
        a.onclick = function () {
            manageClasses_subjectOnclick(this);
        };
        var text = document.createTextNode(subject);
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }
}

//renders classes from the current subject (localstorage) onto the calendar
function manageClasses_loadSubjectEvents() {
    var subject = localStorage.getItem("manageClasses_currentSubject");
    var subjectClasses = kSubjects[subject];

    //clear selected crn
    manageClasses_clearSelection();

    //load subjectText in menuBar
    var subjectText = document.getElementById("mc_manageClasses_subjectText");
    subjectText.innerText = subject;

    var calendar = $("#calendar");
    //clear old events
    calendar.fullCalendar('removeEvents');

    var events = [];
    for (var i = 0; i < subjectClasses.length; i++) {
        var curCrn = subjectClasses[i];
        var classData = kClasses[curCrn];
        //add each time as an event
        for (var t = 0; t < classData.times.length; t++) {

            var startTime = copy(classData.times[t][0]);
            var endTime = copy(classData.times[t][1]);
            var days = copy(classData.days[t]);

            var event = {
                id: curCrn + "_" + t, //crn stored as id
                title: classData.course, //use course name for event title
                start: startTime,
                end: endTime,
                dow: days,
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder",
            };
            events.push(event);
        }
    }
    calendar.fullCalendar('renderEvents', events);
}