(function(){
	
	PushPin.Map = function(localStorage){
		this.localStorage = localStorage;
		this.layers = null;
		this.map = null;
		this.mapProj = 'EPSG:3857';
		this.locationProj = 'EPSG:4326';
		this.locationMarker = null;
	};

	var prototype = PushPin.Map.prototype;
	
	prototype.loadMap = function(){
		
		//Push BaseMaps to Layers (Bing, OSM)
		this.layers = [
	  		new ol.layer.Tile({
	  		  visible: false,
		      source: new PushPin.ol.BingMaps({
		      	key: 'AlcyscghNheU6SjKl-_AfYD8_UvdBkghZ_d5y3_g_H574kTHa8031xO79vEUp4Qt',
		      	style: 'Aerial'
		      })
		    }),
		    new ol.layer.Tile({
	  			visible: true,
	  	        source: new ol.source.OSM({layer: 'sat'})
	    })];
		
		//Create Map Object
	    this.map = new ol.Map({
	      target: 'map',
	      layers: this.layers,
	      view: new ol.View2D({
	        center: ol.proj.transform([-77.360415, 38.95947], this.locationProj, this.mapProj),
	        zoom: 17
	      })
	    });
	    
	};
	
	prototype.setVisibleLayerFromLocalStorage = function(){
		
		//Set Visible Selected Map Layer
		var mapLayer = this.localStorage.getMapLayer();
		if(mapLayer == 'bing'){
		    this.layers[0].set('visible', true);
		  	this.layers[1].set('visible', false);
		}else {
		    this.layers[1].set('visible', true);
		    this.layers[0].set('visible', false);
		}
	};
	
	prototype.setCenter = function(center, projection){
		this.map.setView(new ol.View2D({
		    center: ol.proj.transform(center, projection, this.mapProj),
		    zoom: 17
		}));
	};
	
	prototype.updateMarker = function(coordinate){
		if(!this.locationMarker){
			this.locationMarker = new ol.Overlay({
				position: coordinate,
				element: $('<img id="geo-marble">').attr('src','resources/images/icon-location-marble.png')
			});
			
			this.map.addOverlay(this.locationMarker);
		}else{
			this.locationMarker.setPosition(coordinate);
		}
	};
	
	prototype.getCenter = function(){
		return this.map.getView().getCenter();
	};
	
	prototype.addOverlay = function(overlay){
		this.map.addOverlay(overlay);
	};
	
	prototype.getPixelFromCoordinate = function(coord){
		return this.map.getPixelFromCoordinate(coord);
	};
	
	prototype.getCoordinateFromPixel = function(pixel){
		return this.map.getCoordinateFromPixel(pixel);
	};
	
	prototype.addLayer = function(layer){
		this.map.addLayer(layer);
	};
	
	prototype.getSize = function(){
		return this.map.getSize();
	};
	
	prototype.getLayers = function(){
		return this.map.getLayers();
	};
	
	prototype.getBoundingBox = function(){
		var bbox = this.map.getView().calculateExtent(this.map.getSize());
		bbox = ol.proj.transform(bbox, 'EPSG:3857', 'EPSG:4326');

		return bbox;
	};
	
	prototype.setOnClickGrabFeature = function(){
	
	    var map = this.map;
	    var localStorage = this.localStorage;
	    this.map.on('singleclick', function(evt) {	    	
	    	//Clean Popup Overlay
			var overlays = map.getOverlays();
			if(overlays.getLength() > 1){
				overlays.removeAt(1);
			}
			
		  	map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
	  	
			  	var pos = null;
			  	if(feature.getGeometry().getType() == 'Point'){
			  		pos = feature.getGeometry().getCoordinates();
			  	}
			  	else {
			  		pos = feature.getGeometry().getInteriorPoint().getCoordinates();
			  	}
			  	
			  	var popup = new ol.Overlay({
				  	position: pos,
				  	element: $('<div class="popup">').html(feature.get('name') + '<a href="formView.html"><img style="height:1em; margin-left: 5px;" src="resources/images/disclosure.png"/></a>')
				});
				
		     	map.addOverlay(popup);
		     	
		     	var properties = feature.getProperties();
		     	
		     	var poi = {};
		     	
		     	poi['id'] = feature.getId();
		     	
		     	poi['properties'] = {};
		     	
		     	for(var key in properties){
		     		
		     		if(key !== "geometry"){
		     			poi['properties'][key] = {
		     				value: properties[key],
		     				updated: false
		     			};
		     		}
		     	}
		     	
		     	localStorage.saveFeature(JSON.stringify(poi));
		     	localStorage.setPinPosition(pos);
		     			    
		  	});
		});
	};
})();