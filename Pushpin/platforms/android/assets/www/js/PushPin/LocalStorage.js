(function(){
	
	PushPin.LocalStorage = function(){
		this.mapLayer = 'mapLayer';
		this.mapViewCenterX = "mapViewCenterX";
		this.mapViewCenterY = "mapViewCenterY";
		this.pinPositionX = 'pinPositionX';
		this.pinPositionY = 'pinPositionY';
		this.feature = 'feature';
		this.changeset = 'changeset';
		this.mapZoomLevel = 'mapZoomLevel';
		this.boundingN = 'boundingN';
		this.boundingE = 'boundingE';
		this.boundingS = 'boundingS';
		this.boundingW = 'boundingW';
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

	prototype.saveMapZoom = function(mapZoom) {
	    localStorage.setItem(this.mapZoomLevel, mapZoom);
	};

	prototype.getMapZoom = function() {
	    return localStorage.getItem(this.mapZoomLevel);
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

	prototype.setBoundingBox = function(boundingBox) {
	    localStorage.setItem(this.boundingN, boundingBox[0]);
	    localStorage.setItem(this.boundingE, boundingBox[1]);
	    localStorage.setItem(this.boundingS, boundingBox[2]);
	    localStorage.setItem(this.boundingW, boundingBox[3]);
	};

	prototype.getBoundingBox = function() {
	    var boundingBox = [];
        boundingBox.push(localStorage.getItem(this.boundingN));
        boundingBox.push(localStorage.getItem(this.boundingE));
        boundingBox.push(localStorage.getItem(this.boundingS));
        boundingBox.push(localStorage.getItem(this.boundingW));
        return boundingBox;
    };
	
	prototype.setPinPosition = function(pinPosition){
		localStorage.setItem(this.pinPositionX,pinPosition[0]);
		localStorage.setItem(this.pinPositionY,pinPosition[1]);
	};
	
	prototype.getPinPosition = function(){
		var pinPositionX = localStorage.getItem(this.pinPositionX);
		var pinPositionY = localStorage.getItem(this.pinPositionY);
		
		var position = null;
		
		if(PushPin.existsAndNotNull(pinPositionX) && PushPin.existsAndNotNull(pinPositionY)){
			position = [parseFloat(pinPositionX),
				        parseFloat(pinPositionY)];
		}
		
		return position;
	};
	
	prototype.clearPinPosition = function(){
		localStorage.setItem(this.pinPositionX,null);
		localStorage.setItem(this.pinPositionY,null);
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

	prototype.saveChangeset = function(changeset) {
	    localStorage.setItem(this.changeset, changeset);
	};

	prototype.getChangeset = function() {
	    return localStorage.getItem(this.changeset);
	};
})();