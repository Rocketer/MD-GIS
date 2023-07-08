class Ship {
    constructor(Id, MMSI, IMONumber, ShipTypeName, VesselName, marker) {

        // Default Required Field
        this.Id = Id;
        this.MMSI = MMSI;
        this.IMONumber = IMONumber.trim();
        this.ShipTypeName = ShipTypeName.trim();
        this.VesselName = VesselName.trim();
        this.marker = marker;

        // Demo
        this.accessRestrictZone = false;
        this.accessZoneFirstTime = false;
        this.accessZoneName = '';
        
        // Extent Field
        this.AISversion = "";
        this.CallSign = "";
        this.DataDate = "";
        this.DataTime = "";

        this.Latitude = "";
        this.Longitude = "";
        this.LastLatitude = "";
        this.LastLongitude = "";

        this.SpeedOverGround = "";
        this.CourseOverGround;
        
        this.ShipTypeId = "";
        this.ShipTypeColor = "";
        this.Flag = "";
        this.Origin = "";
        this.Destination = "";
        this.NoOfSattelites = "";
        this.Altitude = "";
        this.MagneticVariation = "";
        this.GPSIndicator = "";
        this.GoeidalSeparation = "";
        this.NavigationStatusId = "";
        this.NavigationStatusName = "";
        this.TrueHeading = "";
        this.AISchannel = "";

        this.DimensionToBow = "";
        this.DimensionToStern = "";
        this.DimensionToPort = "";
        this.DimensionToStarboard = "";
        this.ETA = "";
        this.RepeatIndicator = "";
        this.RateOfTurn = "";
        this.Draught = "";

        this.IsBaseStation = false;
        this.baseStationMMSI = "";
    }

    updateExtra(data) {


        this.IMONumber = data.IMONumber.trim();
        this.ShipTypeName = data.ShipTypeName.trim();
        this.VesselName = data.VesselName.trim();

        // Extent Field
        this.AISversion = data.AISversion;
        this.CallSign = data.CallSign;
        this.DataDate = data.DataDate;
        this.DataTime = data.DataTime;

        this.Latitude = data.Latitude;
        this.Longitude = data.Longitude;
        this.LastLatitude = data.LastLatitude;
        this.LastLongitude = data.LastLongitude;

        this.SpeedOverGround = data.SpeedOverGround;
        this.CourseOverGround = data.CourseOverGround;

        this.ShipTypeId = data.ShipTypeId;
        this.ShipTypeColor = data.ShipTypeColor;
        this.Flag = data.Flag;
        this.Origin = data.Origin;
        this.Destination = data.Destination;
        this.NoOfSattelites = data.NoOfSattelites;
        this.Altitude = data.Altitude;
        this.MagneticVariation = data.MagneticVariation;
        this.GPSIndicator = data.GPSIndicator;
        this.GoeidalSeparation = data.GoeidalSeparation;
        this.NavigationStatusId = data.NavigationStatusId;
        this.NavigationStatusName = data.NavigationStatusName;
        this.TrueHeading = data.TrueHeading;
        this.AISchannel = data.AISchannel;

        this.DimensionToBow = data.DimensionToBow;
        this.DimensionToStern = data.DimensionToStern;
        this.DimensionToPort = data.DimensionToPort;
        this.DimensionToStarboard = data.DimensionToStarboard;
        this.ETA = data.ETA;
        this.RepeatIndicator = data.RepeatIndicator;
        this.RateOfTurn = data.RateOfTurn;
        this.Draught = data.Draught;

        this.IsBaseStation = data.IsBaseStation;
        this.baseStationMMSI = data.baseStationMMSI;
    }

    getLastPosition() {

    }

    setVisible(visible, map) {
        var target = map;
        if (!visible) target = null;
        this.marker.setMap(target);
    }

    getVisible() {
        return !(this.marker.getMap() == null)
    }

    isMoving() {
        try {

            if (!this.SpeedOverGround) return false;
            if (this.NavigationStatusName) {
                if (this.NavigationStatusName.toString().toLowerCase().indexOf('moore') > -1) return false;
                if (this.NavigationStatusName.toString().toLowerCase().indexOf('anchor') > -1) return false;
            }
            return true;                
        } catch (e) {
            return true;
        }       
    }

}

class Ships {
    constructor() {
        this.list = [];
    }

    add(ship) {
        var MMSI = ship.MMSI;
        if (!this.list[MMSI]) {
            this.list[MMSI] = ship;
        }
        return this;
    }

    remove(ship) {

        // Get Removed Index
        if (ship.marker) ship.marker.setMap(null);
        delete ship.marker;
        if (ship.directionLine) ship.directionLine.setMap(null);
        delete ship.directionLine;


        var target = ship.MMSI;
        var list = [];
        for (var MMSI in this.list) {
            if (MMSI != target) {
                list[MMSI] = this.list[MMSI];
            }
        }
        this.list = list;
        return this; 
    }

    indexOf(ship) {
        var i = -1;
        if (!ship) return i;
        for (var MMSI in this.list) {
            i += 1;
            if (ship.MMSI == MMSI) return i;
        }
        return -1;
    }

    removeByMMSI(MMSI) {
        var ship = this.list[MMSI];
        if (!ship) return this;
        return this.remove(ship);
    }

    byMMSI(MMSI) {
        return this.list[MMSI];
    }

    byType(ShipTypeName) {
        var result = [];
        for (var MMSI in this.list) {
            var ship = this.list[MMSI];
            if (ship.ShipTypeName == ShipTypeName)
                result.push(ship);
        }
        return result;
    }

    byVisibility(visible) {
        var result = [];
        for (var MMSI in this.list) {
            var ship = this.list[MMSI];
            if (ship.getVisible() == visible)
                result.push(ship);
        }   
        return result;        
    }
}