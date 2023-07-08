function stringLike(str, keyword) {
    str = (str + "").toString();
    keyword = (keyword + "").toString();
    //return str.match(/^.*" + search + "$/) | str.match(/^" + search + ".*$/);

    return (str.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) > -1);
}

function reportFriendlyTime(min) {
    min = parseInt(min);
    if (min < 2) {
        return "last minute";
    } else if (min < 60) {
        return "last " + min + " minutes";
    } else if (min < 120) {
        return "last hour";
    } else if (min < 2880) {
        return "last " + parseInt(min / 60) + " hours";
    } else if (min < 44640) {
        return "last " + parseInt(min / 1440) + " days";
    } else if (min) {
        return "Last " + parseInt(min / 44640) + " months";
    } else {
        return null;
    }
}

function genRadomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


Date.prototype.addSeconds = function (seconds) {
    this.setSeconds(this.getSeconds() + seconds);
    return this;
};

Date.prototype.addMinutes = function (minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addHours = function (hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addWeeks = function (weeks) {
    this.addDays(weeks * 7);
    return this;
};

Date.prototype.addMonths = function (months) {
    var dt = this.getDate();

    this.setMonth(this.getMonth() + months);
    var currDt = this.getDate();

    if (dt !== currDt) {
        this.addDays(-currDt);
    }

    return this;
};

Date.prototype.addYears = function (years) {
    var dt = this.getDate();

    this.setFullYear(this.getFullYear() + years);

    var currDt = this.getDate();

    if (dt !== currDt) {
        this.addDays(-currDt);
    }

    return this;
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.like = function (keyword) {
    keyword = (keyword + "").toString();
    return (this.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) > -1);
};

function urlParam(param) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === param) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function equals(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
//-------------------- Update at MD-GIS --------------------
function getCaret(el) {
    if (el.prop("selectionStart")) {
        return el.prop("selectionStart");
    } else if (document.selection) {
        el.focus();

        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }

        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);

        return rc.text.length;
    }
    return 0;
}

function appendAtCaret($target, caret, $value) {
    var value = $target.val();
    if (caret != value.length) {
        var startPos = $target.prop("selectionStart");
        var scrollTop = $target.scrollTop;
        $target.val(value.substring(0, caret) + $value + value.substring(caret, value.length));
        $target.prop("selectionStart", startPos + $value.length);
        $target.prop("selectionEnd", startPos + $value.length);
        $target.scrollTop = scrollTop;
    } else if (caret == 0) {
        $target.val($value + value);
    } else {
        $target.val(value + $value);
    }
}

function downloadTextFile(text, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//-------------------- Google Map --------------------------
function polygon2Geojson(polygon) {
    var obj = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: []
        },
        properties: {
            strokeColor: polygon.strokeColor,
            strokeOpacity: polygon.strokeOpacity,
            strokeWeight: polygon.strokeWeight,
            fillColor: polygon.fillColor,
            fillOpacity: polygon.fillOpacity
        }
    }      
    // Run Get coordinates
    var area = [];
    var vertices = polygon.getPath();
    for (i = 0; i < vertices.getLength(); i++) {
        var latLng = vertices.getAt(i);
        var pos = [latLng.lng(), latLng.lat()];
        area.push(pos);
    }

    var sn = vertices.getAt(0);
    var en = vertices.getAt(vertices.getLength() - 1);
    if (sn.lng() != en.lng() | sn.lat() != en.lat())
        area.push([sn.lng(), sn.lat()]);

    obj.geometry.coordinates.push(area);

    return obj;
}

function circle2Geojson(circle) {
    var obj = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [[circle.getCenter().lng(), circle.getCenter().lat()]]
        },
        properties: {
            radius: circle.getRadius(),
            strokeColor: circle.strokeColor,
            strokeOpacity: circle.strokeOpacity,
            strokeWeight: circle.strokeWeight,
            fillColor: circle.fillColor,
            fillOpacity: circle.fillOpacity
        }        
    }
    return obj;
}

function rectangle2Geojson(rectangle) {

    var obj = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: []
        },
        properties: {
            strokeColor: rectangle.strokeColor,
            strokeOpacity: rectangle.strokeOpacity,
            strokeWeight: rectangle.strokeWeight,
            fillColor: rectangle.fillColor,
            fillOpacity: rectangle.fillOpacity
        }
    }
    var area = [];
    // Run Get coordinates
    var bounds = rectangle.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();

    area.push([SW.lng(), NE.lat()]);
    area.push([NE.lng(), NE.lat()]);
    area.push([NE.lng(), SW.lat()]);
    area.push([SW.lng(), SW.lat()]);
    area.push([SW.lng(), NE.lat()]);
    obj.geometry.coordinates.push(area);

    return obj;
}

function getShapeBound(shape) {
    switch (shape.type) {
        case "rectangle":
            return rectangle.getBounds();
            break;
        case "polygon":
            //------------ get Boundary ------------
            var bounds = new google.maps.LatLngBounds();
            var vx = shape.getPath();
            for (i = 0; i < vx.getLength(); i++) {
                var latLng = vx.getAt(i);
                bounds.extend(latLng);
            }
            return bounds;
            break;
        case "circle":
            return shape.getBounds();
            break;
    }
    return null;
}


