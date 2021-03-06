var webSocket   = null;

// websocket connection
openWSConnection();

/* Event handler for clicking on button "Disconnect"*/
function onDisconnectClick() {
    webSocket.close();
}

/* Open a new WebSocket connection using the given parameters */
function openWSConnection() {
    var webSocketURL = null;
    webSocketURL = "wss://websocket.springgo.io:11511";//"wss://websocket.springgo.io:11411";
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
            if(JSON.parse(wsMsg).what == "EVENT")
            {
                createAlertDiv(wsMsg);
            }
            else
            {
                if(wsMsg.indexOf("error") > 0) 
                    console.log("WebSocket Error MESSAGE: " +wsMsg.error);
            }
        };
    } catch (exception) {
        console.error(exception);
    }
}

/* Send a message to the WebSocket server */
function onSendClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        return;
    }  
    webSocket.send(msg);
}
