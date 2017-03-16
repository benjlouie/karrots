
////Schedule specific////
function scheduleRegistration_classListSwitch(element) {
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

function scheduleRegistration_createClassListEntry(crn) {
    ;
}