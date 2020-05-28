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
        vehicleID = "SCN"+(JSON.parse(eventData)).door.vehicle_id;
       
        if((JSON.parse(eventData)).door.value == true )
        {
            eventMessage = "Doors are open"; 
            //console.log("vehicleID :"+vehicleID+" selectedId: "+selectedId);
            if(id == selectedId)
                document.getElementById("doorStatus").src = "images/door/door_open.svg";
        }
        else
        {
            eventMessage = "Doors are closed"; 
            if(id == selectedId)
                document.getElementById("doorStatus").src = "images/door/door_closed.svg";
        }
    } 
    else if(dataAttribute == "drive")
    {
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        id = (JSON.parse(eventData)).drive.vehicle_id;
        vehicleID = "SCN"+(JSON.parse(eventData)).drive.vehicle_id;
        if((JSON.parse(eventData)).drive.value == true)
        {
            eventMessage = "Drive is Autonomous"; 
            if(id == selectedId)
                document.getElementById("driveStatus").innerHTML = "AUTONOMOUS";
        }
        else
        {
            eventMessage = "Drive is Manual"; 
            if(id == selectedId)
                document.getElementById("driveStatus").innerHTML = "MANUAL";
        }
    }
    else if(dataAttribute == "message")
    {
        id = (JSON.parse(eventData)).message.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = "SCN"+(JSON.parse(eventData)).message.vehicle_id;
        eventMessage = (JSON.parse(eventData)).message.value; 
    }
    else if(dataAttribute == "parking")
    {
        id = (JSON.parse(eventData)).parking.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = "SCN"+(JSON.parse(eventData)).parking.vehicle_id;
      
        if((JSON.parse(eventData)).parking.value == true)
        {
            eventMessage = "Vehice is parked"; 
            if(id == selectedId)
                vehicleStatus("PARKED", "rgb(128,128,128)");
        }
            
        else
            eventMessage = "Vehice is not parked"; 
    }
    else if(dataAttribute == "passenger")
    {
        id = (JSON.parse(eventData)).passenger.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = "SCN"+(JSON.parse(eventData)).passenger.vehicle_id;
        eventMessage = "Current passengers: "+(JSON.parse(eventData)).passenger.current_passenger; 
        if(id == selectedId)
            passengerStatus((JSON.parse(eventData)).passenger.current_passenger);
    }
    else if(dataAttribute == "power")
    {
        id = (JSON.parse(eventData)).power.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = "SCN"+(JSON.parse(eventData)).power.vehicle_id;
        if((JSON.parse(eventData)).power.value == true )
            eventMessage = "Power is ON"; 
        else
            eventMessage = "Power is OFF"; 
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
