var historyWaypoints = [];

var historyMMSI;
$(document).ready(function () {
    $('#aToggleInfo').click(function () {
        showShipHistory(historyMMSI);
    });
});

function showShipHistory(MMSI) {
    // -------------------- Get History ------------------

    var historyURL = "ShipInfo.aspx?Mode=GetHistory&mmsi=" + MMSI;
    var lineSymbol = {
        path: 'M 0,0 0,1',
        strokeOpacity: 1,
        scale: 1
    };

    historyWaypoints = [];
    //---------------  Get Data From NMEA Demo-----------------
    $.getJSON(historyURL, function (JSONString) {


        var wayPointNo = 0;
        var ShipTypeColor = 'yellow';
        var mapBounds = new google.maps.LatLngBounds();
        var P1 = new google.maps.LatLng(0, 0);


        var index = 0;

        $.each(JSONString, function (key, data) {

            index += 1;

            if (data.Latitude == 0 & data.Longitude == 0) return;
            if (!data.ShipTypeName) data.ShipTypeName = 'Unspecific';

            var P2 = new google.maps.LatLng(data.Latitude, data.Longitude);
            var distance = getDistance(P1, P2);
            if (!distance) return;
            if (distance <= 10 & index != JSONString.length) return; // Simplex Vertext by specific deistance

            if (data.ShipTypeColor) {
                shipTypeColor = data.ShipTypeColor;
            } else {
                shipTypeColor = 'grey';
            }

            
            wayPointNo += 1;

            var pos = "#" + wayPointNo;
            var iconURL = "";

            if (index != JSONString.length) {
                iconURL = 'Images/ShipIcon/PNG/' + data.ShipTypeName + "_C_720.png";
            } else {
                iconURL = getShipIcon(data.ShipTypeName, data.TrueHeading, data.NavigationStatusName, data.SpeedOverGround);
            }


            var icon = {
                url: iconURL,
                size: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 15), // ขนาดของ icon หาร 2 จะตรงกับปลายหมุด
                optimized: false
            };

            var Updated = "";
            if (data.DataDate & data.DataTime) {
                Updated = reportNMEATime(data.DataDate, data.DataTime);
            }

            var wayPoint = new google.maps.Marker({
                position: P2,
                icon: icon,
                map: mapMini,
                title: Updated
            });
            // Bundle Data
            wayPoint.Updated = Updated;
            wayPoint.DataDate = data.DataDate;
            wayPoint.DataTime = data.DataTime;
            wayPoint.Latitude = data.Latitude;
            wayPoint.Longitude = data.Longitude;
            wayPoint.NavigationStatusName = data.NavigationStatusName;
            if (wayPointNo != 1) {
                wayPoint.distance = parseInt(distance) + ' m.';
            } else {
                wayPoint.distance = "";
            }

            mapBounds.extend(P2);

            google.maps.event.addListener(wayPoint, 'click', function () {
                var content = pos + '.' + Updated + '<br>' + data.Latitude + ', ' + data.Longitude;
                var infoWindow = new google.maps.InfoWindow({
                    content: content,
                    pixelOffset: new google.maps.Size(0, 15)
                });
                infoWindow.open(mapMini, wayPoint);
            });

            historyWaypoints.push(wayPoint);

            if (wayPointNo != 1) {
                Coordinates = [];
                Coordinates.push(P1);
                Coordinates.push(P2);

                var polyLines = new google.maps.Polyline({
                    path: Coordinates,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '10px'
                    }],
                    map: mapMini,
                    strokeColor: shipTypeColor.toLowerCase(),
                    strokeOpacity: 0
                });
            }
            P1 = P2;
        });

        mapMini.fitBounds(mapBounds);

        // DataTable
        setHistoryTable();
    });
}

function setHistoryTable() {

    // Generate Row
    var tbody = $('#tbHistory tbody');

    var html = "";
    var index = -1;

    for (i = 0; i < historyWaypoints.length; i++) {
        var wayPoint = historyWaypoints[i];
        var tr = "<tr style='cursor:pointer;' onclick='moveMiniMapToHistory(" + (i + 1) + ");'>";

        //if (wayPoint.Updated)
        tr += "<td>" + reportNMEATime(wayPoint.DataDate, wayPoint.DataTime) + "</td>";
        //else
        //    tr += "<td></td>";

        if (wayPoint.Latitude != null & wayPoint.Longitude != null)
            tr += "<td align='right'>" + wayPoint.Latitude + "<br>" + wayPoint.Longitude + "</td>";
        else
            tr += "<td></td>";

        if (wayPoint.NavigationStatusName)
            tr += "<td>" + wayPoint.NavigationStatusName + "</td>";
        else
            tr += "<td></td>";

        if (wayPoint.distance)
            tr += "<td>" + wayPoint.distance + "</td>";
        else
            tr += "<td></td>";

        tr += "</tr>";
        html += tr;
    }

    tbody.html(html);
}

function moveMiniMapToHistory(index) {
    for (i = 0; i < historyWaypoints.length; i++) {
        if (i != index) {
            //historyWaypoints[i].infowindow.close();
        } else {

            var wayPoint = historyWaypoints[i];
            mapMini.setCenter(wayPoint.getPosition());
            mapMini.setZoom(24);
            var content = '#' + (index + 1) + '.' + reportNMEATime(wayPoint.DataDate, wayPoint.DataTime) + '<br>' + wayPoint.getPosition().lat() + ', ' + wayPoint.getPosition().lng();
            var infoWindow = new google.maps.InfoWindow({
                content: content,
                pixelOffset: new google.maps.Size(0, 15)
            });
            infoWindow.open(mapMini, wayPoint);
            setTimeout(function () { infoWindow.setMap(null); }, 5000);
            $("#aToggleInfo").focus();
        }
    }

}

function clearHistoryMap() {

    for (i = 0; i < historyWaypoints.length; i++) {
        try {
            historyWaypoints[i].setMap(null);
        } catch (e) { }
    }
    historyWaypoints = [];
    initMapMini();
}

var mapMini;

function initMapMini() {
    mapMini = new google.maps.Map(document.getElementById('MapMini'), {
        styles: mapStyle,
        center: { lat: 13.1, lng: 100.844 },
        disableDefaultUI: true,
        zoom: 15
    });
}