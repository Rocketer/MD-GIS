class Zone {

    constructor(shape, type) {
        this.shape = shape; // เก็บ Shape ได้แก่ google.maps.Rectangle, google.maps.Polygon, google.maps.Circle
        this.type = type; // เก็บ Type ของ Shape ได้แก่ Rectangle, Polygon, Circle
    }

    //setVisible(visible, map) {
    //    var target = map;
    //    if (!visible) target = null;
    //    for (i=0; i < this.areas.length; i++) 
    //        this.areas[i].setMap(target);        
    //}

    //getVisible() {
    //    if (this.areas.length == 0) return false;
    //    return !(this.areas[0].getMap() == null)
    //}
}

class Zones {
    constructor( name ) {
        this.list = [];
        this.name = name;
    }

    add(zone) {
        this.list.push(zone); 
        return this;
    }

    length() {
        return this.list.length;
    }

    remove(zone) {
        //for (var i = 0; i < this.list.length; i++) {
        //    if (this.list[i].id == id) {
        //        this.list[i].shape.setMap(null);
        //        this.list.splice(i, 1);
        //        return this;
        //    }
        //}
        return this; 
    }

    indexOfShape(shape) {
        var s = shape2Data(shape);
        for (var i = 0; i < this.list.length; i++) {
            var o = shape2Data(this.list[i].shape);
            if (equals( s , o)) return i;
        } return -1;
    }

    removeAt(index) {
        this.list[index].shape.setMap(null);
        this.list.splice(index, 1);
        return this;
    }

    clear() {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].shape.setMap(null);
            this.list = [];           
        }
        return this;
    }

}

function shape2Data(shape) {
    var obj;
    switch (shape.type) {
        case "circle":
            obj = circle2Data(shape);
            break;
        case "rectangle":
            obj = rectangle2Data(shape);
            break;
        case "polygon":
            obj = polygon2Data(shape);
            break;
    }
    return obj;
}

function polygon2Data(shape) {

    var vertices = shape.getPath();
    if (vertices.getLength() < 3) return null;

    var Coordinates = "";
    for (var i = 0; i < vertices.getLength(); i++) {
        var latLng = vertices.getAt(i);
        Coordinates += latLng.lng() + ' ' + latLng.lat() + ',';
    }
    var sn = vertices.getAt(0);
    var en = vertices.getAt(vertices.getLength() - 1);
    if (sn.lng() != en.lng() | sn.lat() != en.lat())
        Coordinates += sn.lng() + ' ' + sn.lat() + ',';

    Coordinates = Coordinates.substring(0, Coordinates.length - 1);

    var obj = {
        Shape_Type: 1,
        Coordinates: Coordinates,
        Radius: null,
        Stroke_Color: shape.strokeColor,
        Stroke_Opacity: shape.strokeOpacity,
        Stroke_Weight: shape.strokeWeight,
        Fill_Color: shape.fillColor,
        Fill_Opacity: shape.fillOpacity
    }
    return obj;
}

function circle2Data(shape) {

    var Coordinates = shape.getCenter().lng() + ' ' + shape.getCenter().lat();
    var obj = {
        Shape_Type: 3,
        Coordinates: Coordinates,
        Radius: shape.getRadius(),
        Stroke_Color: shape.strokeColor,
        Stroke_Opacity: shape.strokeOpacity,
        Stroke_Weight: shape.strokeWeight,
        Fill_Color: shape.fillColor,
        Fill_Opacity: shape.fillOpacity
    }
    return obj;
}

function rectangle2Data(shape) {

    var bounds = shape.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();

    var Coordinates = NE.lng() + ' ' + NE.lat() + ',' + SW.lng() + ' ' + SW.lat();
    var obj = {
        Shape_Type: 2,
        Coordinates: Coordinates,
        Radius: null,
        Stroke_Color: shape.strokeColor,
        Stroke_Opacity: shape.strokeOpacity,
        Stroke_Weight: shape.strokeWeight,
        Fill_Color: shape.fillColor,
        Fill_Opacity: shape.fillOpacity
    }
    return obj;
}

function data2Polygon(data) {

    var LatLng = Coordinates2Points(data.Coordinates);
    var polygon = new google.maps.Polygon({
        paths: LatLng,
        draggable: true,
        strokeColor: data.Stroke_Color,
        strokeOpacity: data.Stroke_Opacity,
        strokeWeight: data.Stroke_Weight,
        fillColor: data.Fill_Color,
        fillOpacity: data.Fill_Opacity
    });
    polygon.type = "polygon";
    return polygon;
}

function data2Rectangle(data) {

    var north = parseFloat(data.Coordinates.split(',')[0].split(' ')[1]);
    var south = parseFloat(data.Coordinates.split(',')[1].split(' ')[1]);
    var east = parseFloat(data.Coordinates.split(',')[0].split(' ')[0]);
    var west = parseFloat(data.Coordinates.split(',')[1].split(' ')[0]);

    var rectangle = new google.maps.Rectangle({
        draggable: true,
        strokeColor: data.Stroke_Color,
        strokeOpacity: data.Stroke_Opacity,
        strokeWeight: data.Stroke_Weight,
        fillColor: data.Fill_Color,
        fillOpacity: data.Fill_Opacity,
        bounds: {
            north: north,
            south: south,
            east: east,
            west: west
        }
    });
    rectangle.type = "rectangle";
    return rectangle;
}

function data2Circle(data) {

    var LatLng = Coordinates2Points(data.Coordinates);
    var center = LatLng[0];

    var circle = new google.maps.Circle({
        draggable: true,
        strokeColor: data.Stroke_Color,
        strokeOpacity: data.Stroke_Opacity,
        strokeWeight: data.Stroke_Weight,
        fillColor: data.Fill_Color,
        fillOpacity: data.Fill_Opacity,
        center: center,
        radius: data.Radius
    });
    circle.type = "circle";
    return circle;
}

function Coordinates2Points(Coordinates) {
    var LatLng = [];
    var pos = Coordinates.split(',');
    for (i = 0; i < pos.length; i++) {
        var p = pos[i].split(' ');
        var lon = parseFloat(p[0]);
        var lat = parseFloat(p[1]);
        var latlng = new google.maps.LatLng(lat, lon);
        LatLng.push(latlng);
    }
    return LatLng;
}