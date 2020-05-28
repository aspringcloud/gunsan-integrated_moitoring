var webSocket   = null;
openWSConnection();

/**
 * Event handler for clicking on button "Disconnect"
 */
function onDisconnectClick() {
    webSocket.close();
}
/**
 * Open a new WebSocket connection using the given parameters
 */
function openWSConnection() {
    var data = {"door": {"vehicle_id": 1, "value": false}};
    var dataAttribute = Object.keys(data);
    if(dataAttribute == "door")
    {
        var id = data.door.vehicle_id;
        var value = data.door.value;
    }

    var webSocketURL = null;
    webSocketURL = "ws://115.93.143.2:9103/ws/vehicle";
    try {
        webSocket = new WebSocket(webSocketURL);
       /* const channel = webSocket.channel('door');
        channel.join()
        .receive("ok", resp => { alert("Subscribed to vehicle position updates", resp) })
        .receive("error", resp => {alert("Error subscribing", resp) })
        channel.on("door", door => {
            alert("Received vehicle position update", door);
          })*/
        webSocket.onopen = function(openEvent) {
            //console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
        };
        webSocket.onclose = function (closeEvent) {
            //console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
        };
        webSocket.onerror = function (errorEvent) {
            //console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = messageEvent.data;
            if (wsMsg.indexOf("error") > 0) {
                //console.log("WebSocket MESSAGE: " +wsMsg.error);
            } else {
                //console.log("WebSocket MESSAGE: " +wsMsg);
                createAlertDiv(wsMsg);
            }
        };
    } catch (exception) {
        //console.error(exception);
    }
}
/**
 * Send a message to the WebSocket server
 */
function onSendClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        //console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }  
    webSocket.send(msg);
}
