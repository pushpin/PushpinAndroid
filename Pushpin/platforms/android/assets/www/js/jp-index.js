//globals
var layers;
var map;
var geoX, geoY;

//Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);	

//Cordova is ready
function onDeviceReady(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

//onSuccess Geolocation
function onSuccess(position){
	//Set Coordinate variables
	geoX = position.coords.longitude;
	geoY = position.coords.latitude;		
  	
  	//Go to Position
  	goToPosition();
  	
  	//Add Marker on Position
  	marker = new ol.Overlay({
	  	position: ol.proj.transform([geoX,geoY], 'EPSG:4326', 'EPSG:3857'),
	  	element: $('<img id="geo-marble">').attr('src','resources/images/icon-location-marble.png')
	  });
      map.addOverlay(marker);
    
    //Set up watchPosition
	//watchID = navigator.geolocation.watchPosition(updatePosition, updateError);
    
}

//Update Current Position
function updatePosition(position){
	geoX = position.coords.longitude;
	geoY = position.coords.latitude; 
	alert('hmm: ' + geoX + ', ' + geoY);
}

//onError Callback receives a PositionError object
function updateError(error){
	alert(error.message);
}

function onError(error){
	$('#tap-instr').html(error.message);	
}
  
  //Push BaseMaps to Layers (Bing, OSM)
  var layers = [
  		new ol.layer.Tile({
  		  visible: false,
	      source: new ol.source.BingMaps({
	      	key: 'AlcyscghNheU6SjKl-_AfYD8_UvdBkghZ_d5y3_g_H574kTHa8031xO79vEUp4Qt',
	      	style: 'AerialWithLabels'
	      })
	    }),
	    new ol.layer.Tile({
  			visible: true,
        	source: new ol.source.OSM({layer: 'sat'})
        })];
	
  //Create Map Object
  var map = new ol.Map({
    target: 'map',
    layers: layers,
    view: new ol.View2D({
      center: ol.proj.transform([-77.360415, 38.95947], 'EPSG:4326', 'EPSG:3857'),
      zoom: 17
    })
  });
  
  //Set Visible Selected Map Layer
  var mapLayer = localStorage.getItem('mapLayer');
  if(mapLayer == 'bing'){
  	layers[0].set('visible', true);
  	layers[1].set('visible', false);
  }
  else {
  	layers[1].set('visible', true);
  	layers[0].set('visible', false);
  }
  
  //Fetch Points
  function fetchPoints(){
	//Add fetch junx
	window.location.href='addPoint.html';
  }
  
  //GeoLocation Button
  function goToPosition(){
  	//[geoX, geoY] = geolocation.getPosition(); 
  	map.setView(new ol.View2D({
      center: ol.proj.transform([geoX, geoY], 'EPSG:4326', 'EPSG:3857'),
      zoom: 17
    }));
  }
  
  //Navigation functions
	function addPointView(){	
		//Store most recent Map View Center		
		mapViewCenter = map.getView().getCenter();
		localStorage.setItem("mapViewCenterX",mapViewCenter[0]);
		localStorage.setItem("mapViewCenterY",mapViewCenter[1]);
		window.location.href ='addPoint.html';
	}
	
	//Update Base Map layer
	function updateMap(){
	  var mapLayer = localStorage.getItem('mapLayer');
      if(mapLayer == 'bing'){
      	layers[0].set('visible', true);
      	layers[1].set('visible', false);
      }
      else {
      	layers[1].set('visible', true);
      	layers[0].set('visible', false);
      }
	}
  
  	//Show credits
  	function showCredits(){
  		credits = 'OpenStreetMap is open data, licensed under the Open Data Commons Open Database License (ODbL). http://www.openstreetmap.org/copyright\n\n\
Nearby objects powered by the Overpass API http://wiki.openstreetmap.org/wiki/Overpass_API\n\n\
Search powered by Nominatim http://wiki.openstreetmap.org/wiki/Nominatim\n\n\
Pin icons are from maki (http://mapbox.com/maki/) and the Noun Project (http://thenounproject.com/)\n\n\
Libraries used under license:\n\n\
Route-Me, 9c) Route-Me Contributors https://github.com/route-me/route-me';
  		alert(credits);
  	}
  	
  	//Send Email
  	//Email
	function sendEmail(){
		window.location.href = "mailto:?subject=Pushpin OSM Android";
	}
	
	//Set username
	localStorage.setItem('username', 'jpmendieta');
	$('#username').html(localStorage.getItem('username'));