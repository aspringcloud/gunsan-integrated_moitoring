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
    webSocketURL = "wss://ws.tasio.io:11511";//"ws://222.114.39.8:11411";//"wss://ws.tasio.io:11511"; //"ws://222.114.39.8:11411/ws/vehicle"
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
            //console.log("wsMsg :"+JSON.stringify(wsMsg));
            if(JSON.parse(wsMsg).what == "EVENT")
            {
                createAlertDiv(wsMsg);
            }
            else
            {
                if(wsMsg.indexOf("error") > 0) 
                    console.log("WebSocket Error MESSAGE: " +wsMsg.error);
                 
            }



            //alert("*wsMsg :"+wsMsg);
          /*  if(wsMsg.indexOf("error") > 0) {
               // alert("if");
                console.log("WebSocket Error MESSAGE: " +wsMsg.error);
            } 
            else {
                //alert("else:" +JSON.parse(wsMsg).what );
                if(JSON.parse(wsMsg).what == "EVENT")
                    createAlertDiv(wsMsg);
            }*/
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
