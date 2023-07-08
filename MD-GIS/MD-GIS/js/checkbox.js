function iCheckboxPlugin() {

    var iCheckList = ["red", "green", "blue", "yellow", "aero", "orange", "purple", "pink", "grey", "maroon"];

    for (i = 0; i < iCheckList.length; i++) {
        var _color = iCheckList[i];
        $('input[type="checkbox"].flat-' + _color).iCheck({
            checkboxClass: 'icheckbox_flat-' + _color
        });
        $('input[type="checkbox"].minimal-' + _color).iCheck({
            checkboxClass: 'icheckbox_minimal-' + _color
        });

        $('input[type="radio"].flat-' + _color).iCheck({
            radioClass : 'iradio_flat-' + _color
        });
    }

    $('ins').click(function () {

        var cb = $(this).parent().find("input[type='checkbox']");
        var rd = $(this).parent().find("input[type='radio']");

        // implement map function
        if (cb.attr("id") == 'chkToggleName') {
            setTimeout(toggleShipLabel, 100);
        }
        if (cb.attr("id") == 'chkToggleDirection') {
            setTimeout(toggleShipDirection, 100);
        }
        if (rd.attr("name") == 'rdoDirection') {
            setTimeout(toggleShipDirection, 100);
        }

        var shipType = cb.attr("ship-type");

        if (shipType) {
            setTypeVisibility(shipType, getTypeVisibility(shipType));
        }

        reportShipList();
    });

}

function isCheckboxChecked(obj) {
    return obj.parent().hasClass('checked');
}

function iCheckboxArea(map) {
    $('ins').click(function () {
        setAllZonesVisibility(map);
    });
    setAllZonesVisibility(map);
}

function setAllZonesVisibility(map) {

    for (z = 0; z < zones.list.length; z++) {
        var zone = zones.list[z];
        var visible = $("#chkZoneType" + zone.type).parent().hasClass("checked");
        
        if (!visible) {
            zone.setVisible(false, map);
        } else {
            visible = $("#chkZoneId" + zone.id).parent().hasClass("checked");            
            zone.setVisible(visible, map);
        }
    }

}

function setTypeVisibility(ShipTypeName) {
    var target = map;
    var visible = getTypeVisibility(ShipTypeName);
    if (!visible) target = null;
    var list = ships.byType(ShipTypeName);
    for (i = 0; i < list.length; i++) {
        list[i].marker.setMap(target);
        if (list[i].directionLine) {
            list[i].directionLine.setMap(target);
        }
    }
}
