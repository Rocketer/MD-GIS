/* ------ Current Managed Objects ------ */
var map;

var colors = ['#FF0000', '#1E90FF', '#32FF32', '#FF8C00', '#4B0082', '#cccccc'];
var selectedColor = null;
var colorButtons = [];
var drawingManager;
var selectedShape;
var zones;

function resizeMap() {
    $('#Map').height($('.content-wrapper').innerHeight() - 270);
    $('.content-wrapper').innerHeight();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('Map'), {
        styles: mapStyle,
        center: { lat: 13.54, lng: 100.6 },
        disableDefaultUI: true,
        zoom: 11,
        gestureHandling: 'greedy'
    });

    if (zones) zones.clear();
    zones = new Zones("");
    colorButtons = [];
    implementTools();
}

function implementTools() {
    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and zones.

    var polyOptions = {
        strokeWeight: 0,
        strokeColor: 'white',
        strokeOpacity: 0,
        fillOpacity: 0.3,
        editable: true,
        draggable: true
    };

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: ['circle', 'polygon', 'rectangle']
        },
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        rectangleOptions: polyOptions,
        map: map
    });

    // ----------------- Event เมือวาดเสร็จ ---------------
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {

        var shape = e.overlay;
        shape.type = e.type;

        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);

        // Add an event listener that selects the newly-drawn shape when the user mouses down on it.
        setEditable(shape);

        var zone = new Zone(shape, e.type);
        zones.add(zone); // Add to zones
        setSelection(shape);
    });

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.

    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(map, 'click', clearSelection); // เมื่อ Map โดน Click ให้  Clear Selection
    google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

    buildColorPalette();
}

/* ----------------- Selection ------------------- */
function clearSelection() {
    if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
    }
}

function setSelection(shape) {
    clearSelection();
    shape.setEditable(true);
    selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    selectedShape = shape;
}

function deleteSelectedShape() {
    if (selectedShape) {

        var index = zones.indexOfShape(selectedShape);
        if (index == -1) {
            selectedShape.setMap(null);
            selectedShape = null;
        } else {
            zones.removeAt(index);
        }

    }
}

/* ---------------Shape Color ------------------------*/
function selectColor(color) {
    selectedColor = color;
    for (var i = 0; i < colors.length; ++i) {
        var cur = colors[i];
        colorButtons[cur].style.border = cur == color ? '2px solid #789' : '2px solid #fff';
    }

    // Retrieves the current options from the drawing manager and replaces the
    // stroke or fill color as appropriate.
    var circleOptions = drawingManager.get('circleOptions');
    circleOptions.fillColor = color;
    drawingManager.set('circleOptions', circleOptions);

    var polygonOptions = drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    drawingManager.set('polygonOptions', polygonOptions);
}

function setSelectedShapeColor(color) {
    if (selectedShape) {
        selectedShape.set('fillColor', color);
    }
}

function makeColorButton(color) {
    var button = document.createElement('div');
    button.className = 'color-button';
    button.style.backgroundColor = color;
    google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color);
        setSelectedShapeColor(color);
    });
    return button;
}

function buildColorPalette() {

    var colorPalette = document.getElementById('color-palette');
    colorPalette.innerHTML = "";
    colorButtons = [];

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var button = makeColorButton(color);
        colorPalette.appendChild(button);
        colorButtons[color] = button;
    }
    selectColor(colors[0]);
}

function getZones() {
    var ret = [];
    for (var i = 0; i < zones.list.length; i++) {
        var data = shape2Data(zones.list[i].shape);
        if (data) ret.push(data);
    }       
    return ret;
}

function setEditable(shape) {
    google.maps.event.addListener(shape, 'click', function (e) {
        if (e.vertex !== undefined) {
            if (shape.type === google.maps.drawing.OverlayType.POLYGON) {
                var path = shape.getPaths().getAt(e.path);
                path.removeAt(e.vertex);
                if (path.length < 3) {
                    deleteSelectedShape();
                }
            }
        }
        setSelection(shape);
    });
}

function setSpatialData(json, map) {

    var shapes = json.Zones;
    zones = new Zones(json.W_Name);
    var bound;
    for (var i = 0; i < shapes.length; i++) {

        var data = shapes[i];
        var shape ;

        switch (shapes[i].Shape_Type) {
            case 1: // Polygon
                shape = data2Polygon(data);
                break;
            case 2: // Rectangle
                shape = data2Rectangle(data);
                break;
            case 3: // Circle 
                shape = data2Circle(data);
                break;
        }
        shape.setMap(map);
        setEditable(shape);
        zone = new Zone(shape, shape.type);
        zones.add(zone);

        if (!bound)
            bound = getShapeBound(shape);
        else
            bound.extend(getShapeBound(shape));
    }
    //if (bound)
    //    map.fitBounds(bound);

    $('select[data="spatialMethod"]').prop('selectedIndex', json.Spatial_Filter_Type);
    return zones;
}

