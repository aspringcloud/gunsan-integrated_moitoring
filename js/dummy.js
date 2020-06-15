
function gunsanRoute(gunsanSiteId) {
    // daegu_interval
     if(daegu_interval != null)
         clearInterval(daegu_interval);
 
     hide_div("graph_div");
     //hide_div("graph2_div");
     var map_center = [35.812484, 126.409100];
     if(gunsanClickCount <=1)
     {    
         gunsan_map = createMap( gunsan_map, 'gunsanMap');
         showRouteInfo(gunsan_map, "stations/", "route/station_kiosk.svg", gunsanSiteId);
         showRouteInfo(gunsan_map, "garages/", "garage_daegu.svg", gunsanSiteId);
     }
     gunsan_map.invalidateSize();
 }
 
 function sangamRoute(sangamSiteId) {
     
     hide_div("graph_div");
     //hide_div("graph2_div");
     
     /* Check this --> map_function.js:717 Uncaught TypeError: Cannot read property 'style' of null*/
     var map_center = [37.579333, 126.889036];
     if(sangamClickCount <=1)
     {
         sangam_map = createMap( sangam_map,'sangamMap');
     
         // show stations, kiosk, garage, V2X on degu route.
         showRouteInfo(sangam_map, "stations/", "route/station_kiosk.svg", sangamSiteId);
         showRouteInfo(sangam_map, "garages/", "route/garageIcon.svg", sangamSiteId);
         showDataCenter(sangam_map, sangamSiteId);
         show_v2x(sangam_map, "v2x/");
     }
     sangam_map.invalidateSize();
 }
 
 function sejongRoute() {
     //daegu_interval.clearInterval();
     document.getElementById("subMenuModal").style.display = "block";
     clearInterval(daegu_interval);
     clearInterval(interval);
 
     hide_div("graph_div");
     //hide_div("graph2_div");
     open_tab('degu_window',18);
 
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
     var map_center = [36.499951, 127.270606];
     var waypoints = [
         L.latLng(36.499351, 127.270606),
         L.latLng(36.501690, 127.272315),
     ];
 
     if(sejong1ClickCount<=1)
     {
         sejong_map = createMap( sejong_map,'sejongMap');
     
     
         // show stations, kiosk, garage on degu route.
         showRouteInfo(sejong_map, "stations/", "route/station_kiosk.svg", 3);
         showRouteInfo(sejong_map, "garages/", "route/garageIcon.svg", 3);
         showDataCenter(sejong_map, 3);
             
         // show V2X on Degu route
         show_v2x(sejong_map, "v2x/");
     }
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
         //alert("vehicleObj :"+vehicleObj);
 
         // create select list of vehicle 
         createSelectList(vehicleObj);
 
         // update status of webcam  
         webcam('1', vehicleObj);
         webcam('2', vehicleObj);
 
         var firstId = sejongShuttleArray[0];
         vehicleInfo(sejong_map, firstId);
         changeVehicleInfo(firstId);
     });
 }
 
 
 function sejongRoute2() {
     //daegu_interval.clearInterval();
 
     document.getElementById("subMenuModal").style.display = "block";
     clearInterval(daegu_interval);
     clearInterval(interval);
 
     hide_div("graph_div");
     //hide_div("graph2_div");
     open_tab('degu_window',18);
 
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
     var map_center = [36.499951, 127.270606];
     if(sejong2ClickCount <=1 )
     {
 
  
     sejong_map2 = createMap(sejong_map2,'sejongMap2');
     var waypoints = [
         L.latLng(36.499351, 127.270606),
         L.latLng(36.501690, 127.272315),
     ];
   
     // show stations, kiosk, garage on degu route.
     showRouteInfo(sejong_map2, "stations/", "route/station_kiosk.svg", 18);
     showRouteInfo(sejong_map2, "garages/", "route/garageIcon.svg", 18);
     showDataCenter(sejong_map2, 18);
         
     // show V2X on Degu route
     show_v2x(sejong_map2, "v2x/");
 }
     sejong_map2.invalidateSize();
 
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
             if (vehicle.site == 18){             
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
         //alert("sejongShuttleArray :"+sejongShuttleArray);
 
         if(sejongShuttleArray[0] != undefined || sejongShuttleArray[0] != null )
         {
             var first_id = sejongShuttleArray[0];
             vehicleInfo(sejong_map2, first_id);
             changeVehicleInfo(firstId);
         }
     });
 }
 