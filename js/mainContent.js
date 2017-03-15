//functions used by maincontent
//all functions should use 'mc_' as prefix
//TODO: ensure above

//takes in the <a> that was clicked and toggles its associated div 
function mc_sideListDetailToggle(element) {
    var toggleIcon = element.getElementsByClassName("mc_sideListDetailToggleIcon")[0];
    var liChildren = element.parentNode.children;
    var details = liChildren[1]; //div

    if (toggleIcon.innerHTML == "+") {
        var iconText = document.createTextNode("-");
    } else {
        var iconText = document.createTextNode("+");
    }
    toggleIcon.removeChild(toggleIcon.firstChild);
    toggleIcon.appendChild(iconText);
    $(details).slideToggle(150);

}

////Schedule specific////
function classListSwitch(element) {
    event.cancelBubble = true;
    if (event.stopPropagation) {
        //ensure only add/remove switch is affected
        event.stopPropagation();
    }

    if (element.innerHTML == "Add") {
        element.innerHTML = "Remove";
        element.style.backgroundColor = "#74dd8f";
        element.style.color = "black";
    } else {
        element.innerHTML = "Add";
        element.style.backgroundColor = "#5f5f5f";
        element.style.color = "#babab2";
    }
}

function classListRowClick(element) {
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

////ManageClasses Specific////
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
        title: title.value,
        course: course.value,
        hrs: hrs.value,
        seats: seats.value,
        building: building.value,
        room: room.value,
        times: classTimes, //times: [start, end]
        days: classDays, //days for each time section
    };
    kClasses[crn.value] = newClass;

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
    if (selectedCrn == null || parseInt(selectedCrn) == NaN) {
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

////Calendar////
function makeCalendar() {
    //init calendar
    var calendar = document.getElementById("calendar");
    if (!calendar) {
        //no calendar, stop
        return;
    }

    var calendar = $("#calendar");

    calendar.fullCalendar({
        height: 500, //TODO: call a function first and set height to its result
        header: false,
        defaultDate: "2017-02-21",
        defaultView: "sevenDaySchedule",

        views: {
            sevenDaySchedule: {
                type: 'agenda',
                duration: { days: 7 },
                allDaySlot: false,
                columnFormat: 'ddd' //just show day names
            }
        },

        //eventDurationEditable: false, //can't move events
        snapDuration: '00:15:00', //edditable duration snaps to 15 min

        //put options and callbacks here
        eventClick: function (event, jsEvent, view) {
            eventClickHandler(event, jsEvent, view);
        },
        //when an event is changed, alter its color
        eventDragStart: function (event, jsEvent, ui, view) {
            eventDragStartHandler(event, jsEvent, ui, view);
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
            eventDropHandler(event, delta, revertFunc, jsEvent, ui ,view);
            handleOverlaps();
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            eventResizeHandler(event, delta, revertFunc, jsEvent, ui, view);
            handleOverlaps();
        },

        eventOverlap: function (stillEvent, movingEvent) {
            return eventOverlapHandler(stillEvent, movingEvent);
        },
    });

    eventsInitialRender();

    //make sure calendar is the correct height
    adjustCalendarHeight();
}

function eventClickHandler(event, jsevent, view) {

    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
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

    //TODO: handle other pages

    $('#calendar').fullCalendar("rerenderEvents");
}

//highlights events with CRN equal to the selected CRN
//returns list of events that were found
function highlightSelectedEvents() {
    var foundEvents = [];
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    var events = $('#calendar').fullCalendar('clientEvents');
    for (var i = 0; i < events.length; i++) {
        var eventCrn = events[i]._id.split("_")[0];
        if (eventCrn == selectedCrn) {
            events[i].borderColor = "#e6e600";//light yellow
            foundEvents.push(events[i]);
        } else {
            events[i].borderColor = "black";
        }
    }

    return foundEvents;
}

//saves the original event so it can be used with eventDropHandler
function eventDragStartHandler(event, jsEvent, ui, view) {
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
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
        localStorage.setItem("manageClassesEventDragSave", JSON.stringify(saveData));
    }
}

//handles when events are dragged to a new position
function eventDropHandler(event, delta, revertFunc, jsEvent, ui, view) {
    resetRevertColors();
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
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
        var oldEventData = JSON.parse(localStorage.getItem("manageClassesEventDragSave"));
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
                        localStorage.setItem("manageClassesRevertColorEvents", JSON.stringify(overlapTable));
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
        return;
    }

    //TODO: handle other pages
}

function eventResizeHandler(event, delta, revertFunc, jsEvent, ui, view) {
    resetRevertColors();
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
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
                        localStorage.setItem("manageClassesRevertColorEvents", JSON.stringify(overlapTable));
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

    //TODO: handle other page
}

function eventOverlapHandler(stillEvent, movingEvent) {
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        var stillId = stillEvent._id.split("_")[0];
        var movingId = movingEvent._id.split("_")[0];

        //only allowed to overlap if ids are different
        return stillId != movingId;
    }

    //TODO: handle other page
}

//gets the events that were reset in the last operation (if any) and sets them to the default color
function resetRevertColors() {
    var events = JSON.parse(localStorage.getItem("manageClassesRevertColorEvents"));
    var allEvents = $('#calendar').fullCalendar('clientEvents');
    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i]._id in events) {
            allEvents[i].color = '#5f5f5f';
        }
    }
    localStorage.setItem("manageClassesRevertColorEvents", "{}");
    //rerender events
    $("#calendar").fullCalendar('renderEvents', events);
}

//render classes to the calendar
function eventsInitialRender() {
    //remove selection if it's there
    localStorage.setItem("mainContentCalendarSelectedCrn", "");

    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        var events = [];
        for (key in kClasses) {
            classData = kClasses[key];
            //add each time as an event
            for (var t = 0; t < classData.times.length; t++) {

                var startTime = copy(classData.times[t][0]);
                var endTime = copy(classData.times[t][1]);
                var days = copy(classData.days[t]);

                var event = {
                    id: key + "_" + t, //crn stored as id
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
        $("#calendar").fullCalendar('renderEvents', events);
    }

    //TODO: handle other pages
}

function adjustCalendarHeight() {
    if (localStorage.getItem("mainContentCalendar") == "true") {

        //mockup_classSchedule
        var scheduleCalendar = document.getElementsByClassName("mc_scheduleCalendar");
        if (scheduleCalendar.length > 0) {
            $('#calendar').fullCalendar('option', 'height', scheduleCalendar[0].clientHeight);
        }
        
        //mockup_manageClasses
        var manageClassCalendar = document.getElementsByClassName("mc_manageClassesCalendar");
        if (manageClassCalendar.length > 0) {
            $('#calendar').fullCalendar('option', 'height', manageClassCalendar[0].clientHeight);
        }

        //TODO: adjust for calendars on other pages
    }
}

function handleOverlaps() {
    if (localStorage.getItem("mainContentCalendarEventOverlap") == "true") {
        //overlap is allowed, don't need to do anything
        return;
    }

    var overlappingEvents = getOverlappingEvents();
    var len = overlappingEvents.length;
    var overlapTable = {};

    //get hashtable of events that overlap
    for (var i = 0; i < len; i++) {
        var event1 = overlappingEvents[i][0];
        var event2 = overlappingEvents[i][1];

        //using _id covers ALL repeated event times
        //ex: event on Tues,Fri that only has overlap on friday
        //    both times will be covered
        overlapTable[event1._id] = true;
        overlapTable[event2._id] = true;
    }

    var allEvents = $('#calendar').fullCalendar('clientEvents');
    len = allEvents.length;
    for (var i = 0; i < len; i++) {
        var event = allEvents[i];
        if (event._id in overlapTable) {
            //event overlaps something, set accordingly
            event.color = "#990000"; //red
        } else {
            //event does NOT overlap anything, it's good
            event.color = "#5f5f5f";
        }
    }
}

//returns every pair of overlapping events
//ex: [[e1,e2],[e3,e4]]
//doesn't get every pair, but each overlapped event will apear at least once
//if crn is specified, only checks events with that crn
function getOverlappingEvents(crn) {

    var overlappingEvents = [];
    if (crn === undefined || parseInt(crn) == NaN) {
        var allEvents = $('#calendar').fullCalendar('clientEvents');
    } else {
        var allEvents = $('#calendar').fullCalendar('clientEvents', function (event) {
            return event._id.split("_")[0] == crn;
        });
    }
    var len = allEvents.length;

    if (len == 0) {
        return overlappingEvents;
    }

    //sort by start time
    allEvents.sort(function (a, b) {
        return a.start._d.getTime() - b.start._d.getTime();
    });

    var prev = allEvents[0];
    var low = prev.start._d.getTime();
    var high = prev.end._d.getTime();
    for (var i = 1; i < len; i++) {
        var cur = allEvents[i];
        curStart = cur.start._d.getTime();
        curEnd = cur.end._d.getTime();

        //check for overlap
        if (curStart < high) {
            //overlap
            prev.color = "";
            cur.color = "";
            //push overlapping pair
            overlappingEvents.push([prev,cur]);
        }

        //adjust low/high for comparing against next event
        low = curStart;
        if (curEnd > high) {
            high = curEnd;
            prev = cur; //ensures overlap pair with furthest overlap
        }
    }

    return overlappingEvents;
}


/*//Other//*/

//converts time
//"16:30" --> "4:30 PM"
function time_24ToMeridian(timeString) {
    var timeSplit = timeString.split(':');
    var hours = parseInt(timeSplit[0]);
    var minutes = timeSplit[1];
    var meridian;
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    } else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }
    } else {
        meridian = 'PM';
    }

    return hours + ":" + minutes + " " + meridian;
}

//converts time
//"4:30 PM" --> "16:30"
function time_meridianTo24(timeString) {
    var timeSplit = timeString.split(':');
    var hours = parseInt(timeSplit[0]);
    var minutes = timeSplit[1].substr(0, timeSplit[1].length - 3);
    var meridian = timeSplit[1].substr(timeSplit[1].length - 2);

    if (meridian == "PM" && hours < 12) {
        hours += 12;
    }

    return hours + ":" + minutes;
}

//formats the given hours and minutes into a string
//ex: hours: 2, minuts: 35 --> "02:35"
function string_makeTime(hours, minutes) {
    hours = string_pad(hours, 2);
    minutes = string_pad(minutes, 2);
    return hours + ":" + minutes;
}

//pads num to width using the padChar
//padChar defaults to '0'
//from stackoverflow
function string_pad(num, width, padChar) {
    padChar = padChar || '0';
    num = num + '';
    return num.length >= width ? num : new Array(width - num.length + 1).join(padChar) + num;
}

//this is terrible
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}