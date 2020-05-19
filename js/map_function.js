/*Integrated Monitoring system version 0.2
  Note : Some function from version 0.1 which 
  are not used in version 0.2  are commented  */

// Checks which route button is clicked and 
// Calls the function associated for that route 
var mapList = [];               // stores the id of open map 
mapList.push("mapid");          //  push id of offsite map on login  
var daegu_map;
function switchMap(obj)
{   
    if(obj.id == "degu_button")
    {           
        for(var i = 0 ; i < mapList.length; i++)
            hide_div(mapList[i]);
        show_div("deguMap");
        mapList.push("deguMap");
        document.getElementById('webcam_div1').style.display = "inline-block";
        document.getElementById('webcam_div2').style.display = "inline-block";
        deguRoute(daegu_map); 
        show_div("alertDiv");
    }
    else if(obj.id == "sejong_button")
    {
        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        show_div("sejongMap");
        mapList.push("sejongMap");
        hide_div('webcam_div1');
        hide_div('webcam_div2');
        sejongRoute(); 
        show_div("alertDiv");
    }
    else if(obj.id == "sangam_button")
    {
        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        show_div("sangamMap");
        mapList.push("sangamMap");
        hide_div('webcam_div1');
        hide_div('webcam_div2');
        sangamRoute(); 
        open_tab('degu_window',4);
        show_div("alertDiv");
    }
    else if(obj.id == "gunsan_button")
    {
        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        show_div("gunsanMap");
        mapList.push("gunsanMap");
        hide_div('webcam_div1');
        hide_div('webcam_div2');
        gunsanRoute(); 
        open_tab('degu_window',1);
        show_div("alertDiv");
    }
    else if(obj.id == "gangrung_button") 
    {
        // this will be developed in next version
        mapList.push("gangrungMap");  
    }
}

function offsite() {
    // hide all div's from site route
    for(var i=0 ; i< mapList.length; i++)
        hide_div(mapList[i]);
    
    hide_div("listItem");
    mapList.push("mapid"); 
    hide_div("alertDiv");
    hide_div("distanceChart1");
    hide_div("passangerChart2");
    hide_div("webcam_div");

    // show all div's of offsite
    show_div("mapid");
    show_div("graph1_div");
    show_div("graph2_div");
    show_div("countInfoDiv");  
    
    // create list to show all site info.
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

// show the sub items of offsite list 
function listItem() {
    show_div('siteListModal');

    // alignment of listItem div
    var li_Item = document.getElementById("listItem");
    li_Item.style.top = (this.offsetTop + 100) + "px";
    li_Item.style.display = "block";
    
    // get summary details from 'sites/' api 
    getMethod("sites/" + this.id, function (site_data) {
        var data = JSON.parse(site_data);
        var summary = data.summary.replace(/\r\n/g, '<br>');
        document.getElementById("listItem_summary").innerHTML = summary;
    });
}

// show total passenger and distance graphs when offsite div is open
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
        highchart('graph2', '총 운행거리', '#f1ca3f', 'Distance(km)', vehicleList, passengerList, 'km');
        highchart('graph1', '총 탑승자 수', '#3bc7d1', 'Passenger', vehicleList, distanceList, '명');
    });
}

/*
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
*/

function showCluster() 
{
    // hide data of other sites if open 
    hide_div("deguMap");
    hide_div("sejongMap");
    hide_div("webcam_div");
    hide_div("alertDiv");
    
    // show data for offsite.
    showGraphs();
    show_div("mapid");
    show_div("graph1_div");
    show_div("graph2_div");
    show_div("countInfoDiv");
  
    // array to store lat-lon of cluster 
    var addressPoints = []; 
    // get location of clusters using REST api
    getMethod("routes/", function (routes_data) {
        var cluster_data = JSON.parse(routes_data).results;
        var count = Object.keys(cluster_data).length;
        for (i = 0; i < count; i++) {
            if(cluster_data[i].start != '')
                addressPoints.push(cluster_data[i].start);
        }

        // create offsite map(replace create map code width 'createMap' function in future)
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

        // create openstreet tile layer
        clusterLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });

        // add layer to map with zoom level
        clusterLayer.addTo(cluster_map);
        var zoomHome = L.Control.zoomHome();
        zoomHome.addTo(cluster_map);     
        
        // create markers and add it to layer
        var markers = L.markerClusterGroup();
        for (var i = 0; i < addressPoints.length; i++) {
            var location = addressPoints[i];
            var marker = L.marker(new L.LatLng(location[0], location[1]));
            markers.addLayer(marker);
        }

        // add layer to the map instance.
        cluster_map.addLayer(markers);
        cluster_map.invalidateSize(); // refresh map 
    });
}

// function to switch between main tabs (different projects)
function showContent(tabId) {
    // Update this function when other projects are developed.
    var tabArray = ['integrated_control', 'integrated_Dashboard'];
    if (tabId == "integrated_control")
        window.location.href = "main.html";
    else if(tabId == "integrated_Dashboard")
        window.location.href = "dashboard.html";
}

// Show weather information on main.html
function getweather(lat, lon) {
    var key = '326fceb5cbe3b99fa6f5e0f307732100'; // API key
    // fetch data from open weather every 20 minutes
    // Note: Time interval can be chnaged in future
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
    }, 20000);
}

// shows passenger count by images icon
// Note - function not used in version 0.2
function displayPassenger(img_src, divDom)
{
    // create img dom and append it to div
    var img = document.createElement('img');
    img.src = img_src;
    img.style.height = "25.07px";
    img.style.width = "9px";
    img.style.margin = "2px";
    divDom.insertAdjacentElement("afterBegin", img);
}

// function to update passenger status in the shuttle. 
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

// function to calculate distance between two locations
// Note - not used in version 0.2
function onDemand(map)
{
    // static waypoint for test 
    var waypoints = [
        L.latLng(35.8363080000000000, 128.6815470000000000),
        L.latLng(35.8386730000000000, 128.6878920000000000),
    ];

    // Use routing control leaflet plugin to draw route on map
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

// Get distance between two location using leaflet function
// Note - (does not consider waypoints while showing the route)
function getDistance(start, destination) {
    var distance_m = (start.distanceTo(destination)).toFixed(0);
     var distance_km = distance_m/1000;
    return distance_km;
}

// Updates the speed of vehicle in main.html
function setVehicleSpeed(speed)
{
    var speedDom = document.getElementById("speed_v1");
    speedDom.innerHTML = speed;
    if(speed < 18)
    {
        // speed is less then 18 text color is black
        speedDom.style.color="#4F4F4F";
        speedDom.style.fontWeight ="normal";
    }
    else if(speed > 18)
    {
        if(speed > 30)
        {
            // speed is greater then 30 text color is red and bold
            speedDom.style.color="#CA4040";
            speedDom.style.fontWeight ="bold";
        }
        else
        {
            // speed is greater then 18 and less then 30
            // text color is red and normal
            speedDom.style.color="#CA4040";
            speedDom.style.fontWeight ="normal";
        }
    }
}

// Calculate ETA of vehicle on each station (under development)
function arraivalTime(mapInstance, shuttleLocation,speedArray,count, request_count)
{
    // ppt speed avg
     var speed = ((7*2)+(14.2)+(13.6*10))
    // (7+7+14.2+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+13.6+14.3)/14;
    /* Average speed solution 15 sec */
    /*var sumSpeed = (speedArray.reduce(function(pv, cv) { return pv + cv; }, 0)); 
    if(sumSpeed == 0 )
    {
        console.log("sumSpeed return false");
        return false;
    }
    var speed = sumSpeed/speedArray.length;*/
    //console.log("arival ETA");
   // ETA(shuttleLocation, mapInstance); // for on demand

    // distance between vehicle and station A
  /*  var vtoA = getDistance(shuttleLocation, L.latLng(35.836308, 128.681547));
    var timeA = vtoA/speed;
    var staA = document.getElementById("deguStationA");
    if(timeA < 1)
    {
        timeA = Math.floor((Math.abs(timeA) * 60) % 60);
        staA.innerHTML = Math.round(timeA)+"sec 후 도착";
    }
    else
    {
        staA.innerHTML = Math.round(timeA)+"분 후 도착";
    }

    // distance between vehicle and station B
    var vtoB = getDistance(shuttleLocation, L.latLng(35.838673, 128.687892));
    var timeB = vtoB/speed;
    var staB = document.getElementById("deguStationB");
    if(timeB < 1)
    {
        timeB = Math.floor((Math.abs(timeB) * 60) % 60);
        staB.innerHTML = Math.round(timeB)+"sec 후 도착";
    }
    else
    {
        staB.innerHTML = Math.round(timeB)+"분 후 도착";
    }

    // distance between vehicle and station C
    var vtoC = getDistance(shuttleLocation, L.latLng(35.83705, 128.690044));
    var staC = document.getElementById("deguStationC");
    var timeC = vtoC/speed;
    if(timeC < 1)
    {
        timeC = Math.floor((Math.abs(timeC) * 60) % 60);
        staC.innerHTML = Math.round(timeC)+"sec 후 도착";
    }
    else
    {
        staC.innerHTML = Math.round(timeC)+"분 후 도착";
    }

    // distance between vehicle and station D
    var vtoD = getDistance(shuttleLocation, L.latLng(35.83459, 128.68652));
    var timeD = vtoD/speed;
    var staD = document.getElementById("deguStationD");
    if(timeD < 1)
    {
        timeD = Math.floor((Math.abs(timeD) * 60) % 60);
        staD.innerHTML = Math.round(timeD)+"분 후 도착";
    }
    else
    {
        staD.innerHTML = Math.round(timeD)+"분 후 도착";
    }
   */
    /* for testing
    console.log("timeA:"+(timeA)+ " distanceA: "+vtoA);
    console.log("timeB:"+(timeB)+ " distanceB: "+vtoB);
    console.log("timeC:"+(timeC)+ " distanceC: "+vtoC);
    console.log("timeD:"+(timeD)+ " distanceD: "+vtoD);
    */
}


// show vehicle info like speed, heading, gnss battery etc.
var interval;
function vehicleInfo(map, vId)
{   
   
    var request_count = 0;
    var count15 = 0;
    var speedArray=[];
    interval = setInterval(function(){
        request_count++;
        count15++;
        var apiUrl = "vehicles/"+vId+"/";//"vehicles/1/"; //"vehicles/"+vId+"/";  //change line 2 (1 or 6)
        getMethod(apiUrl, function (data) {
            var vehicle = JSON.parse(data);
            var shuttleLocation = L.latLng(vehicle.lat, vehicle.lon);
            // calculate ETA after every 15 seconds
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
            updateShuttleInfo(vehicle); 
        });
    }, 1500);
    return interval;
}

function updateShuttleInfo(vehicle)
{  
    if(vehicle.drive_mode == 1)
        document.getElementById("driveStatus").innerHTML = "AUTONOMOUS";
    else
        document.getElementById("driveStatus").innerHTML = "MANUAL";

    if(vehicle.isparked == true)
        vehicleStatus("rgb(128,128,128)", "PARKED", "rgb(128,128,128)", "#57AE66");
    else if(vehicle.speed > 0) 
        vehicleStatus("rgba(115, 192, 95, 0.4)", "DRIVING", "#57AE66", "#57AE66");
    else
        vehicleStatus("rgba(202, 64, 64, 0.4)", "STOPPED", "#CA4040", "#BDBDBD");
    
    // Vehicle name and version     
    document.getElementById("vehicleID").innerHTML = vehicle.name;
    document.getElementById("vehicleVersion").innerHTML = "version : "+vehicle.model.firmware;
                        
    // show speed of vehicle
    setVehicleSpeed(vehicle.speed);
    if(vehicle.heading == null)
        var heading = 0;
    else
        var heading = vehicle.heading;    
    document.getElementById("heading_v1").innerHTML = heading + "&deg";
    
    // rotate heading
    document.getElementById("bigCircle").style = 'transform:rotate('+vehicle.heading+'deg)';
    
    // reverse rotate heading
    var reverseHeading = -(heading);
    document.getElementById("angleDegree").style = 'transform: rotate('+reverseHeading+'deg)';
    var vehicleMid = (vehicle.name).substring(0, 3); // trim first 3 characters

    // show passenger status    
    passengerStatus(vehicle.passenger);
    if (vehicle.gnss == true)
        document.getElementById("gnss_v1").style.backgroundColor = "#57AE66";
    else
        document.getElementById("gnss_v1").style.backgroundColor = "#CA4040";

    // show door status      
    if (vehicle.door == false)
        document.getElementById("doorStatus").src = "images/door/door_closed.svg";
    else
        document.getElementById("doorStatus").src = "images/door/door_open.svg";
    
    // show battery status
    setBatteryPercent(vehicle.battery);

    // show webcam
    checkWebcam(vehicle.webcam1, 'cameraButton1', 'video1', 'video1Active');
    checkWebcam(vehicle.webcam2, 'cameraButton2', 'video2', 'video2Active');
}

// create select box options
function createSelectList(objArray)
{ 
    var selectDom = document.getElementById("vehicleSelect");
    $('#vehicleSelect').empty();
    for(var i = 0; i < objArray.length; i++)
    {
        var option = document.createElement("option");
        option.text = objArray[i].name;
        option.id = objArray[i].id;
        selectDom.add(option);
    }
}

// switch between the vehicle info when select option is changed. 
/*
function changeVehicleInfo(map, obj)
{
    clearInterval(interval);
    if(typeof(obj) == 'number')
    {
        interval= vehicleInfo(map, obj);
    }
    else
    {
        var selectedId = obj.options[obj.selectedIndex].id;
        interval= vehicleInfo(map, selectedId);
    }
}*/

function changeVehicleInfo(obj)
{
    // check if which sites map is open 
    // return the last element of array 
    //alert("changeVehicleInfo:"+obj);
    var activeMap =  mapList[mapList.length - 1];
    clearInterval(interval);
    if(typeof(obj) == 'number')
    {
        interval = vehicleInfo(activeMap, obj);
    }
    else
    {
        var selectedId = obj.options[obj.selectedIndex].id;
        interval = vehicleInfo(activeMap , selectedId);
    }
}

function createHtmlMarker(vehicleObj, iconHtml)
{
    marker = L.marker([vehicleObj.lat, vehicleObj.lon], {
        draggable: false,
        icon: iconHtml,
    });
    return marker;
}

// This is vehicle ripple effect function. 
// This is vehicle ripple effect function. 
var rippleMarkerArray = [];
var shuttleMarkerArray = [];
function showVehicleRipple(request_count, mapInstance, vehicleInfo){ 
        var vehicleMarker;
        // loop throght array vehicles of route
        for(var j = 0; j < vehicleInfo.length; j++)
        {        
            var vehicleObj = vehicleInfo[j];
           // red ripple marker html
            var redIconHtml = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                '<div id="ring1" class="shuttle_ring1"></div>'+
                                '<div id="ring2" class="shuttle_ring2"></div>'+
                                '<div id="ring3" class="shuttle_ring3"></div>'+
                                '<div id="ring4" class="shuttle_ring4"></div>'+
                            '</div>';

            // green ripple marker html
            var greenIconHtml = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                '<div id="ring1" class="shuttle_ring1_g"></div>'+
                                '<div id="ring2" class="shuttle_ring2_g"></div>'+
                                '<div id="ring3" class="shuttle_ring3_g"></div>'+
                                '<div id="ring4" class="shuttle_ring4_g"></div>'+
                            '</div>';
        
            const redRippleIcon = L.divIcon({html: redIconHtml});
            const greenRippleIcon = L.divIcon({html: greenIconHtml});
            if (request_count == 1) 
            {
                // create Icon for ripple marker as per the speed value
                if (vehicleObj.speed > 0 ) // || vehicleObj.drive == true
                {
                    var marker = createHtmlMarker(vehicleObj, greenRippleIcon);
                    marker.options.rotationAngle = vehicleObj.heading;                // rotate marker of speed is greater then 0 to avoid abnormal data
                } 
                else
                {
                    var marker = createHtmlMarker(vehicleObj, redRippleIcon);
                }
                marker._leaflet_id = vehicleObj.id;                                   // set id of vehicle as id of marker.
                marker.addTo(mapInstance);                                            // add marker to map  
                var rippleMarkerObj = {                                               // create marker object
                    marker : marker,
                    markId : vehicleObj.id
                }
                rippleMarkerArray.push(rippleMarkerObj);                              // maintain array of ripple marker objects

                // show vehicle markers on route
                var iconUrl = "images/route/shuttleIcon.svg";  
                var vehicleIcon = L.icon({                                            // Create icon for marker.               
                    iconSize: [37, 52],
                    popupAnchor: [10, -25],
                    iconAnchor: [26, 45],
                    iconUrl: iconUrl,
                });

                // Create vehicle marker 
                vehicleMarker = createHtmlMarker(vehicleObj, vehicleIcon);            
                vehicleMarker._leaflet_id = vehicleObj.name;
                if(vehicleObj.speed > 0)                                              // to avoid abnormal data of heading, update heading data only if speed is > 0 
               
                // create html and append to popup div
                var customPopup = "";
                const customOptions = {'className': 'custom-popup2'};
                vehicleMarker.bindPopup(customPopup, customOptions).openPopup();               // bind popup to vehicle marker                   
                vehicleMarker.on('click', function(e) {           
                    // vehicle marker on click function ---> updates vehicle popup data every second 
                    setPopupContent(e, mapInstance);
            });

            if(vehicleObj.speed > 0)
                vehicleMarker.options.rotationAngle = vehicleObj.heading;

            vehicleMarker.addTo(mapInstance);                                                 // show vehicle icon on route
            var shuttleMarkerObj = {                                                          // store marker in array 
                marker : vehicleMarker,
                markId : vehicleObj.id,
                name: vehicleObj.name,
                speed: vehicleObj.speed,
                battery: vehicleObj.battery,
                version: vehicleObj.model.firmware
            }
            shuttleMarkerArray.push(shuttleMarkerObj);                                         // maintain array of shuttle markers
        }   
        else  //update markers
        {           
            for(var i = 0; i < rippleMarkerArray.length; i++)
            {           
                if(vehicleObj.id == rippleMarkerArray[i].markId)                                // check if ripple marker is present in array
                {
                   // console.log("else Lat:"+vehicleObj.lat+ "Lon:"+vehicleObj.lon+ "name :"+vehicleObj.name);
                    var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
                    var currentRipple = rippleMarkerArray[i].marker;
                    currentRipple.setLatLng(newLatLng);                                         // update the location of ripple marker

                    // change speed status in left side window
                    if (vehicleObj.speed > 0 ) //|| vehicleObj.drive == true
                    {                  
                        currentRipple.setIcon(greenRippleIcon);
                        currentRipple.options.rotationAngle = vehicleObj.heading;
                    }
                    else
                    {
                        currentRipple.setIcon(redRippleIcon); //L.divIcon({html: icon_html2})
                    }
                    currentRipple.addTo(mapInstance);
                }
            }
            
            for(var k = 0; k < shuttleMarkerArray.length; k++ )
            {
                if(vehicleObj.id == shuttleMarkerArray[k].markId)                              // check if vehicle marker is present in array
                {
                    var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
                    var currentVehicle = shuttleMarkerArray[k].marker;
                    currentVehicle.setLatLng(newLatLng);                                       // update the location of vehicle marker
                    currentVehicle._leaflet_id = vehicleObj.name;

                    if(vehicleObj.speed > 0) 
                        currentVehicle.options.rotationAngle = vehicleObj.heading;
                    currentVehicle.addTo(mapInstance);
                                      
                    // If current markers popup is open then set the content of popup
                    var currentMarker =  shuttleMarkerArray[k].marker;
                    if(currentMarker.getPopup().isOpen() == true)
                    {
                        // set popup color
                        var thirdCharacter = (vehicleObj.name).charAt(2);                   // check the third character of vehicle name
                        var popupColor;                                                // Update the background color of popup according as per the make of vehicle 
                        if(thirdCharacter == "E")
                            popupColor ="greenPopup";
                        else if(thirdCharacter == "N") 
                            popupColor ="bluePopup ";
                        else if(thirdCharacter == "K")   
                            popupColor ="blackPopup";

                        // update speed status 
                        var speedColor;
                        var speedWeight;
                        var currentSpeed = shuttleMarkerArray[k].speed
                        if(currentSpeed < 18)                                              // if speed is less then 18, text should be black color with normal font weight
                        {
                            speedColor = '#4F4F4F';
                            speedWeight = "normal";
                        }
                        else if(currentSpeed > 18)                                         // if speed is greater then 18, text should be red color with normal font weight
                        {
                            speedColor = '#CA4040';
                            if(currentSpeed > 30)                                          // if speed is greater then 30, text should be red color with bold font weight
                                speedWeight ="bold";
                            else
                                speedWeight ="normal";
                        }

                        if(vehicleObj.id == 1)
                        console.log("%%%%vehicleObj.version:"+vehicleObj.model.version+ " vehicleObj.battery:"+vehicleObj.battery);
                    
                        currentMarker._popup.setContent("<div class="+popupColor+" id='vPopup'>"+
                        "<p class='popupTitle'>" +vehicleObj.name+ "<img class='activeGreenPopup' src='images/status/active_green.svg'></p>"+
                        "<span class='popupVersion'>VER:"+shuttleMarkerArray[k].version+"</span>"+
                        "</div><br>"+
                        "<div class='popupSpeedDiv'>"+
                            "<span>Speed</span><br>"+
                            "<span id='popup_speed' class='popupSpeed' style='color:"+speedColor+";font-weight:"+speedWeight+"'>"+vehicleObj.speed+"</span><br>"+
                            "<span class='popupSpeedUnit'>km/hr</span>"+
                        "</div>"+
                        "<div class='popupBatteryDiv'>"+
                            "<span style='vertical-align:top'>Battery</span>"+
                            "<div id='popupBattery' class='popup-battery' data-content="+vehicleObj.battery+'%'+"></div>"+
                            "<div class='popupParent'></div>"+
                        "</div>")
                        setPopupBattery(vehicleObj.battery);                // update popup battery value 
                        setPopupSpeed(vehicleObj.speed);        
                    }
                }
               
                // check if which vehicle is selected from select list and update the info of that vehicle 
                var dom = document.getElementById("vehicleSelect");  // vehicle select list
                var selectedId = dom.options[dom.selectedIndex].id;  // selected Id 
                
                if(vehicleObj.id == selectedId)
                    updateShuttleInfo(vehicleObj);
            }
        }                                                     
    }
}

function setPopupContent(e, mapInstance)
{
    // update popup battery 
    for(var k = 0; k < shuttleMarkerArray.length; k++)
    {
        if(e.target._leaflet_id == shuttleMarkerArray[k].name)                 // find the marker in array to update
        {                       
            (shuttleMarkerArray[k].marker).openPopup();
            mapInstance.eachLayer(function (layer) {
                if(layer._leaflet_id == shuttleMarkerArray[k].name)
                {
                    var vehicle_name = e.target._leaflet_id;
                    var thirdCharacter = vehicle_name.charAt(2);                   // check the third character of vehicle name
                    var popupColor;                                                // Update the background color of popup according as per the make of vehicle 
                    if(thirdCharacter == "E")
                        popupColor ="greenPopup";
                    else if(thirdCharacter == "N") 
                        popupColor ="bluePopup ";
                    else if(thirdCharacter == "K")   
                        popupColor ="blackPopup";
                    
                    // update speed status 
                    var speedColor;
                    var speedWeight;
                    var currentSpeed = shuttleMarkerArray[k].speed
                    if(currentSpeed < 18)                                              // if speed is less then 18, text should be black color with normal font weight
                    {
                        speedColor = '#4F4F4F';
                        speedWeight = "normal";
                    }
                    else if(currentSpeed > 18)                                         // if speed is greater then 18, text should be red color with normal font weight
                    {
                        speedColor = '#CA4040';
                        if(currentSpeed > 30)                                          // if speed is greater then 30, text should be red color with bold font weight
                            speedWeight ="bold";
                        else
                            speedWeight ="normal";
                    }
                    layer._popup.setContent("<div class="+popupColor+" id='vPopup'>"+
                                            "<p class='popupTitle'>" +shuttleMarkerArray[k].name+ "<img class='activeGreenPopup' src='images/status/active_green.svg'></p>"+
                                            "<span class='popupVersion'>VER:"+shuttleMarkerArray[k].version+"</span>"+
                                            "</div><br>"+
                                            "<div class='popupSpeedDiv'>"+
                                                "<span>Speed</span><br>"+
                                                "<span id='popup_speed' class='popupSpeed' style='color:"+speedColor+";font-weight:"+speedWeight+"'>"+currentSpeed+"</span><br>"+
                                                "<span class='popupSpeedUnit'>km/hr</span>"+
                                            "</div>"+
                                            "<div class='popupBatteryDiv'>"+
                                                "<span style='vertical-align:top'>Battery</span>"+
                                                "<div id='popupBattery' class='popup-battery' data-content="+shuttleMarkerArray[k].battery+'%'+"></div>"+
                                                "<div class='popupParent'></div>"+
                                            "</div>")
                    setPopupBattery(shuttleMarkerArray[k].battery);                // update popup battery value 
                    setPopupSpeed(shuttleMarkerArray[k].speed);                               // update popup speed value 
                }
            });
            break;
        }
    }
}

function vehicleStatus(color, status, statusBg, frontBG)
{
   // alert("driving status :"+status);
    // Driving button 
    document.getElementById("v_status1").innerHTML = status;
    
    document.getElementById("v_status1").style.background = statusBg;

    // front
    document.getElementById("v_front").style.background = frontBG;
}

// Show multiple vehicles on route (under development)
function shuttleOnRoute(mapInstance, reqCount, vehicleObj)
{
    var vLocationArray=[];
        getMethod("vehicles/", function(data){  
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;

        // create vehicle obj and store in array
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == 2){//&& vehicle.name =="SCE999") { 
                vLocationArray.push(vehicle); // array of vehicle ID
            }
        }
        showVehicleRipple(reqCount,mapInstance,vLocationArray);
    });
}

var daegu_interval;

// Daegu monitoring
function deguRoute(daegu_map) 
{
    if(interval != null)
        clearInterval(interval);
    var deguShuttleArray=[]; // stores info of each vehicle in object form on degu route
    document.getElementById("degu_button").backgroundColor = "#ffffff";
    document.getElementById("degu_button").color = "#185786";
    hide_div("graph1_div");
    hide_div("graph2_div");
    hide_div("countInfoDiv");
    hide_div("listItem");
    hide_div("offsite_window");
    show_div("webcam_div");
    show_div("degu_window");
    open_tab('degu_window',2);
    document.getElementById("distanceChart1").style.display = "inline-block";
    document.getElementById("passangerChart2").style.display = "inline-block";

    // clear hidden cameras 
    document.getElementById("hidden_cam1").style.background= "";
    document.getElementById("hidden_cam2").style.background= "";
    document.getElementById("webcam_div1").style.background= "#828282";
    document.getElementById("webcam_div2").style.background= "#828282";
    if(document.getElementById("pausePlayButton1").src= "images/cctv/play.svg")
        document.getElementById("pausePlayButton1").src= "images/cctv/pause.svg";
    if(document.getElementById("pausePlayButton2").src= "images/cctv/play.svg")
        document.getElementById("pausePlayButton2").src= "images/cctv/pause.svg";
 
    // daegu map center
    var map_center = [35.83731,128.68384];
     
    /* Check this --> map_function.js:717 Uncaught TypeError: Cannot read property 'style' of null*/
    var container = L.DomUtil.get('deguMap');
    if(container != null)
        container._leaflet_id = null;

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

    // get all vehicle Id's.
    getMethod("vehicles/", function (data) {
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;

        // create vehicle obj and store in array
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == 2){//&& vehicle.name =="SCE999") { 
                deguShuttleArray.push(vehicle.id); // array of vehicle ID 
                var vehicle = {
                    id:vehicle.id,
                    mid:vehicle.mid,
                    name: vehicle.name,
                    speed:vehicle.speed,
                    lat:vehicle.lat,
                    lon:vehicle.lon,
                    heading : vehicle.heading,
                    battery : vehicle.battery,
                    drive : vehicle.drive,
                    webcam1 : vehicle.webcam1,
                    webcam2 : vehicle.webcam2,
                }
                vehicleObj.push(vehicle);
              /*  if(vehicle.name =="SCN001")
                {
                    console.log("vehicle obj value :"+vehicle.speed);
                }*/
            }
        }
        
          //create list of vehicles in degu route
        vehicleObj = vehicleObj.sort((a, b) => (a.id > b.id) ? 1 : -1);

        // create select list of vehicle 
        createSelectList(vehicleObj);

        // update status of webcam  
        webcam('1', vehicleObj);
        webcam('2', vehicleObj);

        // show chart.js 
        showChartData(2);

        // Call update function every second
        daegu_interval = setInterval(function(){
            reqCount++;
            shuttleOnRoute(daegu_map, reqCount, vehicleObj);
            //console.log("daegu_interval is executing");
        }, 1000);
      
        deguShuttleArray = deguShuttleArray.sort();
        firstId = deguShuttleArray[0];
        vehicleInfo(daegu_map, firstId);
        changeVehicleInfo(firstId);
    });
    show_div("alertDiv");
    //alert("daegu_map undefined or not 5:"+daegu_map);
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
  
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function ETA(vehicleObj, daegu_map){
    console.log("vehicleObj :"+vehicleObj);
    //var vehicleLoc = L.latLng(vehicleObj[0].lat, vehicleObj[0].lon);
    //var vehicleLoc = L.latLng(35.83597,128.69015);
    var vehicleLoc = vehicleObj;
    var distance_V_to_A;
    var distance_V_to_B;
    var distance_V_to_C;
    var distance_V_to_D;

    /*var distance_V_to_A = getDistance(vehicleLoc, L.latLng(35.836308, 128.681547));
    var distance_V_to_B = getDistance(vehicleLoc, L.latLng(35.838673, 128.687892));
    var distance_V_to_C = getDistance(vehicleLoc, L.latLng(35.83459, 128.68652));
    var distance_V_to_D = getDistance(vehicleLoc, L.latLng(35.836308, 128.681547));*/

    // Route VtoA
   var waypointsVA = [
        vehicleObj, // vehicle location
        L.latLng(35.83459, 128.68652), //staD
        L.latLng(35.836308, 128.681547) //staA
    ];
    var controlA = L.Routing.control({
        waypoints: waypointsVA,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:true,
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#008000', weight: 0 }]},  
    }).addTo(daegu_map);
    L.Routing.errorControl(controlA).addTo(daegu_map);
    controlA.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        // alert distance and time in km and minutes
        distance_V_to_A = summary.totalDistance ;
        console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
     });

    // Route VtoB
    var waypointsVB = [
        vehicleObj, // vehicle location
        L.latLng(35.836308, 128.681547), //staA
        L.latLng(35.838673, 128.687892), //staB
    ];
    var controlB = L.Routing.control({
        waypoints: waypointsVB,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:true,
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#0000FF', weight: 0 }]},  
    }).addTo(daegu_map);
    L.Routing.errorControl(controlB).addTo(daegu_map);
    controlB.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        distance_V_to_B = summary.totalDistance;
        // alert distance and time in km and minutes
        console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
     });


    // Route VtoC
    var waypointsVC = [
        vehicleObj, // vehicle location
        L.latLng(35.838673, 128.687892), //staB
        L.latLng(35.83705, 128.690044),  // staC
    ];
    var controlC = L.Routing.control({
        waypoints: waypointsVC,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:true,
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#00FF00', weight: 0 }]},  
    }).addTo(daegu_map);
    L.Routing.errorControl(controlC).addTo(daegu_map);
    controlC.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        distance_V_to_C = summary.totalDistance;
        // alert distance and time in km and minutes
        console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
     });

    // Route VtoD
    var waypointsVD = [
        vehicleObj, // vehicle location
        L.latLng(35.83705, 128.690044),  // staC
        L.latLng(35.83459, 128.68652), //staD
    ];
    var controlD = L.Routing.control({
        waypoints: waypointsVD,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:true,
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#FF0000', weight: 0 }]},  
    }).addTo(daegu_map);
    L.Routing.errorControl(controlD).addTo(daegu_map);
    controlD.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        distance_V_to_D = summary.totalDistance;
        // alert distance and time in km and minutes
        console.log('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
     });

    // create list of objects from with station name and distance between vehicle to each station on route
    const distanceList = [
        { station: 'A', distance: distance_V_to_A },
        { station: 'B', distance: distance_V_to_B },
        { station: 'C', distance: distance_V_to_C },
        { station: 'D', distance: distance_V_to_D },
      ];
    
    // sort the list of objects to find the smallest distance.   
    distanceList.sort((a, b) => (a.distance > b.distance) ? 1 : -1);

    var firstsmallest = distanceList[0].station; // first smallest distance
    var secondsmallest = distanceList[1].station; // second smallest distance

    console.log("firstsmallest :"+firstsmallest);
    console.log("secondsmallest: "+secondsmallest);

    // distance between garage to vehicle 
    var distanceGtoA = getDistance(vehicleLoc, L.latLng(35.835155, 128.682617)); //garage location

    // check if vehicle is parked
   /* if(distanceGtoA <= 0.2 || distance_V_to_A <= 0.2 ) //distanceList[0].distance == distanceList[1].distance ||
    //min if XX = true 
    {
        // reset all the stations - this a start of route
        var stationAArrived = false;
        var stationBArrived = false;
        var stationCArrived = false;
        var stationDArrived = false;
    }
    //min if XX = 

    // Check the next visiting station by the sequence

    console.log("1 #### firstsmallest:"+firstsmallest+ " secondsmallest:"+secondsmallest);
    if(firstsmallest=='A' && secondsmallest =='B') // chect all stations withh alll stations
        firstsmallest = 'B'
    else if (firstsmallest=='B' && secondsmallest =='C')   
        firstsmallest = 'C'
    else if (firstsmallest=='C' && secondsmallest =='D')   
        firstsmallest = 'D'
    else if (firstsmallest=='D' && secondsmallest =='A')   
        firstsmallest = 'A'

    console.log("2 ^^^^^^firstsmallest:"+firstsmallest);
  
    // check if station is already covered by vehicle or not, if covered next station 
   if(firstsmallest == 'A' && stationAArrived == true)
        firstsmallest = 'B';
    else if(firstsmallest == 'B' && stationBArrived == true)
        firstsmallest ='C';
    else if(firstsmallest == 'C' && stationCArrived == true)
        firstsmallest ='D';
    else if(firstsmallest == 'D' && stationDArrived == true)
        firstsmallest ='A';

    console.log("3 ^^^^^^firstsmallest:"+firstsmallest);*/
    // Latitute and longitude of all stations
    var LocC = L.latLng(35.83705, 128.690044); //staC
    var LocD = L.latLng(35.83459, 128.68652); //staD
    var LocA = L.latLng(35.836308, 128.681547); //staA
    var LocB = L.latLng(35.838673, 128.687892); //staB

    // static distance between each station
    var distanceAtoB = 0.72;
    var distanceBtoC = 0.42;
    var distanceCtoD = 0.68;
    var distanceDtoA = 0.68;
    
    // Intialize ETA variable for all stations
    var distancetoA = 0;
    var distancetoB = 0;
    var distancetoC = 0;
    var distancetoD = 0;

    // calculate distance
    if(firstsmallest == 'A')
    {
        console.log("Going to station A");
        // this means vehicle is going from station D to A
        // calculate distance between vtoA and vtoD stations
        var vtoA =  getDistance(vehicleLoc, L.latLng(35.836308, 128.681547));
        var vtoD =  getDistance(vehicleLoc, L.latLng(35.83459, 128.68652));
        distancetoA = vtoA;
        distancetoB = vtoA + distanceAtoB;
        distancetoC = vtoA + distanceAtoB + distanceBtoC;
        distancetoD = vtoA + distanceAtoB + distanceBtoC + distanceCtoD;

        if(vtoA <= 0.2)
            stationAArrived == true;
            //min set a some value XX
    }
    else if(firstsmallest == 'B')
    {
        console.log("Going to station B");
        // this means vehicle is going from station A to B
        // calculate distance between vtoB and vtoA stations
        var vtoB =  getDistance(vehicleLoc, L.latLng(35.838673, 128.687892));
        var vtoA =  getDistance(vehicleLoc, L.latLng(35.836308, 128.681547));
        distancetoA = vtoB+ distanceBtoC + distanceCtoD + distanceDtoA;
        distancetoB = vtoB; 
        distancetoC = vtoB + distanceBtoC;
        distancetoD = vtoB + distanceBtoC + distanceCtoD;
        if(vtoB <= 0.2)
            stationBArrived == true;
    }
    else if(firstsmallest == 'C')
    {
        console.log("Going to station C");
        // this means vehicle is going from station B to C
        var station = "stationC";
        // calculate distance between vtoC and vtoB stations
        var vtoC =  getDistance(vehicleLoc, L.latLng(35.83705, 128.690044));
        var vtoB =  getDistance(vehicleLoc, L.latLng(35.838673, 128.687892));
    
        distancetoA = vtoC+ distanceCtoD + distanceDtoA;
        distancetoB = vtoC+ distanceCtoD + distanceDtoA + distanceAtoB; 
        distancetoC = vtoC;
        distancetoD = vtoC + distanceCtoD;

        if(vtoC <= 0.2)
            stationCArrived == true;
    }
    else
    {
        console.log("Going to station D");
        // this means vehicle is going from station C to D
        var station = "stationD";
        // calculate distance between vtoC and vtoD stations
        var vtoD =  getDistance(vehicleLoc, L.latLng(35.83459, 128.68652));
        var vtoC =  getDistance(vehicleLoc, L.latLng(35.83705, 128.690044));
        distancetoA = vtoD + distanceDtoA;
        distancetoB = vtoD+ distanceDtoA + distanceAtoB; 
        distancetoC = vtoD+ distanceDtoA + distanceAtoB + distanceBtoC; 
        distancetoD = vtoD;

        if(vtoD <= 0.2)
            stationDArrived == true;
    }

    /* for testing */
    console.log("distanceA: "+distance_V_to_A);
    console.log("distanceB: "+distance_V_to_B);
    console.log("distanceC: "+distance_V_to_C);
    console.log("distanceD: "+distance_V_to_D);

    console.log("timeA:"+(distance_V_to_A/15)+ " distanceA: "+distancetoA);
    console.log("timeB:"+(distance_V_to_B/15)+ " distanceB: "+distancetoB);
    console.log("timeC:"+(distance_V_to_C/15)+ " distanceC: "+distancetoC);
    console.log("timeD:"+(distance_V_to_D/15)+ " distanceD: "+distancetoD);
}

/* show chart with todays distance passenger count */
function showChartData(siteId){
    var nameList = [];
    var distanceList = [];
    var passengerList = [];
    var colorList = [];
    var api_url = "http://115.93.143.2:9103/api/oplogs/by-date/";

    // get todays date 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+dd;
    
    // send today's date via post method
    var data = JSON.stringify({
        "date": "2020-04-06"   // today
    });

    postMethod(data, api_url, function (req) {
        if(req.status == 200){  
            var summary = JSON.parse(req.response);
            var count = Object.keys(summary).length;
            for(var i=0; i<summary.length; i++)
            {                
                if(summary[i].site.id == siteId)
                {
                    var totalDistance = summary[i].log.distance;
                    var totalPassenger = summary[i].log.passenger;
                    var vehicleName = summary[i].site.mid;

                    distanceList.push(totalDistance);
                    passengerList.push(totalPassenger);
                    nameList.push(vehicleName);
         
                    // check this again
                    if((JSON.stringify(summary[i].log.distance).substring(0, 3)) == "SCN")
                        colorList.push('#0082C8');
                    else
                        colorList.push('#67BBB1');
                }    
            }
           // alert("passengerList :"+passengerList);
          //  todayChart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, nameList);
            highchart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, distanceList, 'km');
            highchart('todayPassenger', '총 탑승자 수', colorList, 'Passenger', nameList, passengerList, '명');
         //   todayChart('todayPassenger', '총 탑승자 수', colorList, 'Passenger', nameList, passengerList);
        } else if (req.status == 401)
            alert("Authentication credentials were not provided");
        else if (req.status == 404)
            alert("User record not found");
        console.log("chart data status: " +req.status);
    });
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
  
    var after = (100 - percent) +"%";    
    var battery = document.querySelectorAll('.inverted-bar3')[0];
   
    // updates side window battery status
    battery.style.setProperty("--afterWidth3", percent+'%');
    if (percent <= 30) 
    {  
        battery.style.setProperty("--afterbgColor3", "#CA4040");
        battery.style.setProperty("--afterColor", "#CA4040");
    }
    else 
    {
        battery.style.setProperty("--afterbgColor3", "#57AE66");
        battery.style.setProperty("--afterColor", "#57AE66");
        if(percent == 100)
            battery.style.setProperty("--fontSize", "10px");
        else
            battery.style.setProperty("--fontSize", "12px");
    }
}

function setPopupBattery(percent)
{
    if (percent == null)
    percent = 0;

    $("#popupBattery").attr('data-content', percent+'%');
    var popupBattery = document.querySelectorAll('.popup-battery')[0];

    //  updates popup battery status
    if(popupBattery!= undefined)
    {
        popupBattery.style.setProperty("--afterWidth2", (percent+1)+'%');
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

/*
var prevMarker; // retains value of previous marker
function showVehicle(request_count, mapInstance, vehicleObj)
{
    var popupMarker;
    var iconUrl = "images/route/shuttleIcon.svg";  
    var vehicleIcon = L.icon({
        iconSize: [37, 52],
        popupAnchor: [10, -25],
        iconAnchor: [26, 45], //20,40
        iconUrl: iconUrl,
    });

    if(request_count <= 1)
    {        
        // Create vehicle marker 
        var vehicleMarker = L.marker([vehicleObj.lat, vehicleObj.lon], {
            draggable: false,
            icon: vehicleIcon,
        });

        // not in use currently
        //vehicleMarker._leaflet_id = vehicleObj.id; 
        if(vehicleObj.speed > 0) 
            vehicleMarker.options.rotationAngle = vehicleObj.heading;
              
        // update speed status 
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
        
        // create html and append to popup div
        var customPopup = "<div class='popup' id='vPopup'>"+
                            "<p class='popupTitle'>" +vehicleObj.name+ "<img class='activeGreenPopup' src='images/status/active_green.svg'></p>"+
                            "<span class='popupVersion'>VER:"+vehicleObj.model.firmware+"</span>"+
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
        vehicleMarker.on('click', function(e) {identifyMake(vehicleObj.name);});
        vehicleMarker.addTo(mapInstance);
        prevMarker = vehicleMarker;
        popupMarker = vehicleMarker;
    } 
    else 
    {
        // update location of old marker 
        var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
        prevMarker.setLatLng(newLatLng);
        
        if(vehicleObj.speed > 0) 
            prevMarker.options.rotationAngle = vehicleObj.heading;
 
        prevMarker.addTo(mapInstance);
        popupMarker = prevMarker;
        //setPopupSpeed(vehicleObj.speed, vehicleObj.name);

      
        for(var i = 0; i <vMarkerArray.length;i++ )
        {
               if(vehicleObj.id == vMarkerArray[i].markId)
               {
            //   alert("id:"+vehicleObj.id+" marker id:"+vMarkerArray[i].id);
                  var newLatLng = new L.LatLng(vehicleObj[j].lat, vehicleObj[j].lon);
                  vMarkerArray[i].marker.setLatLng(newLatLng);
                  console.log("!!!!!!!!!!i:"+i);
                }
            
        }
    
    }

    // open vehicle popup onclick to show shuttle battery and speed info.
    var popup_battery = document.getElementById("popup_battery");
    if (popup_battery != null)
        popup_battery.innerText = vehicleObj.battery;

    popupMarker.on('onClick', function(){
        var popupDiv = document.getElementById("batteryPercent1") ;
        if(popupDiv != null)
        {
            popupDiv.style.width = "60%";
            popupDiv.style.color = "green";
        }
    });
}
*/
// function not in use currently
function setPopupSpeed(speed)
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

// REST api get method function
function getMethod(api_name, callback) {
    var username = localStorage.getItem("userId");
    var password = localStorage.getItem("userPwd"); 
    var base64Credentials = "Basic " + btoa(username + ":" + password);
    var request = new XMLHttpRequest();
    var base_url = "http://115.93.143.2:9103/api/";

    // get and return data 
    request.open('GET', base_url + api_name, true);
    request.onload = function (e) {
        if (request.status == 200) {
            callback(request.response);
        } else if (request.status == 401)
            alert("Authentication credentials were not provided");
        else if (request.status == 403)
            alert("Unauthorized access to accounts")
        console.log("GET data status: " + request.status);
    };
    request.onerror = function (status) {
        console.log("GET data error (GET).");
    };
    request.setRequestHeader("Authorization", base64Credentials);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    request.send();
}


// updates offsite count div
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

// show station, garage, datahub and kiosk on route
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
                    var stationTitle = iconData[i].name;
                    var kiosk_title = iconData[i].mid;
                    var stationLat = iconData[i].lat;
                    var stationLon = iconData[i].lon;
                    stationTitleArray.push(stationTitle); // array for station title
                                
                    // check if kiosk for the station is available in kiosk api
                    var kioskTitle = "KIS" +kiosk_title.substring(3);
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
                    showMarker(mapInstance, "images/" + icon_path, iconData[i].name, 'false', iconData[i].lat, iconData[i].lon);
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

// create route using control routing plugin leaflet 
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

// creates map with given mapcenter and zoom level
function createMap(map_center, zoom, mapInstance, mapId) {
    /*if (mapInstance != undefined || mapInstance != null) 
    {
        mapInstance.off();
        mapInstance.remove();
        $("#deguMap").html("");
        var container = L.DomUtil.get('deguMap');
        if(container != null){
            container._leaflet_id = null;
        }
        
        //mapInstance = undefined;
        //document.getElementById('deguMap').innerHTML = "";
    }*/
   // alert("should be undefined:"+mapInstance);
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
    var gunsan_map = createMap(map_center, 16, gunsan_map, 'gunsanMap');
    showRouteInfo(gunsan_map, "stations/", "route/station_kiosk.svg", 1);
    showRouteInfo(gunsan_map, "garages/", "garage_daegu.svg", 1);
    gunsan_map.invalidateSize();
}

function sangamRoute() {
    hide_div("graph1_div");
    hide_div("graph2_div");
    
    /* Check this --> map_function.js:717 Uncaught TypeError: Cannot read property 'style' of null*/
    var map_center = [37.579333, 126.889036];
    var sangam_map = createMap(map_center, 16, sangam_map,'sangamMap');
   
    // show stations, kiosk, garage on degu route.
    showRouteInfo(sangam_map, "stations/", "route/station_kiosk.svg", 4);
    showRouteInfo(sangam_map, "garages/", "route/garageIcon.svg", 4);
    showDataCenter(sangam_map, 4);

    // show V2X on Degu route
    show_v2x(sangam_map, "v2x/");
    sangam_map.invalidateSize();
}

function sejongRoute() {
    //daegu_interval.clearInterval();
    clearInterval(daegu_interval);
    clearInterval(interval);

    hide_div("graph1_div");
    hide_div("graph2_div");
    open_tab('degu_window',3);

    // clear hidden cameras 
    document.getElementById("hidden_cam1").style.background= "";
    document.getElementById("hidden_cam2").style.background= "";
    document.getElementById("webcam_div1").style.background= "#828282";
    document.getElementById("webcam_div2").style.background= "#828282";
    if(document.getElementById("pausePlayButton1").src= "images/cctv/play.svg")
        document.getElementById("pausePlayButton1").src= "images/cctv/pause.svg";
    if(document.getElementById("pausePlayButton2").src= "images/cctv/play.svg")
        document.getElementById("pausePlayButton2").src= "images/cctv/pause.svg";
    
    playPause("webcam_div1", 'pausePlayButton1');
    playPause("webcam_div2", 'pausePlayButton1');
 
    // update status of webcam  
    show_div("webcam_div");
    document.getElementById('webcam_div1').style.display = "inline-block";
    document.getElementById('webcam_div2').style.display = "inline-block";
    
    //webcam('1', null);
    //webcam('2', null);
    var sejongShuttleArray=[];
    var vehicleObj=[];
    // Reset vehicle information 
    /*var select = document.getElementById("vehicleSelect");
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }*/

    /*document.getElementById('speed_v1').innerHTML=0;
    document.getElementById('heading_v1').innerHTML=0;
    document.getElementById('passengerCount').innerHTML=0;
    document.getElementById('v_status1').innerHTML='STOPPED';
    document.getElementById('vehicleVersion').innerHTML='version : 0.0.0';
    document.getElementById('vehicleID').innerHTML='No Shuttle';
    
    setBatteryPercent(0); */
  
    //document.getElementById('speed_v1').innerHTML=0;
    var map_center = [36.499951, 127.270606];

    var container = L.DomUtil.get('sejongMap');
    if(container != null)
      container._leaflet_id = null;

    var sejong_map = createMap(map_center, 18, sejong_map,'sejongMap');
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

    // get all vehicle Id's of route 3 (Sejong).
    getMethod("vehicles/", function (data) {
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;

        //alert("count :"+count+" Sejong vehicles: "+vehicle_data );
        // create vehicle obj and store in array
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == 3){             
                sejongShuttleArray.push(vehicle.id); // array of vehicle ID 
                var vehicle = {
                    id:vehicle.id,
                    mid:vehicle.mid,
                    name: vehicle.name,
                    speed:vehicle.speed,
                    lat:vehicle.lat,
                    lon:vehicle.lon,
                    heading : vehicle.heading,
                    battery : vehicle.battery,
                    drive : vehicle.drive,
                    webcam1 : vehicle.webcam1,
                    webcam2 : vehicle.webcam2,
                }
                vehicleObj.push(vehicle);
           }
        }
        //create list of vehicles in degu route
        vehicleObj = vehicleObj.sort((a, b) => (a.id > b.id) ? 1 : -1);

        // create select list of vehicle 
        createSelectList(vehicleObj);

        // update status of webcam  
        webcam('1', vehicleObj);
        webcam('2', vehicleObj);

        firstId = sejongShuttleArray[0];
        vehicleInfo(sejong_map, firstId);
        //changeVehicleInfo(firstId);
    });
}

function showMarkerIcon(iconUrl, title, lat, long, map) 
{
    // define icon
    var icon = L.icon({
        iconSize: [10, 14.75],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: iconUrl,
    });

    // create marker
    var marker = L.marker([lat, long], {
        draggable: false, // Make the icon dragable
        icon: icon
    });

    // assign marker events
    var kiosk_title = title.substring(3);
    kiosk_title = "KSK" + kiosk_title;
    marker.on('mouseover', function (ev) {
        ev.target.openPopup();
    })

    // add marker to map
    marker.addTo(map);
    const customPopup = "<ul><li>" + title + "</li><li>" + kiosk_title + "</li><ul>";
    const customOptions = { 'className': 'custom-popup', autoPan: false, autoClose: false }
    marker.bindPopup(customPopup, customOptions).openPopup();
    map.invalidateSize();
}

// switch betwwen site window and offsite window
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

// update vehicle status by updating the color of bullet
function changeBulletColor(element, operation_status) {
    if (operation_status == false)
        element.style.color = 'red';
    else
        element.style.color = '#3DD118';
}

// Note - functn not used in version 0.2
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
                var li_content = "<p class='station_p1'>" +kiosk_data[i].name+ "&nbsp;&nbsp;:&nbsp;&nbsp;</p><p class='station_p2'>" +lat+ ",&nbsp;" +lon+ " </p>";
                li.innerHTML = li_content;
                ul.appendChild(li);
                changeBulletColor(li, kiosk_data[i].operation);
            }
        }
    });
}

// get and update the status of vehicle
function vehicle_info(vehicle_id) {
    var api_name = "vehicles/";
    getMethod(api_name, function (vehicles_data) {
        var vehicle_data = JSON.parse(vehicles_data).results;
        for (var i = 0; i < 4; i++) {
            if (vehicle_data[i].name == vehicle_id) {
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
                // setBatteryPercent(battery_percent);
            }
        }
    });
}

// update site(title, summary) info
function siteSummary(divId)
{
    var dom = document.getElementById(divId);
 
    if (dom.style.display == "block" || dom.style.display == null || dom.style.display == '')
    {
        dom.style.display = "none";
        document.getElementById("hideP").innerHTML = "더보기";
        document.getElementById("arrowImg").src="images/openArrow.svg"
    }
    else
    {
        dom.style.display = "block";
        document.getElementById("hideP").innerHTML ="숨기기";
        document.getElementById("arrowImg").src="images/closeArrow.svg";
    }
}

function setSiteInfo(site_id){
    if (site_id == 0)
        return false;

    var api_url = "sites/" + site_id + "/";
    getMethod(api_url, function (sites_data) {
        var site_data = JSON.parse(sites_data);
        var site_title = site_data.summary.indexOf('\r');
        var site_title_slice = site_data.summary;//.substring(0, site_title);
        var summary_start = site_data.summary.indexOf('<b>');
        var remaining_summary = site_data.summary2.substring(summary_start);
        document.getElementById("site_name").innerHTML = site_data.name;
        document.getElementById('site_title').innerHTML = site_title_slice;
        document.getElementById("site_summary").innerHTML = remaining_summary;
        manager_list(site_data.user);
    });
}

// plot data hub and datacenter on route
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
                // show lat long of data hub/center on mouseover
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

// plot v2x on route
function show_v2x(mapInstance, api_name){
    var icon_html;
    if (api_name == "v2x/") 
    {
        icon_html = '<div class="v2x_ripple v2x_icon">'+
                        '<div class="v2x_inner"></div>'+
                        '<div class="v2x_ring1"></div>'+
                    '</div>';
    } 
    else 
    {
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

function manager_list(site_manager_array) 
{
    // add managers to select list, 
    var select = document.getElementById("manager_selectlist");
    select.options.length = 0;
     
    // This is temporary becasue of sejong 
    if(site_manager_array == undefined || site_manager_array == null)
       return false;
     
    for (var i = 0; i < site_manager_array.length; i++) {
        var api_url = "users/" + site_manager_array[i] + "/";
        getMethod(api_url, function (site_manager_data) {
            //alert("site_manager_data :"+site_manager_data);
            var site_manager_data = JSON.parse(site_manager_data);
            var option = document.createElement('option');
            option.text = site_manager_data.username;
            option.value = site_manager_data.email;
            select.add(option, i + 1);
        });
    }
}

function msg_modal() {
    show_div('messageModal');
    selectSite('all', "0","0");
}

// updates notice
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
   // alert(stationTitle);

    // get first 3 characters of string 
    var title = stationTitle.substring(0, 3);
    if(title == "GAR")
    {
        kioskIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="garageMarkerLable">' +stationTitle+ '</span>',
           });
    } 
    else if(kioskTitle == 'false') 
    {
        kioskIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="markerLable">' +stationTitle+ '</span>'});
    } 
    else
    {
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

function highchart(graph1, title, color, yAxisLable, vehicleList, yAxisList, y_unit) {
   // vehicleList.push('');
    //vehicleList.push('');
    //vehicleList.push('');
    for (var i = vehicleList.length; i < 4; i++) {
        vehicleList.push("");
      }

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
                    text: 'Distance (km)',
                    position: "left",
                    rotation: 90
                }
            },

            // Configuration options go here
            options: {
                plugins: {
                    datalabels: {
                      anchor: 'end',
                      align: 'top',
                      formatter: Math.round,
                      font: {
                        weight: 'bold',
                        size: '0'
                      }
                    }
                  },
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
                        barThickness: 15,
                        categoryPercentage: 0,
                        barPercentage: 0,
                        gridLines: {
                            display: false,
                            drawBorder : false,
                        },
                        ticks: {
                            fontSize: 8,
                            fontFamily: "Roboto",
                            fontStyle: "bold",
                            scaleStepWidth : 30,
                        },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: false,
                            labelString:y_unit,
                        },
                        gridLines: {
                            display: true,
                            drawBorder : false,
                        },
                        ticks: {
                            fontSize: 8,
                            fontFamily: "Roboto",
                            fontStyle: "bold",
                            beginAtZero: true,
                            // stepSize: 300,
                        }
                    }]
                }
            }
        });
    }
}

function playPause(webcam_div, pausePlayButton)
{    
    // Event listener for the play/pause button
    var pausePlayButtons = document.getElementById(pausePlayButton);
    var fifthChar = pausePlayButtons.src.substring((pausePlayButtons.src).length - 5);

    if(fifthChar == "y.svg")
    {
        // Update the button text to 'Pause'
        pausePlayButtons.src = "images/cctv/pause.svg"; 
        document.getElementById(webcam_div).style.background = "";
        document.getElementById(webcam_div).style.backgroundColor = "#828282";
        document.getElementById(webcam_div).style.backgroundSize="contain";
    } 
    else 
    {  
        // Update the button text to 'Play'
        pausePlayButtons.src = "images/cctv/play.svg"; 
        if(webcam_div == "webcam_div1")
            document.getElementById(webcam_div).style.background = document.getElementById("hidden_cam1").style.background;
        else if(webcam_div == "webcam_div2")
            document.getElementById(webcam_div).style.background = document.getElementById("hidden_cam2").style.background ;
        document.getElementById(webcam_div).style.backgroundSize="contain";
    }
}


function webcam(webcamId, vehicle) {
  
    show_div('webcam_div');

    // close div with off camer=a button
    if(vehicle[0].webcam1 != null)
       document.getElementById("offCameraDiv1").style.display = "none";

    if(vehicle[0].webcam2 != null)
        document.getElementById("offCameraDiv2").style.display = "none";
    
    // open div with play camera and fullscreen icon
    document.getElementById("playButtonDiv1").style.display = "block";
    document.getElementById("playButtonDiv2").style.display = "block";

    var button_id = "cameraButton" + webcamId;

    //If vehicle data is not available 
    // if(vehicle == null)
    //    return false;
   
    //alert("webcamId :"+webcamId);
    if (webcamId == '1') 
    {
        if(vehicle != null)
            var vehicleObj = vehicle[0];
        if(vehicleObj != null)
            var webcam1 = vehicleObj.webcam1;
          
        if (webcam1 != null) {
            document.getElementById("webcam_div1").style.display = "inline-block";
            document.getElementById("hidden_cam1").style.background = 'url('+webcam1+')'; 
        }
    }
    if (webcamId == '2') {
        if(vehicle != null)
            var vehicleObj = vehicle[0];
        document.getElementById("cameraButton2").src = "images/cctv/video2Active.svg";
        if(vehicleObj != null)
            var webcam2 = vehicleObj.webcam2;
        if (webcam2 != null) {
            document.getElementById("webcam_div2").style.display = "inline-block";
            document.getElementById("hidden_cam2").style.background = 'url('+webcam2+')';
        }
    }           
}

// under- development
function scale_image(hidden_cam) {
    document.getElementById("myModal").style.display = "block";
    var div_url = document.getElementById(hidden_cam).style.background;
    document.getElementById("img01").style.backgroundImage = div_url;
}

function setByte(str) {
    document.getElementById("msg_byte").innerText = "/200 bytes";
}

function selectSite(select, site_no, managerName) {
    var selectValue;
    var managerSelect = document.getElementById('select_siteManager');
   
    if(select == 'all')
        selectValue = 0;
    else
        selectValue = select[select.selectedIndex].id;

    if(selectValue == null || selectValue == undefined) 
    {
        managerSelect.innerText = null;
        alert("No managers are available");
    } 
    else if(selectValue == "0") {
        // assign all managers to the option list from site api. 
        var api3 = "users/";
        getMethod(api3, function (managersData) {
            var managerInfo = JSON.parse(managersData).results;
            var managerCount = Object.keys(managerInfo).length;
            for (var i = 0; i < managerCount; i++)
                createOption(managerSelect, managerInfo[i].username, managerInfo[i].email, managerInfo[i].photo,site_no, managerName);
        });
    } 
    else
    {
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

function change_info(name, src_a, src_b) {
    var img = eval('document.' + name);
    var info_content = document.getElementById('info_content');
    if(img.length == 0) return;
    if (img.src.indexOf(src_a) >= 0) {
        img.src = src_b;
        info_content.style.display = 'none';
        return;
    }
    if (img.src.indexOf(src_b) >= 0) {
        img.src = src_a;
        info_content.style.display = 'block';
        return;
    }
    return;
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
            option.selected = true;
    }
    selectDom.appendChild(option);
}

// test function
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

// updates user account setting
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
        var res = JSON.parse(req.response);
        var pwdErrorDom = document.getElementById("pwdResetError");
        if(req.status == 200)
        {  
            if (res.detail == "New password has been saved.")
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
            if(res.detail == "This password is too short. It must contain at least 8 characters." )
                pwdErrorDom.innerHTML = "8글자 이상의 비밀번호를 입력하세요.";
            else if(res.new_password1 == "This field may not be blank.")
                pwdErrorDom.innerHTML = "new password 1 is blank.";
            else if(res.new_password2 == "This field may not be blank.")
                pwdErrorDom.innerHTML = "new password 2 is blank.";
            else if(res.detail == "Invalid username/password.")    
                pwdErrorDom.innerHTML ="Invalid";
            else if (res.detail == "The two password fields didn't match.")
                pwdErrorDom.innerHTML = "두 개의 비밀번호가 일치하지 않습니다.";
            else if (res.detail == "This password is too common.")
                pwdErrorDom.innerHTML = "평범하지 않은 비밀번호를 입력하세요.";
            else if (res.detail == "This password is entirely numeric.")
                pwdErrorDom.innerHTML = "비밀번호에 숫자 외의 문자를 포함하세요.";
            else if (res.detail == "The password is too similar to the email address.")
                pwdErrorDom.innerHTML = "비밀번호가 이메일ID와 너무 유사합니다.";
            else if (res.detail == "The password is too similar to the username.")
                pwdErrorDom.innerHTML = "비밀번호가 사용자 이름과 너무 유사합니다.";
            else
                pwdErrorDom.innerHTML = "Re-enter passwords.";
        }
    });
    return true;
}

// download odd file on button click
function oddFileDownload(){
    var dom = document.getElementById("vehicleSelect");
    var selectedId = dom.options[dom.selectedIndex].id;
    getMethod("vehicles/"+selectedId+"/", function (data) {
        var vehicle = JSON.parse(data);
        var filePath = vehicle.odd; 
        if(filePath == null)
        {
            alert("Odd file is not available");
            return false;
        }
        var oddDom = document.getElementById("oddFile");
        oddDom.href=filePath;
        document.body.appendChild(oddDom);
        oddDom.click();
    });
}

//webSocket();
function webSocket()
{
    // Create WebSocket connection.
    const socket = new WebSocket('ws://115.93.143.2:9103/ws/vehicle/');

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

/*
var socket = io('ws://115.93.143.2:9103', {transports: ['websocket']});
socket.on('connect', function () {
  console.log('connected!');
  socket.emit('greet', { message: 'Hello Mr.Server!' });
});

socket.on('respond', function (data) {
  console.log(data);
});*/
    
}