//functions used by maincontent
//all functions should use 'mc_' as prefix
//TODO: ensure above

//takes in the <a> that was clicked and toggles its associated div 
function mc_sideListDetailToggle(element) {
    var liChildren = element.parentNode.children;
    var details = liChildren[1]; //div
    if (details.style.maxHeight == "0px" || details.style.maxHeight == "") {
        details.style.maxHeight = "1000px";
        details.style.padding = "2px 2px 2px 10px";
        details.style.opacity = "1";
        details.style.fontSize = "initial";
    } else {
        details.style.maxHeight = "0px";
        details.style.padding = "0px";
        details.style.opacity = "0";
        details.style.fontSize = "0";
    }
}

function makeCalendar() {
    //init calendar
    var calendar = document.getElementById("calendar");
    if (!calendar) {
        //no calendar, stop
        return;
    }

    var calendar = $("#calendar");

    calendar.fullCalendar({

        header: false,

        views: {
            sevenDaySchedule: {
                type: 'agenda',
                duration: { days: 7 },
                allDaySlot: false
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