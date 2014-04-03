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
    	window.location.href = 'form.html';
    };
    
    prototype.addPin = function(){
		var position, pin;
		
		$('#poi-pin').remove(); 
		
		position = this.map.getCenter(); 		
		this.localStorage.setPinPosition(position); 		
		
		pin = new ol.Overlay({
			position: position,
		  	element: $('<img id="poi-pin">').attr('src','resources/images/icon-pin.png')
		});
		
		this.map.addOverlay(pin);
    };
    
    prototype.addCrosshair = function(){    	
	    var mapCenter = this.map.getCenter();
	    mapCenterPixel = this.map.getPixelFromCoordinate(mapCenter);
	    $('#crosshair').css('left',mapCenterPixel[0]-8);
	    $('#crosshair').css('bottom',mapCenterPixel[1]-15);
    };
})();