(function(){
	
	PushPin.LocalStorage = function(){
		this.mapLayer = 'mapLayer';
		this.mapViewCenterX = "mapViewCenterX";
		this.mapViewCenterY = "mapViewCenterY";
		this.pinPosition = 'pin-pos';
		this.feature = 'feature';
	};
	
	var prototype = PushPin.LocalStorage.prototype;
	
	prototype.layerOptions = {
		BING: 'bing',
		OSM: 'osm'
	};
	
	prototype.setMapLayer = function(layerOption){
		localStorage.setItem(this.mapLayer, layerOption);
	};
	
	prototype.getMapLayer = function(){
		return localStorage.getItem(this.mapLayer);
	};
	
	prototype.saveMapCenter = function(mapViewCenter){
		localStorage.setItem(this.mapViewCenterX,mapViewCenter[0]);
		localStorage.setItem(this.mapViewCenterY,mapViewCenter[1]);
	};
	
	prototype.getMapCenter = function(){
		var mapViewCenterX = localStorage.getItem(this.mapViewCenterX);
		var mapViewCenterY = localStorage.getItem(this.mapViewCenterY);
		
		var center = null;
		
		if(PushPin.existsAndNotNull(mapViewCenterX) && PushPin.existsAndNotNull(mapViewCenterY)){
			center = [parseFloat(mapViewCenterX),
				        parseFloat(mapViewCenterY)];
		}
		
		return center;
	};
	
	prototype.setPinPosition = function(position){
		localStorage.setItem(this.pinPosition,position);
	};

	prototype.saveFeature = function(poi){
		localStorage.setItem(this.feature,poi);
	};
	
	prototype.getFeature = function(){
		return localStorage.getItem(this.feature);
	};
	
	prototype.clearFeature = function(){
		localStorage.setItem(this.feature, null);
	};
})();