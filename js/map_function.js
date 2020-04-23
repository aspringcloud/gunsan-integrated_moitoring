var map; 
var sejong_map;
var daegu_map;
var gunsan_map
var sangam_map
var mapList = [];
var mapMarkerArray = []; // stores vehicle ripple marker 
var vehicleMarkerArray = []; // stores vehicle ripple marker 
mapList.push("mapid");  
function switchMap(obj)
{   
    if(obj.id == "degu_button")
    {     
        for(var i=0 ; i<mapList.length; i++)
            hide_div(mapList[i]);
        show_div("deguMap");
        mapList.push("deguMap");
        deguRoute(); 
        open_tab('degu_window',2);
        document.getElementById("currentMap").innerHTML = "degu";
        show_div("alertDiv");
    }
    else if(obj.id == "sejong_button")
    {
        for(var i=0 ; i<mapList.length; i++)
            hide_div(mapList[i]);
        show_div("sejongMap");
        mapList.push("sejongMap");
        sejongRoute(); 
        open_tab('degu_window',3);
        document.getElementById("currentMap").innerHTML = "sejong";
        show_div("alertDiv");
    }
    else if(obj.id == "sangam_button")
    {
        for(var i=0 ; i<mapList.length; i++)
            hide_div(mapList[i]);
        show_div("sangamMap");
        mapList.push("sangamMap");
        sangamRoute(); 
        open_tab('degu_window',3);
        document.getElementById("currentMap").innerHTML = "sangam";
        show_div("alertDiv");
    }
    else if(obj.id == "gunsan_button")
    {
        for(var i=0 ; i<mapList.length; i++)
            hide_div(mapList[i]);
        show_div("gunsanMap");
        mapList.push("gunsanMap");
        gunsanRoute(); 
        open_tab('degu_window',3);
        document.getElementById("currentMap").innerHTML = "gunsan";
        show_div("alertDiv");
    }
    else if(obj.id == "gangrung_button")
    {
        mapList.push("gangrungMap");  
    }
    /*else if(obj.id == "offsite_button")
    {
        alert("Button :"+obj.id);
        for(var i=0 ; i< mapList.length; i++)
            hide_div(mapList[i]);
        show_div("mapid");
        mapList.push("mapid");  
        show_div("offsite_window");
        offsite(); //open_tab(this.id, 'offsite_window',0);
    }*/
}

function offsite() {
    document.getElementById("currentMap").innerHTML = "cluster";
    for(var i=0 ; i< mapList.length; i++)
        hide_div(mapList[i]);

    hide_div("listItem");
    mapList.push("mapid"); 
    show_div("mapid");
    show_div("graph1_div");
    show_div("graph2_div");
    show_div("countInfoDiv");
    hide_div("alertDiv");
      
    var offsite_list = document.getElementById("offsite_list");
    offsite_list.innerHTML = '';
    getMethod("sites/", function (sites_data) {
        var site_data = JSON.parse(sites_data).results;
        var count = Object.keys(site_data).length;
        for (i = 0; i < count; i++) {
            var siteId = site_data[i].mid;
            siteId = siteId.substring(3, siteId.length);
            if (parseInt(siteId) >= 901) {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(site_data[i].name));
                offsite_list.appendChild(li);
                li.style.paddingTop = "5px";
                li.style.paddingBottom = "5px";
                li.style.marginTop = "10px";
                li.style.marginBottom = "10px";
                li.fontSize = "14px";
                li.id = site_data[i].id;
                li.onclick = listItem;
            }
        }
    });
}

function listItem() {
    show_div('siteListModal');
    var li_Item = document.getElementById("listItem");
    li_Item.style.top = (this.offsetTop + 70) + "px";
    li_Item.style.display = "block";
    getMethod("sites/" + this.id, function (site_data) {
        var data = JSON.parse(site_data);
        var summary = data.summary.replace(/\r\n/g, '<br>');
        document.getElementById("listItem_summary").innerHTML = summary;
    });
}

function showGraphs() {
    getMethod("oplogs/summary/", function (graphData) {
        var graph_data = JSON.parse(graphData);
        var count = Object.keys(graph_data).length;
        var vehicleList = [];
        var passengerList = [];
        var distanceList = [];
        for (i = 0; i < count; i++) {
            vehicleList.push(graph_data[i].vehicle);
            passengerList.push(graph_data[i].accum_passenger);
            distanceList.push(graph_data[i].accum_distance);
        }
        highchart('graph2', '총 운행거리', '#f1ca3f', 'Distance(km)', vehicleList, passengerList);
        highchart('graph1', '총 탑승자 수', '#3bc7d1', 'Passenger', vehicleList, distanceList);
    });
}

function defaultZoom()
{
    var currentMap = document.getElementById("currentMap");
    if(currentMap.innerHTML == "cluster")
    {
        L.Control.ViewCenter = L.Control.extend({
            options: {
                vcLatLng: [35.902, 128.013],
                vcZoom: 7
            },
        });
    }
    else if(currentMap.innerHTML == "degu") 
    {
        map.flyTo([35.83553,128.68351], 17, {
            animate: false, 
            reset:true,  
          });
    }
}

function showCluster() {
    document.getElementById("currentMap").innerHTML = "cluster";
    hide_div("deguMap");
    show_div("mapid");
    hide_div("sejongMap");
    showGraphs();
    show_div("graph1_div");
    show_div("graph2_div");
    hide_div("webcam_div");
    show_div("countInfoDiv");
    hide_div("alertDiv");
    var addressPoints = [];
    getMethod("routes/", function (routes_data) {
        var cluster_data = JSON.parse(routes_data).results;
        var count = Object.keys(cluster_data).length;
        for (i = 0; i < count; i++) {
            if(cluster_data[i].start != '')
                addressPoints.push(cluster_data[i].start);
        }

        /* replace create map code width function */
        var map_center = [35.902, 128.013];
        var cluster_map = L.map('mapid', {
            zoomSnap: 0.15,      
            dragging: true, //false
            draggable:true,
            scrollWheelZoom: true, //false
            color: "rgba(8, 148, 19)",
            zoomControl: false,
            zoom:7,
            center:map_center
        });
        clusterLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
        clusterLayer.addTo(cluster_map);
        var zoomHome = L.Control.zoomHome();
        zoomHome.addTo(cluster_map);     
            
        var markers = L.markerClusterGroup();
        for (var i = 0; i < addressPoints.length; i++) {
            var location = addressPoints[i];
            var marker = L.marker(new L.LatLng(location[0], location[1]));
            markers.addLayer(marker);
        }
        cluster_map.addLayer(markers);
        cluster_map.invalidateSize();
    });
}

function showContent(tabId) {
    // Update this function when other pages are developed.
    var tabArray = ['integrated_control', 'integrated_Dashboard'];
    if (tabId == "integrated_control")
        window.location.href = "main.html";
}

function getweather(lat, lon) {
    var key = '326fceb5cbe3b99fa6f5e0f307732100';//'da17414b52ae5cbee8b60a5c7d06bde8';
    setInterval(function () {
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +lat+ '&lon=' +lon+ '&appid=' +key)
            .then(function (resp) { return resp.json() }) // Convert data to json
            .then(function (data) {
                var celcius = Math.round(parseFloat(data.main.temp) - 273.15);
                document.getElementById('temp_celsicus').innerHTML = celcius+ '&deg;C';
                document.getElementById('weather_icon').src = "http://openweathermap.org/img/w/" +data.weather[0].icon+ ".png";
            })
            .catch(function () {
                console.log("Unable to fetch open weather map data.");
            });
    }, 1000);
}

function displayPassenger(img_src, divDom)
{
    var img = document.createElement('img');
    img.src = img_src;
    img.style.height = "25.07px";
    img.style.width = "9px";
    img.style.margin = "2px";
    divDom.insertAdjacentElement("afterBegin", img);
}

// function to show passenger status of the shuttle. 
function passengerStatus(activePassenger) {
    if(document.getElementById('passengerStatus') != undefined)
    {
        var passengerDom = document.getElementById('passengerStatus').innerHTML;
        var prevCount = passengerDom.slice(0, passengerDom.indexOf('/'));  
        if((Number(prevCount))-1 == Number(activePassenger))
            return false;
    }
    passivePassenger = 15 - activePassenger;
    document.getElementById("passengerCount").innerHTML = (activePassenger + 1);
}

function onDemand(map)
{
    var waypoints = [
        L.latLng(35.8363080000000000, 128.6815470000000000),
        L.latLng(35.8386730000000000, 128.6878920000000000),
    ];

    var control = L.Routing.control({
        waypoints: waypoints,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        profile: 'foot'
    }).addTo(map);

    control.on('routesfound',function(e){
        var distanceKm = (e.routes[0].summary.totalDistance)/1000 + ' km';
        var minutes = Math.round(e.routes[0].summary.totalTime % 3600/ 60)+ ' minutes';
        console.log("distanc:"+distanceKm);
        console.log("min:"+minutes);
    });
}

// Get distance between two location using leaflet function(does not consider waypoints)
function getDistance(start, destination,speed) {
    var distance_m = (start.distanceTo(destination)).toFixed(0);
    var distance_km = distance_m / 1000;
    return distance_km;
}

function setVehicleSpeed(speed)
{
    var speedDom = document.getElementById("speed_v1");
    speedDom.innerHTML = speed;
    if(speed < 18)
    {
        speedDom.style.color="#4F4F4F";
        speedDom.style.fontWeight ="normal";
    }
    else if(speed > 18)
    {
        if(speed > 30)
        {
            speedDom.style.color="#CA4040";
            speedDom.style.fontWeight ="bold";
        }
        else{
            speedDom.style.color="#CA4040";
            speedDom.style.fontWeight ="normal";
        }
    }
}

function arraivalTime(mapInstance, shuttleLocation,speedArray,count, request_count)
{
    /* ppt speed avg*/
    //var speed = ((7*2)+(14.2)+(13.6*10))
    //(7+7+14.2+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+14.3)/14;

    /* Average speed solution 15 sec */
    var sumSpeed = (speedArray.reduce(function(pv, cv) { return pv + cv; }, 0)); 
    if(sumSpeed == 0 )
        return false;
    var speed = sumSpeed / speedArray.length;

    // distance between vehicle and station A
    var vtoA = getDistance(shuttleLocation, L.latLng(35.836308, 128.681547));
    var timeA = vtoA/speed;
    if(timeA < 1)
    {
        timeA = Math.floor((Math.abs(timeA) * 60) % 60);
        document.getElementById("deguStationA").innerHTML = Math.round(timeA)+"sec 후 도착";
    }
    document.getElementById("deguStationA").innerHTML = Math.round(timeA)+"분 후 도착";

    // distance between vehicle and station B
    var vtoB = getDistance(shuttleLocation, L.latLng(35.838673, 128.687892));
    var timeB = vtoB/speed;
    if(timeB < 1)
    {
        timeB = Math.floor((Math.abs(timeB) * 60) % 60);
        document.getElementById("deguStationB").innerHTML = Math.round(timeB)+"sec 후 도착";
    }
    else
    {
        document.getElementById("deguStationB").innerHTML = Math.round(timeB)+"분 후 도착";
    }

    // distance between vehicle and station C
    var vtoC = getDistance(shuttleLocation, L.latLng(35.83705, 128.690044));
    var timeC = vtoC/speed;
    if(timeC < 1)
    {
        timeC = Math.floor((Math.abs(timeC) * 60) % 60);
        document.getElementById("deguStationC").innerHTML = Math.round(timeC)+"sec 후 도착";
    }
    else
    {
        document.getElementById("deguStationC").innerHTML = Math.round(timeC)+"분 후 도착";
    }

    // distance between vehicle and station D
    var vtoD = getDistance(shuttleLocation, L.latLng(35.83459, 128.68652));
    var timeD = vtoD/speed;
    if(timeD < 1)
    {
        timeD = Math.floor((Math.abs(timeD) * 60) % 60);
        document.getElementById("deguStationD").innerHTML = Math.round(timeD)+"분 후 도착";
    }
    else
    {
        document.getElementById("deguStationD").innerHTML = Math.round(timeD)+"분 후 도착";
    }
   
    /*console.log("timeA:"+(timeA)+ " distanceA: "+vtoA);
    console.log("timeB:"+(timeB)+ " distanceB: "+vtoB);
    console.log("timeC:"+(timeC)+ " distanceC: "+vtoC);
    console.log("timeD:"+(timeD)+ " distanceD: "+vtoD);*/
}

var interval;
function vehicleInfo(vId)
{   var request_count = 0;
    var count15 = 0;
    var speedArray=[];
    interval = setInterval(function(){
    request_count++;
    count15++;
    var apiUrl = "vehicles/"+vId+"/";
    getMethod(apiUrl, function (data) {
        var vehicle = JSON.parse(data);
        var shuttleLocation = L.latLng(vehicle.lat, vehicle.lon);
        if(count15 == 16)
        {          
            count15 = 0;             
            arraivalTime(map, shuttleLocation,speedArray,count15,request_count);
            speedArray=[];
        }
        else
        {
            speedArray.push(vehicle.speed);
            if(request_count==1)
                arraivalTime(map, shuttleLocation,speedArray,count15, request_count);
        }
        document.getElementById("vehicleID").innerHTML = vehicle.name;
        document.getElementById("vehicleVersion").innerHTML = "version : "+vehicle.firmware;
                            
        // show speed of vehicle
        setVehicleSpeed(vehicle.speed);

        //Show heading of vehicle.
        if( vehicle.heading < 10)
            document.getElementById("heading_v1").style.paddingLeft ="71px";
        else if(vehicle.heading > 10 && vehicle.heading < 99)
            document.getElementById("heading_v1").style.paddingLeft ="60px";
        else if(vehicle.heading > 99)
            document.getElementById("heading_v1").style.paddingLeft ="58px";
        document.getElementById("heading_v1").innerHTML = vehicle.heading + "&deg";
        
        // rotate heading
        document.getElementById("sun").style = 'transform: rotate(' +vehicle.heading+ 'deg)';
        var vehicleMid = (vehicle.mid).substring(0, 3); // trim first 3 characters

        // show passenger status    
        passengerStatus(vehicle.passenger);
        if (vehicle.gnss == true)
            document.getElementById("gnss_v1").style.backgroundColor = "#57AE66";
        else
            document.getElementById("gnss_v1").style.backgroundColor = "#CA4040";

        if (vehicle.door == false)
            document.getElementById("doorStatus").src = "images/door/door_closed.svg";
        else
            document.getElementById("doorStatus").src = "images/door/door_open.svg";
        
        // show battery status
        setBatteryPercent(vehicle.battery);

        // show webcam
        checkWebcam(vehicle.webcam1, 'cameraButton1', 'video1', 'video1Active');
        checkWebcam(vehicle.webcam2, 'cameraButton2', 'video2', 'video2Active');
    });
    }, 1500);
    return interval;
}

function createSelectList(objArray)
{
    var selectDom = document.getElementById("vehicleSelect");
    for(var i=0; i<objArray.length; i++)
    {
        var option = document.createElement("option");
        option.text = objArray[i].mid;
        option.id = objArray[i].id;
        selectDom.add(option);
    }
}

function changeVehicleInfo(obj)
{
    clearInterval(interval);
    if(typeof(obj) == 'number')
    {
        interval= vehicleInfo(obj);
    }
    else
    {
        var selectedId = obj.options[obj.selectedIndex].id;
        interval= vehicleInfo(selectedId);
    }
}

var markerCount2;
function shuttleOnRoute(mapInstance, reqCount, vehicleObj)
{
    JSON.stringify("stringyfy:"+vehicleObj);
    vehicle =  vehicleObj[0];
    getMethod("vehicles/" + vehicle.id + "/", function (vehicle) {
        markerCount2++;
        //console.log("#### ShowVehicle():"+vehicle.name+ " Markercount2 : "+markerCount2+ " Heading:"+vehicle.heading);
        showVehicleRipple(reqCount, mapInstance,vehicle,markerCount2);
    });
}

// Array stores all the shuttles on daegu route
var deguShuttleArray=[];
function deguRoute() {
    document.getElementById("currentMap").innerHTML = "degu";
    document.getElementById("degu_button").backgroundColor = "#ffffff";
    document.getElementById("degu_button").color = "#185786";
    // hide_div("mapid");
    // show_div("deguMap");
    // hide_div("sejongMap");
    hide_div("graph1_div");
    hide_div("graph2_div");
    hide_div("countInfoDiv");
    show_div("degu_window");
    hide_div("listItem");
    hide_div("offsite_window");
    webcam('1');
    webcam('2');
    
    var map_center = [35.83553,128.68351];
     
    /* Check this --> map_function.js:717 Uncaught TypeError: Cannot read property 'style' of null*/
    daegu_map = createMap(map_center, 17, daegu_map, 'deguMap');
        
    // show stations, kiosk, garage on degu route.
    showRouteInfo(daegu_map, "stations/", "route/station_kiosk.svg", 2);
    showRouteInfo(daegu_map, "garages/", "route/garageIcon.svg", 2);
    showDataCenter(daegu_map, 2);

    // show V2X on Degu route
    show_v2x(daegu_map, "v2x/");

    // Show All the shuttles on degu route
    var reqCount = 0;
    var firstId; 
    var vehicleObj=[];

    // get ll vehicle Id's.
    getMethod("vehicles/", function (data) {
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == 2 && vehicle.name =="SCN001") { //&& i == 0
                deguShuttleArray.push(vehicle.id); // array of vehicle ID 
                var vehicle={
                id:vehicle.id,
                mid:vehicle.mid,
                name: vehicle.name,
                speed:vehicle.speed,
                lat:vehicle.lat,
                lon:vehicle.lon,
                heading : vehicle.heading,
                battery : vehicle.battery,
                }
                vehicleObj.push(vehicle);
            }
        }
        showChartData(vehicleObj);
        deguShuttleArray = deguShuttleArray.sort();
        firstId = deguShuttleArray[0];
        vehicleInfo(firstId);
        changeVehicleInfo(firstId);
        vehicleObj = vehicleObj.sort((a, b) => (a.mid > b.mid) ? 1 : -1);
        createSelectList(vehicleObj);
    });
    show_div("alertDiv");
}

function showChartData(vehicleObj){
   /* show chart with todays distance passenger count */
    var nameList = [];
    var distanceList = [];
    var passengerList = [];
    var colorList = [];

    for (var j=0; j< vehicleObj.length; j++)
    {
        getMethod("oplogs/summary/", function (data) {
            if(data == undefined)
                return false;
            var summary_data = JSON.parse(data);
            if(vehicleObj[i].mid == summary_data.vehicle)
            {          
                nameList.push(summary_data.vehicle);
                var distance; 
                if(vehicle_data.accum_distance == null)
                    distance = 0;
                else
                    distance = vehicle_data.accum_distance;     

                distanceList.push(distance);
                passengerList.push(vehicle_data.passenger);
                if(((vehicle_data.name).substring(0, 3)) == "SCN")
                    colorList.push('#0082C8');
                else
                    colorList.push('#67BBB1');

                todayChart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, distanceList);
            }
        });   
    }
}

function checkWebcam(webcamData, imgID, ifImg, elseImg) {
    var imgPath = "images/cctv/";
    var imgDom = document.getElementById(imgID);
    if (webcamData == null)
        imgDom.src = imgPath+ifImg+ ".svg";
    else
        imgDom.src = imgPath+elseImg+ ".svg"; 
}

function setBatteryPercent(percent) {
    if (percent == null)
        percent = 0;

    $("#battery").attr('data-content', percent+'%');
    $("#popupBattery").attr('data-content', percent+'%');
    var after = (100 - percent) +"%";    
    var battery = document.querySelectorAll('.inverted-bar')[0];
    var popupBattery = document.querySelectorAll('.popup-battery')[0];

    // Popup battery dom
    battery.style.setProperty("--afterHeight", after);
    if (percent <= 30) 
    {  
        battery.style.setProperty("--beforebgColor", "#CA4040");
        battery.style.setProperty("--afterColor", "#CA4040");
    }
    else 
    {
        battery.style.setProperty("--beforebgColor", "#57AE66");
        if(percent == 100)
            battery.style.setProperty("--fontSize", "10px");
        else
            battery.style.setProperty("--fontSize", "12px");

        battery.style.setProperty("--beforeColor", "#ffffff");
        battery.style.setProperty("--beforebgColor", "#57AE66");
        battery.style.setProperty("--afterColor", "#57AE66");
        
       /* if (percent >= 77)
            battery.style.setProperty("--beforeColor", "#ffffff");
        else
            battery.style.setProperty("--beforebgColor", "#57AE66");*/
    }
             
    // popup battery
    if(popupBattery!= undefined)
    {
        popupBattery.style.setProperty("--afterWidth2", (percent+1)+"%");
        if (percent <= 30) 
        {  
            popupBattery.style.setProperty("--afterbgColor2", "#CA4040");
            popupBattery.style.setProperty("--beforeColor2", "#CA4040");
        }
        else
        {         
            popupBattery.style.setProperty("--beforeColor2", "#57AE66");
            popupBattery.style.setProperty("--afterbgColor2", "#57AE66");
            if(percent == 100)
                popupBattery.style.setProperty("--fontSize2", "10px "); 
        }
    }
}

function identifyMake(vehicle_name)
{
    var thirdCharacter = vehicle_name.charAt(2);
    var dom = document.getElementById('vPopup');
   
    if(thirdCharacter == 'E')
        dom.style.background = '#67BBB1';
    else if(thirdCharacter == 'N') 
        dom.style.background = '#0082C8' ;
    else if(thirdCharacter == 'K')   
        dom.style.background = '#5C5C5C';
} 

var prevMarker; // retains value of previous marker
function showVehicle(request_count, mapInstance, vehicleObj, markerCount2)
{
    var popupMarker;
    var iconUrl = "images/route/Icon_Vehicle.svg";  
    var vehicleIcon = L.icon({
        iconSize: [37, 52],
        popupAnchor: [10, -25],
        iconAnchor: [20, 40],
        iconUrl: iconUrl,
    });

    if(request_count <= 1)
    {        
        // Create vehicle marker 
        var vehicleMarker = L.marker([vehicleObj.lat, vehicleObj.lon], {
            draggable: false,
            icon: vehicleIcon,
        });
        vehicleMarker._leaflet_id = vehicleObj.id;
        if(vehicleObj.speed > 0) 
            vehicleMarker.options.rotationAngle = vehicleObj.heading;
              
        // HTML for popup
        var speedColor;
        var speedWeight;
        if(vehicleObj.speed < 18)
        {
            speedColor="#4F4F4F";
            speedWeight ="normal";
        }
        else if(vehicleObj.speed > 18)
        {
            if(vehicleObj.speed > 30)
            {
                speedColor="#CA4040";
                speedWeight ="bold";
            }
            else{
                speedColor="#CA4040";
                speedWeight ="normal";
            }
        }
        
        var customPopup = "<div class='popup' id='vPopup'>"+
                            "<p class='popupTitle'>" +vehicleObj.name+ "<img class='activeGreenPopup' src='images/status/active_green.svg'></p>"+
                            "<span class='popupVersion'>VER:"+vehicleObj.firmware+"</span>"+
                        "</div><br>"+
                        "<div class='popupSpeedDiv'>"+
                            "<span>Speed</span><br>"+
                            "<span id='popup_speed' class='popupSpeed' style='color:"+speedColor+";font-weight:"+speedWeight+"'>"+vehicleObj.speed+"</span><br>"+
                            "<span class='popupSpeedUnit'>km/hr</span>"+
                        "</div>"+
                        "<div class='popupBatteryDiv'>"+
                            "<span style='vertical-align:top'>Battery</span>"+
                            "<div id='popupBattery' class='popup-battery' data-content=''></div>"+
                            "<div class='popupParent'></div>"+
                        "</div>";
        const customOptions = {'className': 'custom-popup2'};
        vehicleMarker.bindPopup(customPopup, customOptions).openPopup();
        vehicleMarker.on('click', function(e) {identifyMake(vehicleObj.name); /*setPopupSpeed(speed, title);*/});
        vehicleMarker.addTo(mapInstance);
        vehicleMarkerArray.push(vehicleMarker);
        prevMarker = vehicleMarker;
        popupMarker = vehicleMarker;
    } 
    else 
    {
        for(var i=0; i<vehicleMarkerArray.length;i++){
            mapInstance.removeLayer(vehicleMarkerArray[i]);
        }
        var vmarker = L.marker([vehicleObj.lat, vehicleObj.lon],{
            draggable: false,
            icon: vehicleIcon,
        });

        if(vehicleObj.speed > 0) 
            vmarker.options.rotationAngle = vehicleObj.heading;
        vmarker.addTo(mapInstance);
        vehicleMarkerArray.push(vmarker);
        vmarker._leaflet_id = vehicleObj.id;

        /*var oldVMarker = vehicleMarkerArray[markerCount2];//-1];
        var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
        oldVMarker.setLatLng(newLatLng);
        oldVMarker.options.rotationAngle = vehicleObj.heading;
        //console.log("#########ShowVehicle(): Markercount2 : "+markerCount2+ " Heading:"+vehicleObj.heading);
        popupMarker = oldVMarker;*/
        popupMarker = vmarker;
        setPopupSpeed(vehicleObj.speed, vehicleObj.name);
    }

    var popup_battery = document.getElementById("popup_battery");
    if (popup_battery != null)
        popup_battery.innerText = vehicleObj.battery;

    // vehicle popup to show shuttle battery and speed info.
    popupMarker.on('onClick', function(){
        var popupDiv = document.getElementById("batteryPercent1") ;
        if(popupDiv != null)
        {
            popupDiv.style.width = "60%";
            popupDiv.style.color = "green";
        }
    });
}

function setPopupSpeed(speed, title)
{
    var popup_speed = document.getElementById("popup_speed");
    if (popup_speed == null)
        return false;

    // change css to show changes in speed.
    if(speed < 18)
    {
        console.log("<18:"+popup_speed.style.color);
        popup_speed.style.color="#4F4F4F";
        popup_speed.style.fontWeight ="normal";
    }
    else if(speed > 18)
    {
        if(speed > 30)
        {
            popup_speed.style.color="#CA4040";
            popup_speed.style.fontWeight ="bold";
        }
        else
        {
            popup_speed.style.color="#CA4040";
            popup_speed.style.fontWeight ="normal";
        }
    }
}

 function getMethod(api_name, callback) {
    var username = localStorage.getItem("userId");
    var password = localStorage.getItem("userPwd"); 
    var base64Credentials = "Basic " + btoa(username + ":" + password);
    var request = new XMLHttpRequest();
    var base_url = "http://115.93.143.2:9103/api/";

    request.open('GET', base_url + api_name, true);
    request.onload = function (e) {
        if (request.status == 200) {
            callback(request.response);
        } else if (request.status == 401)
            alert("Authentication credentials were not provided");
        else if (request.status == 403)
            alert("Unauthorized access to accounts")
       // console.log("GET data status: " + request.status);
    };
    request.onerror = function (status) {
        console.log("GET data error (GET).");
    };
    request.setRequestHeader("Authorization", base64Credentials);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    request.send();
}

// This is vehicle ripple effect function. 
var test2 = {};
function showVehicleRipple(request_count, mapInstance, vehicle, markerCount2){ 
    var vehicleObj = JSON.parse(vehicle);
    var icon_html2 = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                        '<div id="ring1" class="shuttle_ring1"></div>'+
                        '<div id="ring2" class="shuttle_ring2"></div>'+
                        '<div id="ring3" class="shuttle_ring3"></div>'+
                        '<div id="ring4" class="shuttle_ring4"></div>'+
                    '</div>';

    var icon_html_g = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                        '<div id="ring1" class="shuttle_ring1_g"></div>'+
                        '<div id="ring2" class="shuttle_ring2_g"></div>'+
                        '<div id="ring3" class="shuttle_ring3_g"></div>'+
                        '<div id="ring4" class="shuttle_ring4_g"></div>'+
                    '</div>';
     
    const circleIcon = L.divIcon({html: icon_html2});
    const circleIcon_g = L.divIcon({html: icon_html_g});
    var marker;
    if (request_count <= 1) {
        if (vehicleObj.speed > 0) 
        {
            marker = L.marker([vehicleObj.lat, vehicleObj.lon], {
                draggable: false,
                icon: circleIcon_g,
            });
        }
        else
        {
            marker = L.marker([vehicleObj.lat, vehicleObj.lon], {
                draggable: false,
                icon: circleIcon,
            });
        }

        if(mapMarkerArray.length !=0 )
        {
            for(var i=0; i<mapMarkerArray.length;i++){
                mapInstance.removeLayer(mapMarkerArray[i]);
            }
        }
        if(vehicleObj.speed > 0) 
            marker.options.rotationAngle = vehicleObj.heading;
        marker.addTo(mapInstance);
        mapMarkerArray.push(marker);
        marker._leaflet_id = vehicleObj.id;
        test2 = marker;
    } else {
        if(mapInstance != undefined )
        {
            for(var i=0; i<mapMarkerArray.length;i++){
                mapInstance.removeLayer(mapMarkerArray[i]);
            }
        }
        var marker2 = L.marker([vehicleObj.lat, vehicleObj.lon],{
            draggable: false,
            icon: circleIcon,
        });

        if(vehicleObj.speed > 0) 
            marker2.options.rotationAngle = vehicleObj.heading;
        marker2.addTo(mapInstance);
        mapMarkerArray.push(marker2);
        marker2._leaflet_id = vehicleObj.id;
        /* 
        var oldMarker = mapMarkerArray[markerCount2];//-1];
        oldMarker.setLatLng([vehicleObj.lat, vehicleObj.lon]);//.update();
        oldMarker.options.rotationAngle = vehicleObj.heading;
        if (vehicleObj.speed > 0){ 
            oldMarker.options.icon = circleIcon_g;
        }
        else{
            oldMarker.options.icon = circleIcon;
        }
        */
    }

    /* 
    if (speed > 0) 
    {
        console.log("If speed :"+speed);gggggghggrgrghxhtjuytju
        vehicleStatus("rgba(115, 192, 95, 0.4)", "DRIVING", "#57AE66", "#57AE66");
    }
    else
    {
        console.log("else speed :"+speed);
        vehicleStatus("rgba(202, 64, 64, 0.4)", "STOPPED", "#CA4040", "#BDBDBD");
    }
    */
    console.log("ShowVehicle():"+vehicleObj.name+ " Markercount2 : "+markerCount2+ " Heading:"+vehicleObj.heading);
    showVehicle(request_count, mapInstance,vehicleObj, markerCount2);  
}

function vehicleStatus(color, status, statusBg, frontBG)
{
    if(document.getElementById("ring1") == null)
       return false;
    document.getElementById("ring1").style.background = color;
    document.getElementById("ring2").style.background = color;
    document.getElementById("ring3").style.background = color;
    document.getElementById("ring4").style.background = color;
    document.getElementById("v_status1").innerHTML = status;
    document.getElementById("v_status1").style.background = statusBg;
    document.getElementById("v_front").style.background = frontBG;
}

function showSummary() {
    getMethod("sites/summary/", function (getSummary) {
        var summary = JSON.parse(getSummary);
        document.getElementById("routeCount").innerHTML = summary.route_count;
        document.getElementById("vehicleCount").innerHTML = summary.vehicle_count;
        document.getElementById("StationCount").innerHTML = summary.station_count;
        document.getElementById("kioskCount").innerHTML = summary.kiosk_count;
        document.getElementById("garageCount").innerHTML = summary.garage_count;
    });
}

function showRouteInfo(mapInstance, api_name, icon_path, site_no) {
    var stationWp_array = [];
    getMethod(api_name, function(data) {
        var iconData = JSON.parse(data).results;
        if (iconData == undefined)
            var iconData = JSON.parse(data);
                    
        var count = Object.keys(iconData).length;
        var stationTitleArray=[];
        var kioskTitleArray=[];
        for (var i = 0; i < count; i++) {
            if (iconData[i].site == site_no) {
                if (api_name == "stations/")
                {
                    stationWp_array.push(L.latLng(iconData[i].lat, iconData[i].lon)); // array for station location on route
                    var stationTitle = iconData[i].mid;
                    var stationLat = iconData[i].lat;
                    var stationLon = iconData[i].lon;
                    stationTitleArray.push(stationTitle); // array for station title
                                
                    // check if kiosk for the station is available in kiosk api
                    var kioskTitle = "KIS" + stationTitle.substring(3);
                    var status = stationTitleArray.includes(kioskTitle);

                    // array of kiosk title 
                    if(status == true)
                        kioskTitleArray.push(kioskTitle);
                    else
                        kioskTitleArray.push(kioskTitle);

                    if (status == true)
                        showMarker(mapInstance, "images/" + icon_path, stationTitle, kioskTitle, stationLat, stationLon);
                    else
                        showMarker(mapInstance, "images/" + icon_path, stationTitle, 'false', stationLat, stationLon);
                }
                else
                {
                    // garage api show marker on route 
                    showMarker(mapInstance, "images/" + icon_path, iconData[i].mid, 'false', iconData[i].lat, iconData[i].lon);
                } 
            }
        }

        if (api_name == "stations/")
        {
            if (site_no == 2)
            {
                // push first station as the last station of the array to complete the route.  
                var last = stationWp_array[0];
                stationWp_array.push(last);
            } 
            else if (site_no == 4) 
            {
                stationWp_array = [
                    L.latLng(37.579333, 126.889036),
                    L.latLng(37.58299, 126.88485),
                    L.latLng(37.57518, 126.89837),
                    L.latLng(37.581296, 126.885693)];
            }
            createRoute(mapInstance, stationWp_array, stationTitleArray, kioskTitleArray);
        }
    });
}

function createRoute(map, waypoints, stationTitle,kioskTitle) {
    var iconUrl= 'images/route/station_kiosk.svg';
    var control = L.Routing.control({
        waypoints: waypoints,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:true,
        createMarker: function (i, wp) {
            if(stationTitle[i] != undefined)
            {
                var stationIcon = new L.DivIcon({
                    html :'<img src= '+iconUrl+'>'+
                        '<span class="markerLable">'+stationTitle[i]+'</span>'+
                        '<span class="markerLable">'+kioskTitle[i]+'</span>' 
                    });  
            
                var marker = L.marker(wp.latLng, {
                    icon: stationIcon,
                    draggable: false,
                });

                var popup;
                marker.on('mouseover', function(e) {
                    var latlon= (wp.latLng).toString();
                    var trimStr = latlon.substr(7); // trim first 7 characters
                    var content = trimStr.substring(0, trimStr.length - 1); // trim last character
                    popup = L.popup({className: "stationPopup"}).setLatLng(e.latlng).setContent(content).openOn(map);//.openPopup();
                });
                
                marker.on('mouseout', function (e) { 
                    map.closePopup(popup);
                    });
              
                return marker;
            }
        },
       
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#7cc3e2', weight: 6 }]},     
        autoRoute: true,
        showAlternatives: false,
        show: false,
     
    }).addTo(map);
    L.Routing.errorControl(control).addTo(map);
}

function createMap(map_center, zoom, mapInstance, mapId) {
    if (mapInstance != undefined) 
        mapInstance.remove();
    
    mapInstance = L.map(mapId, {
        zoomSnap: 0.15,      
        dragging: true, //false
        draggable:true,
        scrollWheelZoom: true, //false
        zoomControl: false,
        zoom:zoom,
        center:map_center
    });
    deguLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    deguLayer.addTo(mapInstance);
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(mapInstance);
    mapInstance.invalidateSize();
    return mapInstance;
}

function gunsanRoute() {
    hide_div("graph1_div");
    hide_div("graph2_div");
    var map_center = [35.812484, 126.409100];
    gunsan_map = createMap(map_center, 16, gunsan_map, 'gunsanMap');
    showRouteInfo(gunsan_map, "stations/", "route/station_kiosk.svg", 1);
    showRouteInfo(gunsan_map, "garages/", "garage_daegu.svg", 1);
    gunsan_map.invalidateSize();
}

function sangamRoute() {
    hide_div("graph1_div");
    hide_div("graph2_div");

    var map_center = [37.579333, 126.889036];
    /* Check this --> map_function.js:717 Uncaught TypeError: Cannot read property 'style' of null*/
    sangam_map = createMap(map_center, 16, sangam_map,'sangamMap');
   
    // show stations, kiosk, garage on degu route.
    showRouteInfo(sangam_map, "stations/", "route/station_kiosk.svg", 4);
    showRouteInfo(sangam_map, "garages/", "route/garageIcon.svg", 4);
    showDataCenter(sangam_map, 4);

    // show V2X on Degu route
    show_v2x(sangam_map, "v2x/");
    sangam_map.invalidateSize();
}

function sejongRoute() {
    hide_div("graph1_div");
    hide_div("graph2_div");
    var map_center = [36.499951, 127.270606];
    sejong_map = createMap(map_center, 18, sejong_map,'sejongMap');
    var waypoints = [
        L.latLng(36.499351, 127.270606),
        L.latLng(36.501690, 127.272315),
    ];
  
    // show stations, kiosk, garage on degu route.
    showRouteInfo(sejong_map, "stations/", "route/station_kiosk.svg", 3);
    showRouteInfo(sejong_map, "garages/", "route/garageIcon.svg", 3);
    showDataCenter(sejong_map, 3);

    // show V2X on Degu route
    show_v2x(sejong_map, "v2x/");
    sejong_map.invalidateSize();
}

function showMarkerIcon(iconUrl, title, lat, long, map) {
    const icon = L.icon({
        iconSize: [10, 14.75],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: iconUrl,
    });

    var marker = L.marker([lat, long], {
        draggable: false, // Make the icon dragable
        icon: icon
    });

    var kiosk_title = title.substring(3);
    kiosk_title = "KSK" + kiosk_title;
    marker.on('mouseover', function (ev) {
        ev.target.openPopup();
    })

    marker.addTo(map);
    const customPopup = "<ul><li>" + title + "</li><li>" + kiosk_title + "</li><ul>";
    const customOptions = { 'className': 'custom-popup', autoPan: false, autoClose: false }
    marker.bindPopup(customPopup, customOptions).openPopup();
    map.invalidateSize();
}

function open_tab( window_id, site_id) {
    var window_list = ["offsite_window", "degu_window"];
    for (var i = 0; i < window_list.length; i++) {
        if (window_list[i] != window_id)
            document.getElementById(window_list[i]).style.display = "none";
        else
            document.getElementById(window_id).style.display = "block";
    }
    if(window_id != "offsite_window")
        setSiteInfo(site_id);
}

function logout() {
    var email = document.getElementById("loggedin_userid").innerText;
    var api_url = "http://115.93.143.2:9103/api/auth/logout/";
    postMethod(JSON.stringify(email), api_url, function (status_code) {
        if (status_code == 200)
            window.location.href = "index.html";
        else if (status_code == 401)
            alert("Authentication credentials were not provided");
        else if (status_code == 404)
            alert("Not found");
        console.log("Logout status: " + status_code);
    });
}

function changeBulletColor(element, operation_status) {
    if (operation_status == false)
        element.style.color = 'red';
    else
        element.style.color = '#3DD118';
}

function kiosk_info() {
    hide_div_list("div_kiosk");
    change_button_color('kiosk_info_button');

    if ($('#kiosks_list li').length != 0)
        return true;

    getMethod("kiosks/", function (kiosk_data) {
        var kiosk_data = JSON.parse(kiosk_data).results;
        var kiosk_count = Object.keys(kiosk_data).length;
        for (var i = 0; i < kiosk_count; i++) {
            if (kiosk_data[i].site == 2) {
                var ul = document.getElementById('kiosks_list');
                var li = document.createElement('li');
                var lat = parseFloat(kiosk_data[i].lat).toFixed(6);
                var lon = parseFloat(kiosk_data[i].lon).toFixed(6);
                var li_content = "<p class='station_p1'>" +kiosk_data[i].mid+ "&nbsp;&nbsp;:&nbsp;&nbsp;</p><p class='station_p2'>" +lat+ ",&nbsp;" +lon+ " </p>";
                li.innerHTML = li_content;
                ul.appendChild(li);
                changeBulletColor(li, kiosk_data[i].operation);
            }
        }
    });
}

function vehicle_info(vehicle_id) {
    var api_name = "vehicles/";
    getMethod(api_name, function (vehicles_data) {
        var vehicle_data = JSON.parse(vehicles_data).results;
        for (var i = 0; i < 4; i++) {
            if (vehicle_data[i].mid == vehicle_id) {
                document.getElementById("v_id").innerHTML = vehicle_data[i].name;
                document.getElementById("v_gnss").innerHTML = vehicle_data[i].gnss;
                document.getElementById("v_speed").innerHTML = vehicle_data[i].speed + " km/hr";
                document.getElementById("v_heading").innerHTML = vehicle_data[i].heading + " &#176;";
                document.getElementById("v_passenger").innerHTML = vehicle_data[i].passenger + "/10";

                if (vehicle_data[i].door == false)
                    document.getElementById("v_door").innerHTML = "Close";
                else
                    document.getElementById("v_door").innerHTML = "Open";

                var battery_percent = vehicle_data[i].battery;
                document.getElementById("v_battery").innerHTML = battery_percent + " %";
                setBatteryPercent(battery_percent);
            }
        }
    });
}


function setSiteInfo(site_id){
    if (site_id == 0)
        return false;

    var api_url = "sites/" + site_id + "/";
    getMethod(api_url, function (sites_data) {
        var site_data = JSON.parse(sites_data);
        var site_title = site_data.summary.indexOf('\r');
        var site_title_slice = site_data.summary.substring(0, site_title)
        // document.getElementById("site_name").innerHTML = site_data.name;
        // document.getElementById("site_summary").innerHTML = site_data.summary;
        // document.getElementById('site_title').innerHTML = site_title_slice;
        //alert("manager :"+site_data.manager);
        manager_list(site_data.manager);
    });
}

function showDataCenter(mapInstance, siteId){
    var api_url = "datahub/";
    var icon;

    if(siteId == 3)
        icon = "images/route/dataHub.svg";
    else
        icon = "images/route/dataCenter.svg";

    getMethod(api_url, function(data) {
        var dataCenter = JSON.parse(data).results;
        var count = Object.keys(dataCenter).length;
        for (var i = 0; i < count; i++) {
            if (dataCenter[i].site == siteId) {
                var iconStyle = new L.DivIcon({
                    html: '<img src='+icon+'>'+
                          '<span class="dataMarkerLable">' +dataCenter[i].mid+'</span>'
                });
                var lat = dataCenter[i].lat;
                var lon = dataCenter[i].lon;
                var marker = L.marker([lat,lon], {icon: iconStyle});
                var popup; 
                // show location of data hub/center on mouseover
                marker.on('mouseover', function(e){
                    var stringLat = ((Number(lat)).toFixed(6)).toString();
                    var stringLon = ((Number(lon)).toFixed(6)).toString();
                    var content = stringLat+", "+ stringLon;
                    popup = L.popup({className: "dataHubPopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);
                });
                marker.on('mouseout', function (e) { 
                    mapInstance.closePopup(popup);
                    });
                marker.addTo(mapInstance);
            }
        }
    });
}

function show_v2x(mapInstance, api_name){
    var icon_html;
    if (api_name == "v2x/") {
        icon_html = '<div class="v2x_ripple v2x_icon">'+
                        '<div class="v2x_inner"></div>'+
                        '<div class="v2x_ring1"></div>'+
                    '</div>';
    } else {
        icon_html = '<div class="hub_ripple hub_icon">'+
                        '<div class="hub_inner"></div>'+
                        '<div class="hub_ring1"></div>'+
                    '</div>';
    }

    getMethod(api_name, function(data){
        var ripple_data = JSON.parse(data).results;
        var count = Object.keys(ripple_data).length;
        var circleIcon = L.divIcon({html: icon_html});
        var marker;
        // create v2x marker with ripple animation.
        for (var i = 0; i < count; i++) {
            if (ripple_data[i].site == 2) {
                var lat = ripple_data[i].lat;
                var lon = ripple_data[i].lon;
                marker = L.marker([lat,lon], {
                    draggable: false,
                    icon: circleIcon
                });
        
                marker.addTo(mapInstance);
                //test2 = marker;
                // show loaction of v2x on mouseover 
                var popup;
                marker.on('mouseover', function(e) {
                    var stringLat = ((Number(lat)).toFixed(6)).toString();
                    var stringLon = ((Number(lon)).toFixed(6)).toString();
                    var content = stringLat+", "+ stringLon;
                    popup = L.popup({className: "v2xPopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);
                });
                marker.on('mouseout', function (e) { 
                    mapInstance.closePopup(popup);
                    });
            }
        }
    });
}

function manager_list(site_manager_array) {
    // add managers to select list, 
    var select = document.getElementById("manager_selectlist");
    select.options.length = 0;
     
    // This is temporary becasue of sejong 
    if(site_manager_array == undefined || site_manager_array == null)
       return false;

    for (var i = 0; i < site_manager_array.length; i++) {
        var api_url = "users/" + site_manager_array[i] + "/";
        getMethod(api_url, function (site_manager_data) {
            var site_manager_data = JSON.parse(site_manager_data);
            var option = document.createElement('option');
            option.text = site_manager_data.username;
            option.value = site_manager_data.email;
            var photo = site_manager_data.photo;
            if (photo != null)
                document.getElementById("mangerPicture").src = photo;
            select.add(option, i + 1);
        });
    }
}

function msg_modal() {
    show_div('messageModal');
    selectSite('all', "0","0");
}

function notice_modal() {
    show_div('noticeModal');
    getMethod("notice/", function (site_data) {
        var noticeData = JSON.parse(site_data).results;
        var count = Object.keys(noticeData).length;
        var category = document.getElementById("select_notice").value;
        var noticeDiv = document.getElementById("noticeBody");
        var pinTrueArray=[];
        var pinFalseArray=[];
        var pinArray =[];

        if(noticeDiv != null)
            noticeDiv.innerHTML = "";
        for (var i = 0; i < count; i++) 
        {
            if(category != "0")
            {
                if(noticeData[i].category != category)
                return;
            }
            if(noticeData[i].pin == true)
                pinTrueArray.push(noticeData[i]);
            else
                pinFalseArray.push(noticeData[i]);
        }
        pinTrueArray = pinTrueArray.reverse();
        pinFalseArray = pinFalseArray.reverse();
        pinArray.push(pinTrueArray);
        pinArray.push(pinFalseArray);

        for (var i = 0; i < 2 ; i++) {
            var obj = pinArray[i]; 
            if(obj[0].pin == true)
            {
                var html = '<div id="noticeDiv" style="width: 100%">' +
                                '<img class="noticeBullet1" src = "images/red_bullet.svg">'+
                                '<span id="noticeTitle' +i+ '" class = "noticeSpan1"> ' +obj[0].title+ '</span>'+
                                '<button class = "divButton" id="noticeButton' +i+ '" onclick=" toggle_div2(noticeDetails' +i+ ', ' +i+ ')" >'+
                                    '<i class = "fa fa-angle-down" style="vertical-align: top;"></i>'+ 
                                '</button><br/>'+
                                '<lable class="noticeLabel1">' +obj[0].created_on+'</lable><br/>'+
                                '<div id = "noticeDetails' +i+ '" class = "noticeDiv1">'+
                                    '<p>' +obj[0].contents+ '</p>'+
                                '</div>'+
                                '<hr/>'+
                            '</div>';
            }
            else{
                var html = '<div id="noticeDiv" style="width: 100%">'+
                                '<span id="noticeTitle' +i+ '" class = "noticeSpan2">' +obj[0].title+'</span>'+
                                '<button class = "divButton" id="noticeButton' +i+ '" onclick=" toggle_div2(noticeDetails' +i+ ', ' +i+ ')" >'+
                                '<i class = "fa fa-angle-down" style = "vertical-align: top;"></i> </button>' +
                                '<br/>' +
                                '<lable class="noticeLabel1">' +obj[0].created_on+'</lable>' +
                                '<br/>' +
                                '<div id = "noticeDetails' +i+ '" class = "noticeDiv1">' +
                                    '<p>' +obj[0].contents+ '</p>' +
                                '</div>' +
                                '<hr/>' +
                            '</div>';
            }
            $('#noticeBody').append(html);
        }
    });
}

function toggle_div2(divID, i) {
    var button = document.getElementById('noticeButton' +i);
    var title = document.getElementById('noticeTitle' +i);
    title.style.color = "#828282";
    title.style.fontWeight = "normal";
    if (divID.style.display == "block") {
        divID.style.display = "none";
        button.style.transform = "rotate(0deg)";
        button.style.backgroundColor = "#FFFFFF";
        button.style.color = "black";

    } else {
        divID.style.display = "block";
        button.style.backgroundColor = "#8FA4B8";
        button.style.color = "#FFFFFF";
        button.style.transform = "rotate(-180deg)";
    }
}

function toggle_div(div_id) {
    var div_display = document.getElementById(div_id);
    if (div_display.style.display == "block")
        div_display.style.display = "none";
    else
        div_display.style.display = "block";
}

function hide_div(div_id) {
    var id = document.getElementById(div_id);
    if (id != null)
        id.style.display = "none";
}

function show_div(div_id) {
    var id = document.getElementById(div_id);
    if (id != null)
        id.style.display = "block";
}

function hide_div_list(div_id) {
    var div_list = ["div_station", "div_kiosk", "div_garage", "div_vehicle"];
    for (var i = 0; i < div_list.length; i++) {
        if (div_list[i] != div_id)
            document.getElementById(div_list[i]).style.display = "none";
        else
            document.getElementById(div_id).style.display = "block";
    }
}

function change_button_color(button_id) {
    var button_list = ["station_info_button", "kiosk_info_button", "garage_info_button", "vehicle_info_button"];
    for (var i = 0; i < button_list.length; i++) {
        if (button_list[i] != button_id) 
            document.getElementById(button_list[i]).style.backgroundColor = "#C5C5C5";
        else 
            document.getElementById(button_id).style.backgroundColor = "#185786";
    }
}

function close_div() {
    document.getElementById('degu_window').style.display = "none";
}

function showMarker(mapInstance, iconUrl, stationTitle, kioskTitle, lat, long) {
    var kioskIcon;
    // get first 3 characters of string 
    var title = stationTitle.substring(0, 3);

    if (title == "GAR") {
        kioskIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="garageMarkerLable">' +stationTitle+ '</span>',
           });
    } else if (kioskTitle == 'false') {
        kioskIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="markerLable">' +stationTitle+ '</span>'});
    } else {
      kioskIcon = new L.DivIcon({
        //  Fake station icons 
        /*  html: '<img src='+iconUrl+'>' +
            '<span class="markerLable">' +stationTitle+ '</span>' +
            '<br><span class="markerLable">' +kioskTitle+ '</span>'*/
        })
    }

    var kioskMarker = L.marker([lat, long], {
        draggable: false, // Make the icon dragable
        icon: kioskIcon
    });
    
    //const customPopup = "<ul><li>" + stationTitle + "</li><ul>";
    //const customOptions = {'className': 'custom-popup', autoPan: false, autoClose: false }
    kioskMarker.addTo(mapInstance);
    var popup;
    kioskMarker.on('mouseover', function(e) {
        var stringLat = ((Number(lat)).toFixed(6)).toString();
        var stringLon = ((Number(long)).toFixed(6)).toString();
        var content = stringLat+", "+ stringLon;
        popup = L.popup( {className : "garagePopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);
    });
    kioskMarker.on('mouseout', function (e) { 
        mapInstance.closePopup(popup);
    });
}

function setDateTime() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var currentdate = new Date();
    var strDate = currentdate.getDate()+" " +months[currentdate.getMonth()]+ ", " +currentdate.getFullYear();
    var currentHour = currentdate.getHours();
    var hour_status;
    if (currentHour > 12)
        hour_status = "PM";
    else
        hour_status = "AM";

    var strTime = currentHour+ ":" +currentdate.getMinutes()+ ' ' +hour_status;
    document.getElementById("currentDate").innerHTML = strDate;
    document.getElementById("currentTime").innerHTML = strTime;
    var userName = localStorage.getItem("activeUserID");
    // trim email id to username
    var trimName = userName.substring(0, userName.indexOf('@'));
    document.getElementById("active_username").innerHTML = trimName;
    setTimeout(setDateTime, 20000);
}

function highchart(graph1, title, color, yAxisLable, vehicleList, yAxisList) {
    if (graph1 == 'graph2')
        document.getElementById('graphTitle1').innerHTML = title;
    else
        document.getElementById('graphTitle2').innerHTML = title;

    for (var i = 0; i < 2; i++) {
        var ctx = document.getElementById(graph1).getContext('2d');
        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vehicleList,
                datasets: [{
                    label: yAxisLable,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: yAxisList,
                    backgroundColor: color,
                    barPercentage: 0.3,
                    categoryPercentage: 1.0,
                }]
            },
            title: {
                text: title,
                fontSize: '0px',
                fontFamily: 'Noto Sans KR',
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Distance (km)'
                }
            },

            // Configuration options go here
            options: {
                options: {
                    hover: {
                        intersect: false,
                    }
                },
                title: {
                    display: false,
                    text: '총 운행거리',
                    ticks: {
                        fontSize: 8,
                        fontFamily: "Noto Sans KR"
                    },
                },
                legend: {
                    display: false,
                },
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                        },

                        ticks: {
                            fontSize: 8,
                            fontFamily: "Roboto",
                            fontStyle: "bold",
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            fontSize: 8,
                            fontFamily: "Roboto",
                            fontStyle: "bold",
                            stepSize: 300,
                        }
                    }]
                }
            }
        });
    }
}

function todayChart(graph1, title, color, yAxisLable, vehicleList, distanceList) {
    //alert("colorlist :"+color);
    //alert("vehiclelist :"+vehicleList);
    //alert("yAxisList :"+distanceList);
    var ctx = document.getElementById(graph1).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: vehicleList,
            datasets: [{
                label: yAxisLable,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: distanceList,
                backgroundColor:color,
                barPercentage: 0.3,
                categoryPercentage: 1.0,
            }]
        },
        title: {
            text: title,
            fontSize: '0px',
            fontFamily: 'Noto Sans KR',
            display: false,
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Distance (km)'
            },
            display: false,
            gridLines:{
                drawBorder: false
            }
        },

        // Configuration options go here
        options: {
            options: {
                hover: {
                    intersect: false,
                }
            },
            title: {
                display: true,
                text: '총 운행거리',
                ticks: {
                    fontSize: 8,
                    fontFamily: "Noto Sans KR",
                },
                position:'topleft'
            },
            plugins:{
                datalabels: {
                    align: 'end',
                    anchor: 'end',        
                    /*
                    backgroundColor: function(context) {
                        return context.dataset.backgroundColor;
                    },*/
                    color: 'black',
                    formatter: function(value, context) {
                        return value+'km';
                    }
                }
            },
            animation: {
                duration: 1,
                onComplete () {
                    const chartInstance = this.chart;
                    const ctx = chartInstance.ctx;
                    const dataset = this.data.datasets[0];
                    const meta = chartInstance.controller.getDatasetMeta(0);
                    Chart.helpers.each(meta.data.forEach((bar, index) => {
                        const label = this.data.labels[index];
                        const labelPositionX = 50;
                        const labelWidth = ctx.measureText(label).width + labelPositionX;
                        ctx.textBaseline = 'middle';
                        ctx.textAlign = 'left';
                        ctx.fillStyle = '#fff';
                        ctx.fillText(label, labelPositionX, bar._model.y);
                    }));
                }},
            legend: {
                display: false,
            },
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder:false,
                    },
                    ticks: {
                        fontSize: 8,
                        fontFamily: "Roboto",
                        fontStyle: "bold",
                        beginAtZero:true,
                        display:false
                    }
                }],
                yAxes: [{
                    
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                    gridLines: {
                        display: false,
                        drawBorder:false,
                    },
                    ticks: {
                        fontSize: 8,
                        fontFamily: "Roboto",
                        fontStyle: "bold",
                        display:false,
                        //stepSize: 300,
                    }
                }
            ]
            }
        }
    });
}

function playPause()
{    
    // Event listener for the play/pause button
    var pausePlayButton = document.getElementById("pausePlayButton");
    pausePlayButton.addEventListener("click", function() {
       
        if(document.getElementById("video1").paused == true)
        {
            document.getElementById("video1").play(); // Play the video
            pausePlayButton.src= 'images/cctv/pause_circle_outline.svg';  // Update the button text to 'Pause'
        } 
        else 
        {
            document.getElementById("video1").pause();  // Pause the video
            pausePlayButton.src= 'images/cctv/play_circle_outline.svg';  // Update the button text to 'Play'
        }
    }, {once : true});
}

function webcam(webcamId) {
    show_div('webcam_div');
    var button_id = "cameraButton" + webcamId;
    var button_dom = document.getElementById(button_id);
    var api_name = "vehicles/";
    getMethod(api_name, function (vehicles_data) {
        var vehicle_data = JSON.parse(vehicles_data).results;
        if (vehicle_data == undefined || vehicle_data == null)
            vehicle_data = JSON.parse(vehicles_data);

        var count = Object.keys(vehicle_data).length;
        for (var i = 0; i < count; i++) {
            if (vehicle_data[i].mid == "SCN001") {
                if (webcamId == '1') {
                  // document.getElementById("video1").src = "images/cctv/video1Active.svg";
                    var webcam1 = "images/sampleVideo.mp4"; //vehicle_data[i].webcam1;
                    if (webcam1 != null) {
                        document.getElementById("webcam_div1").style.display = "inline-block";
                        document.getElementById("video1Src").src = webcam1;
                        console.log("webcam1 :"+ document.getElementById("video1Src").src);
                        //document.getElementById("video1").style.backgroundImage = 'url(' + webcam1 + ')';
                        document.getElementById("hidden_cam1").src = webcam1;
                        document.getElementById("webcamButton1").style.display = "block";
                    }
                }
                if (webcamId == '2') {
                    document.getElementById("cameraButton2").src = "images/cctv/video2Active.svg";
                    var webcam2 = vehicle_data[i].webcam2;
                    if (webcam2 != null) {
                        document.getElementById("webcam_div2").style.display = "inline-block";
                        document.getElementById("webcamButton2").style.display = "block";
                        document.getElementById("webcam_div2").style.background = 'url(' + webcam2 + ')';
                        document.getElementById("hidden_cam2").src = webcam2;
                    }
                }
            }
        }
    });
}

function scale_image(hidden_cam) {

    /*var vid = document.getElementById("video1");
    if(vid.requestFullScreen){
		vid.requestFullScreen();
	} else if(vid.webkitRequestFullScreen){
		vid.webkitRequestFullScreen();
	} else if(vid.mozRequestFullScreen){
		vid.mozRequestFullScreen();
	}*/
    
    document.getElementById("myModal").style.display = "block";
    var img = document.getElementById(hidden_cam).src;
    document.getElementById("img01").style.backgroundImage = 'url('+img+')';

}

function setByte(str) {
    document.getElementById("msg_byte").innerText = "/200 bytes";
}

function selectSite(select, site_no, managerName) {
    var selectValue;
    var managerSelect = document.getElementById('select_siteManager');
   
    if (select == 'all')
        selectValue = 0;
    else
        selectValue = select[select.selectedIndex].id;

    if (selectValue == null || selectValue == undefined) {
        managerSelect.innerText = null;
        alert("No managers are available");
    } else if (selectValue == "0") {
        // assign all managers to the option list from site api. 
        var api3 = "users/";
        getMethod(api3, function (managersData) {
            var managerInfo = JSON.parse(managersData).results;
            var managerCount = Object.keys(managerInfo).length;
            for (var i = 0; i < managerCount; i++)
                createOption(managerSelect, managerInfo[i].username, managerInfo[i].email, managerInfo[i].photo,site_no, managerName);
        });
    } else {
        // Find site managers from "sites/" api.
        var api_name = "sites/" + selectValue; 
        getMethod(api_name, function (managerList) {
            var managerList = JSON.parse(managerList).manager;
            if (managerList != null)
                var managerCount = Object.keys(managerList).length;
            var api2;
            managerSelect.innerText = null;
            for (var i = 0; i < managerCount; i++) {
                api2 = "users/" +managerList[i]+ "/";
                getMethod(api2, function(managerData) {
                    var managerInfo = JSON.parse(managerData);
                    // assign username to select dropdown list
                    createOption(managerSelect, managerInfo.username, managerInfo.email, managerInfo.photo, site_no, managerName);
                });
            }
        });
    }
}

function createOption(selectDom, username, email, photo,site_no, managerName) {
    if (photo != null)
        document.getElementById('profile_photo').src = photo;

    // assign username to select dropdown list
    selectDom.style.fontSize = "14px";
    var option = document.createElement("option");
    option.text = username;
    option.value = email;
    option.style.fontSize = "14px";
    console.log("username :"+username+" = managerName :"+managerName);
    console.log("site_no :"+site_no);
    if(site_no != "0")
    {   if(username == managerName)
        {
            option.selected = true;
        }
    }
    selectDom.appendChild(option);
}

function showText(obj) {
    obj.innerText = 'rutuja';
}

function fnChkByte(obj, maxByte) {
    var str = obj.value;
    var str_len = str.length;
    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";

    for (var i = 0; i < str_len; i++) {
        one_char = str.charAt(i);
        if (escape(one_char).length > 4)
            rbyte += 2; // Korean 2Byte
        else 
            rbyte++; // English, etc... 1Byte
        
        if (rbyte <= maxByte) 
            rlen = i + 1; // The number of string to return
    }

    if (rbyte > maxByte) {
        alert("메세지는 최대 " + maxByte + "byte를 초과할 수 없습니다.")
        str2 = str.substr(0, rlen); // count String
        obj.value = str2;
        fnChkByte(obj, maxByte);
    } else {
        document.getElementById('byteInfo').innerText = rbyte;
    }
}

function settings()
{
    hide_div('logoutSetting');
    hide_div('settingDiv21');
    hide_div('settingDiv31');
    show_div('settingDiv');
    document.getElementById('settingDiv2').style.display = "inline-block";
    document.getElementById('settingDiv3').style.display = "inline-block";
    getMethod("auth/user/", function(data) {
        var userId = JSON.parse(data).pk;
        getMethod("users/"+userId+"/", function (data) {
            var userData = JSON.parse(data);
            document.getElementById("activeEmail").innerHTML = userData.email;
            document.getElementById("activeName").innerHTML = userData.username;
            document.getElementById("activeTeam").innerHTML = userData.profile.team;
            document.getElementById("activePhone").innerHTML = userData.profile.phone;

            var level = userData.profile.level;
            var levelName; 
            if(level == 1)
                levelName = "Operator";
            else if(level == 2)
                levelName = "Manager";
            else if(level == 3)
                levelName = "Supervisor";

            document.getElementById("activeLevel").innerHTML = levelName;
            document.getElementById("activeUserImg").src = userData.profile.photo;
        });
    });
}

function passwordChange2()
{
    hide_div('settingDiv2');
    hide_div('settingDiv3');
    document.getElementById("settingDiv21").style.display = "inline-block";
    document.getElementById("settingDiv31").style.display = "inline-block";
}
 
function resetPassword()
{
    //var input_current_pwd = $("#currentPwd").val();
    var input_new_pwd = $("#newPwd").val();
    var input_repeat_pwd = $("#confirmPwd").val();
    //check_password
    var data = JSON.stringify({
        "new_password1": input_new_pwd,
        "new_password2": input_repeat_pwd,
    });
    var api_url = "http://115.93.143.2:9103/api/auth/password/change/";
    postMethod(data, api_url, function (req) {
        var t = JSON.parse(req.response);
        //var errorMsg = req.response.details;
        var pwdErrorDom = document.getElementById("pwdResetError");
        if(req.status == 200)
        {  
            if (t.detail == "New password has been saved.")
            {
                alert("PAssword update successfull");
                pwdErrorDom.innerHTML = "새로운 비밀번호로 변경 됐습니다.";
                pwdErrorDom.style.color="#2E92B0";
                localStorage.setItem('userPwd', input_new_pwd);
            }
            else{
                pwdErrorDom.innerHTML = "Re-enter passwords.";
                pwdErrorDom.style.color="red";
            }
        }
        else
        {
            console.log("Pasword Change error code:"+req.status );
            pwdErrorDom.style.color="red";
            if(t.detail == "This password is too short. It must contain at least 8 characters." )
                pwdErrorDom.innerHTML = "8글자 이상의 비밀번호를 입력하세요.";
            else if (t.new_password1 == "This field may not be blank.")
                pwdErrorDom.innerHTML = "new password 1 is blank.";
            else if (t.new_password2 == "This field may not be blank.")
                pwdErrorDom.innerHTML = "new password 2 is blank.";
            else if(t.detail == "Invalid username/password.")    
                pwdErrorDom.innerHTML ="Invalid";
            else if (t.detail == "The two password fields didn't match.")
                pwdErrorDom.innerHTML = "두 개의 비밀번호가 일치하지 않습니다.";
            else if (t.detail == "This password is too common.")
                pwdErrorDom.innerHTML = "평범하지 않은 비밀번호를 입력하세요.";
            else if (t.detail == "This password is entirely numeric.")
                pwdErrorDom.innerHTML = "비밀번호에 숫자 외의 문자를 포함하세요.";
            else if (t.detail == "The password is too similar to the email address.")
                pwdErrorDom.innerHTML = "비밀번호가 이메일ID와 너무 유사합니다.";
            else if (t.detail == "The password is too similar to the username.")
                pwdErrorDom.innerHTML = "비밀번호가 사용자 이름과 너무 유사합니다.";
            else
                pwdErrorDom.innerHTML = "Re-enter passwords.";
        }
    });
    return true;
}

function oddFileDownload(){
    var dom = document.getElementById("vehicleSelect");
    var selectedId = dom.options[dom.selectedIndex].id;
    getMethod("vehicles/"+selectedId+"/", function (data) {
        var vehicle = JSON.parse(data);
        var filePath = vehicle.odd; 
        if(filePath == null)
        {
            alert("ODd file is not available");
            return false;
        }
        var oddDom = document.getElementById("oddFile");
        oddDom.href=filePath;
        document.body.appendChild(oddDom);
        oddDom.click();
    });
}
