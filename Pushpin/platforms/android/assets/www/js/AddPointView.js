(function(){
	PushPin.AddPointView = function(map, localStorage){
		this.map = map;
		this.localStorage = localStorage;

		this.isPinPlaced = false;
		
		this.cancelPointBtn = $('#cancelPointBtn');
		this.donePointBtn = $('#donePointBtn');
		this.addPinBtn = $('#addPinBtn');
	};
	
	var prototype = PushPin.AddPointView.prototype;
	
	prototype.registerEvents = function() {
		var context = this;
		
		this.cancelPointBtn.click(function(){
    		return context.cancelPoint();
    	});
    	
    	this.donePointBtn.click(function(){
    		return context.donePoint();
    	});
    	
    	this.addPinBtn.click(function(){
    		return context.addPin();
    	});
	};
	
	prototype.cancelPoint = function(){
		var mapViewCenter = this.map.getCenter();
		var mapZoom = this.map.getZoom();
		this.localStorage.saveMapCenter(mapViewCenter);
		this.localStorage.saveMapZoom(mapZoom);
    	window.location.href ='mapView.html';
    };
    
    prototype.donePoint = function(){

        if (!this.isPinPlaced) {
            window.location.href = 'mapView.html';
        }
        else {
            var mapViewCenter = this.map.getCenter();
            var mapZoom = this.map.getZoom();
            this.localStorage.saveMapCenter(mapViewCenter);
            this.localStorage.saveMapZoom(mapZoom);
            window.location.href = 'formView.html';
        }
    };
    
    prototype.addPin = function(){
		var position, pin;

		this.isPinPlaced = true;
		
		$('#poi-pin').remove(); 
		
		position = this.map.getCenter(); 		
		this.localStorage.setPinPosition(position); 		
		
		pin = new ol.Overlay({
			position: position,
		  	element: $('<img id="poi-pin">').attr('src','resources/images/icon-pin.png'),
		  	offsetY: -39,
            offsetX: -11
		});
		
		this.map.addOverlay(pin);
    };
    
    prototype.addPinForSelectedPoint = function(){
    	var position, zoom, pin;
    	
    	position = this.localStorage.getPinPosition();
    	this.localStorage.saveMapCenter(position);
    	zoom = this.localStorage.getMapZoom();
    	
    	pin = new ol.Overlay({
			position: position,
		  	element: $('<img id="poi-pin">').attr('src','resources/images/icon-pin.png'),
		  	offsetY: -39,
		  	offsetX: -11
		});
		
		this.map.addOverlay(pin);
		this.map.setCenter(position, zoom, 'EPSG:3857');
    };
    
    prototype.addCrosshair = function(){
      // Function being called before map is able to be rendered
      var map = this.map;
      setTimeout(function() {
        var mapCenter = map.getCenter();
        var mapCenterPixel = map.getPixelFromCoordinate(mapCenter);
        $('#crosshair').css('left', mapCenterPixel[0] - 18);
        $('#crosshair').css('bottom', mapCenterPixel[1] - 15);
      }, 500);
    };
})();