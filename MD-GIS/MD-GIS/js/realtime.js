var MQTT;
var MQTT_HOST = "marinet.myhr.co.th";
var MQTT_PORT = 15675;
var MQTT_SHIP_TOPIC = "MD-GIS-UPDATE";
var MQTT_WATCHDOG_TOPIC = "MD-GIS/Watchdog";
var MQTT_DETECT_TOPIC = "MD-GIS/Detect";

function startRealtime() {

    var clientID = genRadomString(10);
    MQTT = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, "/ws" , clientID);


    // set callback handlers
    MQTT.onConnectionLost = realtimeConnectionLost;
    MQTT.onMessageArrived = realtimeMessageArrived;

    // connect the client
    MQTT.connect({
        onSuccess: MqttConnected, // แยก Event ไปแต่ละหน้า ***************************
        onFailure: realtimeConnectionLost,
        keepAliveInterval: 50,
        timeout: 10,
        useSSL: false,
        reconnect: true
    });
}

function realtimeConnectionLost(responseObject) {
    // try Reconnect
    setTimeout(startRealtime, 1000);
}

function realtimeMessageArrived(message) {
    // parse And Update Ship

    switch (message.topic) {
        case MQTT_SHIP_TOPIC:
            try {
                var data = JSON.parse(message.payloadString);
                updateShip(data, true); // Update Single Ship // แยก Event ไปแต่ละหน้า ***************************
            } catch (e) {}
            break;
        case MQTT_WATCHDOG_TOPIC:
            try {
                var data = JSON.parse(message.payloadString);
                updateWatchdogRealtime(data); // Update Watchdog Change // แยก Event ไปแต่ละหน้า ***************************
            } catch (e) { }
            break;
        case MQTT_DETECT_TOPIC:
            try {
                var data = JSON.parse(message.payloadString); 
                updateDetectionRealtime(data); // Update detection // แยก Event ไปแต่ละหน้า ***************************
            } catch (e) {}
            break;
    }    
}

function stopRealtime() {
    MQTT.disconnect();
    MQTT = null;
}

