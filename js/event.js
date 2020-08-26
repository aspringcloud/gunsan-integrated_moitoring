$(document).on('click','.batteryAlert img', function(){
    $(this).parent('div').fadeOut();
});
 
function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function getPosition( element ) {
    var rect = element.getBoundingClientRect();
    return {x:rect.left,y:rect.top};
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
    var siteId   = event_how.site_id;

    if(dataAttribute == "door")
    {
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        id = event_how.vehicle_id;
        vehicleID = event_how.vehicle_mid;
        if(event_how.value == true )
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
        id = event_how.vehicle_id;
        vehicleID = event_how.vehicle_mid;
        if(event_how.value == "auto")
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
        //document.getElementById("eventMessageModal").style.display = "block";
       // document.getElementById("event_vid").innerHTML = vehicleID;
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
        var sec = currentdate.getSeconds();
        //document.getElementById("eventMsgArea").innerHTML = eventMessage;
        //document.getElementById("timeInfo").innerHTML = strDate+" "+strTime+ " 수신"; 
        //onclick="confirmEventMsg('+this+');" style="'+test+'" 
        var top;
        var left;
        var divArray = [];
        if(!document.getElementById("eventContent200"))
        {
            if(left == undefined )
                left = 200;
            if(top == undefined )
                top = 100;
        }
        else //if(document.getElementById("eventContent"+left))
        {
            $('div','#eventMsgModalDiv').each(function(){
                divArray.push($(this).attr('id')); 
            });
            
            var leftValueArray = [];   
            for(var j=0; j<divArray.length;j++)
            {
                if(divArray[j] != undefined)
                {
                    var subStr = (divArray[j]).substr(0,12);
                    if(subStr == "eventContent")
                    {
                        var topString = (divArray[j]).substr(12);   
                        leftValueArray.push(topString);   
                    }
                }
            }

            console.log("topValueArray :"+leftValueArray);
            left = leftValueArray [leftValueArray.length -1];
            top = (leftValueArray [leftValueArray.length -1])-100;
            top = parseInt(top) + 60;
            left = parseInt(left) + 60;
        }

        var style = 'left:'+left+'px; top:'+top+'px; display:block;';
        var eventHtml = '<div id="eventContent'+left+'" class="message-content3" style = "'+style+'">'+ 
                         '<div id="eventHeader" class="message-header2" >'+
                            '<div class="msgDiv1">'+
                                '<p class="msgSendP" id="vehicleEventMsg"> <span id="event_vid">'+vehicleID+'</span>에서 보낸 메세지</p>'+
                                '<span class="msg_close">'+
                                    '<img id= "eventMsgClose" src="images/closing_button.svg"  style="margin-top: 15px;">'+
                                '</span>'+
                            '</div>'+
                        '</div>'+
                        ' <div class="message-body2">'+
                            '<textarea id="eventMsgArea" class="textArea" rows="10" cols="30" name="contents" onkeyup="fnChkByte(this,200)" disabled>'+eventMessage+'</textarea>'+
                            '<span class="noto_regular msgP2" id="timeInfo">'+strDate+" "+strTime+ ' 수신</span>'+
                        ' </div>'+
                        '<div class="message-footer2" style="margin-top: 15px;">'+
                            '<button class="event_send_button" id="testEvent" >확인</button>'+
                        ' </div>'+
                    '</div>';
        $('#eventMsgModalDiv').append(eventHtml);//html(eventHtml);//append(eventHtml);
        document.getElementById("eventMsgModalDiv").style.display = "block";
       // document.getElementById("eventContent").style.display = "block";
       //document.getElementById("eventContent").style.left = left+'px';
    }
    else if(dataAttribute == "parking")
    {
        id =event_how.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = event_how.vehicle_mid;
        if(event_how.value == "true")
        {
            eventMessage = "주차 상태입니다."; 
            if(id == selectedId)
                vehicleStatus("PARKED", "rgb(128,128,128)");
        }
        else
        {
            eventMessage = "주차 상태가 아닙니다."; 
        }
          
    }
    else if(dataAttribute == "passenger")
    {
        id = event_how.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = event_how.vehicle_mid;
        eventMessage = "현재 승객 수: "+event_how.current_passenger+ " 명"; 
        if(id == selectedId)
            passengerStatus(event_how.current_passenger);
    }
    else if(dataAttribute == "power")
    {
        id = event_how.vehicle_id;
        selectedId = selectList.options[selectList.selectedIndex].id;  // selected Id 
        vehicleID = event_how.vehicle_mid;

        if(event_how.value == true  || event_how.value  == null)
            eventMessage = "전원이 켜졌습니다."; 
        else
            eventMessage = "전원이 꺼졌습니다."; 
    }

    if(vehicleID == null || siteId != active_site || dataAttribute == "message" ) //|| siteId != active_site
        return false;
    
    // Create div to show event information
    var today = new Date();
    var currentDate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+ today.getDate();

    // calculate hours 
    var currentHour = today.getHours();
    if(currentHour > 12)
        currentHour = currentHour - 12;
      
    if (currentHour < 10)
        currentHour = "0"+currentHour;

    // calculate minutes
    var currentMinutes;
    if(today.getMinutes() < 10)
        currentMinutes = "0"+today.getMinutes();
    else
        currentMinutes = today.getMinutes();

    // calculate seconds
    var currentSeconds;
    if(today.getSeconds() < 10)
        currentSeconds = "0"+today.getSeconds();
    else
        currentSeconds = today.getSeconds();

    var currentTime = currentHour+':'+currentMinutes+':'+currentSeconds;
    var todayDate = currentDate+ ' '+currentTime;
    console.log("todayDate :"+todayDate);
    var dom = document.getElementById('eventsDiv');
    var newAlert = "<span style='display:inline-block'>"+vehicleID+"</span> <img style='display:inline-block; position:absolute; right:0%;' src = 'images/events/event_close_button.svg'/>"+
                   "<label style='margin-top:20%; color:#929292;padding-left: 5%;display:inline-block; position:absolute'>"+currentDate+"</label><label style=';margin-top:20%; margin-left :45%;  position:absolute; display:inline-block; '>"+currentTime+"</label>"+
                   "<p style='margin-top:35%'>"+eventMessage+"</p>";//+
                   //"<button>확인</button>";
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

function confirmEventMsg()
{
    document.getElementById('eventContent').style.display = "none";
   //$(obj).parent('div').fadeOut();
}

/*
$("#testEvent").click( function (e) {
    //e.stopPropagation();
    alert("parent :"+$(this).parent());
    //$(this).parent().parent().hide();
});
*/
function addition(left)
{
   var add = parseInt(left) + Number(3);
   //alert("left :"+left+ " add :"+add);
   return add;
}

//closes div on confirm button
$(document).on('click','.message-content3 button', function(){
    $(this).parent().parent('div').remove();
});

//closes div on close button
$(document).on('click','.message-content3 img', function(){
    $(this).parent().parent().parent().parent('div').remove();
});


/*
function confirmEventMsg(obj)
{
    alert("obj");
    document.getElementById('eventMessageModal').style.display = "none";
}*/
/*
$("#eventMsgClose").click( function (e) {
    alert("close");
    //$(this).parent('div').fadeOut();
    document.getElementById('eventMessageModal').style.display = "none";
});*/

/*
  if( document.getElementById("eventContent"))
        {
            var top = (document.getElementById("eventContent").style.top)  ;
            var left = (document.getElementById("eventContent").style.left) ;
      
            left = addition(left);
            var test =  "left:"+(left)+"%";
           
        }
        else
        {
            var top = 5;
            var left = 40; 
          //  alert("ELSE top: "+top+ " left: "+left);
        }
       var eventHtml = '<div id="eventContent" class="message-content3" style="'+test+'">'+
                         '<div id="eventHeader" class="message-header2" >'+
                            '<div class="msgDiv1">'+
                                '<p class="msgSendP" id="vehicleEventMsg"> <span id="event_vid">'+vehicleID+'</span>에서 보낸 메세지</p>'+
                                '<span class="msg_close" onclick="confirmEventMsg('+this+');">'+
                                    '<img src="images/closing_button.svg" style="margin-top: 15px;">'+
                                '</span>'+
                            '</div>'+
                        '</div>'+
                        ' <div class="message-body2">'+
                            '<textarea id="eventMsgArea" class="textArea" rows="10" cols="30" name="contents" onkeyup="fnChkByte(this,200)" disabled>'+eventMessage+'</textarea>'+
                            '<span class="noto_regular msgP2" id="timeInfo">'+strDate+" "+strTime+ ' 수신</span>'+
                        ' </div>'+
                        '<div class="message-footer2" style="margin-top: 15px;">'+
                            '<button class="event_send_button" id="testEvent" >확인</button>'+
                        ' </div>'
                    '</div>';
                    document.getElementById("eventMessageModal").style.display = "block";
                
                    ///onclick="confirmEventMsg('+this+');"
        $('#eventMessageModal').append(eventHtml);//html(eventHtml);//append(eventHtml);
 
        document.getElementById("eventContent").style.top = (top+2)+'%';
        document.getElementById("eventContent").style.left = (left+2)+'%';
    }
*/