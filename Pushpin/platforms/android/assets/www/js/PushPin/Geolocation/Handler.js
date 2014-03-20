(function(){
	PushPin.GeolocationHandler = function(map, test){
		this.map = map;
		this.test = test;
		this.geoX = null;
		this.geoY = null;
		this.marker = null;
		this.mapProj = 'EPSG:3857';
		this.locationProj = 'EPSG:4326';
	};
	
	var prototype = PushPin.GeolocationHandler.prototype;
	
	prototype.updatePosition = function(pos){
		this.geoX = pos.coords.longitude;
		this.geoY = pos.coords.latitude;
		
		var coordinate = ol.proj.transform([this.geoX, this.geoY],
				this.locationProj, this.mapProj);
		
		if(!this.marker){
			this.marker = new ol.Overlay({
				position: coordinate,
				element: $('<img id="geo-marble">').attr('src','resources/images/icon-location-marble.png')
			});
			
			this.map.addOverlay(this.marker);
		}else{
			this.marker.setPosition(coordinate);
		}
	};
	
	prototype.updateError = function(e){
		console.log("Error getting location", e);
		$('#tap-instr').html(e.message);
	};
	
	prototype.getCurrentPosition = function(){
		
		if(this.test){
			test.getCurrentPosition(this.updatePosition, this.updateError);
		}else{
			navigator.geolocation.getCurrentPosition(this.updatePosition, this.updateError);
		}
	};
	
	prototype.watchPosition = function(){
		
		if(this.test){
			test.watchPosition(this.updatePosition, this.updateError);
		}else{
			navigator.geolocation.watchPosition(this.updatePosition, this.updateError);
		}
	};
})();