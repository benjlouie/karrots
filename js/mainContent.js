//functions used by maincontent
//all functions should use 'mc_' as prefix
//TODO: ensure above

//takes in the <a> that was clicked and toggles its associated div 
function mc_sideListDetailToggle(element) {
    var toggleIcon = element.getElementsByClassName("mc_sideListDetailToggleIcon")[0];
    var liChildren = element.parentNode.children;
    var details = liChildren[1]; //div

    if (details.style.maxHeight == "0px" || details.style.maxHeight == "") {
        details.style.maxHeight = "1000px";
        details.style.padding = "2px 2px 2px 2px";
        details.style.opacity = "1";
        var iconText = document.createTextNode("-");
    } else {
        details.style.maxHeight = "0px";
        details.style.padding = "0px 2px 0px 2px";
        details.style.opacity = "0";
        var iconText = document.createTextNode("+");
    }
    toggleIcon.removeChild(toggleIcon.firstChild);
    toggleIcon.appendChild(iconText);
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
    if (element.nextElementSibling.style.display == "none" || element.nextElementSibling.style.display == "") {
        element.firstElementChild.rowSpan = 2; //add button takes up both rows
        element.nextElementSibling.style.display = "table-row";
    } else {
        element.firstElementChild.rowSpan = 1; //add button takes up both rows
        element.nextElementSibling.style.display = "none";
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
        height: 500, //TODO: find a way to make this better
        header: false,
        defaultDate: "2017-02-21",

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
                editable: true,
            },
            {
                title: 'Chemistry',
                start: '2017-02-22 10:30:00',
                end: '2017-02-22 12:45:00',
                color: '#5f5f5f',
                borderColor: 'black',
                editable: true,
            },
        ],
        //eventDurationEditable: false,
        snapDuration: '00:15:00', //edditable duration snaps to 15 min

        //put options and callbacks here
        dayClick: function () {
            //alert("you clicked a day!");
        }
    });

    //change calendar view to weekly adenda style
    calendar.fullCalendar("changeView", "sevenDaySchedule");
    adjustCalendarHeight();
}

function adjustCalendarHeight() {
    if (localStorage.getItem("mainContentCalendar") == "true") {

        //mockup_classSchedule
        var classList = document.getElementById("mc_selectedClassList");
        if (classList != null) {
            $('#calendar').fullCalendar('option', 'height', classList.clientHeight);
        }

        //TODO: adjust for calendars on other pages
    }
}