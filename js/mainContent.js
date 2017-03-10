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
                start: '2017-02-21 07:30:00',
                end: '2017-02-21 08:45:00',
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder", //add css class to change options
            },
            {
                title: 'CSE 222L',
                start: '2017-02-22 10:30:00',
                end: '2017-02-22 12:45:00',
                color: '#5f5f5f',
                borderColor: 'black',
                textColor: 'black',
                editable: true,
                className: "calendarEvent_moreBorder",
            },
            {
                title: 'CSE 113',
                start: '09:00:00',
                end: '10:15:00',
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