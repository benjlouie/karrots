function assignProfessors_eventsInitialRender() {
		var colors = {
		"TBD" : "#5f5f5f",
        "Scott E. Lee Chadde": "red",
        "Dongwan Shin": "blue",
        "Li P. Kuo": "green",
        "Jun Zheng": "orange",
		"Subhasish Mazumdar": "#5f5f5f",
		"Abdelmounaam Rezgui": "#5f5f5f",
		"Blaine W. Burnham": "#5f5f5f",
		"Hamdy Soliman": "#5f5f5f",
		"Lorie M. Liebrock": "#5f5f5f",
		"Lyndon G. Pierson": "#5f5f5f",
    };
	assignProfessors_loadSubjectEvents();
    
}

function assignProfessors_eventClickHandler(event, jsevent, view) {
    //set selected CRN
    var eventCrn = event._id.split("_")[0]; //#####_# we just want the first part
    localStorage.setItem("mainContentCalendarSelectedCrn", eventCrn);

    //change border colors for each event
    highlightSelectedEvents();
    //put class data class input section
    //manageClasses_previewSelected();
	
	//preview the course data
	assignProfessors_previewSelected()
	
	

    
}


function assignProfessors_previewSelected() {
	    var dayAbbrev = {
        0: 'U',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
        6: 'S'
    };
	
	
    var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (selectedCrn == "") {
        return;
    }
    var crn = document.getElementById("courseCRN");
	var professor = document.getElementById("professorName");
    var title = document.getElementById("courseTitle");
    //var course = document.getElementById("mc_assignProfessorss_input_course");
    var hrs = document.getElementById("hours");
	var time = document.getElementById("courseTime");
	var dates = document.getElementById("days");
    var seats = document.getElementById("seats");
    var building = document.getElementById("room");
    

    //put the selected class into the form
    //fill form from event.title, times by selected Crn
    //get class data from global
    var classData = kClasses[selectedCrn];
    crn.innerText = selectedCrn;
    title.innerText = classData.title;
	professor.innerText = classData.teacher;
    //course.innerText = classData.course;
    hrs.innerText = classData.hrs;
    seats.innerText = classData.seats;
    building.innerText = classData.building + " " + classData.room;

	//time/days
    //tr = document.createElement("tr");
    //times
    //td = document.createElement("td");
    //td.colSpan = 2;
	
	while(dates.firstChild){
		dates.removeChild(dates.firstChild);
	}
	
	while(time.firstChild){
		time.removeChild(time.firstChild);
	}
	
	
    var times = classData.times;
    for (var i = 0; i < times.length; i++) {
        if (i > 0) {
            time.appendChild(document.createElement("br")); //line break between entries
        }
        text = document.createTextNode(times[i][0] + " - " + times[i][1]);
        time.appendChild(text);
    }
    //time.appendChild(td);
    //days
    //td = document.createElement("td");
    var days = classData.days;
    for (var i = 0; i < days.length; i++) {
        if (i > 0) {
            dates.appendChild(document.createElement("br")); //line break between entries
        }
        var dayString = "";
        for (var d = 0; d < days[i].length; d++) {
            dayString += dayAbbrev[days[i][d]] + " ";
        }
        dayString = dayString.substr(0, dayString.length - 1);
        text = document.createTextNode(dayString);
        dates.appendChild(text);
    }
    //tr.appendChild(td);
    //table.appendChild(tr);
	
	
    
}

function assignProfessors_loadSubjectEvents() {
    
				var colors = {
		"TBD" : "#5f5f5f",
        "Scott E. Lee Chadde": "red",
        "Dongwan Shin": "blue",
        "Li P. Kuo": "green",
        "Jun Zheng": "orange",
		"Subhasish Mazumdar": "#5f5f5f",
		"Abdelmounaam Rezgui": "#5f5f5f",
		"Blaine W. Burnham": "#5f5f5f",
		"Hamdy Soliman": "#5f5f5f",
		"Lorie M. Liebrock": "#5f5f5f",
		"Lyndon G. Pierson": "#5f5f5f",
		
    };
    var subjectClasses = kSubjects["CSE"];

    //clear selected crn
    //manageClasses_clearSelection();

    //load subjectText in menuBar
    //var subjectText = document.getElementById("mc_manageClasses_subjectText");
    //subjectText.innerText = subject;

    var calendar = $("#calendar");
    //clear old events
    calendar.fullCalendar('removeEvents');

    var events = [];
    for (var i = 0; i < subjectClasses.length; i++) {
        var curCrn = subjectClasses[i];
        var classData = kClasses[curCrn];
        //add each time as an event
        for (var t = 0; t < classData.times.length; t++) {

            if (classData.times[t].length == 0
            || classData.days.length == 0
            || classData.days[t].length == 0) {
                //empty, no times or no days with those times
                continue;
            }

            var startTime = copy(classData.times[t][0]);
            var endTime = copy(classData.times[t][1]);
            var days = copy(classData.days[t]);
			var teacher = copy(classData.teacher);

            var event = {
                id: curCrn + "_" + t, //crn stored as id
                title: classData.course, //use course name for event title
                start: startTime,
                end: endTime,
                dow: days,
                color: colors[teacher],
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

function assignProfessor(element){
	var colors = {
		"TBD" : "#5f5f5f",
        "Scott E. Lee Chadde": "red",
        "Dongwan Shin": "blue",
        "Li P. Kuo": "green",
        "Jun Zheng": "orange",
		"Subhasish Mazumdar": "#5f5f5f",
		"Abdelmounaam Rezgui": "#5f5f5f",
		"Blaine W. Burnham": "#5f5f5f",
		"Hamdy Soliman": "#5f5f5f",
		"Lorie M. Liebrock": "#5f5f5f",
		"Lyndon G. Pierson": "#5f5f5f",
    };
	
	
	var selectedCrn = localStorage.getItem("mainContentCalendarSelectedCrn");
    if (selectedCrn == "") {
        return;
    }
	var classData = kClasses[selectedCrn];
	
	classData.teacher = element.innerText;
	
	assignProfessors_previewSelected();
	
	var calendar = $('#calendar');
    var events = calendar.fullCalendar('clientEvents',function(event){return event._id.split("_")[0] == selectedCrn;});
	
	for(var x = 0; x < events.length; x++ ){
		events[x].color = colors[classData.teacher];
	}
	calendar.fullCalendar("rerenderEvents");
	
}
