(function(){
	
	PushPin.LocalStorage = function(){
		this.mapLayer = 'mapLayer';
	};
	
	var prototype = PushPin.LocalStorage.prototype;
	
	prototype.layerOptions = {
		BING: 'bing',
		OSM: 'osm'
	};
	
	prototype.setMapLayer = function(layerOption){
		localStorage.setItem(this.mapLayer, layerOption);
	};
})();