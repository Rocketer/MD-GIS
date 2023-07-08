/* config */
var masterShipType = ["Cargo", "Tanker", "Passenger", "HighSpeed", "TugAndSpecial", "Fishing", "Pleasure", "Navigation", "Unspecific"];
var masterNavigationStatus = [
    "Aground",
    "AIS-SART is active",
    "At anchor",
    "Constrained by her draught",
    "Engaged in Fishing",
    "Moored",
    "Not defined (default)",
    "Not under command",
    "Reserved for future amendment of Navigational Status for HSC",
    "Reserved for future amendment of Navigational Status for WIG",
    "Reserved for future use",
    "Restricted manoeuverability",
    "Under way sailing",
    "Under way using engine"];
var masterFlag = [
    "AD - Andorra",
    "AE - United Arab Emirates",
    "AF - Afghanistan",
    "AG - Antigua and Barbuda",
    "AI - Anguilla",
    "AL - Albania",
    "AM - Armenia",
    "AN - Netherlands Antilles",
    "AO - Angola",
    "AQ - Antarctica",
    "AR - Argentina",
    "AS - American Samoa",
    "AT - Austria",
    "AU - Australia",
    "AW - Aruba",
    "AX - Aland Islands",
    "AZ - Azerbaijan",
    "BA - Bosnia and Herzegovina",
    "BB - Barbados",
    "BD - Bangladesh",
    "BE - Belgium",
    "BF - Burkina Faso",
    "BG - Bulgaria",
    "BH - Bahrain",
    "BI - Burundi",
    "BJ - Benin",
    "BL - Saint Barthelemy",
    "BM - Bermuda",
    "BN - Brunei Darussalam",
    "BO - Bolivia",
    "BQ - Bonaire, Saint Eustatius and Saba",
    "BR - Brazil",
    "BS - Bahamas",
    "BT - Bhutan",
    "BV - Bouvet Island",
    "BW - Botswana",
    "BY - Belarus",
    "BZ - Belize",
    "CA - Canada",
    "CC - Cocos (Keeling) Islands",
    "CD - Congo (DR)",
    "CF - Central African Republic",
    "CG - Congo",
    "CH - Switzerland",
    "CI - Cote d'Ivoire",
    "CK - Cook Islands",
    "CL - Chile",
    "CM - Cameroon",
    "CN - China",
    "CO - Colombia",
    "CR - Costa Rica",
    "CS - Czechoslovakia",
    "CU - Cuba",
    "CV - Cabo Verde",
    "CW - Curacao",
    "CX - Christmas Island",
    "CY - Cyprus",
    "CZ - Czech Republic",
    "DD - German Democratic Republic",
    "DE - Germany",
    "DJ - Djibouti",
    "DK - Denmark",
    "DM - Dominica",
    "DO - Dominican Republic",
    "DZ - Algeria",
    "EC - Ecuador",
    "EE - Estonia",
    "EG - Egypt",
    "EH - Western Sahara",
    "ER - Eritrea",
    "ES - Spain",
    "ET - Ethiopia",
    "FI - Finland",
    "FJ - Fiji",
    "FK - Falkland Islands",
    "FM - Micronesia",
    "FO - Faroe Islands",
    "FR - France",
    "GA - Gabon",
    "GB - United Kingdom",
    "GD - Grenada",
    "GE - Georgia",
    "GF - French Guiana",
    "GG - Guernsey",
    "GH - Ghana",
    "GI - Gibraltar",
    "GL - Greenland",
    "GM - Gambia",
    "GN - Guinea",
    "GP - Guadeloupe",
    "GQ - Equatorial Guinea",
    "GR - Greece",
    "GS - South Georgia and the South Sandwich Islands",
    "GT - Guatemala",
    "GU - Guam",
    "GW - Guinea - Bissau",
    "GY - Guyana",
    "HK - Hong Kong",
    "HM - Heard Island and McDonald Islands",
    "HN - Honduras",
    "HR - Croatia",
    "HT - Haiti",
    "HU - Hungary",
    "ID - Indonesia",
    "IE - Ireland",
    "IL - Israel",
    "IM - Isle of Man",
    "IN - India",
    "IO - British Indian Ocean Territory",
    "IQ - Iraq",
    "IR - Iran",
    "IS - Iceland",
    "IT - Italy",
    "JE - Jersey",
    "JM - Jamaica",
    "JO - Jordan",
    "JP - Japan",
    "KE - Kenya",
    "KG - Kyrgyzstan",
    "KH - Cambodia",
    "KI - Kiribati",
    "KM - Comoros",
    "KN - Saint Kitts and Nevis",
    "KP - North Korea",
    "KR - Korea",
    "KW - Kuwait",
    "KY - Cayman Islands",
    "KZ - Kazakhstan",
    "LA - Lao People's Democratic Republic",
    "LB - Lebanon",
    "LC - Saint Lucia",
    "LI - Liechtenstein",
    "LK - Sri Lanka",
    "LR - Liberia",
    "LS - Lesotho",
    "LT - Lithuania",
    "LU - Luxembourg",
    "LV - Latvia",
    "LY - Libya",
    "MA - Morocco",
    "MC - Monaco",
    "MD - Moldova",
    "ME - Montenegro",
    "MF - Saint Martin (FR)",
    "MG - Madagascar",
    "MH - Marshall Islands",
    "MK - Macedonia (FYROM)",
    "ML - Mali",
    "MM - Myanmar",
    "MN - Mongolia",
    "MO - Macao",
    "MP - Northern Mariana Islands",
    "MQ - Martinique",
    "MR - Mauritania",
    "MS - Montserrat",
    "MT - Malta",
    "MU - Mauritius",
    "MV - Maldives",
    "MW - Malawi",
    "MX - Mexico",
    "MY - Malaysia",
    "MZ - Mozambique",
    "NA - Namibia",
    "NC - New Caledonia",
    "NE - Niger",
    "NF - Norfolk Island",
    "NG - Nigeria",
    "NI - Nicaragua",
    "NL - Netherlands",
    "NO - Norway",
    "NP - Nepal",
    "NR - Nauru",
    "NU - Niue",
    "NZ - New Zealand",
    "OM - Oman",
    "PA - Panama",
    "PE - Peru",
    "PF - French Polynesia",
    "PG - Papua New Guinea",
    "PH - Philippines",
    "PK - Pakistan",
    "PL - Poland",
    "PM - Saint Pierre and Miquelon",
    "PN - Pitcairn",
    "PR - Puerto Rico",
    "PS - Palestine",
    "PT - Portugal",
    "PW - Palau",
    "PY - Paraguay",
    "QA - Qatar",
    "RE - Reunion",
    "RO - Romania",
    "RS - Serbia",
    "RU - Russian Federation",
    "RW - Rwanda",
    "SA - Saudi Arabia",
    "SB - Solomon Islands",
    "SC - Seychelles",
    "SD - Sudan",
    "SE - Sweden",
    "SG - Singapore",
    "SH - Saint Helena, Ascension and Tristan da Cunha",
    "SI - Slovenia",
    "SJ - Svalbard and Jan Mayen",
    "SK - Slovakia",
    "SL - Sierra Leone",
    "SM - San Marino",
    "SN - Senegal",
    "SO - Somalia",
    "SR - Suriname",
    "SS - South Sudan",
    "ST - Sao Tome and Principe",
    "SV - El Salvador",
    "SX - Saint Maarten (NL)",
    "SY - Syrian Arab Republic",
    "SZ - Swaziland",
    "TC - Turks and Caicos Islands",
    "TD - Chad",
    "TF - French Southern Territories",
    "TG - Togo",
    "TH - Thailand",
    "TJ - Tajikistan",
    "TK - Tokelau",
    "TL - East Timor",
    "TM - Turkmenistan",
    "TN - Tunisia",
    "TO - Tonga",
    "TR - Turkey",
    "TT - Trinidad and Tobago",
    "TV - Tuvalu",
    "TW - Taiwan (Province of China)",
    "TZ - Tanzania",
    "UA - Ukraine",
    "UG - Uganda",
    "UM - United States Minor Outlying Islands",
    "US - United States of America",
    "UY - Uruguay",
    "UZ - Uzbekistan",
    "VA - Holy See",
    "VC - Saint Vincent and the Grenadines",
    "VE - Venezuela",
    "VG - Virgin Islands (GB)",
    "VI - Virgin Islands (US)",
    "VN - Viet Nam",
    "VU - Vanuatu",
    "WF - Wallis and Futuna",
    "WS - Samoa",
    "XA - Azores",
    "XB - Madeira",
    "XC - Alaska",
    "XD - Adele Island",
    "XE - Ascension Island",
    "XF - Crozet Archipelago",
    "XG - Kerguelen Islands",
    "XH - Tahiti",
    "XI - Saint Paul and Amsterdam Islands",
    "YE - Yemen",
    "YT - Mayotte",
    "YU - Yugoslavia",
    "ZA - South Africa",
    "ZM - Zambia",
    "ZW - Zimbabwe",
    "ZZ - Unknown"
];

/* List */

function bindList() {
    // Remain
    $('[role="setting-list"] tbody').empty();
    
    $.getJSON("API.ashx?Mode=GetListWatchDog", function (data) {

        for (var i = 0; i < data.Result.length; i++) {
            var row = data.Result[i];

            setTimeout(
                bindListRow(row.W_ID, row.W_Name, row.W_Desc, row.Property_Filter, row.Spatial_Filter, row.Schedule, row.Period, row.Detected, row.IsWorking)
                , 100);
        }        
    });

    $('div[role="setting-list"]').show();
    $('div[role="setting-form"]').hide();

    setTimeout(startRealtime(), 1000);    
}

function bindListRow(W_ID, W_Name, W_Desc, Property_Filter, Spatial_Filter, Schedule, Period, Detected, IsWorking) {

    var tr = $('[role="setting-list"] tbody tr[W_ID="' + W_ID + '"]');
    var html;
    if (tr.length == 0) {
        html = '<tr style="cursor:pointer;" W_ID="' + W_ID + '"></tr>';
        $('[role="setting-list"] tbody').append(html);
        tr = $('[role="setting-list"] tbody tr:last');
    }
    html = '<td style="font-weight:bold;">';
    if (IsWorking) 
        html += '<img src="images/Watchdog-Working.gif" alt="Working" title="Working" height="30" /> ';
    else 
        html += '<img src="images/Watchdog-Sleeping.gif" alt="Sleep" title="Sleep" height="30" /> ';
    
    html +=  W_Name + '</td>\n';
    html += '	<td>' + W_Desc + '</td>\n';
    if (Property_Filter == 0) {
        html += '	<td>-</td>\n';
    } else {
        html += '	<td>' + Property_Filter + ' condition(s)</td>\n';
    }    
    html += '	<td>' + Spatial_Filter + '</td>\n';

    switch (Schedule) {
        case 'Allday':
            html += '	<td class="text-success">Allday</td>\n';
            break;
        case 'Daily':
            html += '	<td class="text-info">Daily</td>\n';
            break;
        case 'Weekday':
            html += '	<td class="text-primary">Weekday</td>\n';
            break;
        default:
            html += '	<td>-</td>\n';
    }

    html += '	<td class="text-danger">' + Period + '</td>\n';
    //switch (Period) {
    //    case 'Inactive':
    //        html += '	<td class="text-danger">Inactive</td>\n';
    //        break;
    //    case 'Assignment':
    //        html += '	<td class="text-info">Assignment</td>\n';
    //        break;
    //    case 'Forever':
    //        html += '	<td class="text-success">Forever</td>\n';
    //        break;
    //    default:
    //        html += '	<td>-</td>\n';
    //}

    html += '	<td><span class="badge bg-red detection">' + Detected + '</span></td>\n';
    html += '	<td role="delete"><button class="btn btn-danger btn-sm" onclick="if(confirm(\'Confrm to remove ' + W_Name + ' ?\'))dropWatchdog('+ W_ID+ ');">Remove</button></td>\n';

    tr.html(html);

    tr.find('td').not('[role="delete"]').off().click(function () {
        editWatchdog(W_ID);
    });

}

function dropWatchdog(W_ID) {
    $.getJSON("API.ashx?Mode=DropWatchdog&W_ID=" + W_ID, function (data) {
        if (data.Status) {
            alertDialog(data.Message, 'info');
        } else {
            alertDialog('Unable to remove<br>' + data.Message, 'warning');
        }
        $('[role="setting-list"] tr[W_ID="' + W_ID + '"]').remove();
    });    
}

function editWatchdog(W_ID) {
    clearWatchdogForm();
    
    $.getJSON("API.ashx?Mode=getWatchDog&W_ID=" + W_ID, function (data) {
        if (!data.Status) {
            alertDialog(data.Message, "danger");
            bindList();
            return;
        }
        var json = data.Result;        
        applySetting(json);

        $('#editMode').html('Edit');
        $('#editMode').attr('W_ID', W_ID);

        startEditWatchdog();
    });
}

//-------------------------------------------------------PageControl-------------------------------------------------------
function clearWatchdogForm() {

    $('#editMode').html('Add new');
    $('#editMode').attr('W_ID',0);

    // Focus on Map
    $('.tab-pane').removeClass('active');
    $('#tab1').addClass('active');

    $('ul[role="tab"] li[tabindex]').removeClass('active');
    $('ul[role="tab"] li[tabindex="1"]').addClass('active');

    // Description
    $('#txtName').empty();
    $('#txtDesc').empty();
    $('[name="rdoSchedule"]').prop('checked', false);
    $('[name="rdoDuration"]').prop('checked', false);

    initCheckbox();

    $('#tbDaily tbody').empty();
    $('#tbWeekly tbody').empty();
    $('#tbAssign tbody').empty();
    $('#tbProperty tbody').empty();

    $('select[data="spatialMethod"]').val(null);

    // Google Map
    resizeMap();
    initMap();

    // Notification Message
    $('div[data]').empty();
    implementMessageHelper();

    // Autosize TextArea    
    textAreaAutogrow();
}


function startEditWatchdog() {
    $('div[role="setting-list"]').hide();
    $('div[role="setting-form"]').show();

    stopRealtime();
}


var propHelper = ["Altitude", "MMSI", "IMONumber", "ShipTypeName", "VesselName", "CallSign", "Latitude", "Longitude",
    "SpeedOverGround", "CourseOverGround", "Flag", "Origin", "Destination", "NavigationStatusName",
    "DimensionToBow", "DimensionToStern", "DimensionToPort", "DimensionToStarboard","Draught"];

function implementMessageHelper() {
    var html = '';
    for (var i = 0; i < propHelper.length; i++) {
        html += '<button type="button" helper data="' + propHelper[i] + '">' + propHelper[i] + '</button>\n';
    }

    var messageHelper = $('div[role="messageHelper"]').css('padding-left', '0px').css('padding-bottom', '5px').html(html);

    messageHelper.find('button').click(function (event) {
        //event.preventDefault();
        var prop = $(this).attr('data');
        var target = $(this).closest('div').next();
        var caret = getCaret(target);
        appendAtCaret(target, caret, '[' + prop + ']');
    });
}

function setNotice(json) {
    $('textarea[data="url"]').val(json.Service_URL);
    $('textarea[data="postData"]').val(json.Post_Content);
    $('label[data="contentType"]').html(json.Content_Type);
}


