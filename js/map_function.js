/*Integrated Monitoring system version 0.2
  Note : Some function from version 0.1 which 
  are not used in version 0.2  are commented  */

// Checks which route button is clicked and 
// Calls the function associated for that route 
'use strict';

var mapList = [];               // stores the id of open map 
mapList.push("offsiteMap");          //  push id of offsite map on login  

var daegu_map;
var sejong_map;
var sangam_map;
var sejong_map2;
var gunsan_map;
var cluster_map ;

var deguClickCount = 0;
var sejong1ClickCount = 0;
var sejong2ClickCount = 0;
var gunsanClickCount = 0;
var sangamClickCount = 0;
var clusterMapCount = 0;

var zoomHome_main;

function activeButton(element)
{
    var buttonList = ["main_site_button", "degu_button", "sejong_button", "sangam_button", "gunsan_button", "offsite_button"];
    for(var i = 0; i < buttonList.length; i++)
    {
        if(buttonList[i] == element.id)
        {
            element.style.backgroundColor = "#ffffff";
            element.style.color = "#185786";
        }
        else
        {                           
            document.getElementById(buttonList[i]).style.backgroundColor = "#0893BF";
            document.getElementById(buttonList[i]).style.color = "#ffffff";
        }
    }
}

function switchMap(obj)
{        
    activeButton(obj);
    //document.getElementById(obj.id).style.backgroundColor = "#ffffff";
    //document.getElementById(obj.id).style.color = "#185786";

    if(obj.id == "degu_button")
    {  
        deguClickCount++;
        if(daegu_map == undefined)
        {
            daegu_map = L.map('deguMap',{
                 zoom : 17,
                center:[35.83731,128.68384],
                zoomControl: false,
            });
        }
         
        for(var i = 0 ; i < mapList.length; i++)
            hide_div(mapList[i]);

        mapList.push("deguMap");
        document.getElementById('webcam_div1').style.display = "inline-block";
        document.getElementById('webcam_div2').style.display = "inline-block";
        hideMaps('deguMap');
        showSite(daegu_map, 2, deguClickCount); 
        show_div("alertDiv");
        document.getElementById('currentSiteId').innerHTML="2";
    }
    
    else if(obj.id == "main_site_button")
    {   
        clusterMapCount++;
        var elementsToHide = ["offsite_window", "webcam_div", "webcam_div1", "webcam_div2",  "distanceChart1", "passangerChart2"];
        hideElements(elementsToHide);
        hideMaps('offsiteMap');

       //hide_div("offsite_window");
        show_div("graph_div");
        show_div("countInfoDiv");
        //show_div("subMenuModal");
        //show_div("sejongSubmenu");
  
        //var elementsToShow = ["webcam_div", "degu_window"];
        //showElements(elementsToShow);

        // create offsite map
        var leftCenter = [35.951,133.066];
        if(cluster_map == undefined)
        {            
            cluster_map = L.map('offsiteMap', {
                zoomSnap: 0.15,      
                dragging: true, //false
                draggable:true,
                scrollWheelZoom: true, //false
                color: "rgba(8, 148, 19)",
                zoomControl: false,
                zoom:7,
                center:leftCenter
            });
            zoomHome_main = L.Control.zoomHome();
            zoomHome_main.addTo(cluster_map);   
        }
        else
        {
            cluster_map.panTo(leftCenter);
            cluster_map.setView(leftCenter);
          //  cluster_map.setView([35.902, 128.013], 7)
            zoomHome_main.setHomeCoordinates([35.951,133.066], 7);
        }
        
        //cluster_map.panTo(leftCenter);
        show_div("graph_div");
        // show_div("graph2_div");
        show_div("countInfoDiv");
        showCluster(cluster_map);
        document.getElementById('currentSiteId').innerHTML="0";
    }

    else if(obj.id == "sejong_button" )
    {   
        show_div("subMenuModal");
        show_div("sejongSubmenu");       
    }

    else if(obj.id == "sejong_button1")
    {       
        sejong1ClickCount++;
        if(sejong_map == undefined)
        {
            sejong_map = L.map('sejongMap',{
                zoom : 18,
                center:[36.499951, 127.270606],
                zoomControl: false,
            });
   
        }

        if(daegu_interval != null)
            clearInterval(daegu_interval);

        hideMaps('sejongMap'); 

        //show_div("subMenuModal");    
        show_div("sejongSubmenu");

        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        show_div("sejongMap");
        mapList.push("sejongMap");
        hide_div('countInfoDiv');
       // var elementsToHide = [ "webcam_div1", "webcam_div2", "webcam_div"];
       // hideElements(elementsToHide);
       // show_div("webcam_div");
       // show_div('webcam_div1');
        //show_div('webcam_div2');
        showSite(sejong_map, 3, sejong1ClickCount); 
        //sejongRoute(); 
        open_tab('degu_window',3);
        show_div("alertDiv");
        document.getElementById('currentSiteId').innerHTML="3";
    }
    else if(obj.id == "sejong_button2")
    {       
        sejong2ClickCount++;
        if(daegu_interval != null)
            clearInterval(daegu_interval);

        if(sejong_map2 == undefined)
        {
            sejong_map2 = L.map('sejongMap2',{
                zoom : 14,
                center:[36.492,125.793],
                zoomControl: false,
            });
        }    

        show_div("sejongSubmenu");
        hideMaps('sejongMap2'); 
        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        // show_div("sejongMap2");
        mapList.push("sejongMap2");
       // var elementsToHide = [ "webcam_div1", "webcam_div2", "webcam_div"];     
        //hideElements(elementsToHide);
       
        //hide_div('webcam_div2');
        hide_div('countInfoDiv');
        //sejongRoute2(); 
        showSite(sejong_map2, 18, sejong2ClickCount); 
        open_tab('degu_window',18);
        show_div("alertDiv");
        document.getElementById('currentSiteId').innerHTML="18";
    }
    else if(obj.id == "sangam_button")
    {
        console.log("sangam button is clicked");
        sangamClickCount++;
        if(daegu_interval != null)
            clearInterval(daegu_interval);

        console.log("sangam_map :"+sangam_map);
        if(sangam_map == undefined)
        {
            sangam_map = L.map('sangamMap',{
                zoom : 16,
                center:[37.579333, 126.889036],
                zoomControl: false,
            });
        }
    
       
        //alert(document.getElementById("sangamMap").style.display);
        //show_div("sangamMap");
        for(var i = 0; i < mapList.length; i++)
        {
            hide_div(mapList[i]);
            //alert("hide:"+mapList[i]);
        }        
        
        mapList.push("sangamMap");
        hideMaps("sangamMap");
        hide_div('countInfoDiv');
        showSite(sangam_map, 4, sangamClickCount); 
        open_tab('degu_window',4);
        show_div("alertDiv");
        document.getElementById('currentSiteId').innerHTML = "4";
    }
    else if(obj.id == "gunsan_button")
    {
        gunsanClickCount++;
        if(daegu_interval != null)
            clearInterval(daegu_interval);

        if(gunsan_map == undefined)
        {
            gunsan_map = L.map('gunsanMap',{
                zoom : 16,
                center:[35.812484, 126.409100],
                zoomControl: false,
            });
        }

        for(var i = 0; i < mapList.length; i++)
            hide_div(mapList[i]);
        hideMaps("gunsanMap");
        mapList.push("gunsanMap");
        //var elementsToHide = [ "webcam_div1", "webcam_div2", "webcam_div"];     
       // hideElements(elementsToHide);
   
        hide_div('countInfoDiv');
        //gunsanRoute(1); 
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
        if(cluster_map == undefined)
        {
            cluster_map = L.map('offsiteMap', {
                zoomSnap: 0.15,      
                dragging: true, //false
                draggable:true,
                scrollWheelZoom: true, //false
                color:"rgba(8, 148, 19)",
                zoomControl: false,
                zoom:7,
                center:rightCenter
            });
        }
       
        cluster_map.setView([35.902, 128.013], 7)
        zoomHome_main.setHomeCoordinates([35.902, 128.013]);
        cluster_map.invalidateSize();
        var elementsToHide = [ "graph_div", "countInfoDiv", "webcam_div", "webcam_div1", "webcam_div2", "distanceChart1", "passangerChart2"];     
        hideElements(elementsToHide);
         
        mapList.push("offsiteMap"); 
        hide_div("alertDiv");
        hideMaps("offsiteMap");
        hide_div("webcam_div1");
        hide_div("webcam_div2");
        hide_div("webcam_div");
        hide_div("distanceChart1");
        hide_div("passangerChart2");
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


var daegu_interval;
// Daegu monitoring
function showSite(mapInstance, currentSiteId, clickCount, mapToShow) 
{
    //hideMaps(mapToShow);
    if(interval != null)
        clearInterval(interval);

    if(daegu_interval != null)
        clearInterval(daegu_interval);
        
    var deguShuttleArray=[]; // stores info of each vehicle in object form on degu route
    
    // clear events div
    document.getElementById("eventsDiv").innerHTML = ''; 
    
    var elementsToHide = ["graph_div", "countInfoDiv", "listItem", "offsite_window"];
    var elementsToShow = ["webcam_div", "degu_window"];

    hideElements(elementsToHide);
    showElements(elementsToShow);
    open_tab('degu_window',currentSiteId);
         
    if(clickCount <= 1)
    {   
        //var start2 = Date.now();
        mapInstance = createMap( mapInstance);
        // show stations, kiosk, garage, V2X on degu route.
        showRouteInfo(mapInstance, "stations/", "route/station_kiosk.svg", currentSiteId);
        //alert("stationArray");
        showRouteInfo(mapInstance, "garages/", "route/garageIcon.svg", currentSiteId);
        showDataCenter(mapInstance, currentSiteId);
        show_v2x(mapInstance, "v2x/", currentSiteId);
        //var responseTime2 = Date.now()-start2;
       // console.log("Response 2 time seconds:"+((responseTime2 % 60000) / 1000).toFixed(0)+" seconds");
    }
   
    // Show All the shuttles on degu route
    var reqCount = 0;
    var firstId; 
    var vehicleObj=[];

    // var beginTime = System.currentTimeMillis();
    var start = Date.now();
    //console.log("start time :"+Math.floor(start / 1000)+" Milli seconds");
    // console.log("Begin time Vehicle API :"+System.currentTimeMillis());
    // get all vehicle Id's.
    getMethod("vehicles/", function (data) {
       var responseTime = Date.now()-start;
        //console.log("Response Time milliseconds :"+responseTime);
        console.log("Response time seconds:"+((responseTime % 60000) / 1000).toFixed(0)+" seconds");
        var vehicle_data = JSON.parse(data).results;
        if (vehicle_data == undefined) 
            vehicle_data = JSON.parse(data);
        var count = Object.keys(vehicle_data).length;

        // create vehicle obj and store in array
        for (var i = 0; i < count; i++) {
            var vehicle = vehicle_data[i];
            if (vehicle.site == currentSiteId){
                //console.log("currentSiteId:"+ JSON.stringify(vehicle));
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
 
        // update status of webcam  
        document.getElementById("hidden_cam1").style.background= "";
        document.getElementById("hidden_cam2").style.background= "";
        document.getElementById("webcam_div1").style.background= "#828282";
        document.getElementById("webcam_div2").style.background= "#828282";
        if(document.getElementById("pausePlayButton1").src= "images/cctv/play.svg")
            document.getElementById("pausePlayButton1").src= "images/cctv/pause.svg";
        if(document.getElementById("pausePlayButton2").src= "images/cctv/play.svg")
            document.getElementById("pausePlayButton2").src= "images/cctv/pause.svg";

        webcam('1', vehicleObj);
        webcam('2', vehicleObj);
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
                /*document.getElementById('contact_button').style.backgroundColor = "#CA4040"; */
                document.getElementById('contact_button').style.backgroundColor = "#ffffff";
                document.getElementById('contact_button').style.border  = "0.5px solid #CA4040";
                document.getElementById('contact_button').style.color = "#CA4040";
                document.getElementById('contact_button').style.pointerEvents ="auto";
            }
        });
    });
    show_div("alertDiv");

    // websocket connection
    openWSConnection();
}

function launchFullScreen(element) {
    //alert("launching");
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }
  
var switchStatus =false;
function toggledSwitch()
{
    if(switchStatus == false)
        switchStatus =true;
    else
        switchStatus = false;
    
    //alert("switchStatus :"+switchStatus);
      //  fullscreen();

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

// detect F11 keypress // update switch button on F11 key event
window.onresize = function (event) {
   var maxHeight = window.screen.height,
        maxWidth = window.screen.width,
        curHeight = window.innerHeight,
        curWidth = window.innerWidth;

    if (maxWidth == curWidth && maxHeight == curHeight) {
        switchStatus = true;
        $("#switchButton").prop('checked', switchStatus);
    }
    else{
        switchStatus = false;
        $("#switchButton").prop('checked', switchStatus);
    }
}


function offsite() {
    // hide all div's from site route
    for(var i = 0; i < mapList.length; i++)
        hide_div(mapList[i]);
    
   // hide_div("listItem");
   // mapList.push("offsiteMap"); 
    //hide_div("alertDiv");
    

   /* hide_div("distanceChart1");
    hide_div("passangerChart2");
    hide_div("webcam_div");*/

    // show all div's of offsite
   // hideMaps("offsiteMap");
   // hide_div("graph_div");
   // hide_div("countInfoDiv");

    // change center of map 
    //var map_center = [35.902, 128.013];
    //cluster_map.panTo(map_center);
    
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
        for (var i = 0; i < count; i++) {
            vehicleList.push(graph_data[i].vehicle);
            passengerList.push(graph_data[i].accum_passenger);
            distanceList.push(graph_data[i].accum_distance);
        }

        //document.getElementById('totalData').innerHTML = ;
        //distanceList
        document.getElementById('totalDistance').innerHTML = Number(distanceList.reduce(function(pv, cv) { return pv + cv; }, 0)).toLocaleString('en');
        //passengerList
        document.getElementById('totalPassenger').innerHTML = Number(passengerList.reduce(function(pv, cv) { return pv + cv; }, 0)).toLocaleString('en');

        highchart('graph3', '총 데이터 용량', '#3bc7d1', 'Data', vehicleList, distanceList, 'GB');
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

function showCluster(cluster_map)
{
    // hide data of other sites if open 
    hideMaps('offsiteMap');
    hide_div("alertDiv");
    hide_div("degu_window");
    // show data for offsite.
    showGraphs();
    // array to store lat-lon of cluster 
    var addressPoints = []; 
    if(clusterMapCount <= 1)
    {
        // get location of clusters using REST api
        getMethod("routes/", function (routes_data) {
            var cluster_data = JSON.parse(routes_data).results;
            var count = Object.keys(cluster_data).length;
            for (i = 0; i < count; i++) {
                if(cluster_data[i].start != '')
                    addressPoints.push(cluster_data[i].start);
            }

            // create openstreet tile layer
            var clusterLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });

            // add layer to map with zoom level
            clusterLayer.addTo(cluster_map);
           // var zoomHome = L.Control.zoomHome();

          //  zoomHome.addTo(cluster_map);     
            
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
            cluster_map.invalidateSize(); // refresh map 
            //alert("cluster_map :"+cluster_map);
        });
    }
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
    // clear interval 
    clearInterval(interval);
   
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
           /* if(count15 == 16)
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
            }*/
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
        document.getElementById("vehicleVersion").innerHTML = "version : NA";
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

    updateFrontStaus(vehicle.parkingbrake, vehicle.speed );
    // change driving color
    if(vehicle.parkingbrake == '1' || vehicle.parkingbrake == null)
        vehicleStatus("PARKED", "rgb(128,128,128)");
    else if(vehicle.speed > 0) 
        vehicleStatus( "DRIVING", "#57AE66");
    else
        vehicleStatus( "STOPPED", "#CA4040");
   
    // Vehicle name and version     
    document.getElementById("vehicleID").innerHTML = vehicle.name;
    document.getElementById("vehicleVersion").innerHTML = "version : "+vehicle.model.firmware;
                        
    // show speed of vehicle
    setVehicleSpeed(vehicle.speed);
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
        // update parking status fir first time 
        // if(vehicle.isparked == true)
          //  vehicleStatus("PARKED", "rgb(128,128,128)");

        // oddFile Status update
      //  oddFileDownload(vehicle.odd);
    }
    // show battery status
    setBatteryPercent(vehicle.battery);

    
    // show webcam
    checkWebcam(vehicle.webcam1, 'cameraButton1', 'video1', 'video1Active');
    checkWebcam(vehicle.webcam2, 'cameraButton2', 'video2', 'video2Active');
}

function updateFrontStaus(parkingBreak, speed)
{
    var frontBG;
    if(parkingBreak == 0 || speed > 0)
        frontBG = "#57AE66";
    else
        frontBG = "#BDBDBD";
    document.getElementById("v_front").style.background = frontBG;
}

function updateGnssBgcolor(gnss_status)
{
    if (gnss_status == true)
        document.getElementById("gnss_v1").style.backgroundColor = "#57AE66";
    else
        document.getElementById("gnss_v1").style.backgroundColor = "#CA4040";
}

function updateDrive(drive_mode)
{
    //I considered drive_mode as 1,2 or null
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
    for(var i = 0; i < objArray.length; i++)
    {
        var option = document.createElement("option");
        option.text = objArray[i].name;
        option.id = objArray[i].id;
        selectDom.add(option);
    }
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
}

function createHtmlMarker(vehicleObj, iconHtml)
{
   // if(vehicleObj.lat == null )
       // return false;

    //alert("create html marker :"+vehicleObj.lat+" "+vehicleObj.lon+ "mid : "+vehicleObj.mid);
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
function showVehicleRipple(request_count, mapInstance, vehicleInfo){ 
        //console.log("showVehicleRipple():"+mapInstance);
        var vehicleMarker;
        // loop throught array vehicles of route
        for(var j = 0; j < vehicleInfo.length; j++)
        {        
            ///console.log("vehicleInfo array"+vehicleInfo[j].name );
            var vehicleObj = vehicleInfo[j];

            if(vehicleObj.lat == null || vehicleObj.lon == null)
                continue;

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
            
            // grey ripple marker html
            var greyIconHtml = '<div id="vehicleRippleDiv" class="shuttle_icon">'+
                                    '<div id="ring1" class="shuttle_ring1_grey"></div>'+
                                    '<div id="ring2" class="shuttle_ring2_grey"></div>'+
                                    '<div id="ring3" class="shuttle_ring3_grey"></div>'+
                                    '<div id="ring4" class="shuttle_ring4_grey"></div>'+
                                '</div>';
        
            const redRippleIcon = L.divIcon({html: redIconHtml});
            const greenRippleIcon = L.divIcon({html: greenIconHtml});
            const greyRippleIcon = L.divIcon({html: greyIconHtml});

           // console.log("vehicleObj :"+ JSON.stringify(vehicleObj));
            if (request_count == 1) 
            {
                // create Icon for ripple marker as per the speed value
                if(vehicleObj.parkingbrake == "1" || vehicleObj.parkingbrake == null) //vehicleObj.isparked == true |
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
                    iconSize: [37, 52],
                    popupAnchor: [5, -45],
                    iconAnchor: [20, 40],
                    iconUrl: iconUrl,
                });

                // Create vehicle marker 
                vehicleMarker = createHtmlMarker(vehicleObj, vehicleIcon);            
                vehicleMarker._leaflet_id = vehicleObj.name;
                //if(vehicleObj.speed > 0)                                              // to avoid abnormal data of heading, update heading data only if speed is > 0 

                /*if (vehicleObj.speed > 0  ) //|| vehicleObj.drive == true
                {
                    marker.options.rotationAngle = vehicleObj.heading;
                    vehicleMarker.options.rotationAngle = vehicleObj.heading;
                }*/

                 if (vehicleObj.speed > 0) // || vehicleObj.drive == true
                {
                    vehicleMarker.options.rotationAngle = vehicleObj.heading;               // rotate marker of speed is greater then 0 to avoid abnormal data
                }
                  
                // create html and append to popup div
                var customPopup = "";
                const customOptions = {'className': 'custom-popup2'};
                vehicleMarker.bindPopup(customPopup, customOptions).openPopup();               // bind popup to vehicle marker                   
                vehicleMarker.on('click', function(e) {           
                    // vehicle marker on click function ---> updates vehicle popup data every second 
                    setPopupContent(e, mapInstance);
             
            });

            //if(vehicleObj.speed > 0)
                //vehicleMarker.options.rotationAngle = vehicleObj.heading;
            //alert("vehicleMarker._leaflet_id :"+vehicleMarker._leaflet_id);
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
                    //console.log("else Lat:"+vehicleObj.lat+ "Lon:"+vehicleObj.lon+ "name :"+vehicleObj.name);
                    var newLatLng = new L.LatLng(vehicleObj.lat, vehicleObj.lon);
                    var currentRipple = rippleMarkerArray[i].marker;
                    currentRipple.setLatLng(newLatLng);                                         // update the location of ripple marker

                    //alert("nbn:"+vehicleObj.isparked);
                    // change speed status in left side window
                    if ( vehicleObj.parkingbrake =='1' || vehicleObj.parkingbrake == null ) //vehicleObj.isparked == true ||
                    {
                        currentRipple.setIcon(greyRippleIcon);
                    }
                    else if (vehicleObj.speed > 0 ) //|| vehicleObj.drive == true //&& vehicleObj.isparked == false 
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

                    //if(vehicleObj.speed > 0) 
                        //currentVehicle.options.rotationAngle = vehicleObj.heading;

                    if (vehicleObj.speed > 0 ) //|| vehicleObj.drive == true
                    {   
                       currentVehicle.options.rotationAngle = vehicleObj.heading;
                    }

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
                    setPopupSpeed(shuttleMarkerArray[k].speed);                    // update popup speed value 
                }
            });

            // Update left window vehicle info. when vehicle popup is clicked
            document.getElementById('vehicleSelect').value = shuttleMarkerArray[k].name;  
            vehicleInfo(mapInstance, shuttleMarkerArray[k].markId);
            oddButtonStatus();
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
   // console.log("shuttleOnRoute()"+mapInstance);
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
        showVehicleRipple(reqCount,mapInstance,vLocationArray);
    });
}

function noVehicleInfo()
{
    //vehicleInfo(null , null);
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
    document.getElementById("distanceChart1").style.display = "inline-block";
    document.getElementById("passangerChart2").style.display = "inline-block";
    
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
           // alert("passengerList :"+passengerList);
          //  todayChart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, nameList);
            highchart('todayDistance', '총 운행거리', colorList, 'Distance(km)', nameList, distanceList, 'km');
            highchart('todayPassenger', '총 탑승자 수', colorList, 'Passenger', nameList, passengerList, '명');
         //   todayChart('todayPassenger', '총 탑승자 수', colorList, 'Passenger', nameList, passengerList);
        } /*else if (req.status == 401)
            alert("Authentication credentials were not provided");
        else if (req.status == 404)
            alert("User record not found");*/
        //console.log("chart data status: " +req.status);
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
            console.log("Authentication credentials were not provided");
        else if (request.status == 403)
            console.log("Unauthorized access to accounts")
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
    //  alert("api_name :"+api_name);
    getMethod(api_name, function(data) {
        var iconData = JSON.parse(data).results;
        if (iconData == undefined)
            var iconData = JSON.parse(data);
                    
        var count = Object.keys(iconData).length;
       
        var kioskTitleArray=[];
        var stationTitleArray=[];
        
        for (var i = 0; i < count; i++) {
            if (iconData[i].site == site_no) {
                if (api_name == "stations/" ) //&& site_no != 18
                {
                    stationWp_array.push(L.latLng(iconData[i].lat, iconData[i].lon)); // array for station location on route
                    
                    var stationTitle = iconData[i].name;
                    var kiosk_title = iconData[i].mid;
                    var stationLat = iconData[i].lat;
                    var stationLon = iconData[i].lon;
                    stationTitleArray.push(stationTitle); // array for station title
                  
                    // check if kiosk for the station is available in kiosk api
                    var kioskTitle = "KIS" +kiosk_title.substring(3);
                    if(iconData.iskiosk ==true)
                         status = true;//stationTitleArray.includes(kioskTitle);
                    else
                     status = false

                    // array of kiosk title 
                    if(status == true)
                        kioskTitleArray.push(kioskTitle);
                    //else
                        kioskTitleArray.push(kioskTitle);

                    if (status == true ) //|| site_no == 18
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
          else if( site_no == 18)
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
            /*if( site_no == 18)
            {
                sejongWaypoints = [
                    L.latLng(36.4994300000000000,127.3284000000000000),
                    L.latLng(36.50078,127.32962),
                    L.latLng(36.4996800000000000,127.3323300000000000),
                    L.latLng(36.4945400000000000,127.3258500000000000),
                    L.latLng(36.49448,127.32282),
                    L.latLng(36.4974200000000000,127.3227800000000000),
                    L.latLng(36.49836, 127.32659),
                    L.latLng(36.4994300000000000,127.3284000000000000)];
                createRoute(mapInstance, sejongWaypoints, stationTitleArray, kioskTitleArray);
            }
      
            else*/
                createRoute(mapInstance, stationWp_array, stationTitleArray, kioskTitleArray, site_no);
        }
    });
}

function updateETA(site_no)
{
    var stationArray=[];
    var station_mid = [];

    getMethod("stations/", function(data) {
        var stationData = JSON.parse(data);
        var count = Object.keys(stationData).length;
        for (var i = 0; i < count; i++) {
           // alert("site :"+stationData[i].site+ " site no :"+site_no);
            if (stationData[i].site == site_no)
            {
                stationArray.push(stationData[i].name);
                station_mid.push(stationData[i].mid);
            }
        }

    // station list
    var divElement = document.getElementById('stationList');
    divElement.innerHTML = "";

    // list element - blue line
    $("#station_li").empty();

    // eta list 
    $("#eta_list").empty();
    //
    //alert("stationArray :"+stationArray);

    for(var j = 0; j < stationArray.length; j++)
    { 
        // station name 
        var stationHtml = "<p style='margin-bottom:15px'>"+
                        "<span class='timeSpan1'>"+stationArray[j]+"</span>"+
                        "<span class ='timeSpan2'>STA00"+(j+1)+"</span>"+
                        "</p>";

        divElement.insertAdjacentHTML('beforeend', stationHtml);
                    
        // blue line which indicate ETA
       // $("#station_li ul").append('<li></li>');
       $("#station_li").append(' <p class="eta_circle"></p>');
      // $("#station_li").append(' <span class="eta_line"></span>');
       

        //alert("height:"+$("#station_li ul").scrollHeight);
        //let myElement = document.querySelector("#station_li ul");
       //// myElement.style.height = (myElement.style.height + 155)+"px";
        // $("#station_li ul").height = ""($("#station_li ul")[0].height+55)+"px";
        //ul.bar 

        // ETA in minutes
        var p = "<p style='margin-bottom:30px;'>곧 도착 또는 출발</p>";
        $("#eta_list ").append(p);

        }
    });
}

// create route using control routing plugin leaflet 
function createRoute(mapInstance, waypoints, stationTitle,kioskTitle, site_no) {
    //alert("mapInstance:"+mapInstance+" waypoints:"+waypoints);
   // alert("stationTitle:" +stationTitle);
    var iconUrl= 'images/route/station_kiosk.svg';
    var control = L.Routing.control({
        waypoints: waypoints,
        serviceUrl: 'http://115.93.143.2:8104/route/v1',
        dragging:false,
        routeWhileDragging:false,
        createMarker: function (i, wp) {
            if(stationTitle[i] != undefined)
            {
                if(site_no == 18)
                {
                    var stationIcon = new L.DivIcon();
                }
                else{
                    var stationIcon = new L.DivIcon({
                    html :'<img src= '+iconUrl+'>'+
                        '<span class="markerLable">'+stationTitle[i]+'</span>'+
                        '<span class="markerLable">'+kioskTitle[i]+'</span>' 
                    });
                }  
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
        fitSelectedRoutes: true,
        draggableWaypoints: false,
        addWaypoints: false,
        //autoRoute: true,
        showAlternatives: false,
        show: false,
     
    }).addTo(mapInstance);
    //control.autoRoute.disabled();
    L.Routing.errorControl(control).addTo(mapInstance);
}

// creates map with given mapcenter and zoom level
function createMap(mapInstance) {
    

    mapInstance.zoomSnap = 0.15;
   // mapInstance.zoomControl.disable();
    mapInstance.scrollWheelZoom.enable();
    mapInstance.dragging.enable();

    var mapLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    mapLayer.addTo(mapInstance);
   // alert("createMap");
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(mapInstance);  
  
  //  var zoomHome = L.Control.zoomHome();
    //cluster_map.setView([35.902, 128.013], 7)
  //  mapInstance.setView(mapCenter);
   // zoomHome.setHomeCoordinates(mapCenter);
    //cluster_map.zoomHome.setHomeCoordinates(mapCenter);
    //zoomHome.addTo(mapInstance);
    mapInstance.invalidateSize();
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
var dowun
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
        //console.log("sites_data :"+sites_data);
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
    //alert("site_manager_array :"+site_manager_array);
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
            select.add(option, i + 1);
        });
    }
}

function msg_modal() {
    show_div('messageModal');
    selectSite('all', null,null);
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
                                '<hr style="border: 0.5px solid #BDBDBD; width:97%; float:left; margin:5px 0px 5px 0px" />'+
                            '</div>';
            }
            else{
                var html = '<div id="noticeDiv" style="width: 100%">'+
                                '<span id="noticeTitle' +i+ '" class = "noticeSpan2">' +obj[0].title+'</span>'+
                                '<button class = "divButton" id="noticeButton' +i+ '" onclick=" toggle_div2(noticeDetails' +i+ ', ' +i+ ')" >'+
                                '<i class = "fa fa-angle-down" style = "vertical-align: top;"></i> </button>' +
                                '<br/>' +
                              
                                '<lable style="margin-top:15px;" class="noticeLabel1">' +obj[0].created_on+'</lable>' +
                                '<br/>' +
                                '<br/>' +
                                '<div id = "noticeDetails' +i+ '" class = "noticeDiv1">' +
                                    '<p>' +obj[0].contents+ '</p>' +
                                '</div>' +
                                '<hr style="border: 0.5px solid #BDBDBD;/>' +
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
    var div_dom = document.getElementById(div_id);
    if (div_dom != null)
        div_dom.style.display = "none";
}

function hideElements(div_array) {
    for(var i = 0; i < div_array.length; i++)
    {
        var div_dom = document.getElementById(div_array[i]);
        //console.log( "div_array[i] :"+div_array[i]);
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
            div_dom.style.display = "block";
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
        //console.log("mapList:"+mapList[i]+ " activeMap:"+activeMap);
        var div_dom = document.getElementById(mapList[i]);
        if (mapList[i] == activeMap)
        {
            if(div_dom.style.display != "block")
            {
                div_dom.style.display = "block";
                console.log("block "+activeMap+ " map : display: " +div_dom.style.display);
               // alert(mapList[i] + " : " + div_dom.style.display);
            }
        }
        else
        {
            if(div_dom.style.display != "none")
            {
                div_dom.style.display = "none";
               // alert(mapList[i] + " : " + div_dom.style.display);
            }
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

function showMarker(mapInstance, iconUrl, stationTitle, kioskTitle, lat, long) {
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
    else if(kioskTitle == 'false') 
    {
        markerIcon = new L.DivIcon({
            html: '<img src='+iconUrl+'>' +
                '<span class="markerLable">' +stationTitle+ '</span>'});
    } 
    else
    {
        markerIcon = new L.DivIcon({
        //  Fake station icons 
        /*  html: '<img src='+iconUrl+'>' +
            '<span class="markerLable">' +stationTitle+ '</span>' +
            '<br><span class="markerLable">' +kioskTitle+ '</span>'*/
        })
    }

    var marker = L.marker([lat, long], {
        draggable: false, // Make the icon dragable
        icon: markerIcon,
        autoPan : true
    });
      
    //const customPopup = "<ul><li>" + stationTitle + "</li><ul>";
    //const customOptions = {'className': 'custom-popup', autoPan: false, autoClose: false }
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
    document.getElementById("active_username").innerHTML = trimName;
    // update date and time after every 20 seconds
    setTimeout(setDateTime, 20000);  
}

function highchart(graph1, title, color, yAxisLable, vehicleList, yAxisList, y_unit) {
    for(var i = vehicleList.length; i < 4; i++) 
        vehicleList.push("");

    if(graph1 == 'graph2')
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
                        //barThickness: 15,
                        //categoryPercentage: 0,
                        //barPercentage: 0,
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
                        barPercentage: 0.3,
                        categoryPercentage: 1.0,

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
    if(vehicle[0] == undefined)
        return false;
  
    show_div('webcam_div');
    document.getElementById("webcam_div1").style.display = "inline-block";
    document.getElementById("webcam_div2").style.display = "inline-block";

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
            //document.getElementById("webcam_div1").style.display = "inline-block";
            document.getElementById("hidden_cam1").style.background = 'url('+webcam1+')'; 
            //alert("hiddeb:"+ document.getElementById("hidden_cam1").style.background);
        }
    }
    if (webcamId == '2') {
        if(vehicle != null)
            var vehicleObj = vehicle[0];
        document.getElementById("cameraButton2").src = "images/cctv/video2Active.svg";
        if(vehicleObj != null)
            var webcam2 = vehicleObj.webcam2;
        if (webcam2 != null) {
            //document.getElementById("webcam_div2").style.display = "inline-block";
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

function siteMsgSend() {
    // Send message to manager of the site. 
    // Get email from session variable.
    var optionCount = $('#manager_selectlist option').length;
    var e = document.getElementById("manager_selectlist");
    // If manager list is empty don't open message window 
    if(optionCount == 0)
        return false;

    document.getElementById('messageModal').style.display = "block";

    // current selected site is
    var currentSiteId = document.getElementById('currentSiteId').innerHTML;
    
    // get the site number and selected manager from the select box. 
    var t = document.getElementById("select_site");
    t.selectedIndex = currentSiteId; 
    
    // currently selected manager's info.
    var selectedUserInfo = {
        name :e.options[e.selectedIndex].innerHTML,
        email : e.options[e.selectedIndex].value
    }
 
    var current_siteId = document.getElementById('currentSiteId').innerHTML;
    selectSite('all',current_siteId,selectedUserInfo);
}

function selectSite(select, site_no, selectedUserInfo) {
    var selectValue;
    var managerSelect = document.getElementById('select_siteManager');
   
    if(select == 'all')
        selectValue = 0;
    else
        selectValue = select[select.selectedIndex].id;

    if(selectValue == null || selectValue == undefined) 
    {
        managerSelect.innerText = null;
        //alert("No managers are available");
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
   // alert("selectDom:"+selectDom+" username :"+username+" = managerName :"+managerName);
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
        //alert("메세지는 최대 " + maxByte + "byte를 초과할 수 없습니다.")
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

// hide message div
/*
document.addEventListener('mouseup', function(e) {
    var container = document.getElementById('contactDiv');
    if (!container.contains(e.target)) {
      container.style.display = 'none';
    }
  });
*/

  $(document).on("click", function(){
    $('.contactDiv').hide();
  });
  
function stopVideoStreaming()
{
    // close full screen 
    hide_div("myModal");

    // stop video 
} 

// Odd file status
function oddButtonStatus()
{
    var dom = document.getElementById("vehicleSelect");
    var selectedId = dom.options[dom.selectedIndex].id;
    getMethod("vehicles/"+selectedId+"/", function (data) {
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