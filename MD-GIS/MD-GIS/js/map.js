var mapStyle = [
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "6"
                },
                {
                    "weight": "1.25"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "8"
                }
            ]
        },
        {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers': [{ 'visibility': 'simplified' }]
        },
        {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [{ 'visibility': 'off' }]
        },
        {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers': [{ 'visibility': 'off' }]
        }
];

var shipInfoWindow = null;

function openInfoWindowMini(ship, map) {
    // -------------- ดึง Info ของ Marker นั้นมา ---------------
    var url = "ShipInfo.aspx?Mode=GetShipInfoWindowMini&mmsi=" + ship.MMSI;
    $.get(url, function (data) {

        var indexOfScript = data.toString().indexOf('<script>');
        var content = data.toString();
        var script = '';

        if (indexOfScript > -1) {
            script = content.substring(indexOfScript, content.length - 1);
            content = content.substr(0, indexOfScript);            
        }

        // Prepare Updated Time
        if (ship.DataDate & ship.DataTime) {
            var Updated = reportNMEATime(ship.DataDate, ship.DataTime, LONG_TIME_FORMAT);
            content = content.replaceAll('<!--Updated-->', Updated);
        }
        

        closeShipInfoWindow();

        shipInfoWindow = new google.maps.InfoWindow({
            content: content,
            pixelOffset: new google.maps.Size(0, 15)
        });
        shipInfoWindow.open(map, ship.marker);
        shipInfoWindow.ship = ship;

        google.maps.event.addListener(shipInfoWindow, 'closeclick', function () {
            closeShipInfoWindow();
        });

        // update additional script
        if(script != ''){
            setTimeout(function () { $('#div_' + ship.mmsi).html(script); }, 300);
        }
    });
}


function closeShipInfoWindow() {
    if (shipInfoWindow) shipInfoWindow.close();
    shipInfoWindow = null;
}

function showShipInfo(MMSI, forceOpen) {

    clearShipInfo();
    historyMMSI = MMSI;

    if (forceOpen) {
        $('.control-sidebar').addClass('control-sidebar-open');
    }

    // Get Profile
    var infoURL = "ShipInfo.aspx?Mode=GetShipProfile&mmsi=" + MMSI;
    $.getJSON(infoURL, function (data) {
        ////------------------ Header -----------------//

        $('#hdr_mmsi').html(data.MMSI);
        $('#hdr_imoNumber').html(data.IMONumber);
        $('#hdr_vesselName').html(data.VesselName);
        $('#hdr_shipTypeName').html(data.ShipTypeName);
        var ShipTypeColor = data.ShipTypeColor.toString().toLowerCase();
        $('#hdr_img').attr('class', 'info-box-icon bg-' + ShipTypeColor);

        /*------------picture-------------*/
        if (data.HasPicture) $('#hdr_img').html('<img src="ShipPicture.aspx?mmsi=' & data.MMSI & '&target=infoWindow" />');

        /*------------flag-------------*/
        if (data.Flag) $('#hdr_Flag').attr('src', 'Picture/Flag/' + data.Flag + '.png');


        $('#hdr_updated').html(reportNMEATime(data.DataDate, data.DataTime, LONG_TIME_FORMAT));
        //------------------ Profile ----------------//
        $('#nfo_navigationStatus').html(data.NavigationStatusName);
        $('#nfo_callSign').html(data.CallSign);
        $('#nfo_position').html(data.Position.replace("\n", "&nbsp; &nbsp; &nbsp;"));
        $('#nfo_latitude').html(data.Latitude);
        $('#nfo_longitude').html(data.Longitude);
        $('#nfo_speedOverGround1').html(data.SpeedOverGround);
        $('#nfo_speedOverGround2').html(data.SpeedOverGround);
        $('#nfo_courseOverGround1').html(data.CourseOverGround);
        $('#nfo_courseOverGround2').html(data.CourseOverGround);
        $('#nfo_dimensionToBow').html(data.DimensionToBow);
        $('#nfo_dimensionToStern').html(data.DimensionToStern);
        $('#nfo_dimensionToPort').html(data.DimensionToPort);
        $('#nfo_dimensionToStarboard').html(data.DimensionToStarboard);
        $('#nfo_repeatIndicator').html(data.RepeatIndicator);
        $('#nfo_rateOfTurn').html(data.RateOfTurn);
        $('#nfo_draught').html(data.Draught);
        $('#nfo_origin').html(data.Origin);
        $('#nfo_destination').html(data.Destination);
        $('#nfo_ETA').html(data.ETA);
    });
    showShipHistory(MMSI);

}

function clearShipInfo() {
    //------------------ Header -----------------//
    $('#hdr_color').attr('class', 'info-box small-box bg-default'); // Ship Type Color
    $('#hdr_img').html('<i class="fa fa-ship"></i>'); //Ship Image
    $('#hdr_Flag').attr('src', 'Picture/Flag/unknown.png');
    $('#hdr_mmsi').html('-');
    $('#hdr_imoNumber').html('-');
    $('#hdr_vesselName').html('-');
    $('#hdr_shipTypeName').html('-');
    $('#hdr_updated').html('-');

    //------------------ Profile ----------------//
    $('#nfo_navigationStatus').html('-');
    $('#nfo_callSign').html('-');
    $('#nfo_position').html('-');
    $('#nfo_speedOverGround').html('-');
    $('#nfo_courseOverGround').html('-');
    $('#nfo_dimensionToBow').html('-');
    $('#nfo_dimensionToStern').html('-');
    $('#nfo_dimensionToPort').html('-');
    $('#nfo_dimensionToStarboard').html('-');
    $('#nfo_repeatIndicator').html('-');
    $('#nfo_rateOfTurn').html('-');
    $('#nfo_draught').html('-');
    $('#nfo_origin').html('-');
    $('#nfo_destination').html('-');
    $('#nfo_ETA').html('-');

    //---- HistoryMap ------
    clearHistoryMap();
}


function getShipIcon(ShipTypeName, TrueHeading, isMoving) {
    var url = "ShipIcon.aspx?S=" + ShipTypeName;
    if (isMoving)
        return url + "&D=" + TrueHeading;
    else 
        return url + "&D=-1";    
}
    
function focusShip(MMSI, map) {
    var ship = ships.byMMSI(MMSI);
    if (!ship) return;
    map.setZoom(17);
    map.panTo(ship.marker.position);
    openInfoWindowMini(ship, map);
    showShipInfo(MMSI, false);
}

function deg2rad(degree) {
    return degree * Math.PI / 180;
};

function rad2deg(radian){
    return radian * 180 / Math.PI;
}
    
function getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = deg2rad(p2.lat() - p1.lat());
    var dLong = deg2rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(p1.lat())) * Math.cos(deg2rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
}

function getPointByRadianDistance(lat, lon, degree, km) {
    var rEarth = 6371.01;
    var epsilon = 0.000001;

    var rlat1 = deg2rad(lat);
    var rlon1 = deg2rad(lon);
    var rbearing = deg2rad(degree);
    var rdistance = km / rEarth; // normalize linear distance to radian angle

    rlat = Math.asin( (Math.sin(rlat1) * Math.cos(rdistance)) + (Math.cos(rlat1) * Math.sin(rdistance) * Math.cos(rbearing)));
    var rlon = rlon1 + Math.atan(Math.sin(rbearing) * Math.sin(rdistance) * Math.cos(rlat1), Math.cos(rdistance) - Math.sin(rlat1) * Math.sin(rlat));

    var lat2 = rad2deg(rlat);
    var lon2 = rad2deg(rlon);
    return new google.maps.LatLng(rad2deg(rlat), rad2deg(rlon));
}

function knot2Km(knot) {
    return knot * 1.852;
}

const SHORT_TIME_FORMAT = 1;
const LONG_TIME_FORMAT = 2;
function reportNMEAtoLocalTime(DataDate, DataTime, format){
    try {
        //var date = new Date('6/29/2011 4:52:48 PM UTC');
        var d = DataDate.toString().substr(0, 2);
        var m = DataDate.toString().substr(2, 2);
        var y = DataDate.toString().substr(4, 2);
        var h = DataTime.toString().substr(0, 2);
        var n = DataTime.toString().substr(2, 2);
        var s = DataTime.toString().substr(4, 2);

        var tmp = m + '/' + d + '/20' + y + ' ' + h + ':' + n + ':' + s + ' UTC';
        
        var reportTime = new Date(tmp);
        
        switch (format) {
            case SHORT_TIME_FORMAT:

                h = reportTime.getHours().toString().padStart(2,'0');
                n = reportTime.getMinutes().toString().padStart(2, '0');
                s = reportTime.getSeconds().toString().padStart(2, '0');

                return h + ':' + n + ':' + s;
                break;
            default:
                return reportTime.toString();
                break;
        }
    } catch (e) {
        return '';
    }
}

function reportNMEAFriendlyTime(DataDate, DataTime) {
    try {
        var reportTime = new Date(reportNMEAtoLocalTime(DataDate, DataTime, LONG_TIME_FORMAT));
        var currentTime = new Date();
        var min = (currentTime - reportTime) / 60000;
        var freindly = reportFriendlyTime(min);
        if (freindly)
            return ' (' + reportFriendlyTime(min) + ')';
        else
            return '';
    } catch (e) {
        return '';
    }    
}

function reportNMEATime(DataDate, DataTime, format, friendlyTime = true) {
    var content = reportNMEAtoLocalTime(DataDate, DataTime, format);
    if (friendlyTime) content += ' ' + reportNMEAFriendlyTime(DataDate, DataTime).toString().trim();
    return content;
}