$(document).on('click','.batteryAlert button', function(){
    $(this).parent('div').fadeOut();
});

function createAlertDiv(eventData)
{
    var dataAttribute = Object.keys(JSON.parse(eventData))
    var id;
    var vehicleID; 
    var eventMessage;
    var selectList = document.getElementById("vehicleSelect");  // vehicle select list
    var selectedId;// = selectList.options[selectList.selectedIndex].id;  // selected Id 

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
        id = (JSON.parse(eventData)).message.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = (JSON.parse(eventData)).message.vehicle_mid;
        eventMessage = (JSON.parse(eventData)).message.value; 
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
        id = (JSON.parse(eventData)).passenger.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = (JSON.parse(eventData)).passenger.vehicle_mid;
        eventMessage = "현재 승객 수: "+(JSON.parse(eventData)).passenger.current_passenger+ " 명"; 
        if(id == selectedId)
            passengerStatus((JSON.parse(eventData)).passenger.current_passenger);
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

    if(vehicleID == null)
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
