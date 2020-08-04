$(document).on('click','.batteryAlert button', function(){
    $(this).parent('div').fadeOut();
});

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function createAlertDiv(eventData)
{
    console.log("eventDiv :"+eventData);
    var event_how = (JSON.parse(eventData).how);
    var dataAttribute = event_how.type;//Object.keys(JSON.parse(eventData))
    var id;
    var vehicleID; 
    var eventMessage;
    var selectList = document.getElementById("vehicleSelect");  // vehicle select list
    var selectedId;// = selectList.options[selectList.selectedIndex].id;  // selected Id 
    var siteId;

    if(dataAttribute == "door")
    {
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 

        id = (JSON.parse(eventData)).door.vehicle_id;
        vehicleID = (JSON.parse(eventData)).door.vehicle_mid;
       
        if((JSON.parse(eventData)).door.value == true )
        {
            eventMessage = "문이 열립니다."; 
            if(id == selectedId)
                document.getElementById("doorStatus").src = "images/door/door_open.svg";
        }
        else
        {
            eventMessage = "문이 닫힙니다."; 
            if(id == selectedId)
                document.getElementById("doorStatus").src = "images/door/door_closed.svg";
        }
    } 
    else if(dataAttribute == "drive")
    {
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        id = (JSON.parse(eventData)).drive.vehicle_id;
        vehicleID = (JSON.parse(eventData)).drive.vehicle_mid;
        if((JSON.parse(eventData)).drive.value == true)
        {
            eventMessage = "자율주행 상태입니다."; 
            if(id == selectedId)
                document.getElementById("driveStatus").innerHTML = "AUTONOMOUS";
        }
        else
        {
            eventMessage = "수동주행 상태입니다."; 
            if(id == selectedId)
                document.getElementById("driveStatus").innerHTML = "MANUAL";
        }
    }
    else if(dataAttribute == "message")
    {
        id = event_how.vehicle_id;//(JSON.parse(eventData)).message.vehicle_id;
        vehicleID = event_how.vehicle_mid;
        document.getElementById("eventMessageModal").style.display = "block";
        document.getElementById("event_vid").innerHTML = vehicleID;
        //selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        eventMessage = event_how.value;//(JSON.parse(eventData)).message.value; 
        siteId = event_how.site_id;
        // get current date time 
        var currentdate = new Date();
     
       // attact zero at start for month 
        var month = 0;
        if((currentdate.getMonth() + 1) < 10)
            month = "0"+(currentdate.getMonth() + 1);
        else
            month = (currentdate.getMonth() + 1);

        // attact zero at start for date  
        if(currentdate.getDate() < 10)
            var date = "0"+(currentdate.getDate());
        else
            var date = currentdate.getDate();
        var strDate = currentdate.getFullYear()+ "-"+month+ "-"+date;  

        var h = currentdate.getHours();
        var m = currentdate.getMinutes();
        m = checkTime(m);
        var strTime = h+ ":"+m; 

        document.getElementById("eventMsgArea").innerHTML = eventMessage;
        document.getElementById("timeInfo").innerHTML = strDate+" "+strTime+ " 수신"; 

        /*
        id = event_how.vehicle_id;//(JSON.parse(eventData)).message.vehicle_id;
        vehicleID = event_how.vehicle_mid;
  
        //document.getElementById("event_vid").innerHTML = vehicleID;
        //selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        eventMessage = event_how.value;//(JSON.parse(eventData)).message.value; 
        siteId = event_how.site_id;
        // get current date time 
        var currentdate = new Date();
     
       // attact zero at start for month 
        var month = 0;
        if((currentdate.getMonth() + 1) < 10)
            month = "0"+(currentdate.getMonth() + 1);
        else
            month = (currentdate.getMonth() + 1);

        // attact zero at start for date  
        if(currentdate.getDate() < 10)
            var date = "0"+(currentdate.getDate());
        else
            var date = currentdate.getDate();
        var strDate = currentdate.getFullYear()+ "-"+month+ "-"+date;  

        var h = currentdate.getHours();
        var m = currentdate.getMinutes();
        m = checkTime(m);
        var strTime = h+ ":"+m; 

        //document.getElementById("eventMsgArea").innerHTML = eventMessage;
     //   document.getElementById("timeInfo").innerHTML = strDate+" "+strTime+ " 수신"; 

        var timeInfo = strDate+" "+strTime+ " 수신";
        var html = '<div id="eventMessageModal" class="message_div2">'+
                    '<div class="message-content3">'+
                        '<div class="message-header2">'+
                        '<div class="msgDiv1">'+
                            '<p class="msgSendP" id="vehicleEventMsg"> <span id="event_vid">'+vehicleID+'</span>에서 보낸 메세지</p>'+
                            '<span class="msg_close" onclick="confirmEventMsg("eventMessageModal");">'+
                                '<img src="images/closing_button.svg" style="margin-top: 15px;">'+
                            '</span>'+
                        '</div>'+
                    '</div>'+
                    '<div class="message-body2">'+
                        '<textarea id="eventMsgArea" class="textArea" rows="10" cols="30" name="contents" onkeyup="fnChkByte(this,"200");" disabled>'+eventMessage+'</textarea>'+
                        '<span class="noto_regular msgP2" id="timeInfo">'+timeInfo+'</span>'+
                    '</div>'+
                    '<div class="message-footer2" style="margin-top: 15px;">'+
                        '<button class="event_send_button" onclick="confirmEventMsg("eventMessageModal");">확인</button>'+
                    '</div>'+
                '</div>'+
            '</div>';

        $('#eventMsgModalDiv').append(html);
        document.getElementById("eventMessageModal").style.display = "block";
        */
    }
    else if(dataAttribute == "parking")
    {
        id = (JSON.parse(eventData)).parking.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = (JSON.parse(eventData)).parking.vehicle_mid;
      
        if((JSON.parse(eventData)).parking.value == true)
        {
            eventMessage = "주차 상태입니다."; 
            if(id == selectedId)
                vehicleStatus("PARKED", "rgb(128,128,128)");
        }
        else
            eventMessage = "주차 상태가 아닙니다."; 
    }
    else if(dataAttribute == "passenger")
    {
        id = event_how.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = event_how.vehicle_mid;
        eventMessage = "현재 승객 수: "+event_how.current_passenger+ " 명"; 
        if(id == selectedId)
            passengerStatus(event_how.current_passenger);

            console.log("**vehicle_id : "+id);
            console.log("**selectedId : "+selectedId);
            console.log("**vehicle_mid : "+vehicleID);
            console.log("**current_passenger : "+event_how.current_passenger);
    }
    else if(dataAttribute == "power")
    {
        id = (JSON.parse(eventData)).power.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = (JSON.parse(eventData)).power.vehicle_mid;
        if((JSON.parse(eventData)).power.value == true )
            eventMessage = "전원이 켜졌습니다."; 
        else
            eventMessage = "전원이 꺼졌습니다."; 
    }

    //alert("active_site :"+active_site+ "  siteId:"+siteId);
    if(vehicleID == null || siteId != active_site || dataAttribute == "message" ) //|| siteId != active_site
        return false;
    
    // Create div to show event information
    var dom = document.getElementById('eventsDiv');
    var newAlert = "<span>"+vehicleID+"</span>"+
                   "<p>"+eventMessage+"</p>"+
                   "<button>확인</button>";
    var divs = document.createElement("div");
    divs.className = 'batteryAlert';
    divs.innerHTML = newAlert;
    
    // insert div as first element of parent div
    dom.insertBefore(divs, dom.firstChild);

    // For non-critical events close div in 3 seconds
    if(dataAttribute =="door" || dataAttribute =="passenger")
    setTimeout(function() {
        $(divs).fadeOut();
    }, 3000);
}

function confirmEventMsg(divId)
{
    document.getElementById(divId).style.display = "none";
}