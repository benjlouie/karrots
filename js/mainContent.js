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
        6: 'S'
    };

    //check times
    if (startTime.value == "" || endTime.value == ""
    || startTime.value > endTime.value) {
        //TODO: add a popup or something
        return;
    }

    //check days
    var validDay = false;
    var dayString = "";
    //list of <div><label \><input \></div> elements
    var timeData = document.getElementById("mc_manageClasses_addTime_container").children;
    for (var i = 0; i < 7; i++) {
        //get checkbox
        var dayCheckbox = timeData[i].lastElementChild;
        checkedDays[i] = dayCheckbox;
        validDay |= checkedDays[i].checked;
        if (checkedDays[i].checked) {
            dayString += dayAbbrev[i] + " ";
        }
    }
    if (!validDay) {
        //TODO: add a popup or something
        return;
    }

    //make new node
    dayString = dayString.substr(0, dayString.length - 1);
    var timeEntry = document.createElement("tr");
    //startTime
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(time_24ToMeridian(startTime.value)));
    timeEntry.appendChild(td);
    //endTime
    td = document.createElement("td");
    td.appendChild(document.createTextNode(time_24ToMeridian(endTime.value)));
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

    var timesListBody = document.getElementById("mc_manageClasses_timesList");
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
    errorList.appendChild(document.createTextNode("Missing Requirements:"));
    errorList.appendChild(document.createElement("br"));

    var validAdd = true;

    if (crn.value == "") {
        errorList.appendChild(document.createTextNode("CRN #"));
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

    //TODO: add class to list of classes

    //add event to calendar

}

function manageClasses_updateClass() {

}

function manageClasses_clearSelection() {

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

        events: [
            {
                title: 'CSE 221',
                start: '07:30',
                end: '08:45',
                dow: [2],
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder", //add css class to change options
            },
            {
                title: 'CSE 222L',
                start: '10:30',
                end: '12:45',
                dow: [3],
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder",
            },
            {
                title: 'CSE 113',
                start: '09:00',
                end: '10:15',
                dow: [1,3,5], //repeat on monday, wednesday, and friday

                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder",
            },
        ],
        //eventDurationEditable: false, //can't move events
        snapDuration: '00:15:00', //edditable duration snaps to 15 min

        //put options and callbacks here
        eventClick: function (event, jsEvent, view) {
            //change border color when selected
            var events = $('#calendar').fullCalendar('clientEvents')
            for (var i = 0; i < events.length; i++) {
                if (events[i]._id == event._id) {
                    events[i].borderColor = "#e6e600";//light yellow
                } else {
                    events[i].borderColor = "black";
                }
            }

            $('#calendar').fullCalendar("rerenderEvents");
        },

        //when an event is changed, alter its color
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
            handleOverlaps();
        },
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            handleOverlaps();
        },
    });

    //make sure calendar is the correct height
    adjustCalendarHeight();
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
function getOverlappingEvents() {
    var overlappingEvents = [];
    var allEvents = $('#calendar').fullCalendar('clientEvents');
    var len = allEvents.length;

    if (len == 0) {
        return numOverlaps;
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

////Other////

//converts time
//"16:30" --> "4:30 PM"
function time_24ToMeridian(timeString) {
    var timeSplit = timeString.split(':');
    var hours = timeSplit[0];
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
    var hours = timeSplit[0];
    var minutes = timeSplit[1].substr(0, timeSplit[1].length - 3);
    var meridian = timeSplit[1].substr(timeSplit[1].length - 2);

    if (meridian == "PM") {
        hours += 12;
    }

    return hours + ":" + minutes;
}