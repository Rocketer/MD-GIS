function appendWeekDay() {
    var html = '\n';
    html += '<tr>\n';
    html += '	<td class="text-bold">\n';
    html += '		<select class="form-control" data="weekDay">\n';
    html += '			<option></option>\n';
    html += '			<option>Sun</option>\n';
    html += '			<option>Mon</option>\n';
    html += '			<option>Tue</option>\n';
    html += '			<option>Wed</option>\n';
    html += '			<option>Thu</option>\n';
    html += '			<option>Fri</option>\n';
    html += '			<option>Sat</option>\n';
    html += '		</select>\n';
    html += '	</td>\n';
    html += '	<td>From</td>\n';
    html += '	<td><input type="text" style="text-align:center;" class="timepicker" data="schFrom" /></td>\n';
    html += '	<td>To</td>\n';
    html += '	<td><input type="text" style="text-align:center;" class="timepicker" data="schTo" /></td>\n';
    html += '	<td>\n';
    html += '		<button type="button" class="btn btn-sm btn-danger" onclick="$(this).closest(\'tr\').remove();">\n';
    html += '			<i class="fa fa-minus"></i>\n';
    html += '		</button>\n';
    html += '	</td>\n';
    html += '</tr>';

    $('#tbWeekly tbody').append(html);
    initTimePicker('#tbWeekly tbody tr:last .timepicker');
}

function appendDaily() {
    var html = '\n';
    html += '<tr>\n';
    html += '	<td>From</td>\n';
    html += '	<td><input type="text" style="text-align:center;" class="timepicker" data="schFrom" /></td>\n';
    html += '	<td>To</td>\n';
    html += '	<td><input type="text" style="text-align:center;" class="timepicker" data="schTo" /></td>\n';
    html += '	<td>\n';
    html += '		<button type="button" class="btn btn-sm btn-danger" onclick="$(this).closest(\'tr\').remove();">\n';
    html += '			<i class="fa fa-minus"></i>\n';
    html += '		</button>\n';
    html += '	</td>\n';
    html += '</tr>\n';

    $('#tbDaily tbody').append(html);
    initTimePicker('#tbDaily tbody tr:last .timepicker')
}

function appendPeriod() {

    var html = '<tr>\n';
    html += '	<td>Start</td>\n';
    html += '	<td>\n';
    html += '		<input type="text" class="text-center datepicker" placeholder="Immedialty" data="prdFrom">\n';
    html += '	</td>\n';
    html += '	<td>End</td>\n';
    html += '	<td>\n';
    html += '		<input type="text" class="text-center datepicker" placeholder="Not end" data="prdTo">\n';
    html += '	</td>\n';
    html += '	<td>\n';
    html += '		<button type="button" class="btn btn-sm btn-danger" onclick="$(this).closest(\'tr\').remove();">\n';
    html += '			<i class="fa fa-minus"></i>\n';
    html += '		</button>\n';
    html += '	</td>\n';
    html += '</tr>\n';

    $('#tbAssign tbody').append(html);
    initDatePicker('#tbAssign tbody tr:last .datepicker');
}

function getScheduleType() {
    switch (true) {
        case $('[name="rdoSchedule"][value="allDay"]').prop('checked'):
            return 1;
            break;
        case $('[name="rdoSchedule"][value="daily"]').prop('checked'):
            return 2;
            break;
        case $('[name="rdoSchedule"][value="weekly"]').prop('checked'):
            return 3;
            break;
    }
    return 0;
}

function getDaily() {
    var ret = [];
    $('#tbDaily tbody tr').each(function () {
        ret.push(
            {
                SCH_From: $(this).find('[data="schFrom"]').val(),
                SCH_To: $(this).find('[data="schTo"]').val()
            }
        );
    });
    return ret;
}

function getWeekDays() {
    var ret = [];
    $('#tbWeekly tbody tr').each(function () {
        ret.push(
            {
                WeekDay: $(this).find('[data="weekDay"]').prop('selectedIndex'),
                SCH_From: $(this).find('[data="schFrom"]').val(),
                SCH_To: $(this).find('[data="schTo"]').val()
            }
        );
    });     
    return ret;
}

function getPeriodType() {
    switch (true) {
        case $('[name="rdoDuration"][value="forever"]').prop('checked'):
            return 1;
            break;
        case $('[name="rdoDuration"][value="assign"]').prop('checked'):
            return 2;
            break;
        case $('[name="rdoDuration"][value="inactive"]').prop('checked'):
            return 3;
            break;
    }
    return 0;
}

function getActivePeriods() {
    var ret = [];
    $('#tbAssign tbody tr').each(function () {
        ret.push(
            {
                Period_From: $(this).find('[data="prdFrom"]').val(),
                Period_To: $(this).find('[data="prdTo"]').val()
            }
        );
    });
    return ret;
}


// set Part
function setSchedule(json) {
    switch (json.Schedule_Type) {
        case 1 :
            $('[name="rdoSchedule"][value="allDay"]').prop('checked',true);
            break;
        case 2 :
            $('[name="rdoSchedule"][value="daily"]').prop('checked', true);
            break;
        case 3 :
            $('[name="rdoSchedule"][value="weekly"]').prop('checked', true);
            break;
        default:
            $('[name="rdoSchedule"][value="allDay"]').prop('checked', false);
            $('[name="rdoSchedule"][value="daily"]').prop('checked', false);
            $('[name="rdoSchedule"][value="weekly"]').prop('checked', false);
            break;            
    }
    initCheckbox();

    // Set Daily
    for (var i = 0; i < json.Schedule_Daily.length; i++) {
        appendDaily();
        var tr = $('#tbDaily tbody tr:last');
        var item = json.Schedule_Daily[i];
        tr.find('[data="schFrom"]').val( item.SCH_From );
        tr.find('[data="schTo"]').val( item.SCH_To );
    }

    // Set Weekly
    for (var i = 0; i < json.Schedule_Weekday.length; i++) {
        appendWeekDay();
        var tr = $('#tbWeekly tbody tr:last');
        var item = json.Schedule_Weekday[i];
        tr.find('[data="weekDay"]').prop('selectedIndex', item.WeekDay); 
        tr.find('[data="schFrom"]').val( item.SCH_From );
        tr.find('[data="schTo"]').val( item.SCH_To );
    }

           
}

function setPeriod(json) {
    switch (json.Period_Type) {
        case 1:
            $('[name="rdoDuration"][value="forever"]').prop('checked', true);
            break;
        case 2:
            $('[name="rdoDuration"][value="assign"]').prop('checked', true);
            break;
        case 3:
            $('[name="rdoDuration"][value="inactive"]').prop('checked', true);
            break;
        default:
            $('[name="rdoDuration"][value="forever"]').prop('checked', false);
            $('[name="rdoDuration"][value="assign"]').prop('checked', false);
            $('[name="rdoDuration"][value="inactive"]').prop('checked', false);
            break;      
    }
    initCheckbox();

    for (var i = 0; i < json.Active_Periods.length; i++) {
        appendPeriod();
        var tr = $('#tbAssign tbody tr:last');
        var item = json.Active_Periods[i];

        var from = tr.find('[data="prdFrom"]').val(item.Period_From);
        var to = tr.find('[data="prdTo"]').val(item.Period_To);

        // Set Selected Date
        if (from.val() != "") {
            var d = from.val().split(' ');
            from.datepicker("setDate", new Date(d[2]+'-'+getMonthFromShortName(d[1])+'-'+d[0]));
        }
        if (to.val() != "") {
            var d = to.val().split(' ');
            to.datepicker("setDate", new Date(d[2]+'-'+getMonthFromShortName(d[1])+'-'+d[0]));
        }
    }
}

function getMonthFromShortName(month) {
    switch (month) {
        case "Jan": return 1; break;
        case "Feb": return 2; break;
        case "Mar": return 3; break;
        case "Apr": return 4; break;
        case "May": return 5; break;
        case "Jun": return 6; break;
        case "Jul": return 7; break;
        case "Aug": return 8; break;
        case "Sep": return 9; break;
        case "Oct": return 10; break;
        case "Nov": return 11; break;
        case "Dec": return 12; break;
    }
}