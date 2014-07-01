(function(){
	PushPin.Geolocation.Handler = function(map, test){
		
		this.map = map;
		this.test = test;
		this.geoX = null;
		this.geoY = null;
		this.marker = null;
		this.mapProj = 'EPSG:3857';
		this.locationProj = 'EPSG:4326';
		this.watchId = null;
		this.options = {
			enableHighAccuracy: true,
			timeout: 30000
		};
	};
	
	var prototype = PushPin.Geolocation.Handler.prototype;
	
	prototype.updatePosition = function(pos){
		this.geoX = pos.coords.longitude;
		this.geoY = pos.coords.latitude;
		
		var coordinate = ol.proj.transform([this.geoX, this.geoY],
				this.locationProj, this.mapProj);
		
		this.map.updateMarker(coordinate);
	};
	
	prototype.updateError = function(e){
		console.log("Error getting location", e);
		$('#tap-instr').html(e.message);
		$('#tap-instr').removeClass('hide');
	};
	
	prototype.getCurrentPosition = function(){

	    var context = this;
		
		if(this.test){
			this.test.getCurrentPosition(function(pos){
				context.updatePosition(pos);
			}, function(e){
				context.updateError(e);
			});
		}else{
			navigator.geolocation.getCurrentPosition(function(pos){
				context.updatePosition(pos);
			}, function(e){
				context.updateError(e);
			}, this.options);
		}
	};
	
	prototype.watchPosition = function(){
		var context = this;
		
		if(this.test){
			this.watchId = this.test.watchPosition(function(pos){
				context.updatePosition(pos);
			}, function(e){
				context.updateError(e);
			});
		}else{
			this.watchId = navigator.geolocation.watchPosition(function(pos){
				context.updatePosition(pos);
			}, function(e){
				context.updateError(e);
			}, this.options);
		}
	};
	
	prototype.clearWatch = function(){
		
		if(this.test){
			this.test.clearWatch(this.watchId);
		}else{
			navigator.geolocation.clearWatch(this.watchId);
		}
		
		this.watchId = null;
	};
	
	prototype.goToPosition = function(){
		this.map.setCenter([this.geoX, this.geoY], 16, this.locationProj);
	};
})();