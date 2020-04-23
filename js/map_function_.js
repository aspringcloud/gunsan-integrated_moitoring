function showCluster()
{
    var container = L.DomUtil.get('mapid'); 
    if(container != null)
        container._leaflet_id = null; 

    /*var offsite_window_div = document.getElementById("offsite_window");

    if (offsite_window_div.style.display === "none") 
        offsite_window_div.style.display = "block";
    else 
        offsite_window_div.style.display = "none";*/
    
    var addressPoints = [
        [37.27943075229118, 127.01763998406159],
        [37.55915668706214, 126.92536526611102],
        [37.55227862908755, 126.92280546294998],
        [37.490413948014606,127.02079678472444]
    ]

    var map = L.map('mapid',{
        zoomSnap : 0.15,
        minZoom : 7.75,
        maxZoom : 7.75,
        dragging : false

    }).setView([35.902,128.013],7);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var markers = L.markerClusterGroup();
    for (var i = 0; i < addressPoints.length; i++) {
        var a = addressPoints[i];
        var marker = L.marker(new L.LatLng(a[0], a[1]));
        markers.addLayer(marker);
    }
    map.addLayer(markers);
    map.invalidateSize();
}

function deguRoute(){
    var container = L.DomUtil.get('mapid'); 
    if(container != null)
        container._leaflet_id = null; 

    //initialize the map on the "map" div with a given center and zoom
    var map = L.map('mapid', {
        center:[35.836308,128.685847],// [37.544755, 127.090340],
        zoom: 17,
        minZoom:17,
        zoomControl: false,
        routeWhileDragging: false,
        show:false,
        collapsible: false, 
        contextmenu: false,
        closePopupOnClick :false,
    });

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
    }).addTo(map); 

    var waypoints = [
        L.latLng(35.836308,128.681547),
        L.latLng(35.838673,128.687892),
        L.latLng(35.837050,128.690044),
        L.latLng(35.834590,128.686520),
        L.latLng(35.836308,128.681545),
       ];
   
    //From - 35.83604,128.68135 // To - 35.83579,128.68131
    var control = L.Routing.control({
        waypoints:waypoints,
        serviceUrl:'http://115.93.143.2:8104/route/v1',
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
            icon: L.icon({
                iconUrl: 'images/Icon_Station.svg',
                iconSize: [40, 54.75],
                iconAnchor: [10, 41],
                popupAnchor: [2, -40],
            }),
            draggable: false
        });
    },
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#00B2FF',  weight: 6}]},
        autoRoute:true,
        showAlternatives: false,
        show:false,
    }).addTo(map);

    L.Routing.errorControl(control).addTo(map);
    showMarker(map, "images/Icon_Station.svg","SCS001",35.836308,128.681547);
    showMarker(map, "images/Icon_Station.svg","SCS002",35.838673,128.687892);
    showMarker(map, "images/Icon_Station.svg","SCS003",35.837050,128.690044);
    showMarker(map, "images/Icon_Station.svg","SCS004",35.834590,128.686520);
    showMarker(map, "images/Icon_Kiosk.svg","SCK001",35.836308,128.681847);
    showMarker(map, "images/Icon_Kiosk.svg","SCK002",35.838673,128.688192);
    showMarker(map, "images/Icon_Kiosk.svg","SCK003",35.83705,128.69033);
    showMarker(map, "images/Icon_Kiosk.svg","SCK004",35.834590,128.686820);
    showMarker(map, "images/Icon_Garage.svg","SCG001", 35.835067, 128.682933);

    var icon_html = '<div class="shuttle_ripple shuttle_icon">'+
    ' <div class="shuttle_ring1"></div>'+
    ' <div class="shuttle_ring2"></div>'+
    ' <div class="shuttle_ring3"></div>'+
    ' <div class="shuttle_ring4"></div>'+
    '</div>';
    showRippleMarker(map,icon_html,35.8348,128.6899);
    showVehicle(map, "images/Icon_Vehicle.svg","SCN001", 35.8348,128.6899);
    
    var datahub_array = [{"lat": 35.835180, "lon":128.682385, "id":"Data hub"},];
    var v2x_array = [
        {"lat": 35.83506, "lon":128.68125, "id":"V2X-10010"},
        {"lat": 35.8362733, "lon":128.6814035, "id":"V2X-10220"},
        {"lat": 35.83692, "lon":128.68156, "id":"V2X-10210"},
        {"lat": 35.83919, "lon":128.68414, "id":"V2X-10200"},
        {"lat": 35.83760, "lon":128.68170, "id":"V2X-10190"},
        {"lat": 35.83903, "lon":128.68533514, "id":"V2X-10180"},
        {"lat": 35.83880, "lon":128.68767, "id":"V2X-10170"},
        {"lat": 35.83912, "lon":128.68944, "id":"V2X-10140"},
        {"lat": 35.83644, "lon":128.69019, "id":"V2X-10160"},
        {"lat": 35.83608055447169, "lon":128.6901024330637, "id":"V2X-10050"},
        {"lat": 35.83435, "lon":128.68727, "id":"V2X 10040"},
        {"lat": 35.83451, "lon":128.68569, "id":"V2X 10030"},
        {"lat": 35.83477, "lon":128.68325, "id":"V2X 10020"},
    ];
    showV2X(map, v2x_array);
    showDatahub(map, datahub_array[0]);
}

function showDatahub(map, v2x_array)
{
    var icon_html = '<div class="hub_ripple hub_icon">'+
    ' <div class="hub_inner"></div>'+
    ' <div class="hub_ring1"></div>'+
    '</div>';
    showRippleMarker(map, icon_html, v2x_array.lat, v2x_array.lon);
}

function showV2X(map, v2x_array)
{
    for (var i in v2x_array) 
    {
        var icon_html = '<div class="v2x_ripple v2x_icon">'+
        ' <div class="v2x_inner"></div>'+
        ' <div class="v2x_ring1"></div>'+
        '</div>';
        showRippleMarker(map,icon_html,v2x_array[i].lat, v2x_array[i].lon);
    }
}
  
function showRippleMarker(map,icon_html, lat,long){
    const circleIcon = L.divIcon({
        html:icon_html
    });
    
    var marker = L.marker([lat, long],{
        draggable: false, 
        icon: circleIcon
    });
    marker.addTo(map);
} 

function gunsanRoute()
{
    var container = L.DomUtil.get('mapid'); 
    if(container != null)
        container._leaflet_id = null; 
  
    //initialize the map on the "map" div with a given center and zoom
    var map = L.map('mapid', {
        center: [35.812484, 126.409100],
        zoom: 17,
        minZoom:17,
        zoomControl: false,
        routeWhileDragging: false,
        show:false,
        collapsible: false, 
        contextmenu: false,
        closePopupOnClick :false,
    });
    
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
    }).addTo(map);
    
    /*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
                 //other attributes.
    }).addTo(map);*/

    var waypoints = [
      L.latLng(35.811897, 126.404886),
      L.latLng(35.813846, 126.413200),
      L.latLng(35.811472, 126.416443),
     ];
   
   var control = L.Routing.control({
        waypoints:waypoints,
        serviceUrl:'http://115.93.143.2:8104/route/v1',
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
            icon: L.icon({
                iconUrl: 'images/Icon_Station.svg',
                iconSize: [40, 54.75],
                iconAnchor: [10, 41],
                popupAnchor: [2, -40],
            }),
            draggable: false
        });
    },
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#E61773', weight: 6}]},
        autoRoute:true,
        showAlternatives: false,
        show:false,
    }).addTo(map);

    L.Routing.errorControl(control).addTo(map);
    showMarkerIcon("images/Icon_Station.svg","SCS-001",35.811897, 126.404886, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-001", 35.811897, 126.404616, map);
    showMarkerIcon("images/Icon_Station.svg","SCS-002",35.814184, 126.409845, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-002",35.814184, 126.409585, map);
    showMarkerIcon("images/Icon_Station.svg","SCS-003",35.813846, 126.413200, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-003",35.813846, 126.412930, map);
    showMarkerIcon("images/Icon_Station.svg","SCS-004",35.813698, 126.413744, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-004",35.813698, 126.413474, map);
    showMarkerIcon("images/Icon_Kiosk.svg", "SCK-005",35.811472, 126.416180, map);
    showMarkerIcon("images/Icon_Station.svg","SCS-005",35.811472, 126.416443, map);
    showMarkerIcon("images/Icon_Garage.svg","SCS-005",35.811514, 126.404726, map);
    map.invalidateSize();
}

function sangamRoute()
{
    var container = L.DomUtil.get('mapid'); 
    if(container != null)
        container._leaflet_id = null; 
  
    //initialize the map on the "map" div with a given center and zoom
    var map = L.map('mapid', {
        center: [37.579333, 126.889036],
        zoom: 16,
        minZoom:16,
        zoomControl: false,
        routeWhileDragging: false,
        show:false,
        collapsible: false, 
        contextmenu: false,
        closePopupOnClick :false,
    });

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
    }).addTo(map);

    var waypoints = [
      L.latLng(37.579333, 126.889036),
      L.latLng(37.58299,126.88485),
      L.latLng(37.57518,126.89837),
      L.latLng(37.581296, 126.885693),
     ];
   
   var control = L.Routing.control({
        waypoints:waypoints,
        serviceUrl:'http://115.93.143.2:8104/route/v1',
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
            icon: L.icon({
                iconUrl: 'images/Icon_Station.svg',
                //iconSize: [40, 54.75],
                //iconAnchor: [10, 41],
                //popupAnchor: [2, -40],
            }),
            draggable: false,
           
        });
    },
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#E61773',  weight: 6}]},
        autoRoute:true,
        showAlternatives: false,
        show:false,
    }).addTo(map);
   
    L.Routing.errorControl(control).addTo(map);
    showMarkerIcon("images/Icon_Garage.svg","SCG001",37.577672, 126.892164, map);

    //start 
    showMarkerIcon("images/Icon_Station.svg","SCS-001",37.579333, 126.889036, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-001", 37.579333, 126.889570, map);
    // finish
    showMarkerIcon("images/Icon_Station.svg","SCS-002",37.581296, 126.885693, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-002", 37.581296, 126.8859890, map);

    map.invalidateSize();
}

function sejongRoute()
{
    var container = L.DomUtil.get('mapid'); 
    if(container != null)
        container._leaflet_id = null; 
  
    //initialize the map on the "map" div with a given center and zoom
    var map = L.map('mapid', {
        center: [36.499951, 127.270606],
        zoom: 18,
        minZoom:18,
        zoomControl: false,
        routeWhileDragging: false,
        show:false,
        collapsible: false, 
        contextmenu: false,
        closePopupOnClick :false,
    });

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor',    
                 //other attributes.
    }).addTo(map);

    var waypoints = [
      L.latLng(36.499351, 127.270606),
      L.latLng(36.501690, 127.272315),
     ];
   
   var control = L.Routing.control({
        waypoints:waypoints,
        serviceUrl:'http://115.93.143.2:8104/route/v1',
        createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
            icon: L.icon({
                iconUrl: 'images/Icon_Station.svg',
                iconSize: [40, 54.75],
                iconAnchor: [10, 41],
                popupAnchor: [2, -40],
            }),
            draggable: false
        });
    },
        routeWhileDragging: false,
        lineOptions: {styles: [{ color: '#E61773',  weight: 6}]},
        autoRoute:true,
        showAlternatives: false,
        show:false,
    }).addTo(map);

    L.Routing.errorControl(control).addTo(map);
    showMarkerIcon("images/Icon_Garage.svg","SCG001",36.500109, 127.268620, map);
    //start 
    showMarkerIcon("images/Icon_Station.svg","SCS-001",36.499351, 127.270606, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-001", 36.499351, 127.270470, map);
    // finish
    showMarkerIcon("images/Icon_Station.svg","SCS-002",36.501690, 127.272315, map);
    showMarkerIcon("images/Icon_Kiosk.svg","SCK-002", 36.501690, 127.272180, map);
    map.invalidateSize();
}

function showMarkerIcon(iconUrl, title, lat, long, map ){
    const icon = L.icon({
        iconSize: [40, 54.75],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: iconUrl,
      });

    var marker = L.marker([lat, long],{
          draggable: false, // Make the icon dragable
          icon: icon
      });

    marker.addTo(map);
    const customPopup="<ul><li>"+title+"</li><ul>";
    const customOptions = {'className' : 'custom-popup', autoPan: false, autoClose: false  }
    marker.bindPopup(customPopup,customOptions).openPopup();
    map.invalidateSize();
}

function open_tab(button_id, window_id, site_id)
{   
    var window_list=["offsite_window","degu_window"];
    for (var i = 0; i < window_list.length; i++)
    {
        if (window_list[i] != window_id)
            document.getElementById(window_list[i]).style.display="none";
        else
            document.getElementById(window_id).style.display="block";
   }
   setSiteInfo(site_id);
}

function logout()
{
    var email = document.getElementById("loggedin_userid").innerText;
    var api_url = "http://115.93.143.2:9103/api/auth/logout/";
    postMethod(JSON.stringify(email),api_url, function(status_code) {
        if(status_code == 200)
            window.location.href = "login.html";
        else if(status_code == 401)
            alert("Authentication credentials were not provided");
        else if(status_code == 404)
            alert("Not found");
        console.log("Logout status: " +status_code);
    });
} 

function station_info()
{
    hide_div_list("div_station");
    change_button_color('station_info_button');
  
    //Check if which div is open
    if ($('#stations_list li').length != 0)
        return true;
   
    api_url = "http://115.93.143.2:9103/api/stations/";
    getMethod(api_url, function(stations_data) {
      
        var station_data = JSON.parse(stations_data).results;
        var station_count = Object.keys(station_data).length;
        for(var i = 0; i < station_count; i++)
        {
            if(station_data[i].site ==2) //2 is Daegu site
            {
               // alert(station_data.results[i].mid);
                var ul = document.getElementById('stations_list');
                var li = document.createElement('li');
                
                //li.before(color, 'pink');
                var lat = parseFloat(station_data[i].lat).toFixed(9);
                var lon = parseFloat(station_data[i].lon).toFixed(9);
                var li_content = "<p class='station_p1'>"+station_data[i].mid+"&nbsp;&nbsp;:&nbsp;&nbsp;</p><p class='station_p2'>"+lat+",&nbsp;"+lon+" </p>" ;
                li.innerHTML= li_content;
                ul.appendChild(li);

                // Red bullet if operation is false. list_style
                changeBulletColor(li, station_data[i].operation);
            }
        }
    });
}

function changeBulletColor(element, operation_status)
{
    if(operation_status == false)
    {
        element.style.color = 'red';
    }
    else
    {
        element.style.color = '#3DD118';
    }
}

function kiosk_info()
{
    hide_div_list("div_kiosk");
    change_button_color('kiosk_info_button');

    if ($('#kiosks_list li').length != 0)
        return true;
    
    api_url = "http://115.93.143.2:9103/api/kiosks/";
    getMethod(api_url, function(kiosk_data) {
        var kiosk_data = JSON.parse(kiosk_data).results;
        var kiosk_count = Object.keys(kiosk_data).length;
        for(var i=0; i<kiosk_count; i++)
        {
            if(kiosk_data[i].site == 2)
            {
                var ul = document.getElementById('kiosks_list');
                var li = document.createElement('li');
                var lat = parseFloat(kiosk_data[i].lat).toFixed(9);
                var lon = parseFloat(kiosk_data[i].lon).toFixed(9);
                var li_content = "<p class='station_p1'>"+kiosk_data[i].mid+"&nbsp;&nbsp;:&nbsp;&nbsp;</p><p class='station_p2'>"+lat+",&nbsp;"+lon+" </p>" ;
                li.innerHTML= li_content;
                ul.appendChild(li);
                changeBulletColor(li, kiosk_data[i].operation);
            }
        }
    });
}

function garage_info()
{
    hide_div_list("div_garage");
    change_button_color('garage_info_button');
    api_url = "http://115.93.143.2:9103/api/garages/";
    getMethod(api_url, function(garage_data) {
        var garage_data = JSON.parse(garage_data).results;
        
        for(var i=0; i<4; i++)
        {
            if(garage_data[i].site == 2)
            {               
                var lat = parseFloat(garage_data[i].lat).toFixed(9);
                var lon = parseFloat(garage_data[i].lon).toFixed(9);
                document.getElementById("g_location").innerHTML = lat+","+lon;
                document.getElementById("g_temperature").innerHTML = garage_data[i].temperature;
                document.getElementById("g_humidity").innerHTML = garage_data[i].humidity;
                
                if(garage_data[i].door ==  "false")
                    document.getElementById("g_door").innerHTML = "닫힘";
                else
                    document.getElementById("g_door").innerHTML = "열다";
                
                var g_charger1 = document.getElementById("g_charger1");
                var g_charger2 = document.getElementById("g_charger2");
                var g_charger3 = document.getElementById("g_charger3");
                var charger1_list = document.getElementById("charger1_list");
                var charger2_list = document.getElementById("charger2_list");
                var charger3_list = document.getElementById("charger3_list");
                if(garage_data[i].charger == false)
                {
                    g_charger1.innerHTML = "대기중";
                    g_charger2.innerHTML = "대기중";
                    g_charger3.innerHTML = "대기중";
  
                    charger1_list.style.color="red";
                    charger2_list.style.color="red";
                    charger3_list.style.color="red";
                }
                else
                {
                    g_charger1.innerHTML = "사용중";
                    g_charger2.innerHTML = "사용중";
                    g_charger3.innerHTML = "사용중";

                    charger1_list.style.color="#3DD118";
                    charger2_list.style.color="#3DD118";
                    charger3_list.style.color="#3DD118";
                }

               // charger1_list.classList.add("li_after2");
               
                //changeBulletColor(charger1_list, garage_data[i].charger);
                //changeBulletColor(charger2_list, garage_data[i].charger);
               // changeBulletColor(charger3_list, garage_data[i].charger);

               // changeBulletColor(g_charger2, garage_data[i].charger);
               // changeBulletColor(g_charger3, garage_data[i].charger);
            }
        }
    });
}

function vehicle_info()
{
    hide_div_list("div_vehicle");
    change_button_color('vehicle_info_button');
    var api_url = "http://115.93.143.2:9103/api/vehicles/";
    getMethod(api_url, function(vehicles_data) {
        var vehicle_data = JSON.parse(vehicles_data).results;
                
        for(var i=0; i<4; i++)
        {
            if(vehicle_data[i].mid == "SCN001")
            {   
                document.getElementById("v_id").innerHTML = vehicle_data[i].name;
                document.getElementById("v_gnss").innerHTML = vehicle_data[i].gnss;
                document.getElementById("v_speed").innerHTML = vehicle_data[i].speed+ " &nbsp;km/hr";
                document.getElementById("v_ratio").innerHTML = vehicle_data[i].hitratio+ " %";
                document.getElementById("v_passenger").innerHTML = vehicle_data[i].passenger+ "/10";
                document.getElementById("v_angle").innerHTML = vehicle_data[i].heading;
                var battery_percent = vehicle_data[i].battery;
                document.getElementById("v_battery").innerHTML = battery_percent+ " %" ;
                setBatteryPercent(battery_percent);              
                if(vehicle_data[i].drive == true)
                    document.getElementById("v_drive").innerHTML = "DRIVING" ;
                else
                    document.getElementById("v_drive").innerHTML = "STOP" ;
                   
                setLightStatus("LFront_light", vehicle_data[i].lights[0]);
                setLightStatus("LRear_light", vehicle_data[i].lights[2]);
                setLightStatus("RFront_light", vehicle_data[i].lights[1]);
                setLightStatus("RRear_light", vehicle_data[i].lights[3]);
            }
        }
    });
}

function setBatteryPercent(width)
{
    if(width == null)
        width = 0;

    var span = document.getElementById("battery_percent1");
    span.style.width = width+"%";
}

function setLightStatus(element_id, status)
{
    var elementId= document.getElementById(element_id);
    if(status == true)
    {
        elementId.innerHTML = "ON";
        elementId.style.backgroundColor="#41BFC7";
    }
    else
    {
        elementId.innerHTML = "OFF";
        elementId.style.backgroundColor="#CC7663";
    }
}

function setSiteInfo(site_id)
{
    if(site_id == 0)
        return false;

    var api_url = "http://115.93.143.2:9103/api/sites/"+site_id+"/";
    getMethod(api_url, function(sites_data) {
        var site_data = JSON.parse(sites_data);
        document.getElementById("site_summary").innerHTML = site_data.summary;
        manager_list(site_data.manager);
    });
} 

function manager_list(site_manager_array)
{
    // add managers to select list, 
    var select = document.getElementById("manager_selectlist");
    select.options.length = 0;

    for(var i=0 ; i<site_manager_array.length; i++)
    {       
        var api_url = "http://115.93.143.2:9103/api/managers/"+site_manager_array[i]+"/";
        getMethod(api_url, function(site_manager_data) {
            var site_manager_data = JSON.parse(site_manager_data);
            var option = document.createElement('option');
            option.text =site_manager_data.username;
            option.value = site_manager_data.email;
            select.add(option, i+1);
        });
    }
}

function getMethod(api_url, callback){
    var username = "admin@aspringcloud.com";
    var password = "spring#007";
    var base64Credentials = "Basic " +btoa(username+":"+password);
    var request = new XMLHttpRequest();
            
    request.open('GET', api_url, true);
    request.onload = function(e) {
        if(request.status == 200)
        {
            //alert("GET response " +request.response);
            //var response = JSON.parse(request.response);
            callback(request.response);
        }
        else if(request.status == 401)
            alert("Authentication credentials were not provided");
        else if(request.status == 403)
            alert("Unauthorized access to accounts")
        console.log("GET data status: " +request.status);
    };
    request.onerror = function(status){
        console.log("GET data error (GET).");
    };
    request.setRequestHeader("Authorization", base64Credentials);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    request.send();
}

function hide_div_list(div_id)
{
    var div_list=["div_station","div_kiosk","div_garage", "div_vehicle"];
    for (var i = 0; i < div_list.length; i++)
    {
        if (div_list[i] != div_id)
            document.getElementById(div_list[i]).style.display="none";
        else
            document.getElementById(div_id).style.display="block";
    }
}

function change_button_color(button_id)
{
    var button_list=["station_info_button","kiosk_info_button","garage_info_button", "vehicle_info_button"];

    for (var i = 0; i < button_list.length; i++)
    {
        if (button_list[i] != button_id)
        {
           // alert("button_id:"+button_id);
            document.getElementById(button_list[i]).style.backgroundColor="#C5C5C5";
        }
       else
        {
            //alert("button_id:"+button_id);
            document.getElementById(button_id).style.backgroundColor="#185786";
        }
            
    }
}

function close_div()
{    
    document.getElementById('degu_window').style.display="none";
} 

function showVehicle(map, iconUrl,title,lat,long){
      const kioskIcon = L.icon({
      iconSize: [40, 54.75],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: iconUrl,
    });

    var kioskMarker = L.marker([lat, long],{
        draggable: false, // Make the icon dragable
        icon: kioskIcon
    });

    var vehicleID = title.substr(title.length - 1); 
    var api_url = "http://115.93.143.2:9103/api/vehicles/"+vehicleID+"/";
    getMethod(api_url, function(vehiclesInfo) {
        var vehicleInfo = JSON.parse(vehiclesInfo);
        var customPopup= "<ul><li>"+title+"</li></ul> <span>SPEED&nbsp; &nbsp;:&nbsp; &nbsp;<lable>&nbsp;"+vehicleInfo.speed+"km/hr</lable></span><br><span>BATTERY&nbsp; &nbsp;:<lable>&nbsp; &nbsp;"+vehicleInfo.battery+" %</lable></span>"
        const customOptions  = {'className' : 'custom-popup2' }
        kioskMarker.bindPopup(customPopup,customOptions).openPopup();
    });
 
    //const customOptions  = {'className' : 'custom-popup2' }
    kioskMarker.addTo(map);
    // kioskMarker.bindPopup(customPopup,customOptions).openPopup();
} 
  
function showMarker(map,iconUrl,title,lat,long){
    const kioskIcon = L.icon({
      iconSize: [40, 54.75],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: iconUrl,
    });

    var kioskMarker = L.marker([lat, long],{
        draggable: false, // Make the icon dragable
        icon: kioskIcon
    });

    const customPopup="<ul><li>"+title+"</li><ul>";
    const customOptions = {'className' : 'custom-popup',  autoPan: false, autoClose: false  }
    kioskMarker.addTo(map);
    kioskMarker.bindPopup(customPopup,customOptions).openPopup();
} 

function setDateTime()
{
    var currentdate = new Date(); 
    var strDate = currentdate.getFullYear()+"."+currentdate.getMonth()+1+"."+currentdate.getDate();
    var currentHour = currentdate.getHours();
    var hour_status; 
    if(currentHour > 12)
        hour_status = "PM";
    else
        hour_status = "AM";

    var strTime = hour_status+" " +currentHour+" : "+currentdate.getMinutes();
    var dateTime = strDate +"&nbsp;|&nbsp;"+ strTime;
    document.getElementById("date_time_p").innerHTML = dateTime; 
    document.getElementById("active_username").innerHTML =localStorage.getItem("activeUserID"); //document.getElementById("loggedin_userid").innerHTML;
    setTimeout(setDateTime, 20000); 
}
