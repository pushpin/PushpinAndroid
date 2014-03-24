(function(){
	PushPin.MapView = function(map, auth, localStorage, positionHandler){
		this.map = map;
		this.auth = auth;
		this.localStorage = localStorage;
		this.positionHandler = positionHandler;
		
		this.fetchPointsBtn = $('#fetchPointsBtn');
		this.addPointViewBtn = $('#addPointViewBtn');
		this.goToPositionBtn = $('#goToPositionBtn');
		this.selectMapBtn = $('#selectMapBtn');
		this.selectBingMapBtn = $('#selectBingMapBtn');
		this.selectOSMMapBtn = $('#selectOSMMapBtn');
		this.logoutBtn = $('#logoutBtn');
		this.sendMailBtn = $('#sendMailBtn');
		this.showCreditsBtn = $('#sendCreditsBtn');
		this.bingMapOption = $('#bing-map-option');
		this.osmMapOption = $('#osm-map-option');
	};
	
	var prototype = PushPin.MapView.prototype;
	
	prototype.registerEvents = function(){
		var context = this;
		
    	this.fetchPointsBtn.click(function(){
    		context.fetchPoints();
    	});
    	
    	this.addPointViewBtn.click(function(){
    		return context.addPointView();
    	});
    	
    	this.goToPositionBtn.click(function(){
    		context.positionHandler.goToPosition();
    	});
    	
    	this.selectMapBtn.click(function(){
    		context.updateMap();
    	});
    	
    	this.selectBingMapBtn.click(function(){
    		context.selectBingMap();
    	});
    	
    	this.selectOSMMapBtn.click(function(){
    		context.selectOSMMap();
    	});
    	
    	this.logoutBtn.click(function(){
    		context.logout();
    	});
    	
    	this.sendMailBtn.click(function(){
    		context.sendEmail();
    	});
    	
    	this.showCreditsBtn.click(function(){
    		context.showCredits();
    	});
    };
    
    prototype.fetchPoints = function(){
    	// TODO: Fetch points for bounds of map
    };
    
    prototype.addPointView = function(){
    	//Store most recent Map View Center		
		var mapViewCenter = this.map.getCenter();
		
		this.localStorage.saveMapCenter(mapViewCenter);
		
		window.location.href ='addPoint.html';
    };
    
    prototype.selectBingMap = function(){
    	this.bingMapOption.attr('src','resources/images/icon-selected.png');
    	this.osmMapOption.attr('src','resources/images/icon-not-selected.png');
    	this.localStorage.setMapLayer(this.localStorage.layerOptions.BING);
    };
    
    prototype.selectOSMMap = function(){
    	this.osmMapOption.attr('src','resources/images/icon-selected.png');
    	this.bingMapOption.attr('src','resources/images/icon-not-selected.png');
    	this.localStorage.setMapLayer(this.localStorage.layerOptions.OSM);
    };
    
    prototype.showCredits = function(){
    	credits = 'OpenStreetMap is open data, licensed under the Open Data Commons Open Database License (ODbL). http://www.openstreetmap.org/copyright\n\n\
    		Nearby objects powered by the Overpass API http://wiki.openstreetmap.org/wiki/Overpass_API\n\n\
    		Search powered by Nominatim http://wiki.openstreetmap.org/wiki/Nominatim\n\n\
    		Pin icons are from maki (http://mapbox.com/maki/) and the Noun Project (http://thenounproject.com/)\n\n\
    		Libraries used under license:\n\n\
    		Route-Me, 9c) Route-Me Contributors https://github.com/route-me/route-me';
    		  		
    	alert(credits);
    };
    
    prototype.updateMap = function(){
    	this.map.setVisibleLayerFromLocalStorage();
    };
    
    prototype.sendEmail = function(){
    	window.location.href = "mailto:?subject=Pushpin OSM Android";
    };
    
    prototype.logout = function(){
    	var context = this;
    	
    	this.auth.logout(function(){
    		console.log("successfully logged out");
    		
    	}, function(e){
    		console.log("Error logging out", e);
    	});
    };
})();