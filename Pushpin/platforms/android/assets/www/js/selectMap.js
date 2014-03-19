//Get Map Layer
mapLayer = localStorage.getItem("mapLayer");
if(mapLayer == 'bing'){
	$('#bing-map-option').attr('src','resources/images/icon-selected.png');
}
else {
	$('#osm-map-option').attr('src','resources/images/icon-selected.png');
}

//Select Map
function selectBingMap(){
	$('#bing-map-option').attr('src','resources/images/icon-selected.png');
	$('#osm-map-option').attr('src','resources/images/icon-not-selected.png');
	localStorage.setItem("mapLayer",'bing');
}

function selectOSMMap(){
	$('#osm-map-option').attr('src','resources/images/icon-selected.png');
	$('#bing-map-option').attr('src','resources/images/icon-not-selected.png');
	localStorage.setItem("mapLayer",'osm');
}

//Navigation
/*function updateMap(){
	window.location.href ='mapView.html';
}*/