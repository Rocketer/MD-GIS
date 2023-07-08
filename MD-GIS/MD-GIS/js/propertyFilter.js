var masterProperty = ["Altitude",
    "CallSign",
    "CourseOverGround",
    "Destination",
    "DimensionToBow",
    "DimensionToPort",
    "DimensionToStarboard",
    "DimensionToStern",
    "Draught",
    //"ETA",
    "Flag",
    "IMONumber",
    "MMSI",
    "NavigationStatus",
    "Origin",
    "RateOfTurn",
    "RepeatIndicator",
    "ShipType",
    "SpeedOverGround",
    "TrueHeading",
    "VesselName"];


function appendProperty() {
    var html = '<tr>\n\n';
    {
        html += '	<td class="btn-group">\n\n';
        html += '		<button type="button" class="btn btn-danger" style="height:100%;" onclick="$(this).closest(\'tr\').remove();">\n';
        html += '			<i class="fa fa-minus"></i>\n';
        html += '		</button>\n';
        html += '	</td>\n';
        html += '	<td class="form-group" style="vertical-align:top;">\n';
        html += '		<select class="form-control" data="property" style="width: 100%;">\n';
        html += '           <option></option>\n';
        for (var i = 0; i < masterProperty.length; i++)
            html += '           <option>' + masterProperty[i] + '</option>\n';
        html += '		</select>\n';
        html += '	</td>\n';
        {
            html += '   <td class="form-group" style="vertical-align:top;">\n';
            html += '	    <select class="form-control hide operator" data="operator-string">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '		    <option>Like</option>\n';
            html += '		    <option>Unlike</option>\n';
            html += '	    </select>\n';
            html += '	    <select class="form-control hide operator" data="operator-shipType">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '	    </select>\n';
            html += '	    <select class="form-control hide operator" data="operator-navigationStatus">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '	    </select>\n';
            html += '	    <select class="form-control hide operator" data="operator-flag">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '	    </select>\n';
            html += '	    <select class="form-control hide operator" data="operator-integer">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '		    <option>></option>\n';
            html += '		    <option>>=</option>\n';
            html += '		    <option><</option>\n';
            html += '		    <option><=</option>\n';
            html += '		    <option>Between</option>\n';
            html += '	    </select>\n';
            html += '	    <select class="form-control hide operator" data="operator-float">\n';
            html += '		    <option>Is</option>\n';
            html += '		    <option>Is not</option>\n';
            html += '		    <option>></option>\n';
            html += '		    <option>>=</option>\n';
            html += '		    <option><</option>\n';
            html += '		    <option><=</option>\n';
            html += '		    <option>Between</option>\n';
            html += '	    </select>\n';
            //html += '	    <select class="form-control hide operator" data="operator-time">\n';
            //html += '		    <option>></option>\n';
            //html += '		    <option>>=</option>\n';
            //html += '		    <option><</option>\n';
            //html += '		    <option><=</option>\n';
            //html += '		    <option>Between</option>\n';
            //html += '	    </select>\n';
            html += '   </td>\n';
        }
        html += '	<td class="form-group property-value">\n';
        html += '	</td>\n';
        html += '</tr>\n';
    }

    $('#tbProperty tbody').append(html);

    // Add Event
    var prop = $('#tbProperty tbody tr:last [data="property"]').change(function () {
        selectProperty($(this));
    });
}

function selectProperty(prop) {

    var tr = prop.closest('tr');
    tr.find('[data*="operator"]').addClass('hide');

    var oper = tr.find('[data="operator-' + getPropertyType(prop.val()) + '"]').removeClass('hide').change(function () {
        selectOperator(oper);
    });

    selectOperator(oper);
}

function selectOperator(oper) {

    var tr = oper.closest('tr');
    var td = tr.find('.property-value'); // Clear All Item

    var propType = oper.attr('data').replace('operator-', '');
    //integer , float , string , navigationStatus , flag , shipType , time;
    var operator = oper.val();
    // Is , Is not ,  > , >= , < , <= , Between , Like , Unlike

    var lastOper = td.attr("oper-type");
    var curOper = getOperatorType(operator);
    var lastType = td.attr("prop-type");

    // Add Value Item
    switch (propType) {
        case "integer":
            switch (operator) {
                case "Is":
                case "Is not":
                    if (lastOper != curOper | lastType != propType) {
                        td.empty().append(newIntegerList(null));
                        setPropertyListCommand(td);  // Set +- Button
                    }
                    break;
                case ">":
                case ">=":
                case "<":
                case "<=":
                    if (lastOper != curOper | lastType != propType)
                        td.empty().append(newIntegerSingle(null));
                    break;
                case "Between":
                    if (lastOper != curOper | lastType != propType)
                        td.empty().append(newIntegerBetween(null));
                    break;
            }
            break;
        case "float":
            switch (operator) {
                case "Is":
                case "Is not":
                    if (lastOper != curOper | lastType != propType) {
                        td.empty().append(newFloatList(null));
                        setPropertyListCommand(td);  // Set +- Button
                    }
                    break;
                case ">":
                case ">=":
                case "<":
                case "<=":
                    if (lastOper != curOper | lastType != propType)
                        td.empty().append(newFloatSingle(null));
                    break;
                case "Between":
                    if (lastOper != curOper | lastType != propType)
                        td.empty().append(newFloatBetween(null));
                    break;
            }
            break;
        case "string":
            switch (operator) {
                case "Is":
                case "Is not":
                case "Like":
                case "Unlike":
                    if (lastOper != curOper | lastType != propType) {
                        td.empty().append(newStringList(null));
                        setPropertyListCommand(td);  // Set +- Button
                    }
                    break;
            }
            break;
        //case "time":
        //    switch (operator) {
        //        case ">":
        //        case ">=":
        //        case "<":
        //        case "<=":
        //            if (lastOper != curOper | lastType != propType) {
        //                td.empty().append(newTimeSingle(null));
        //                //td.find('div:last input').datetimepicker({
        //                //    autoclose: true,
        //                //    format: "dd M yyyy - hh:ii"
        //                //});
        //            }

        //            break;
        //        case "Between":
        //            if (lastOper != curOper | lastType != propType)
        //                td.empty().append(newTimeBetween(null));
        //            break;
        //    }
        //    break;
        case "navigationStatus":
            if (lastOper != curOper | lastType != propType)
                switch (operator) {
                    case "Is":
                    case "Is not":
                        td.empty().append(newNavigationStatus(null));
                        setPropertyListCommand(td);  // Set +- Button
                        break;
                }
            break;
        case "flag":
            if (lastOper != curOper | lastType != propType)
                switch (operator) {
                    case "Is":
                    case "Is not":
                        td.empty();
                        addFlag(td);
                        break;
                }
            break;
        case "shipType":
            if (lastOper != curOper | lastType != propType)
                switch (operator) {
                    case "Is":
                    case "Is not":
                        td.empty();
                        addShipType(td, null);
                        break;
                }
            break;
    }

    // Keep Last Selected Property Type And Value
    td.attr("oper-type", curOper);
    td.attr("prop-type", propType);
}

function getOperatorType(operator) {
    switch (operator) {
        case "Is":
        case "Is not":
        case "Like":
        case "Unlike":
            return "list"; break;
        case ">":
        case ">=":
        case "<":
        case "<=":
            return "single"; break;
        case "Between":
            return "between"; break;
        case "navigationStatus":
        case "flag":
        case "shipType":
            return "choices"
            break;
    }
    return "";
}

function getPropertyType(prop) {
    switch (prop) {
        // Integer
        case "RepeatIndicator":
        case "TrueHeading":
            return 'integer';
            break;
        // Float
        case "Altitude":
        case "CourseOverGround":
        case "DimensionToBow":
        case "DimensionToPort":
        case "DimensionToStarboard":
        case "DimensionToStern":
        case "Draught":
        case "RateOfTurn":
        case "SpeedOverGround":
            return 'float';
            break;
        // String
        case "CallSign":
        case "Destination":
        case "IMONumber":
        case "MMSI":
        case "Origin":
        case "VesselName":
            return 'string';
            break;
        // Choice
        case "NavigationStatus":
            return 'navigationStatus';
        case "Flag":
            return 'flag'
        case "ShipType":
            return 'shipType'
            break;
        // Time
        //case "ETA":
        //    return 'time';
        //    break;
    }
    return null;
}

function formatStateShipType(opt) {

    if (!opt.id) return opt.text.toUpperCase();
    var optimage = $(opt.element).text();
    if (!optimage)
        return opt.text.toUpperCase();
    else {
        var $opt = $(
            '<span><img src="images/ShipIcon/PNG/' + optimage + '_S_240.png"/> ' + opt.text + '</span>'
        );
        return $opt;
    }
};

function addShipType(td, value) {
    td.append(newShipType(value));
    td.find('select:last').select2({
        templateResult: formatStateShipType,
        templateSelection: formatStateShipType
    });
    $('.select2-container').removeAttr('style');
    setPropertyListCommand(td);
}

function formatStateFlag(opt) {

    if (!opt.id) return opt.text.toUpperCase();
    var optimage = $(opt.element).text().substr(0, 2);
    if (!optimage)
        return opt.text.toUpperCase();
    else {
        var $opt = $(
            '<span><img src="Picture/Flag/' + optimage + '.png"/> &nbsp; &nbsp; ' + opt.text + '</span>'
        );
        return $opt;
    }
};

function addFlag(td, value) {
    td.append(newFlag(value));
    td.find('select:last').select2({
        templateResult: formatStateFlag,
        templateSelection: formatStateFlag
    });
    $('.select2-container').removeAttr('style');
    setPropertyListCommand(td);
}

function setPropertyListCommand(td) {

    //------------ Remove all button
    td.find('div button').remove();

    // ----------if there is more than one items add delete button
    if (td.find('div').length > 1) {
        html = '	<button type="button" class="btn btn-sm btn-danger">\n';
        html += '		<i class="fa fa-minus"></i>\n';
        html += '	</button>\n';
        td.find('div').append(html);
    }

    //------------ Add + button to last item
    html = '	<button type="button" class="btn btn-sm btn-warning">\n';
    html += '		<i class="fa fa-plus"></i>\n';
    html += '	</button>\n';
    td.find('div:last').append(html);

    //-------------- Remove Button
    td.find('.btn-danger').off().click(function () {
        $(this).closest('div').remove();
        setPropertyListCommand(td);
    });

    //---------------Add Button
    var addFunction;
    switch (getPropertyType(td.parent().find('[data="property"]').val())) {
        case "integer":
            addFunction = newIntegerList;
            break;
        case "float":
            addFunction = newFloatList;
            break;
        case "string":
            addFunction = newStringList;
            break;
        case "navigationStatus":
            addFunction = newNavigationStatus;
            break;
        case "flag":
            td.find('.btn-warning').off().click(function () {
                addFlag(td, null);
            });
            break;
        case "shipType":
            td.find('.btn-warning').off().click(function () {
                addShipType(td, null);
            });
            break;
    }
    if (addFunction) {
        td.find('.btn-warning').off().click(function () {
            td.append(addFunction(null));
            setPropertyListCommand(td);
        });
    }
}

function newIntegerList(value) {
    var html = '<div class="value-list">\n';
    html += '	<input type="text" maxlength="8" class="form-control" onchange="this.value=formatinteger(this.value,0,Number.MAX_SAFE_INTEGER,false);" ';
    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

function newFloatList(value) {
    var html = '<div class="value-list">\n';
    html += '	<input type="text" maxlength="10" class="form-control" onchange="this.value=formatnumeric(this.value,Number.MIN_VALUE,Number.MAX_VALUE);" ';
    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

function newStringList(value) {
    var html = '<div class="value-list">\n';
    html += '	<input type="text" maxlength="50" class="form-control" '
    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

function newIntegerSingle(value) {
    var html = '<div data="integer-single">\n';
    html += '	<input type="text" maxlength="8" class="form-control" onchange="this.value=formatinteger(this.value,0,Number.MAX_SAFE_INTEGER,false);" ';
    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

function newFloatSingle(value) {
    var html = '<div data="float-single">\n';
    html += '	<input type="text" maxlength="10" class="form-control" onchange="this.value=formatnumeric(this.value,Number.MIN_VALUE,Number.MAX_VALUE);" ';
    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

//function newTimeSingle(value) {
//    var html = '<div data="time-single">\n';
//    html += '	<input type="text" maxlength="20" class="form-control" '
//    if (value) html += 'value="' + value.toString().replaceAll('"', '') + '"';
//    html += ' placeholder="yyyy-MM-dd hh:mm" />\n';
//    html += '</div>\n';
//    return html;
//}

function newIntegerBetween(start, end) {
    var html = '<div data="integer-between">\n';
    html += '	<input type="text" maxlength="8" class="form-control" data="start" onchange="this.value=formatinteger(this.value,0,Number.MAX_SAFE_INTEGER,false);" ';
    if (start) html += 'value="' + start.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '	<label class="form-control">and</label>\n';
    html += '	<input type="text" maxlength="8" class="form-control" data="end" onchange="this.value=formatinteger(this.value,0,Number.MAX_SAFE_INTEGER,false);" ';
    if (end) html += 'value="' + end.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

function newFloatBetween(start, end) {
    var html = '<div data="integer-between">\n';
    html += '	<input type="text" maxlength="10" class="form-control" data="start" onchange="this.value=formatnumeric(this.value,Number.MIN_VALUE,Number.MAX_VALUE);" ';
    if (start) html += 'value="' + start.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '	<label class="form-control">and</label>\n';
    html += '	<input type="text" maxlength="10" class="form-control" data="end" onchange="this.value=formatnumeric(this.value,Number.MIN_VALUE,Number.MAX_VALUE);" '
    if (end) html += 'value="' + end.toString().replaceAll('"', '') + '"';
    html += ' />\n';
    html += '</div>\n';
    return html;
}

//function newTimeBetween(start, end) {
//    var html = '<div data="time-between">\n';
//    html += '	<input type="text" maxlength="20" class="form-control" data="start" ';
//    if (start) html += 'value="' + start.toString().replaceAll('"', '') + '"';
//    html += ' placeholder="yyyy-MM-dd hh:mm" />\n';
//    html += '	<label class="form-control">and</label>\n';
//    html += '	<input type="text" maxlength="20" class="form-control" data="end" ';
//    if (end) html += 'value="' + end.toString().replaceAll('"', '') + '"';
//    html += ' placeholder="yyyy-MM-dd hh:mm" />\n';
//    html += '</div>\n';
//    return html;
//}

function newShipType(value) {
    var html = '<div data="shipType" class="value-list">\n';
    html += '	<select class="form-control select2">\n';
    html += '       <option></option>\n';
    for (var i = 0; i < masterShipType.length; i++) {
        if (value == masterShipType[i])
            html += '       <option selected>' + masterShipType[i] + '</option>\n';
        else
            html += '       <option>' + masterShipType[i] + '</option>\n';
    }
    html += '	</select>\n';
    html += '</div>\n';
    return html;
}

function newNavigationStatus(value) {
    var html = '<div data="navigationStatus" class="value-list">\n';
    html += '	<select class="form-control select2">\n';
    html += '       <option></option>\n';
    for (var i = 0; i < masterNavigationStatus.length; i++) {
        if (value == masterNavigationStatus[i])
            html += '       <option selected>' + masterNavigationStatus[i] + '</option>\n';
        else
            html += '       <option>' + masterNavigationStatus[i] + '</option>\n';
    }
    html += '	</select>\n';
    html += '</div>\n';
    return html;
}

function newFlag(value) {
    var html = '<div class="value-list" data="flag">\n';
    html += '	<select class="form-control select2">\n';
    html += '       <option></option>\n';
    for (var i = 0; i < masterFlag.length; i++) {
        if (value == masterFlag[i])
            html += '       <option selected>' + masterFlag[i] + '</option>\n';
        else
            html += '       <option>' + masterFlag[i] + '</option>\n';
    }
    html += '	</select>\n';
    html += '</div>\n';
    return html;
}

function getPropertyFilters() {
    var ret = [];

    $('#tbProperty tr').each(function () {

        var tr = $(this);

        //var propId = tr.find('select[data="property"]').prop('selectedIndex');
        var propId =getPropertyId( tr.find('select[data="property"]').val());
        if (propId == 0) return;

        var operName = tr.find('.operator').not('.hide').val();
        if (operName == "undefined") return;

        operName = operName.replace('&gt;', '>').replace('&lt;', '<');
        var prop = {
            Property_ID: propId,
            Oper_Name: operName
        };

        var cell = tr.find('.property-value');
        var operType = cell.attr('oper-type');
      
        var values = [];

        switch (operType) {            
            case 'single':
                values.push({
                    Value_ID: 1,
                    Value_1: cell.find('input[type="text"]:first').val(),
                    Value_2: ''
                });
                break;
            case 'between':
                values.push({
                    Value_ID: 1,
                    Value_1: cell.find('[data="start"]').val(),
                    Value_2: cell.find('[data="end"]').val()
                });
                break;
            case 'list':
                var list = cell.find('.value-list');
                var Value_ID = 0;
                list.each(function () {

                    var Value_1 = '';
                    if ($(this).find('.select2-selection__rendered').length != 0) {
                        Value_1 = $(this).find('.select2-selection__rendered').attr('title');
                    } else if ($(this).find('select.select2').length > 0) {
                        Value_1 = $(this).find('select.select2').val();
                    } else {
                        Value_1 = $(this).find('input[type="text"]').val();
                    }
                    if (Value_1 == "") return;                    

                    Value_ID += 1;
                    values.push({
                        Value_ID: Value_ID,
                        Value_1: Value_1,
                        Value_2: ''
                    });
                });
                break;
        }
        
        prop.values = values;
        ret.push(prop);
    });

    return ret;
}

function setPropertyFilters(json) {

    for (var i = 0; i < json.Property_Filters.length; i++) {

        appendProperty();

        var tr = $('#tbProperty tbody tr:last');
        var item = json.Property_Filters[i];

        var prop = tr.find('[data="property"]');
        //prop.prop('selectedIndex', item.Property_ID);
        prop.val(getPropertyName(item.Property_ID));
        selectProperty(prop);

        var operator = tr.find('select.operator').not('.hide').val(item.Oper_Name);

        var td = tr.find('td.property-value');
        var prop_type = td.attr('prop-type');

        for (var v = 0; v < item.values.length; v++) {

            if (v > 0) { // Add new item row data:list
                switch (prop_type) {
                    case "flag":
                        td.append(newFlag(null));
                        break;
                    case "navigationStatus":
                        td.append(newNavigationStatus(null));
                        break;
                    case "shipType":
                        td.append(newShipType(null));
                        break;
                    case "string":
                        td.append(newStringList(null));
                        break;
                    case "float":
                        if (item.Oper_Name == "Between") {
                            td.append(newFloatBetween(null));
                        } else {
                            td.append(newFloatList(null));
                        }                        
                        break;
                    case "integer":
                        if (item.Oper_Name == "Between") {
                            td.append(newIntegerBetween(null));
                        } else {
                            td.append(newIntegerList(null));
                        }    
                        break;
                }
            }

            switch (item.Oper_Name) {
                case "Between":
                    selectOperator(operator);
                    tr.find('[data="start"]').val(item.values[v].Value_1);
                    tr.find('[data="end"]').val(item.values[v].Value_2);
                    break;
                default:
                    //datatype
                    switch (td.attr('prop-type')) {
                        case "flag":
                            td.find('select').val(item.values[v].Value_1);
                            td.find('select:last').select2({
                                templateResult: formatStateFlag,
                                templateSelection: formatStateFlag
                            });
                            break;
                        case "shipType":
                            td.find('select').val(item.values[v].Value_1);
                            td.find('select:last').select2({
                                templateResult: formatStateShipType,
                                templateSelection: formatStateShipType
                            });
                           break;
                        case "navigationStatus":
                            td.find('select:last').val(item.values[v].Value_1);
                            break;
                        default:
                            td.find('input[type="text"]:last').val(item.values[v].Value_1);
                            break;
                    }
                    setPropertyListCommand(td);
                    break;
            }            
        }

        
        //prop.change(function () {
        //    selectProperty($(this));
        //});

    }



}

function getPropertyId(propName) {

    switch (propName) {
        case "Altitude":
            return 1;
            break;
        case "CallSign":
            return 2;
            break;
        case "CourseOverGround":
            return 3;
            break;
        case "Destination":
            return 4;
            break;
        case "DimensionToBow":
            return 5;
            break;
        case "DimensionToPort":
            return 6;
            break;
        case "DimensionToStarboard":
            return 7;
            break;
        case "DimensionToStern":
            return 8;
            break;
        case "Draught":
            return 9;
            break;
        case "ETA":
            return 10;
            break;
        case "Flag":
            return 11;
            break;
        case "IMONumber":
            return 12;
            break;
        case "MMSI":
            return 13;
            break;
        case "NavigationStatus":
            return 14;
            break;
        case "Origin":
            return 15;
            break;
        case "RateOfTurn":
            return 16;
            break;
        case "RepeatIndicator":
            return 17;
            break;
        case "ShipType":
            return 18;
            break;
        case "SpeedOverGround":
            return 19;
            break;
        case "TrueHeading":
            return 20;
            break;
        case "VesselName":
            return 21;
            break;

    }return 0;

}

function getPropertyName(propId) {
    switch (propId) {
        case 1:
            return "Altitude";
            break;
        case 2:
            return "CallSign";
            break;
        case 3:
            return "CourseOverGround";
            break;
        case 4:
            return "Destination";
            break;
        case 5:
            return "DimensionToBow";
            break;
        case 6:
            return "DimensionToPort";
            break;
        case 7:
            return "DimensionToStarboard";
            break;
        case 8:
            return "DimensionToStern";
            break;
        case 9:
            return "Draught";
            break;
        case 10:
            return "ETA";
            break;
        case 11:
            return "Flag";
            break;
        case 12:
            return "IMONumber";
            break;
        case 13:
            return "MMSI";
            break;
        case 14:
            return "NavigationStatus";
            break;
        case 15:
            return "Origin";
            break;
        case 16:
            return "RateOfTurn";
            break;
        case 17:
            return "RepeatIndicator";
            break;
        case 18:
            return "ShipType";
            break;
        case 19:
            return "SpeedOverGround";
            break;
        case 20:
            return "TrueHeading";
            break;
        case 21:
            return "VesselName";
            break;
    }return "";
}