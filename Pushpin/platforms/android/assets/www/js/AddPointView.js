(function(){
	PushPin.AddPointView = function(map, localStorage){
		this.map = map;
		this.localStorage = localStorage;
		
		this.cancelPointBtn = $('#cancelPointBtn');
		this.donePointBtn = $('#donePointBtn');
		this.addPinBtn = $('#addPinBtn');
	};
	
	var prototype = PushPin.AddPointView.prototype;
	
	prototype.registerEvents = function(){
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
		this.localStorage.saveMapCenter(mapViewCenter);
		
    	window.location.href ='mapView.html';
    };
    
    prototype.donePoint = function(){
    	var mapViewCenter = this.map.getCenter();		
		this.localStorage.saveMapCenter(mapViewCenter);
        window.location.href = 'formView.html';
    };
    
    prototype.addPin = function(){
		var position, pin;
		
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
    	var position, pin;
    	
    	position = this.localStorage.getPinPosition();
    	this.localStorage.saveMapCenter(position);
    	
    	pin = new ol.Overlay({
			position: position,
		  	element: $('<img id="poi-pin">').attr('src','resources/images/icon-pin.png'),
		  	offsetY: -39,
		  	offsetX: -11
		});
		
		this.map.addOverlay(pin);
		this.map.setCenter(position,'EPSG:3857');
    };
    
    prototype.addCrosshair = function(){
      // Function being called before map is able to be rendered
      var map = this.map;
      setTimeout(function() {
        var mapCenter = map.getCenter();
        var mapCenterPixel = map.getPixelFromCoordinate(mapCenter);
        console.log("mapCenterPixel = " + mapCenterPixel);
        $('#crosshair').css('left', mapCenterPixel[0] - 18);
        $('#crosshair').css('bottom', mapCenterPixel[1] - 15);
      }, 500);
    };
})();