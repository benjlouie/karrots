//functions used by maincontent
//all functions should use 'mc_' as prefix
//TODO: ensure above

//takes in the <a> that was clicked and toggles its associated div 
//optional: expand, true/false gives expanded/closed respectively
//TODO: remake this function so it's less convoluted
function mc_sideListDetailToggle(element, expand) {
    var toggleIcon = element.getElementsByClassName("mc_sideListDetailToggleIcon")[0];
    var liChildren = element.parentNode.children;
    var details = liChildren[1]; //div

    if (expand == undefined) {
        //toggle
        if (toggleIcon.innerHTML == "+") {
            var iconText = document.createTextNode("-");
            expand = true;
        } else {
            var iconText = document.createTextNode("+");
            expand = false;
        }
    } else {
        //ensure we want to call the toggle
        if (toggleIcon.innerHTML == "+") {
            var iconText = document.createTextNode("-");
            if (!expand) {
                //already closed
                return;
            }
        } else {
            var iconText = document.createTextNode("+");
            if (expand) {
                //already expanded
                return;
            }
        }
    }

    toggleIcon.removeChild(toggleIcon.firstChild);
    toggleIcon.appendChild(iconText);
    $(details).slideToggle(150);
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
        manageClasses_eventClickHandler(event, jsevent, view);
        $('#calendar').fullCalendar("rerenderEvents");
    }

	//assign professors page
	if (document.getElementById("mc_assingProfessors_section")) {
       assignProfessors_eventClickHandler(event, jsevent, view);
       $('#calendar').fullCalendar("rerenderEvents");
    }
	
    //scheduleRegistration
    if (document.getElementById("mc_scheduleRegistration_classTable")) {
        scheduleRegistration_eventClickHandler(event, jsevent, view);
    }

    //TODO: handle other pages
}

//saves the original event so it can be used with eventDropHandler
function eventDragStartHandler(event, jsEvent, ui, view) {
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        manageClasses_eventDragStartHandler(event, jsEvent, ui, view);
    }
}

//handles when events are dragged to a new position
function eventDropHandler(event, delta, revertFunc, jsEvent, ui, view) {
    resetRevertColors();
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        manageClasses_eventDropHandler(event, delta, revertFunc, jsEvent, ui, view);
        return;
    }

    //TODO: handle other pages
}

function eventResizeHandler(event, delta, revertFunc, jsEvent, ui, view) {
    resetRevertColors();
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        manageClasses_eventResizeHandler(event, delta, revertFunc, jsEvent, ui, view);
        return;
    }

    //TODO: handle other page
}

function eventOverlapHandler(stillEvent, movingEvent) {
    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        return manageClasses_eventOverlapHandler(stillEvent, movingEvent);
    }

    //TODO: handle other page
}

//render classes to the calendar
function eventsInitialRender() {
    //remove selection if it's there
    localStorage.setItem("mainContentCalendarSelectedCrn", "");

    //manageClasses page
    if (document.getElementById("mc_manageClasses_input_crn")) {
        manageClasses_eventsInitialRender();
    }
	
	//assign professors page
	if (document.getElementById("mc_assingProfessors_section")) {
        assignProfessors_eventsInitialRender();
    }

    //scheduleRegistration
    if (document.getElementById("mc_scheduleRegistration_classTable")) {
        scheduleRegistration_eventsInitialRender();
    }

    //TODO: handle other pages
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

//gets the events that were reset in the last operation (if any) and sets them to the default color
function resetRevertColors() {
    var events = JSON.parse(localStorage.getItem("manageClasses_revertColorEvents"));
    var allEvents = $('#calendar').fullCalendar('clientEvents');
    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i]._id in events) {
            allEvents[i].color = '#5f5f5f';
        }
    }
    localStorage.setItem("manageClasses_revertColorEvents", "{}");
    //rerender events
    $("#calendar").fullCalendar('renderEvents', events);
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

    return string_pad(hours, 2) + ":" + string_pad(minutes, 2);
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

//gets the first ancestor of startNode that is the given ancestorTag
function html_getFirstAncestorTag(startNode, ancestorTag) {
    ancestorTag = ancestorTag.toUpperCase();
    var cur = startNode.parentNode;
    while (cur) {
        if (cur.tagName == ancestorTag) {
            return cur;
        }
        cur = cur.parentNode;
    }

    return null;
}