var webSocket   = null;
//

// websocket connection
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
    var webSocketURL = null;
    webSocketURL = "wss://222.114.39.8:11511"; //"ws://222.114.39.8:11411/ws/vehicle"
    try {
        webSocket = new WebSocket(webSocketURL,[], {
            rejectUnauthorized: false
        });
        webSocket.onopen = function(openEvent) {
            console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
        };
        webSocket.onclose = function (closeEvent) {
            console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
            openWSConnection();
        };
        webSocket.onerror = function (errorEvent) {
            console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
           // openWSConnection();
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = messageEvent.data;
            if (wsMsg.indexOf("error") > 0) {
                console.log("WebSocket Error MESSAGE: " +wsMsg.error);
            } 
            else {
                if(JSON.parse(wsMsg).what == "EVENT")
                    createAlertDiv(wsMsg);
            }
        };
    } catch (exception) {
        console.error(exception);
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
