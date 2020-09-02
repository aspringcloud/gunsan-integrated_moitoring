/*Integrated Monitoring system version 0.2
  Note : Some function from version 0.1 which 
  are not used in version 0.2  are commented  */

// Checks which route button is clicked and 
// Calls the function associated for that route 
'use strict';

var mapList = [];               // stores the id of open map 
mapList.push("offsiteMap");          //  push id of offsite map on login  

// variables to store instances of all maps
var daegu_map;
var sejong_map;
var sangam_map;
var sejong_map2;
var gunsan_map;
var cluster_map ;

// stores the click count for each site
var deguClickCount = 0;
var sejong1ClickCount = 0;
var sejong2ClickCount = 0;
var gunsanClickCount = 0;
var sangamClickCount = 0;
var clusterMapCount = 0;

// zoom status of cluster map
var zoomHome_main;

// Active site id 
var active_site=0; 

function activeButton(element)
{   var buttonList = ["main_site_button",  "gunsan_button"]; // "degu_button", "sejong_button", "sangam_button", "sejong_button1", "sejong_button2",, "offsite_button"
    for(var i = 0; i < buttonList.length; i++)
    {
        if(buttonList[i] == element.id)
        {
            if(element.id == "sejong_button1" || element.id == "sejong_button2")
            {
                document.getElementById('sejong_button').style.backgroundColor = "#ffffff";
                document.getElementById('sejong_button').style.color = "#185786";
            }
            else
            {
                element.style.backgroundColor = "#ffffff";
                element.style.color = "#185786";
            }
        }
        else
        {                           
            document.getElementById(buttonList[i]).style.backgroundColor = "#0893BF";
            document.getElementById(buttonList[i]).style.color = "#ffffff";
        }
    }
}

var eta_interval;
function switchMap(obj)
{   
    if(obj.id == "sejong_button" )
    {   
        var show_elements = ["subMenuModal","sejongSubmenu"];
        showElements(show_elements);
    }
    else
    {
        if(eta_interval != null)
            clearInterval(eta_interval);
        activeButton(obj);
        if(obj.id == "degu_button")
        {  
            deguClickCount++;
            for(var i = 0 ; i < mapList.length; i++)
                hide_div(mapList[i]);

            mapList.push("deguMap");
            document.getElementById('webcam_div1').style.display = "inline-block";
            document.getElementById('webcam_div2').style.display = "inline-block";
            hideMaps('deguMap');
            if(daegu_map == undefined)
            {               
                daegu_map = L.map('deguMap',{
                    center:[35.83731,128.68384],
                    zoom : 16,
                    zoomControl: false,
                });
            }
            showSite(daegu_map, 2, deguClickCount); 
            show_div("alertDiv");
            document.getElementById('currentSiteId').innerHTML="2";
        }
        else if(obj.id == "main_site_button")
        {   
            document.getElementById('screenToggleDiv').style.left = "160px";
            document.getElementById('fullscreen_title').style.left = "160px";

            clusterMapCount++;
            var elementsToHide = ["offsite_window", "webcam_div", "webcam_div1", "webcam_div2", "infoChart", "distanceChart1", "passangerChart2"];
            hideElements(elementsToHide);
            hideMaps('offsiteMap');
            hide_div('eta_div');
            $('.leaflet-top, .leaflet-bottom ').css("left" , "1810px");
            var show_elements2 = ["graph_div", "countInfoDiv"];         
            showElements(show_elements2);
            
            // create offsite map
            var leftCenter =[35.8191,126.4332];// [35.8118970000000000,126.4048860000000000];//[35.951,133.066];
            if(cluster_map == undefined)
            {            
                cluster_map = L.map('offsiteMap', {
                    zoomSnap: 0.15,      
                    dragging: true,
                    draggable:true,
                    scrollWheelZoom: true,
                    color: "rgba(8, 148, 19)",
                    zoomControl: false,
                    zoom:15,
                    center:leftCenter
                });
                zoomHome_main = L.Control.zoomHome();
                zoomHome_main.addTo(cluster_map);   
                L.control.scale().addTo(cluster_map);
            }
            else
            {
                cluster_map.panTo(leftCenter);
                cluster_map.setView(leftCenter);
                zoomHome_main.setHomeCoordinates([35.8191,126.4332], 15);
            }
            showCluster(cluster_map);
            cluster_map.invalidateSize();
            cluster_map.resize;
            document.getElementById('currentSiteId').innerHTML="0";
        }
        else if(obj.id == "sejong_button1")
        {       
            sejong1ClickCount++;
            for(var i = 0; i < mapList.length; i++)
                hide_div(mapList[i]);
            mapList.push("sejongMap");
            hideMaps('sejongMap'); 
            if(sejong_map == undefined)
            {
                sejong_map = L.map('sejongMap',{
                    zoom : 17,
                    center:[36.50047,127.27109],
                    zoomControl: false,
                });
            }

            if(daegu_interval != null)
                clearInterval(daegu_interval);

            showElements(["sejongSubmenu", "alertDiv"]);
            hide_div('countInfoDiv');
            showSite(sejong_map, 3, sejong1ClickCount); 
            open_tab('degu_window',3);
            document.getElementById('currentSiteId').innerHTML = "3";
        }
        else if(obj.id == "sejong_button2")
        {       
            sejong2ClickCount++;
            if(daegu_interval != null)
                clearInterval(daegu_interval);
            
            for(var i = 0; i < mapList.length; i++)
                hide_div(mapList[i]);

            mapList.push("sejongMap2");
            hideMaps('sejongMap2'); 
            if(sejong_map2 == undefined)
            {
                sejong_map2 = L.map('sejongMap2',{
                    zoom : 16,
                    center:[36.4975,127.3274],
                    zoomControl: false,
                });
            }    
         
            showElements(["sejongSubmenu", "alertDiv"]);
            hide_div('countInfoDiv');
            showSite(sejong_map2, 18, sejong2ClickCount); 
            open_tab('degu_window',18);
            document.getElementById('currentSiteId').innerHTML = "18";
        }
        else if(obj.id == "sangam_button")
        {
            sangamClickCount++;
            if(daegu_interval != null)
                clearInterval(daegu_interval);
            
            for(var i = 0; i < mapList.length; i++)
                hide_div(mapList[i]);

            hideMaps("sangamMap");
            if(sangam_map == undefined)
            {
                sangam_map = L.map('sangamMap',{
                    zoom : 15,
                    center:[37.579333, 126.889036],
                    zoomControl: false,
                });
            }
            mapList.push("sangamMap");
            hide_div('countInfoDiv');
            showSite(sangam_map, 4, sangamClickCount); 
            open_tab('degu_window',4);
            show_div("alertDiv");
            document.getElementById('currentSiteId').innerHTML = "4";
        }
        else if(obj.id == "gunsan_button")
        {
            document.getElementById('screenToggleDiv').style.left = "570px";
            document.getElementById('fullscreen_title').style.left = "570px";
            gunsanClickCount++;
            if(daegu_interval != null)
                clearInterval(daegu_interval);
            for(var i = 0; i < mapList.length; i++)
                hide_div(mapList[i]);
            mapList.push("gunsanMap");
            hideMaps("gunsanMap");
            if(gunsan_map == undefined)
            {
                gunsan_map = L.map('gunsanMap',{
                    zoomSnap: 0.75,
                    zoom : 16,
                    center:[35.812484, 126.409100],
                    zoomControl: false,
                });
            }

            hide_div('countInfoDiv');
            show_div("eta_div");
            show_div('infoChart');
            showSite(gunsan_map, 1, gunsanClickCount); 
            open_tab('degu_window',1);
            show_div("alertDiv");
            document.getElementById('currentSiteId').innerHTML="1";
        }
        else if(obj.id == "offsite_button")
        {
            clusterMapCount++;
            // create offsite map
            var rightCenter = [35.902, 128.013];
            hideMaps("offsiteMap");
            if(cluster_map == undefined)
            {
                cluster_map = L.map('offsiteMap', {
                    zoomSnap: 0.15,      
                    dragging: true, //false
                    draggable:true,
                    scrollWheelZoom: true, //false
                    color:"rgba(8, 148, 19)",
                    zoomControl: false,
                    zoom:18,
                    center:rightCenter
                });
            }
        
            cluster_map.setView([35.902, 128.013], 17);
            zoomHome_main.setHomeCoordinates([35.902, 128.013]);
            cluster_map.invalidateSize();
            var elementsToHide = ["graph_div", "countInfoDiv", "webcam_div", "webcam_div1", "webcam_div2", "infoChart", "distanceChart1", "passangerChart2"];     
            hideElements(elementsToHide);
            mapList.push("offsiteMap"); 
            hide_div("alertDiv");
            offsite();
            showCluster(cluster_map);
            document.getElementById('currentSiteId').innerHTML = "0";
        }
        else if(obj.id == "gangrung_button") 
        {
            // this will be developed in next version
            mapList.push("gangrungMap");  
        }
    }
}

//On sejong button hover
function buttonHover(element)
{
    element.style.background = "#93C3D1";
    element.style.color = "#333333";
}

// Daegu monitoring
var daegu_interval;
function showSite(mapInstance, currentSiteId, clickCount, mapToShow) 
{
    if(interval != null)
        clearInterval(interval);
    if(daegu_interval != null)
        clearInterval(daegu_interval);
        
    var deguShuttleArray = []; // stores info of each vehicle in object form on degu route
    // clear events div
    document.getElementById("eventsDiv").innerHTML = ''; 
    var elementsToHide = ["graph_div", "countInfoDiv", "listItem", "offsite_window"];
    var elementsToShow = ["webcam_div", "degu_window"];
    hideElements(elementsToHide);
    showElements(elementsToShow);
    open_tab('degu_window',currentSiteId);
    active_site= currentSiteId;
    if(clickCount <= 1)
    {        
        mapInstance = createMap(mapInstance);
        // show stations, kiosk, garage, V2X on degu route.
        showRouteInfo(mapInstance, "stations/", "route/station_kiosk.svg", currentSiteId);
        showRouteInfo(mapInstance, "garages/", "route/garageIcon.svg", currentSiteId);
        showDataCenter(mapInstance, currentSiteId);
        show_v2x(mapInstance, "v2x/", currentSiteId); 
    }
    
    //Update weather information after every 10 minutes 
    getweather(currentSiteId);
    setInterval(function() {
        getweather(currentSiteId);
    }, 10 * 60000);

    L.control.scale().addTo(mapInstance);
    mapInstance.invalidateSize();
     
    // Show All the shuttles on degu route
    var reqCount = 0;
    var firstId; 
    var vehicleObj=[];
    var start = Date.now();

    // get all vehicle Id's.
    getMethod("vehicles/", function (data) {
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;

        // create vehicle obj and store in array
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == currentSiteId){
                deguShuttleArray.push(vehicle.id); // array of vehicle ID 
                vehicleObj.push(vehicle);
            }
        }
        
        //create list of vehicles in degu route
        vehicleObj = vehicleObj.sort((a, b) => (a.id > b.id) ? 1 : -1);

        // show chart.js 
        showChartData(currentSiteId);
        if(vehicleObj.length > 0)
        {
            daegu_interval = setInterval(function() {
                reqCount++;
                shuttleOnRoute(mapInstance, reqCount, currentSiteId); //vehicleObj
            }, 1000)
        }

        // create select list of vehicle 
        createSelectList(vehicleObj);

        if(deguShuttleArray.length >0 )
        {
            deguShuttleArray = deguShuttleArray.sort();
            firstId = deguShuttleArray[0];
            vehicleInfo(mapInstance, firstId);
            changeVehicleInfo(firstId);
            oddButtonStatus();
        }
        else
        {
            noVehicleInfo();
        }

        // update ETA
        updateETA(currentSiteId);
        eta_interval = setInterval(function() {
            updateETA(currentSiteId);
            console.log("Updating eta after 30 seconds")
        }, 30000);
        
        // update status of webcam  
        document.getElementById("hidden_cam1").style.background= "";
        document.getElementById("hidden_cam2").style.background= "";
        if(document.getElementById("pausePlayButton1").src= "images/cctv/play.svg")
            document.getElementById("pausePlayButton1").src= "images/cctv/pause.svg";
        if(document.getElementById("pausePlayButton2").src= "images/cctv/play.svg")
            document.getElementById("pausePlayButton2").src= "images/cctv/pause.svg";

        // get all vehicle Id's.
        getMethod("sites/"+currentSiteId+"/", function (data) {
            if(JSON.parse(data).image == null)
            {
                document.getElementById('emergency_contactImg').src = '';
                document.getElementById('contact_button').style.backgroundColor = "#BDBDBD"; 
                document.getElementById('contact_button').style.border  = "0.5px solid #BDBDBD";
                document.getElementById('contact_button').style.pointerEvents ="none";
                document.getElementById('contact_button').style.color = "#FFFFFF";
            }
            else
            {
                document.getElementById('emergency_contactImg').src = JSON.parse(data).image;
                document.getElementById('contact_button').style.backgroundColor = "#ffffff";
                document.getElementById('contact_button').style.border  = "0.5px solid #CA4040";
                document.getElementById('contact_button').style.color = "#CA4040";
                document.getElementById('contact_button').style.pointerEvents ="auto";
            }
            // count of operationsl vehicles, kiosk  
            if(JSON.parse(data).vehicle_count != undefined)
            {
                //document.getElementById('line_count').innerHTML = JSON.parse(data).route_count;
                document.getElementById('vehicle_count').innerHTML = "2"; //JSON.parse(data).vehicle_count;
                document.getElementById('station_count').innerHTML = "7";//JSON.parse(data).station_count;
                document.getElementById('kiosk_count').innerHTML = "2";//JSON.parse(data).kiosk_count;
                document.getElementById('garage_count').innerHTML = "1"; //JSON.parse(data).garege_count;
            }
        });
    });

    show_div("alertDiv");

    // development history data (underdevelopment)
    showSummary('site');
}

var switchStatus = false;
function toggledSwitch()
{
    if(switchStatus == false)
        switchStatus = true;
    else
        switchStatus = false;

    if(switchStatus)
    {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }   
    else
    {
        if (document.exitFullscreen) {
            document.exitFullscreen(Element.ALLOW_KEYBOARD_INPUT).catch(err => Promise.resolve(console.log(err)));
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } 
}

/* toggled switch disabled
window.onresize = function (event) {
    const windowWidth = window.innerWidth * window.devicePixelRatio;
    const windowHeight = window.innerHeight * window.devicePixelRatio;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    if (((windowWidth/screenWidth)>=0.95) && ((windowHeight/screenHeight)>=0.95)) {
        switchStatus = true;
        $("#switchButton").prop('checked', switchStatus);
    }
    else {
        switchStatus = false;
        $("#switchButton").prop('checked', switchStatus);
    }
}
*/

function offsite() {
    // hide all div's from site route
    for(var i = 0; i < mapList.length; i++)
        hide_div(mapList[i]);
    
    // create list to show all site info.
    var offsite_list = document.getElementById("offsite_list");
    offsite_list.innerHTML = '';
    getMethod("sites/", function (sites_data) {
        var site_data = JSON.parse(sites_data);//.results;
        var count = Object.keys(site_data).length;
        for (i = 0; i < count; i++) {
            var siteId = site_data[i].mid;
            siteId = siteId.substring(3, siteId.length);
            if (parseInt(siteId) >= 901) {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(site_data[i].name));
                offsite_list.appendChild(li);
                li.id = site_data[i].id;
                li.onclick = listItem;
                li.className = "offsiteList1";
            }
        }
    });
}

// show the sub items of offsite list 
function listItem() {
    show_div('siteListModal');

    // alignment of listItem div
    var li_Item = document.getElementById("listItem");
    li_Item.style.top = (this.offsetTop + 78) + "px";
    li_Item.style.display = "block";
  
    // left triangle of div
    var triangle = document.getElementById("leftTriangle");
    triangle.style.top = (this.offsetTop + 104) + "px";

    // get summary details from 'sites/' api 
    getMethod("sites/" + this.id, function (site_data) {
        var data = JSON.parse(site_data);
        var summary = data.summary.replace(/\r\n/g, '<br>');
        document.getElementById("listItem_summary").innerHTML = summary;
    });
 
    $(this).addClass('offsiteList2').siblings().removeClass('offsiteList2');
}

// show total passenger and distance graphs when offsite div is open
function showGraphs() {
    getMethod("oplogs/summary/", function (graphData) {
        var graph_data = JSON.parse(graphData);
        var count = Object.keys(graph_data).length;
        var vehicleList = [];
        var passengerList = [];
        var distanceList = [];
        var dataList = [];
        for (var i = 0; i < count; i++) {
            vehicleList.push(graph_data[i].vehicle);
            passengerList.push(graph_data[i].accum_passenger);
            distanceList.push(graph_data[i].accum_distance);
            //dataList.push(graph_data[i].accum_distance);
        }
        // vehicleList = vehicleList.sort();
        //var total_data = distanceList.reduce(function(pv, cv) { return pv + cv; }, 0);
        // byte conversion 
        /* 1 B = 1 byte;
            1 kB = 1000 bytes;
            1 MB = 1000 kB;
            1 GB = 1000 MB or 1 000 000 000 bytes.*/
        // if(dataList)
        //total_data = 
        // else
        // total_data = 0+ ' MB';
        
        // dataList
        document.getElementById('totalData').innerHTML = 0;
        document.getElementById('dataSize').innerHTML = 'MB';
        document.getElementById('dataUnit').innerHTML = 'MB';
        
        //distanceList
        document.getElementById('totalDistance').innerHTML = Number(distanceList.reduce(function(pv, cv) { return pv + cv; }, 0)).toLocaleString('en');
        //passengerList
        document.getElementById('totalPassenger').innerHTML = Number(passengerList.reduce(function(pv, cv) { return pv + cv; }, 0)).toLocaleString('en');

        // show charts on main site(cluster map)
        showChart('graph3', '총 데이터 용량', '#3bc7d1', 'Data', vehicleList, dataList, 'GB');
        showChart('graph2', '총 운행거리', '#f1ca3f', 'Distance(km)', vehicleList, passengerList, 'km');
        showChart('graph1', '총 탑승자 수', '#3bc7d1', 'Passenger', vehicleList, distanceList, '명');
    });
}

function showCluster(cluster_map)
{
    // hide data of other sites if open 
    hideMaps('offsiteMap');
    hideElements(["alertDiv", "degu_window"]);

    // show data for offsite.
    if(clusterMapCount == 1)
        showGraphs();

    // current_mapinstance = cluster_map;
    // array to store lat-lon of cluster 
    var addressPoints = []; 
    if(clusterMapCount <= 1)
    {

          // create openstreet tile layer
          var clusterLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        });

        // add layer to map with zoom level
        clusterLayer.addTo(cluster_map);
        // get location of clusters using REST api
      /*   getMethod("routes/", function (routes_data) {
            var cluster_data = JSON.parse(routes_data).results;
            var count = Object.keys(cluster_data).length;
            for (var i = 0; i < count; i++) {
                if(cluster_data[i].start != '' && cluster_data[i].operation == true && cluster_data[i].site == 1)
                {
                    addressPoints.push(cluster_data[i].start);
                }
            }

            console.log("cluster addressPoints :"+addressPoints);

            // create markers and add it to layer
           var markers = L.markerClusterGroup();
            for (var i = 0; i < addressPoints.length; i++) {
                var location = addressPoints[i];
                var clusterIcon = L.icon({
                    iconUrl: "images/singleCluster.svg",
                }); 
                var marker = L.marker(new L.LatLng(location[0], location[1]),{
                    icon : clusterIcon
                })
                markers.addLayer(marker);
            }
            // add layer to the map instance.
            cluster_map.addLayer(markers);  
        });*/
    }
    // refresh map 
    cluster_map.invalidateSize();
}

// function to switch between main tabs (different projects)
function showContent(tabId) {
    // Update this function when other projects are developed.
    var tabArray = ['integrated_control', 'integrated_Dashboard'];
    if (tabId == "integrated_control")
        window.location.href = "main.html";
    else
        alert("준비 중입니다.");

   // else if(tabId == "integrated_Dashboard")
       // window.location.href = "dashboard.html";
}

function setWeather(domElement, weatherStatus)
{
    var weatherIconPath;
    if(weatherStatus == "rainy") 
        weatherIconPath = "images/weather/rainy.svg";
    else if(weatherStatus == "good") 
        weatherIconPath = "images/weather/sunny.svg";
    else if(weatherStatus == "cloudy") 
        weatherIconPath = "images/weather/cloudy.svg";
    else if(weatherStatus == "snow") 
        weatherIconPath = "images/weather/snowy.svg";

    document.getElementById(domElement).src = weatherIconPath;
}

// Show weather information on main.html
function getweather(site_id) {
    var url = 'sites/'+site_id+'/';
    getMethod(url, function(data) {
        var weatherData =  JSON.parse(data);
        //set current weather 
        var currentWeather = JSON.parse((weatherData.current_weather)).weather;
        document.getElementById('temp_celsicus').innerHTML = Math.round(JSON.parse((weatherData.current_weather)).temp)+ '&deg;C';
        setWeather('weather_icon', currentWeather);
    });
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
    // var passivePassenger = 15 - activePassenger;
    if(activePassenger == null)
        document.getElementById("passengerCount").innerHTML = 0;
    else
        document.getElementById("passengerCount").innerHTML = (activePassenger + 1);
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
        speedDom.style.fontFamily = "Roboto_regular"
    }
    else if(speed > 18)
    {
        if(speed > 30)
        {
            // speed is greater then 30 text color is red and bold
            speedDom.style.color="#CA4040";
            speedDom.style.fontFamily ="Roboto_bold";
        }
        else
        {
            // speed is greater then 18 and less then 30
            // text color is red and normal
            speedDom.style.color="#CA4040";
            speedDom.style.fontFamily = "Roboto_regular";
        }
    }
}

// show vehicle info like speed, heading, gnss battery etc.
var interval;
function vehicleInfo(map, vId)
{   
    // clear interval 
    clearInterval(interval);
    var request_count = 0;
    var count15 = 0;
    var speedArray=[];
    interval = setInterval(function(){
        request_count++;
        count15++;
        var apiUrl = "vehicles/"+vId+"/";
        getMethod(apiUrl, function (data) {
            var vehicle = JSON.parse(data);
            var shuttleLocation = L.LatLng(vehicle.lat, vehicle.lon);
            updateShuttleInfo(vehicle, request_count); 
        });
    }, 1500);
    return interval;
}

function updateShuttleInfo(vehicle, request_count)
{     
    if(vehicle == null)
    {
        vehicleStatus( "NO DATA", "#CA4040");
        // front
        document.getElementById("v_front").style.background = "#BDBDBD";
        // Vehicle name and version     
        document.getElementById("vehicleID").innerHTML = "NA";
        document.getElementById("vehicleID").style.color = "#666666";
        document.getElementById("vehicleVersion").innerHTML = "SW 버전: NA";
        updateFrontStaus(null, 0)
        showVehicleHeading(null);
        updateDrive(null);
        updateGnssBgcolor(false);
        setBatteryPercent(0);
        passengerStatus(null);    
        updateDoor(false);
        setVehicleSpeed(0);
        return false;
    }

    updateFrontStaus(vehicle.isparked, vehicle.speed);
    // change driving color
    if(vehicle.isparked == true || vehicle.isparked == null)
        vehicleStatus("PARKED", "rgb(128,128,128)");
    else if(vehicle.speed > 0) 
        vehicleStatus( "DRIVING", "#57AE66");
    else
        vehicleStatus( "STOPPED", "#CA4040");
   
    // Vehicle name and version     
    var nameColor = vehicleMakeColor(vehicle.name);

    // changes bgcolor of popup background
    var color; 
    if(nameColor == "greenPopup")
        color= "#67BBB1";
    else if(nameColor == "bluePopup")
        color= "#0082C8";
    else if(nameColor == "blackPopup")
        color = "#333333";
    else
        color ="#666666"; 
    document.getElementById("vehicleVersion").innerHTML = "SW 버전: "+vehicle.model.firmware;
                        
    // show speed of vehicle
    setVehicleSpeed(vehicle.speed);
    if(vehicle.speed > 0)
        showVehicleHeading(vehicle.heading);
    // updates background color of gnss
    updateGnssBgcolor(vehicle.gnss);

    if(request_count == 1)
    {
        // show door status ---> this will be updated by web socket    
        updateDoor(vehicle.door);
        // Update drive mode of vehicle  
        updateDrive(vehicle.drive_mode);
        // show passenger status    
        passengerStatus(vehicle.passenger);    
    }
    // show battery status
    setBatteryPercent(vehicle.battery);
    // show webcam
    checkWebcam(vehicle.webcam1, 'cameraButton1', 'video1', 'video1Active');
    checkWebcam(vehicle.webcam2, 'cameraButton2', 'video2', 'video2Active');
}

function updateFrontStaus(isParked, speed)
{
    var frontBG;
    if(isParked == false || speed > 0)
        frontBG = "#57AE66";
    else
        frontBG = "#BDBDBD";
    document.getElementById("v_front").style.background = frontBG;
}

// site / vehicle operating status 
function updateGnssStatus(status_boolean)
{
    var operatingStatus;
    if(status_boolean == true)
        operatingStatus = 'images/status/active_green.svg';
    else
        operatingStatus = 'images/status/inactive_grey.svg'; 

    return operatingStatus;
} 

function updateGnssBgcolor(gnss_status)
{
    if (gnss_status == true)
        document.getElementById("gnss_v1").style.backgroundColor = "#57AE66";
    else
        document.getElementById("gnss_v1").style.backgroundColor = "#BDBDBD";//"#CA4040";
}

function updateDrive(drive_mode)
{
    // I considered drive_mode as 1,2 or null
    if(drive_mode == 1)
        document.getElementById("driveStatus").innerHTML = "AUTONOMOUS";
    else if(drive_mode == 2)
        document.getElementById("driveStatus").innerHTML = "MANUAL";
    else    
        document.getElementById("driveStatus").innerHTML = "NO DATA";
}

function updateDoor(doorStatus)
{
    if (doorStatus == false)
        document.getElementById("doorStatus").src = "images/door/door_closed.svg";
    else
        document.getElementById("doorStatus").src = "images/door/door_open.svg";
}

function showVehicleHeading(headingAngle)
{
    if(headingAngle == null)
        var heading = 0;
    else
        var heading = headingAngle;    
    document.getElementById("heading_v1").innerHTML = heading + "&deg";

    // rotate heading
    document.getElementById("bigCircle").style = 'transform:rotate('+heading+'deg)';

    // reverse rotate heading
    var reverseHeading = -(heading);
    document.getElementById("angleDegree").style = 'transform: rotate('+reverseHeading+'deg)';
}

// create select box options
function createSelectList(objArray)
{ 
    var selectDom = document.getElementById("vehicleSelect");
    $('#vehicleSelect').empty();
    if(objArray.length == 0)
    {
        selectDom.disabled = true;
        return;
    }
    for(var i = 0; i < objArray.length; i++)
    {
        var option = document.createElement("option");
        option.text = objArray[i].name;
        option.id = objArray[i].id;
        selectDom.add(option);
    }
    selectDom.disabled = false;
}

function changeVehicleInfo(obj)
{
    // check if which sites map is open 
    // return the last element of array 
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
    if(eta_interval != null)
        clearInterval(eta_interval);
    // update ETA
    updateETA(active_site);
    eta_interval = setInterval(function() {
        updateETA(active_site);
        //console.log("Updating eta after 30 seconds on select change");
    }, 30000);
}

function createHtmlMarker(vehicleObj, iconHtml)
{
    var marker = L.marker([vehicleObj.lat, vehicleObj.lon], {
        draggable: false,
        icon: iconHtml,
    });
    return marker;
}

// This is vehicle ripple effect function. 
// This is vehicle ripple effect function. 
var rippleMarkerArray = [];
var shuttleMarkerArray = [];
function showVehicleRipple(request_count, mapInstance, vehicleInfo, currentSiteId){ 
        var vehicleMarker;
        // loop throught array vehicles of route
        for(var j = 0; j < vehicleInfo.length; j++)
        {        
            var vehicleObj = vehicleInfo[j];
            if(vehicleObj.lat == null || vehicleObj.lon == null)
                continue;

            // red ripple marker html
            var redIconHtml =   '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                    '<div id="ring1" class="shuttle_ring1"></div>'+
                                    '<div id="ring3" class="shuttle_ring3"></div>'+
                                '</div>';

            // green ripple marker html
            var greenIconHtml = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                    '<div id="ring1" class="shuttle_ring1_g"></div>'+
                                    '<div id="ring3" class="shuttle_ring3_g"></div>'+
                                '</div>';
            
            // grey ripple marker html
            var greyIconHtml = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                    '<div id="ring1" class="shuttle_ring1_grey"></div>'+
                                    '<div id="ring3" class="shuttle_ring3_grey"></div>'+
                               '</div>';
                        
            const redRippleIcon = L.divIcon({html: redIconHtml, iconAnchor: [0, -20],});
            const greenRippleIcon = L.divIcon({html: greenIconHtml, iconAnchor: [0, -20],});
            const greyRippleIcon = L.divIcon({html: greyIconHtml, iconAnchor: [0, -20],});

            //console.log("isParked : "+ vehicleObj.isparked+ "speed : "+vehicleObj.speed+ "heading:"+vehicleObj.heading);
            if(request_count == 1) 
            {
                // create Icon for ripple marker as per the speed value
                if(vehicleObj.isparked == true || vehicleObj.isparked == null) //vehicleObj.isparked == true |
                {
                    var marker = createHtmlMarker(vehicleObj, greyRippleIcon);
                }
                else if (vehicleObj.speed > 0) // || vehicleObj.drive == true // && vehicleObj.isparked == false
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
                    iconSize: [26, 30],
                    popupAnchor: [5, -45],
                    iconAnchor:[13,15], //[25, 45],
                    iconUrl: iconUrl,
                });

                // Create vehicle marker 
                vehicleMarker = createHtmlMarker(vehicleObj, vehicleIcon);            
                vehicleMarker._leaflet_id = vehicleObj.name;
                if(vehicleObj.isparked == false) 
                {
                    if(vehicleObj.speed > 0) 
                        vehicleMarker.options.rotationAngle = vehicleObj.heading;               // rotate marker of speed is greater then 0 to avoid abnormal data
                }
                    
                // create html and append to popup div
                var customPopup = "";
                var customOptions = {'className': 'custom-popup4'};
                vehicleMarker.bindPopup(customPopup, customOptions).openPopup();               // bind popup to vehicle marker                   
                vehicleMarker.on('click', function(e) {           
                    // vehicle marker on click function ---> updates vehicle popup data every second 
                    setPopupContent(e, mapInstance, currentSiteId);
            });
   
            vehicleMarker.addTo(mapInstance);         
            
           // alert("gns s:"+vehicleObj.gnss);// show vehicle icon on route
            var shuttleMarkerObj = {                                                          // store marker in array 
                marker : vehicleMarker,
                markId : vehicleObj.id,
                name: vehicleObj.name,
                speed: vehicleObj.speed,
                battery: vehicleObj.battery,
                version: vehicleObj.model.firmware,
                version: vehicleObj.gnss
            }
            shuttleMarkerArray.push(shuttleMarkerObj);                                         // maintain array of shuttle markers
        }   
        else  //update markers
        {           
            for(var i = 0; i < rippleMarkerArray.length; i++)
            {           
                if(vehicleObj.id == rippleMarkerArray[i].markId)                                // check if ripple marker is present in array
                {
                    var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
                    var currentRipple = rippleMarkerArray[i].marker;
                    currentRipple.setLatLng(newLatLng);                                         // update the location of ripple marker

                    // change speed status in left side window
                    if(vehicleObj.isparked == true || vehicleObj.isparked == null) //vehicleObj.isparked == true ||
                    {
                        currentRipple.setIcon(greyRippleIcon);
                    }
                    else if(vehicleObj.speed > 0) //|| vehicleObj.drive == true //&& vehicleObj.isparked == false 
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

                    if(vehicleObj.parkingbrake == false) //vehicleObj.isparked == true ||
                    {
                        if(vehicleObj.speed > 0 )
                            currentVehicle.options.rotationAngle = vehicleObj.heading;
                    }

                    currentVehicle.addTo(mapInstance);
                                      
                    // If current markers popup is open then set the content of popup
                    var currentMarker =  shuttleMarkerArray[k].marker;
                    if(currentMarker.getPopup().isOpen() == true)
                    {
                        // set popup color
                        var popupColor = vehicleMakeColor(vehicleObj.name);

                        // update speed status 
                        var speedColor;
                        var speedWeight;
                        var currentSpeed = shuttleMarkerArray[k].speed;
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
                            
                        var vehicleOperation = updateGnssStatus(vehicleObj.gnss);
                        if(vehicleObj.gnss == true)
                        {
                        currentMarker._popup.setContent("<div class="+popupColor+" id='vPopup'>"+
                        "<p class='popupTitle'>" +vehicleObj.name+ "<img class='activeGreenPopup' src="+vehicleOperation+"></p>"+
                        "<span class='popupVersion'>VER : "+vehicleObj.model.firmware+"</span>"+
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
                        "</div>");
                        }
                        else
                        {
                            currentMarker._popup.setContent("<div class="+popupColor+" id='vPopup'>"+
                            "<p class='popupTitle'>" +vehicleObj.name+ "<img class='activeGreenPopup' src="+vehicleOperation+"></p>"+
                            "<span class='popupVersion'>VER : "+vehicleObj.model.firmware+"</span>"+
                            "</div><br>"+

                            "<div class='popupSpeedDivDisable'></div>"+
                            "<div class='popupSpeedDiv'>"+
                                "<span>Speed</span><br>"+
                                "<span id='popup_speed' class='popupSpeed' style='color:"+speedColor+";font-weight:"+speedWeight+"'>"+vehicleObj.speed+"</span><br>"+
                                "<span class='popupSpeedUnit'>km/hr</span>"+
                            "</div>"+
                            "<div class='popupBatteryDiv'>"+
                                "<span style='vertical-align:top'>Battery</span>"+
                                "<div id='popupBattery' class='popup-battery' data-content="+vehicleObj.battery+'%'+"></div>"+
                                "<div class='popupParent'></div>"+
                            "</div>");
                        }
                        setPopupBattery(vehicleObj.battery);                // update popup battery value 
                        setPopupSpeed(vehicleObj.speed);        
                    }
                }
               
                // check if which vehicle is selected from select list and update the info of that vehicle 
                var dom = document.getElementById("vehicleSelect");  // vehicle select list
                var selectedId = null;

                if(dom.options[dom.selectedIndex] != undefined)
                    selectedId = dom.options[dom.selectedIndex].id;  // selected Id 
                
                if(vehicleObj.id == selectedId)
                    updateShuttleInfo(vehicleObj);
            }
        }                                                     
    }
}

function vehicleMakeColor(vehicleName){
    var thirdCharacter = vehicleName.charAt(2);                   // check the third character of vehicle name
    var popupColor;                                                // Update the background color of popup according as per the make of vehicle 
    if(thirdCharacter == "E")
        popupColor ="greenPopup";
    else if(thirdCharacter == "K")   
        popupColor ="blackPopup";
    else //if(thirdCharacter == "N") 
        popupColor ="bluePopup";

   return popupColor;     
}

// site / vehicle operating status 
function operatingStatus(status_boolean)
{
    var operatingStatus;
    if(status_boolean == true)
        operatingStatus = 'images/status/active_green.svg';
    else
        operatingStatus = 'images/status/inactive_red.svg'; 

    return operatingStatus;
} 

function setPopupContent(e, mapInstance, site_no)
{
    // update popup battery 
    for(var k = 0; k < shuttleMarkerArray.length; k++)
    {
        if(e.target._leaflet_id == shuttleMarkerArray[k].name)                 // find the marker in array to update
        {                       
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
                    //var vehicleOperation = updateGnssStatus(shuttleMarkerArray[k].gnss);  
                    layer._popup.setContent("<div class="+popupColor+" id='vPopup'>"+
                                            "<p class='popupTitle'>" +shuttleMarkerArray[k].name+ "<img class='activeGreenPopup'></p>"+ // src="+vehicleOperation+"
                                            "<span class='popupVersion'>VER : "+shuttleMarkerArray[k].version+"</span>"+
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
                                            "</div>");
                    setPopupBattery(shuttleMarkerArray[k].battery);                // update popup battery value 
                    setPopupSpeed(shuttleMarkerArray[k].speed);                    // update popup speed value 
                }
            });

            (shuttleMarkerArray[k].marker).openPopup();

            // Update left window vehicle info. when vehicle popup is clicked
            document.getElementById('vehicleSelect').value = shuttleMarkerArray[k].name;  
            vehicleInfo(mapInstance, shuttleMarkerArray[k].markId);
            oddButtonStatus();
            updateETA(active_site);
            eta_interval = setInterval(function() {
                updateETA(active_site);
            }, 30000);
            break;
        }
    }
}

function vehicleStatus( status, statusBg)
{
    // Driving button 
    document.getElementById("v_status1").innerHTML = status;
    document.getElementById("v_status1").style.background = statusBg;
}

// Show multiple vehicles on route (under development)
function shuttleOnRoute(mapInstance, reqCount, currentSiteId)
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
            if (vehicle.site == currentSiteId){
                vLocationArray.push(vehicle); // array of vehicle ID
            }
        }
        vLocationArray = vLocationArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
        showVehicleRipple(reqCount, mapInstance, vLocationArray, currentSiteId);
    });
}

function noVehicleInfo()
{
    updateShuttleInfo(null , null);
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

/* show chart with todays distance passenger count */
function showChartData(siteId){

    document.getElementById("infoChart").style.display = "block";
    document.getElementById("distanceChart1").style.display = "inline-block";
    document.getElementById("passangerChart2").style.display = "inline-block";
    
    var nameList = [];
    var distanceList = [];
    var passengerList = [];
    var colorList = [];
    var api_url = server_URL+"oplogs/by-date/";

    // get todays date 
    var stringWeekDay = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var today2 = yyyy+'-'+mm+'-'+dd;
    var dayOfWeek = stringWeekDay[today.getDay()];


    var passengerTitleDate = mm+"/"+dd+ " ("+dayOfWeek+")" + " 총 탑승자 수"
    var distanceTitleDate = mm+"/"+dd + " ("+dayOfWeek+")" +" 총 운행거리"
      
    // send today's date via post method
    var data = JSON.stringify({
        "date": today2   //"2020-04-06"   
    });

    postMethod(data, api_url, function (req) {
        if(req.status == 200){  
            var summary = JSON.parse(req.response);
            //var count = Object.keys(summary).length;
            for(var i=0; i<summary.length; i++)
            {                
                if(summary[i].site.id == siteId)
                {
                    var totalDistance = summary[i].log.distance;
                    var totalPassenger = summary[i].log.passenger;
                    var vehicleName = summary[i].vehicle.mid;
              
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
            //  todayChart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, nameList);
            var total_distance = distanceList.reduce((a, b) => a + b, 0);
            var total_passengers = passengerList.reduce((a, b) => a + b, 0);

            document.getElementById('distanceTitle').innerHTML = distanceTitleDate;
            document.getElementById('passengerTitle').innerHTML = passengerTitleDate;
            
            document.getElementById('total_distance').innerHTML = total_distance;
            document.getElementById('total_passengers').innerHTML = total_passengers;
      
            showChart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, distanceList, 'km', total_distance);
            showChart('todayPassenger', '총 탑승자 수', colorList, 'Passenger', nameList, passengerList, '명', total_passengers);
        } 
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

// function not in use currently
function setPopupSpeed(speed)
{
    var popup_speed = document.getElementById("popup_speed");
    if (popup_speed == null)
        return false;

    // change css to show changes in speed.
    if(speed < 18)
    {
        //console.log("<18:"+popup_speed.style.color);
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
    if(api_name == undefined || api_name == '' || api_name == null)
        return false;
    var username = localStorage.getItem("userId");
    var password = localStorage.getItem("userPwd"); 
    var base64Credentials = "Basic " + btoa(username + ":" + password);
    var request = new XMLHttpRequest();
    var base_url = server_URL;

    // get and return data 
    request.open('GET', base_url + api_name, true);
    request.onload = function (e) {
        if (request.status == 200) {
            callback(request.response);
        } else if (request.status == 401)
            console.log("Authentication credentials were not provided");
        else if (request.status == 403)
            console.log("Unauthorized access to accounts")
       // console.log("GET data status: " + request.status);
    };
    request.onerror = function (status) {
        console.log("GET data error (GET).");
    };
    request.setRequestHeader("Authorization", base64Credentials);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    request.send();
}


// updates offsite count div - underDevelopment
function showSummary(site) {
    if(site == "offsite")
    {
        getMethod("sites/summary/", function (getSummary) {
            var summary = JSON.parse(getSummary);
            document.getElementById("routeCount").innerHTML = "1"//summary.route_count;
            document.getElementById("vehicleCount").innerHTML ="2"// summary.vehicle_count;
            document.getElementById("StationCount").innerHTML = "7";//summary.station_count;
            document.getElementById("kioskCount").innerHTML = "2";//summary.kiosk_count;
            document.getElementById("garageCount").innerHTML = "1";// summary.garage_count;
        }); 
    }
}

// show station, garage, datahub and kiosk on route
function showRouteInfo(mapInstance, api_name, icon_path, site_no) {
    var stationWp_array = [];
    getMethod(api_name, function(data) {
        var iconData = JSON.parse(data).results;
        if (iconData == undefined)
            var iconData = JSON.parse(data);
        var count = Object.keys(iconData).length;

        // sort array of object station data according to the sequence number
        iconData.sort((a, b) => (a.sta_Order > b.sta_Order) ? 1 : -1)
        var stationMidArray=[];
        var stationTitleArray=[];
        for (var i = 0; i < count; i++) {
            if (iconData[i].site == site_no) {
                if (api_name == "stations/" ) //&& site_no != 18
                {
                    stationWp_array.push(L.latLng(iconData[i].lat, iconData[i].lon)); // array for station location on route
                    var stationTitle = iconData[i].name;
                    var station_mid = iconData[i].mid;
                    var stationLat = iconData[i].lat;
                    var stationLon = iconData[i].lon;
                    stationTitleArray.push(stationTitle); // array for station title
                                     
                    // check if kiosk for the station is available in kiosk api
                    // var kioskTitle = "KIS" +kiosk_title.substring(3);
                    stationMidArray.push(station_mid);
                    showMarker(mapInstance, "images/" + icon_path, stationTitle, station_mid, stationLat, stationLon);
                }
                else
                {
                    // garage api show marker on route 
                    showMarker(mapInstance, "images/" + icon_path, iconData[i].name, 'false', iconData[i].lat, iconData[i].lon);
                } 
            }
        }
        if(api_name == "stations/")
        {
            if(site_no == 2)
            {
                // push first station as the last station of the array to complete the route.  
                var last = stationWp_array[0];
                stationWp_array.push(last);
            } 
            else if(site_no == 4) 
            {
                stationWp_array = [
                    L.latLng(37.579333, 126.889036),
                    L.latLng(37.58299, 126.88485),
                    L.latLng(37.57518, 126.89837),
                    L.latLng(37.581296, 126.885693)];
            }
            else if(site_no == 18)
            {
                stationWp_array = [
                    L.latLng(36.4994300000000000,127.3284000000000000),
                    L.latLng(36.50078,127.32962),
                    L.latLng(36.4996800000000000,127.3323300000000000),
                    L.latLng(36.4945400000000000,127.3258500000000000),
                    L.latLng(36.49448,127.32282),
                    L.latLng(36.4974200000000000,127.3227800000000000),
                    L.latLng(36.49836, 127.32659),
                    L.latLng(36.4994300000000000,127.3284000000000000)];
            }
            else if(site_no == 1)
            {
                // Gunsan route part 1 
                stationWp_array = [
                    L.latLng(35.8137410000000000, 126.4131030000000000),//12
                   // L.latLng(35.8114720000000000, 126.4164430000000000),//13
                    L.latLng(35.810844, 126.416400),//18
                ];
                stationTitleArray = ["선착장행 주차장", "유람선 선착장"];
                stationMidArray = ["STA012", "STA013"];
                createRoute(mapInstance, stationWp_array, stationTitleArray);

                // Gunsan route part 2 
                   stationWp_array =[   
                    L.latLng(35.8138710000000000, 126.4130100000000000),//11
                    L.latLng(35.8142630000000000, 126.4098250000000000),//18
                ];
                stationTitleArray = ["테마파크행 주차장", "선유도 해변"];
                stationMidArray = ["STA011", "STA018", "STA009"];
                createRoute(mapInstance, stationWp_array, stationTitleArray);

                //GUNSAN EXTRA PART 
                stationWp_array =[  L.latLng(35.8142630000000000, 126.4098250000000000),//18
                            L.latLng(35.8117490000000000, 126.4050750000000000),//9
                ];
                stationTitleArray = ["선유도 해변", "자율주행 테마파크(입)"];
                createRoute(mapInstance, stationWp_array, stationTitleArray);
               
                // Gunsan route part 3
                stationWp_array = [
                    L.latLng(35.8118700000000000, 126.4051900000000000),//19
                    L.latLng(35.8141840000000000, 126.4098450000000000), //10
                ];
                stationTitleArray = ["자율주행 테마파크(출)" , "고군산 탐방센터" ];
                stationMidArray = ["STA019", "STA010"];
                //createRoute(mapInstance, stationWp_array, stationTitleArray);
            }
            if(site_no != 1)
                createRoute(mapInstance, stationWp_array, stationTitleArray);
        }
     });
}
/*
stationWp_array = [
                    L.latLng(35.8137410000000000, 126.4131030000000000),//12
                    L.latLng(35.8114720000000000, 126.4164430000000000),//13
                    L.latLng(35.8138710000000000, 126.4130100000000000),//11
                    L.latLng(35.8142630000000000, 126.4098250000000000),//18
                    L.latLng(35.8117490000000000, 126.4050750000000000),//9
                    L.latLng(35.8118700000000000, 126.4051900000000000),//19
                    L.latLng(35.8141840000000000, 126.4098450000000000), //10
                ];
*/
function currentVehicleETA(stationData)
{
    // get current vehicle id from select list 
    var dom = document.getElementById("vehicleSelect");
    var stationDetails; 
    if((stationData.eta).length == 0) //|| stationData.eta == undefined )
    { //console.log("*T3");
        stationDetails = {
            vehicle_id : null,
            time : "N분 후 도착",
            id : stationData.id,
            mid : stationData.mid,
            name : stationData.name  
        }
        return stationDetails;
    }
    else
    {
        //console.log("*T4");
        var selectedId = dom.options[dom.selectedIndex].id;
        for(var p of stationData.eta)
        {                        
            var temp = JSON.parse(p);
            var key = Object.keys(temp);
            var value = Object.values(temp);
            for(var k = 0; k < key.length; k++)
            {            
               // alert("selectedId :"+selectedId);         
                if(key[k] == selectedId)
                {     
                    //console.log("*T5");
                 //   alert("if");  
                    var time_value;

                    // get drive value from vehicle api to check if vehicle is operational or not
                    var driveStatus = getDriveStatusOfVehicle(selectedId);
                       // console.log("test 1");
                        if(driveStatus == false || driveStatus == null)
                            time_value = "운행 준비중​";
                        else if(Math.round(value[k]) < 2)
                            time_value = "잠시 후 도착예정";
                        else if(Math.round(value[k]) > 2)
                            time_value = Math.round(value[k])+"분 후 도착​";
                        else
                            time_value = "N분 후 도착";

                          //  console.log("*T7");
                        stationDetails = {
                            vehicle_id : key[k],
                            time : time_value,
                            id : stationData.id,
                            mid : stationData.mid,
                            name : stationData.name  
                        }
                        //alert("T2 :"+JSON.stringify(stationDetails));
                        return stationDetails;
                      
                    
                }

               /* else
                {
                    alert("else");
                    stationDetails = {
                        vehicle_id : null,
                        time : "N분 후 도착",
                        id : stationData.id,
                        mid : stationData.mid,
                        name : stationData.name  
                    }
                    //return stationDetails;
                }
                return stationDetails;*/
            }
        }
    }
}
function getDriveStatusOfVehicle(vehicleId)
{
    var driveStatus;
    getMethod("vehicles/"+vehicleId+"/", function(data) {
        //console.log("*T6:"+data);
        var vehicleData = JSON.parse(data);
        driveStatus = vehicleData.drive;
       // alert("vehicleData.drive :"+vehicleData.drive);
        //alert(typeof(vehicleData.drive));
        return driveStatus;
    });
}

function updateETA(site_id)
{
    getMethod("stations/", function(data) {
        var stationData = JSON.parse(data);
        //console.log("stationData :"+JSON.stringify(stationData));
        var count = Object.keys(stationData).length;
        var stationETA = [];
        var passedStation;
        stationData =  stationData.sort((a, b) => (a.sta_Order > b.sta_Order) ? 1 : -1)
        //console.log("stationData[i] :"+stationData[i]);
        // station list
        for (var i = 0; i < count; i++) {
            if (stationData[i].site == site_id)
            {    
                  
                var eta = currentVehicleETA(stationData[i]);
                //alert("if eta:"+eta); 
                stationETA.push(eta);
            }
        }

        //alert("stationETA :"+stationETA);
        // station list
        var divElement = document.getElementById('stationList1');
        divElement.innerHTML = ""; 

        var circleDivElement = document.getElementById('circle_div');
        if(circleDivElement)
            circleDivElement.innerHTML = ""; 

        // list element - blue line
        $("#station_li").empty();
        // eta list 
        $("#eta_list").empty();

        var divHeight = Math.round(844/(stationETA.length));
        var minusHeight = 0;
        //console.log("stationETA :"+stationETA);
        for(var j = 0; j < stationETA.length; j++)
        { 
            minusHeight = j*2;
            // blue line which indicate ETA
            if(j < (stationETA.length - 1))
               $("#station_li").append(' <p class="eta_circle"></p>');
            else
              $("#station_li").append(' <p class="eta_circle2"></p>');

            var border_radius = '';
            if(j==0)
            {
                var border_radius =  'border-top-left-radius:12px;  border-top-right-radius:12px';
            }
            else if(j==(stationETA.length-1))
            {
                var border_radius = 'border-bottom-left-radius:12px;  border-bottom-right-radius:12px';
                divHeight = 40;
            }
            else
            {
               // var marginTop = 'margin-bottom:60px';
              //  var marginTop = 'margin-top:'+divHeight/ (stationETA.length);
            }
                               
            /*//top:'+(top)+'px;'+marginTop+'
            //top:'+((top*j)-((13*j-(j*2))))+'px;'+marginTop+'
            
            if(j==0)
                var circleImg = '<div style="position: absolute; height:'+(divHeight+20)+'px;"><img id="small_white_circle" style="position: absolute;  left:12px; z-index: 1111;" src="images/images_0.3/small_white_circle.svg"/></div>'
            else
                var circleImg = '<div style="position: absolute; height:'+(divHeight+20)+'px;"><img id="small_white_circle" style="position: absolute;  left:12px; z-index: 1111;" src="images/images_0.3/small_white_circle.svg"/></div>'
            */
          
            var marginTop = '';
            if(j==0)
            {
                var circleImg ='<img id="small_white_circle" style="position: absolute; top:'+(divHeight+40)+'px; left:12px; z-index: 1111;" src="images/images_0.3/small_white_circle.svg"/>';
            }
            else if(j < (stationETA.length -1 ))
            {                
                var circleImg ='<img id="small_white_circle" style="position: absolute;margin-top:11px;top:'+(((divHeight+22)*(j+1)))+'px; left:12px; z-index: 1111;" src="images/images_0.3/small_white_circle.svg"/>';
            }
            else if(j >= (stationETA.length -1 ))
            {
                var circleImg ='<img id="small_white_circle" style="position: absolute; top:1009px; left:12px; z-index: 1111;" src="images/images_0.3/small_white_circle.svg"/>';
            }
              
          //  console.log("stationETA[j] :"+stationETA[j]);
            circleDivElement.insertAdjacentHTML('beforeend', circleImg);
            var stationHtml = 
            '<div style="margin-left:20px; '+marginTop+' height:'+(divHeight+20)+'px; width:206px; overflow-y:hidden">'+
               '<p style="font-size: 14px;">'+stationETA[j].name+'</p>'+
                '<span>'+
                    '<p style="display:inline-block ; color: #828282; font-size: 12px; margin-top: 10px; margin-right: 18px; "> '+stationETA[j].mid+'</p>'+
                    '<p style="display:inline-block ;color: #2E92B0; font-size: 12px; width:93px;text-align:right"> '+stationETA[j].time+' </p>'+
                '</span>'+
            '</div>';

            divElement.insertAdjacentHTML('beforeend', stationHtml);
            // ETA in minutes
            if(stationETA[j].time < 1)
                var p = "<p style='margin-bottom:30px;'>곧 도착 또는 출발</p>";
            else
                var p = "<p style='margin-bottom:30px;'>"+stationETA[j].time+"</p>";
        }
    });
}

// create route using control routing plugin leaflet 
function createRoute(mapInstance, waypoints, stationTitle) {
    var control = L.Routing.control({
        waypoints: waypoints,
        serviceUrl:'https://osrm.aspringcloud.com/route/v1',
        dragging:false,
        routeWhileDragging:false,
        createMarker: function (i, wp) {
            if(stationTitle[i] != undefined)
            { 
                var stationIcon = new L.DivIcon();
                var marker = L.marker(wp.latLng, {
                    icon: stationIcon,
                    draggable: false,
                });
                var popup;
                marker.on('mouseover', function(e) {
                    var latlon= (wp.latLng).toString();
                    var trimStr = latlon.substr(7); // trim first 7 characters
                    var content = trimStr.substring(0, trimStr.length - 1); // trim last character
                    popup = L.popup({className: "stationPopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);//.openPopup();
                });
                marker.on('mouseout', function (e) { 
                    mapInstance.closePopup(popup);
                    });
                return marker;
            }
        },
          
        lineOptions: {styles: [{ color: '#7cc3e2', weight: 6 }]},     
        routeWhileDragging: false,
        fitSelectedRoutes: false,
        draggableWaypoints: false,
        addWaypoints: false,
        showAlternatives: false,
        show: false,
    }).addTo(mapInstance);
    L.Routing.errorControl(control).addTo(mapInstance);
}

// creates map with given mapcenter and zoom level
function createMap(mapInstance) {
    mapInstance.scrollWheelZoom.enable();
    mapInstance.dragging.enable();
    var mapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: false,
    });
    mapLayer.addTo(mapInstance);    
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(mapInstance);  
    return mapInstance;
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
    const customOptions = { 'className': 'custom-popup', autoClose: false }
    marker.bindPopup(customPopup, customOptions).openPopup();
    //map.invalidateSize();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
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
    var api_url = server_URL+"auth/logout/";
    postMethod(JSON.stringify(email), api_url, function (status_code) {
        if (status_code == 200)
            window.location.href = "index.html";
            //save login  status in session storage 
            sessionStorage.setItem("login", "false");
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
function siteSummary(divId, obj)
{
    var dom = document.getElementById(divId);
    if (dom.style.display == "block" || dom.style.display == null || dom.style.display == '')
    {
        dom.style.display = "none";
        document.getElementById("hideP").innerHTML = "더보기";
        document.getElementById("arrowImg").src="images/openArrow.svg" //up arrow
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
        //var site_title = site_data.summary.indexOf('\r');
        var site_title_slice = site_data.summary;//.substring(0, site_title);
        var summary_start = site_data.summary.indexOf('<b>');
        var remaining_summary = site_data.summary2.substring(summary_start);
        document.getElementById("site_name").innerHTML = site_data.name;
        document.getElementById('site_title').innerHTML = site_title_slice;
        document.getElementById("site_summary").innerHTML = remaining_summary;
        manager_list(site_data.user);
        //var siteOperation = operatingStatus(site_data.operation);
        //document.getElementById("site_status").src = siteOperation;
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
function show_v2x(mapInstance, api_name, currentSiteId){
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
            if (ripple_data[i].site == currentSiteId) {
                var lat = ripple_data[i].lat;
                var lon = ripple_data[i].lon;
                marker = L.marker([lat,lon], {
                    draggable: false,
                    icon: circleIcon
                });
        
                marker._leaflet_id = ripple_data[i].mid;
                marker.addTo(mapInstance);
                          
                var popup;
                // show loaction of v2x on mouseover 
                marker.on('mouseover', function(e) {
                    var loc = (e.latlng).toString();
                    var content = loc.substring(7, loc.length-1);
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
    //console.log("siteUsers :"+site_manager_array);
    // add managers to select list, 
    var select = document.getElementById("manager_selectlist");
    select.options.length = 0;
     
    // This is temporary becasue of sejong 
    if(site_manager_array == undefined || site_manager_array == null || site_manager_array.length == 0)
    {
        select.disabled = true; 
        return;
    }

    // enable the select list
    if( select.disabled == true)
        select.disabled = false;    
    
    //var site_manager_data = JSON.parse(site_manager_data);
    var sortedManagers = (site_manager_array.sort (ascending));
    for(var i = 0; i < sortedManagers.length; i++)
    {        
        var option = document.createElement('option');
        option.text = sortedManagers[i].username;
        option.value = sortedManagers[i].email;
        select.add(option, i + 1);
    }
}

function ascending ( a , b ) {  
    if ( a.username < b.username ) return -1; 
    else if ( a.username == b.username ) return 0; 
    else return 1; 
} 

function msg_modal() {
    show_div('messageModal');
    //selectSite('all', null,null);
}

// updates notice
function notice_modal() {
    show_div('noticeModal');
    changeNotice();
}

function updateSettingsIcon()
{
    document.getElementById('settingIcon').src= "images/images_0.3/setting_white.svg";
    document.getElementById('logoutIcon').src= "images/logout.svg";
}

function updateLogoutIcon()
{
    document.getElementById('logoutIcon').src= "images/images_0.3/logout_white.svg";
    document.getElementById('settingIcon').src= "images/setting.svg";
}

function updateSettingIcon()
{
    document.getElementById('logoutIcon').src= "images/logout.svg";
    document.getElementById('settingIcon').src= "images/setting.svg";
}

function changeNotice(){
    //var noticeSelect = document.getElementById('select_notice');
    //var category = noticeSelect.options[noticeSelect.selectedIndex].value;
    var category = "2";
    getMethod("notice/", function (site_data) {
        var noticeData = JSON.parse(site_data).results;
        var count = Object.keys(noticeData).length;
        var normalNotice = [];
        var pinNotice = [];
        var noticeArray = [];

        for (var i = 0; i < count; i++) 
        {            
            if(category == 1)
            {
                if(noticeData[i].pin == true)
                    pinNotice.push(noticeData[i]);
                else
                    normalNotice.push(noticeData[i]);
            }
            else if(noticeData[i].category == category)
            {                
                if(noticeData[i].pin == true)
                    pinNotice.push(noticeData[i]);
                else
                    normalNotice.push(noticeData[i]);
            }   
        }

        pinNotice = pinNotice.reverse();
        normalNotice = normalNotice.reverse();

        for(var m = 0; m < pinNotice.length; m++)
            noticeArray.push(pinNotice[m]);
       
        for(var n = 0; n < normalNotice.length; n++)
            noticeArray.push(normalNotice[n]);
       
        $('#noticeBody').empty();
 
        // show all notices
        for (var j = 0; j < noticeArray.length; j++) {
            var obj = noticeArray[j]; 
            if(obj == undefined)
                continue;
            var index = (obj.created_on).indexOf('T');
            var createDate = (obj.created_on).substring(0,index);
           
            if(obj.pin == true)
            {
                var html = '<div id="noticeDiv" style="width: 100%;">' +
                                '<span id="noticeTitle' +j+ '" class = "noticeSpan1"> <img class="noticeBullet1" src = "images/red_bullet.svg">' +obj.title+ '</span>'+
                                '<button class = "divButton" id="noticeButton' +j+ '" onclick=" toggle_div2(noticeDetails' +j+ ', ' +j+ ')" >'+
                                    '<i id="closeAngleIcon" class = "fa fa-angle-down" style="vertical-align: top; margin-left: -1px;"></i>'+ 
                                '</button><br/>'+
                                '<lable class="noticeLabel1">' +createDate+'</lable><br/>'+
                                '<br/>' +
                                '<div id = "noticeDetails' +j+ '" class = "noticeDiv1">'+
                                    '<p>' +obj.contents+ '</p>'+
                                '</div>'+
                            '</div>';
            }
            else
            {
                var html = '<div id="noticeDiv" style="width: 100%; margin-top:15px">'+
                                '<span id="noticeTitle' +j+ '" class = "noticeSpan2">' +obj.title+'</span>'+
                                '<button class = "divButton" id="noticeButton' +j+ '" onclick=" toggle_div2(noticeDetails' +j+ ', ' +j+ ')" >'+
                                    '<i id="openAngleIcon" class = "fa fa-angle-down" data-src="images/openArrow.svg" style = "vertical-align: top; margin-left: -1px;"></i>'+ 
                                '</button>' +
                                '<br/>' +
                                '<lable class="noticeLabel1">' +createDate+'</lable>' +
                                '<br/>' +
                                '<br/>' +
                                '<div id = "noticeDetails' +j+ '" class = "noticeDiv1">' +
                                    '<p>' +obj.contents+ '</p>' +
                                '</div>' +
                            '</div>';
            }

            $('#noticeBody').append(html);
            var html2= '<hr style="border: 0.5px solid #BDBDBD; width:99.5%; float:left; margin:0px 0px 14px 0px; opacity: 0.3"  id="hideHr"/>';
            $('#noticeBody').append(html2);
        }
    });
}

function toggle_div2(divID, i) 
{
    var button = document.getElementById('noticeButton' +i);
    var title = document.getElementById('noticeTitle' +i);
    title.style.color = "#828282";
    title.style.fontWeight = "normal";
    if (divID.style.display == "block") 
    {
        divID.style.display = "none";
        button.style.transform = "rotate(0deg)";
        button.style.backgroundColor = "#FFFFFF";
        button.style.color = "black"
    }
    else 
    {
        divID.style.display = "block";
        button.style.backgroundColor = "#2E92B0";
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
    var div_dom = document.getElementById(div_id);
    if (div_dom != null)
        div_dom.style.display = "none";
}

function hideElements(div_array) {
    for(var i = 0; i < div_array.length; i++)
    {
        var div_dom = document.getElementById(div_array[i]);
        if (div_dom != null)
        {
            div_dom.style.display = "none";
        }
    }
}

function showElements(div_array) {
    for(var i = 0; i < div_array.length; i++)
    {
        var div_dom = document.getElementById(div_array[i]);
        if (div_dom != null)
        {
            div_dom.style.display = "block";
        }    
    }
}

function show_div(div_id) {
    var id = document.getElementById(div_id);
    if (id != null)
        id.style.display = "block";
}

function hideMaps(activeMap)
{   
    var mapList = ['offsiteMap', 'deguMap', 'sejongMap', 'sejongMap2', 'sangamMap', 'gunsanMap'];
    for(var i = 0; i < mapList.length; i++)
    {
        var div_dom = document.getElementById(mapList[i]);
        if (mapList[i] == activeMap)
        {
            if(div_dom.style.display != "block")
                div_dom.style.display = "block";
        }
        else
        {
            if(div_dom.style.display != "none")
                div_dom.style.display = "none";
        }
    }
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

function showMarker(mapInstance, iconUrl, stationTitle, station_mid, lat, long) {
    var markerLabelClass;
    if(station_mid == "STA019" || station_mid == "STA018" || station_mid == "STA011" )
        markerLabelClass = "markerLable_top";
    else
        markerLabelClass = "markerLable";

    var markerIcon;
    // get first 3 characters of string 
    var title = stationTitle.substring(0, 3);
    
    if(title == "GAR")
    {
        markerIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="garageMarkerLable">' +stationTitle+ '</span>',
           });
    } 
    else
    {
        markerIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class='+markerLabelClass+'>' +stationTitle+ '</span>'},{ noHide : false });
    } 
    var marker = L.marker([lat, long], {
        draggable: false, // Make the icon dragable
        icon: markerIcon,
        autoPan : true,
        });
      
    marker.addTo(mapInstance);

    var popup;
    marker.on('mouseover', function(e) {
        var stringLat = ((Number(lat)).toFixed(6)).toString();
        var stringLon = ((Number(long)).toFixed(6)).toString();
        var content = stringLat+", "+ stringLon;
        if(title == "GAR")
            popup = L.popup( {className : "garagePopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);
        else    
            popup = L.popup( {className : "stationPopup"}).setLatLng(e.latlng).setContent(content).openOn(mapInstance);
    });
    marker.on('mouseout', function (e) { 
        mapInstance.closePopup(popup);
    });
    
    if(title == "GAR")
    {
        var customPopup = "";
        const customOptions = {'className': 'custom-popup3'};
        marker.bindPopup(customPopup, customOptions);//.openPopup();
        marker.on('click', function(e) {           
            // garage marker on click function ---> updates garage popup data every second 
            marker.openPopup(); 
            updateGaragePopup(marker, stationTitle);
        });
    }
}

function updateGaragePopup(marker, garageTitle)
{   
    var garageId = garageTitle.slice(-1);
    var apiUrl = "garages/"+garageId+"/";
    getMethod(apiUrl, function (data) {
        var garageData = JSON.parse(data);
        var door;
        var doorClass;
        var charger;
        if(garageData.door == false)
        {
            door = "Door closed";
            doorClass = "garageDoor_black";
        }
        else
        {
            door = "Door open";
            doorClass = "garageDoor_red";
        }

        if(garageData.charger == false)
            charger = "Not in use";
        else
            charger = "In use";
    
        marker._popup.setContent("<div id='garagePopup2' class='garagePopup2'>"+
                            "<div class='garageDiv1'><p class='garageTitle'>"+garageData.name+"</p><p class="+doorClass+">"+door+"</p></div>"+
                            "<div class='garagePopup2div'>"+
                                "<p class='garageP1 garageMargin1'>Temp</p>"+
                                "<p class='garageP2'>"+garageData.temperature+" ℃</p>"+
                            "</div>"+
                            "<div class='garagePopup2div'>"+
                                "<p class='garageP1 garageMargin1'>Humidity</p>"+
                                "<p class='garageP2'>"+garageData.humidity+"%</p>"+
                            "</div>"+
                            "<div style='text-align:center'><p class='garageP1 display_inline_block'>Charger</p> <p class='garageP3 display_inline_block'>"+charger+"</p></div>"
                        );
    });
}

function setDateTime() {
    // set the date time 
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var currentdate = new Date();
    var strDate = currentdate.getDate()+" " +months[currentdate.getMonth()]+ ", " +currentdate.getFullYear();
    var currentHour = currentdate.getHours();

    // AM or PM
     var hour_status;
     if (currentHour > 12)
         hour_status = "PM";
     else
         hour_status = "AM";

    // calculate hours 
    if(currentHour > 12)
        currentHour = currentHour - 12;
      
    if (currentHour < 10)
        currentHour = "0"+currentHour;

    // calculate minutes
    var minutes;
    if(currentdate.getMinutes() < 10)
        minutes = "0"+currentdate.getMinutes();
    else
        minutes = currentdate.getMinutes();

    var strTime = currentHour+ ":" +minutes+ ' ' +hour_status;
    document.getElementById("currentDate").innerHTML = strDate;
    document.getElementById("currentTime").innerHTML = strTime;

    // store the logged in user name in local storage
    var userName = localStorage.getItem("activeUserID");
    // trim email id to username
    var trimName = userName.substring(0, userName.indexOf('@'));
    document.getElementById("active_username").innerHTML = "안녕하세요, " +trimName;
    // update date and time after every 20 seconds
    setTimeout(setDateTime, 20000);  
}

function showChart(graph1, title, color, yAxisLable, vehicleList, yAxisList, y_unit, total) {
    for(var i = vehicleList.length; i < 4; i++) 
        vehicleList.push("");
       
    if(graph1 == 'graph2')
        document.getElementById('graphTitle1').innerHTML = title;
    else
        document.getElementById('graphTitle2').innerHTML = title;
 
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
                    //barThickness: 15,
                    //categoryPercentage: 0,
                    //barPercentage: 0,
                    offsetGridLines : false,
                    gridLines: {
                        display: false,
                        drawBorder : false,
                        offsetGridLines : false
                    },
                    ticks: {
                        fontSize: 8,
                        fontFamily: "Roboto",
                        fontStyle: "bold",
                        scaleStepWidth : 30,
                    },
                    
                }],
                yAxes: [{
                    barPercentage: 0.3,
                    categoryPercentage: 1.0,
                    offsetGridLines : false,
                    scaleLabel: {
                        display: false,
                        labelString:y_unit,
                    },
                    gridLines: {
                        display: true,
                        drawBorder : false,
                        offsetGridLines : false
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

//window.onload = function(){updateCCTV()};
function updateCCTV()
{
    // get CCTV URL 
    var dom = document.getElementById("vehicleSelect");
    var selectedId = dom.options[(dom.selectedIndex + 1)].id;
    getMethod("vehicles/"+selectedId+"/", function (data)
    {
        var vehicle = JSON.parse(data);
        var webcam ;
        var cameraSelectDom = document.getElementById("camera_select");
        var cameraSelectValue = cameraSelectDom.options[cameraSelectDom.selectedIndex].id;
        if( cameraSelectValue == 2)
            webcam = vehicle.webcam2;
        else
            webcam = vehicle.webcam1;    

        document.getElementById("hidden_cam1").style.background = 'url('+webcam+')'; 
        document.getElementById('cctv_webcam').style.background = document.getElementById("hidden_cam1").style.background;
        document.getElementById('cctv_webcam').style.backgroundSize="contain";
        console.log("webcam :"+ document.getElementById('cctv_webcam').style.background);
        document.getElementById('pausePlayButton1').src = "images/cctv/play.svg";
        document.getElementById('cameraText').style.display = "none";
        
        /*if(filePath == null)
        {
           
            var oddDom = document.getElementById("oddFile");
            oddDom.href = "";
            return false;
        }
        else
        {
            document.getElementById('oddFileSpan').className = "oddButton"; 
            var oddDom = document.getElementById("oddFile");
            oddDom.href = filePath;
        }*/
    });

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
        document.getElementById(webcam_div).style.backgroundColor = "#F2F2F2";
        document.getElementById(webcam_div).style.backgroundSize="contain";
        document.getElementById('cameraText').style.display = "block";
    } 
    else 
    {  
        updateCCTV();
        // Update the button text to 'Play'
        pausePlayButtons.src = "images/cctv/play.svg"; 
        if(webcam_div == "webcam_div1")
            document.getElementById(webcam_div).style.background = document.getElementById("hidden_cam1").style.background;
        else if(webcam_div == "webcam_div2")
            document.getElementById(webcam_div).style.background = document.getElementById("hidden_cam2").style.background ;
        document.getElementById(webcam_div).style.backgroundSize="contain";
        document.getElementById('cameraText').style.display = "none";
    }
}

function webcam(webcamId, vehicle) {
    show_div('webcam_div');
    document.getElementById("webcam_div1").style.display = "inline-block";
    document.getElementById("webcam_div2").style.display = "inline-block";
    
    if(vehicle[0] == undefined)
        return false;
    // close div with off camer=a button
    // open div with play camera and fullscreen icon
    if(vehicle[0].webcam1 != null)
    {
        document.getElementById("offCameraDiv1").style.display = "none";
        document.getElementById("playButtonDiv1").style.display = "block";
    }
    else
    {
        document.getElementById("offCameraDiv1").style.display = "block";
        document.getElementById("playButtonDiv1").style.display = "none";
    }
       
    if(vehicle[0].webcam2 != null)
    {
        document.getElementById("offCameraDiv2").style.display = "none";
        document.getElementById("playButtonDiv2").style.display = "block";
    }
    else
    {
        document.getElementById("offCameraDiv2").style.display = "block";
        document.getElementById("playButtonDiv2").style.display = "none";
    }
    //var button_id = "cameraButton" + webcamId;

    if (webcamId == '1') 
    {
        if(vehicle != null)
            var vehicleObj = vehicle[0];
        if(vehicleObj != null)
            var webcam1 = vehicleObj.webcam1;
        if (webcam1 != null) 
            document.getElementById("hidden_cam1").style.background = 'url('+webcam1+')'; 
    }
    if (webcamId == '2') 
    {
        if(vehicle != null)
            var vehicleObj = vehicle[0];
        document.getElementById("cameraButton2").src = "images/cctv/video2Active.svg";
       
        if(vehicleObj != null)
            var webcam2 = vehicleObj.webcam2;
        if (webcam2 != null) 
            document.getElementById("hidden_cam2").style.background = 'url('+webcam2+')';
    }           
}

// under- development
var active_webcam;
var activeVideoButton;
function scale_image(hidden_cam) 
{
    document.getElementById("myModal").style.display = "block";
    var div_url = document.getElementById(hidden_cam).style.background;
    document.getElementById("img01").style.backgroundImage = div_url;

    if(hidden_cam == "hidden_cam1")
    {
        active_webcam = "webcam_div1";
        activeVideoButton = "pausePlayButton1";
    }
    else if(hidden_cam == "hidden_cam2")
    {
        active_webcam = "webcam_div2";
        activeVideoButton = "pausePlayButton2";
    }
}

function siteMsgSend() {
    document.getElementById('messageModal').style.display = "block";
    var e = document.getElementById("manager_selectlist");
    var selectedUserInfo = {
        name :e.options[e.selectedIndex].innerHTML,
        email : e.options[e.selectedIndex].value,
        option_index : e.selectedIndex
    }
    selectSite2(selectedUserInfo);
}

function selectSite2(selectedUserInfo) {
    var e = document.getElementById("manager_selectlist");
    var managerSelect = document.getElementById('select_site');
    var userList = document.getElementById('select_siteManager'); 
    if(userList != null)
        userList.length = 0;
    var api_url = "sites/";
    var allUserList = [];
    var selectValue = 1;
    if(selectValue == 0)
    {
        api_url = "sites/";
        getMethod(api_url, function (data) {
            var userData = JSON.parse(data);
            var count = Object.keys(userData).length;
            for (var j=0; j<count; j++)
            {
                var userData2 = userData[j].user;
                for(var k =0 ;k< userData2.length; k++)
                    allUserList.push(userData2[k]);
            }
            
            if(allUserList.length == 0)
            {
                userList.disabled = true;
            }
            else
            {
                const uniqueAddresses = Array.from(new Set(allUserList.map(a => a.username)))
                .map(username => {
                return allUserList.find(a => a.username === username)
                })
        
                userList.disabled = false;
                for(var i=0;i < uniqueAddresses.length; i++)
                {
                    var option = document.createElement("option");
                    option.text = uniqueAddresses[i].username;
                    option.value = uniqueAddresses[i].email;
                    option.style.fontSize = "14px";
                    userList.appendChild(option);
                }
            }
        });
    }
    else
    {
        api_url = "sites/"+selectValue+"/";
        getMethod(api_url, function (data) {
            var userData = JSON.parse(data).user;
            userData = (userData.sort (ascending));
            var count = Object.keys(userData).length;
            for (var j=0; j<count; j++)
            {
                var option = document.createElement("option");
                option.text = userData[j].username;
                if(selectedUserInfo != undefined)
                {
                    if( option.text == selectedUserInfo.name)
                        option.selected = true;
                }
                option.value = userData[j].email;
                option.style.fontSize = "14px";
                userList.appendChild(option);
            }
        });
    }
}

function selectSite(select, site_no, selectedUserInfo) {
    var selectValue;
    var managerSelect = document.getElementById('select_siteManager');
   
    if(select == 'all')
        selectValue = 0;
    else
        selectValue = select[select.selectedIndex].id;

    if(managerSelect == null)
        return false; 

    if(selectValue == null || selectValue == undefined) 
    {
        managerSelect.innerText = null;
        managerSelect.disabled = true;
    } 
    else if(site_no == null)
    {
        //get list of all managers.
        // under development
        var userList = [];
    }
    else {
        // assign username to select dropdown list
        // Show manager name on main window 
        // delete all previous manager suin the list 
        managerSelect.disabled = false;
        managerSelect.length = 0;
        managerSelect.style.fontSize = "14px";
        var option = document.createElement("option");
        option.text = selectedUserInfo.name;
        option.value = selectedUserInfo.email;
        option.style.fontSize = "14px";
        managerSelect.appendChild(option);
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

    if(site_no != "0")
    {   
        if(username == managerName)
            option.selected = true;
    }
    selectDom.appendChild(option);
}

function clearMessage()
{
    hide_div('messageModal'); 
    $('#msgArea').val('');
    document.getElementById('messageSendStatus').innerHTML =  '';
    document.getElementById('byteInfo').innerHTML = 0;
}

function fnChkByte(obj, maxByte) 
{
    document.getElementById('byteInfo').innerText =  "0";
    var str = obj.value;
    var str_len = str.length;
    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";

    for (var i = 0; i < str_len; i++) 
    {
        one_char = str.charAt(i);
        if (escape(one_char).length > 4)
            rbyte += 2; // Korean 2Byte
        else 
            rbyte++; // English, etc... 1Byte
        
        if (rbyte <= maxByte) 
            rlen = i + 1; // The number of string to return
    }
    if (rbyte > maxByte)
    {
        document.getElementById('messageSendStatus').innerHTML = "메세지는 최대 " + maxByte + "byte를 초과할 수 없습니다.";
        document.getElementById('messageSendStatus').style.color = "#EB5757";
        str2 = str.substr(0, rlen); // count String
        obj.value = str2;
        fnChkByte(obj, maxByte);
    } 
    else 
    {
        if(rbyte <=199)
            document.getElementById('messageSendStatus').innerHTML='';
        document.getElementById('byteInfo').innerText = rbyte;
    }
}

// updates user account setting
function settings()
{
    document.getElementById('setting_button1').src = "images/password_reset/login_selected.svg";
    document.getElementById("user_pwd_change").src = "images/password_reset/pwd_unselected.svg";

    hide_div('logoutSetting');
    hide_div('settingDiv21');
    hide_div('settingDiv31');
    show_div('settingDialog');
    show_div('settingDiv');
   
    document.getElementById('settingDiv2').style.display = "inline-block";
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
        });
    });
    document.getElementById("user_pwd_change").style.color = "#333333";
}

function passwordChange2()
{
    hide_div('settingDiv2');
    hide_div('settingDiv3');
    document.getElementById("settingDiv21").style.display = "inline-block";
    document.getElementById("settingDiv31").style.display = "inline-block";

    // change button text color blue to show button is active
    document.getElementById("user_pwd_change").style.color = "#2E92B0";
}
 
function clearFields()
{
    document.getElementById("newPwd").value = '';
    document.getElementById("confirmPwd").value= '';
    document.getElementById("pwdResetError").innerHTML = "";
}

function resetPassword()
{
    var input_new_pwd = $("#newPwd").val();
    var input_repeat_pwd = $("#confirmPwd").val();
    var pwdErrorDom = document.getElementById("pwdResetError");

    if(input_new_pwd.length == 0)  //length of password
        pwdErrorDom.innerHTML = "새로운 비밀번호를 입력해주세요.";
    else if(input_repeat_pwd.length == 0)
        pwdErrorDom.innerHTML = "새로운 비밀번호를 다시 입력해주세요.";
    else if(input_new_pwd != input_repeat_pwd ) // two passwords are not same 
        pwdErrorDom.innerHTML ="두 개의 비밀번호가 일치하지 않습니다."
    else if(input_new_pwd.length < 8 || input_repeat_pwd.length < 8) // password is too short
        pwdErrorDom.innerHTML = "8글자 이상의 비밀번호를 입력하세요.";
    else
    {
        //check_password
        var data = JSON.stringify({
            "new_password1": input_new_pwd,
            "new_password2": input_repeat_pwd,
        });
        var api_url = server_URL+"auth/password/change/";
        postMethod(data, api_url, function (req) 
        {
            var res = JSON.parse(req.response);
            //console.log("pswd reset response :"+JSON.stringify(res));
            if(req.status == 200)
            {  
                if(res.detail == "New password has been saved.")
                {
                    pwdErrorDom.innerHTML = "새로운 비밀번호로 변경 됐습니다.";
                    pwdErrorDom.style.color = "#2E92B0";
                    localStorage.setItem('userPwd', input_new_pwd);
                }
                else{
                    pwdErrorDom.innerHTML = "다른 비밀번호를 입력해주세요.";
                    pwdErrorDom.style.color="red";
                }
            }
            else
            {
                pwdErrorDom.style.color="red";
                if ((res.new_password2).includes("This password is entirely numeric.") )
                    pwdErrorDom.innerHTML = "비밀번호에 숫자 외의 문자를 포함하세요.";
                else if (res.new_password2.includes("The password is too similar to the email address."))
                    pwdErrorDom.innerHTML = "비밀번호가 이메일ID와 너무 유사합니다.";
                else if (res.new_password2.includes("The password is too similar to the username."))
                    pwdErrorDom.innerHTML = "비밀번호가 사용자 이름과 너무 유사합니다.";
                else if(res.new_password2.includes("This password is too common."))
                    pwdErrorDom.innerHTML = "평범하지 않은 비밀번호를 입력하세요.";
                else
                    pwdErrorDom.innerHTML = "다른 비밀번호를 입력해주세요.";
            }
        });
        return true;
    }    
}

$(document).on("click", function(){
    $('.contactDiv').hide();
});
  
function stopVideoStreaming() //webcam_div, playPauseButton
{
    // close full screen 
    // stop video - make screen grey and show pause button
    document.getElementById('cctv_webcam').style.background = "none";
    document.getElementById('cctv_webcam').style.backgroundColor = "#F2F2F2";
    document.getElementById('pausePlayButton1').src = "images/cctv/pause.svg";
    document.getElementById('cameraText').style.display = "block";
} 

// Odd file status
function oddButtonStatus()
{
    var dom = document.getElementById("vehicleSelect");
    var selectedId = dom.options[dom.selectedIndex].id;
    getMethod("vehicles/"+selectedId+"/", function (data)
    {
        var vehicle = JSON.parse(data);
        var filePath = vehicle.odd; 
        if(filePath == null)
        {
            document.getElementById('oddFileSpan').className = "oddDisabled";
            var oddDom = document.getElementById("oddFile");
            oddDom.href = "";
            return false;
        }
        else
        {
            document.getElementById('oddFileSpan').className = "oddButton"; 
            var oddDom = document.getElementById("oddFile");
            oddDom.href = filePath;
        }
    });
}

// download odd file on button click
function oddFileDownload(){
    var oddDom = document.getElementById("oddFile");
    document.body.appendChild(oddDom);
    oddDom.click();
}

/* Emergency contact information */
function showEmergencyContact()
{
    document.getElementById('contactDiv').style.display = "block";
}
