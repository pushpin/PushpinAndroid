(function(){
	PushPin.Geolocation.Test = function(){
		this.position = {};
		
		this.position.coords = {
			latitude: "38.9558",
			longitude: "-77.3577"
		};
	};
	
	var prototype = PushPin.Geolocation.Test.prototype;
	
	prototype.watchPosition = function(onSuccess, onError, options){
		var context = this;
		
		var watchId = window.setInterval(function(){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess(context.position);
			}
		}, 5000);
		
		return watchId;
	};
	
	prototype.clearWatch = function(watchId){
		
		window.clearInterval(watchId);
	};
	
	prototype.getCurrentPosition = function(onSuccess, onError, options){
		var context = this;
		
		window.setTimeout(function(){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess(context.position);
			}
		}, 5000);
	};
})();