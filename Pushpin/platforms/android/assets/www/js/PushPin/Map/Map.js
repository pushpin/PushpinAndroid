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
		
		console.log("layers", this.layers);
		
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
	
	prototype.setCenter = function(geoX, geoY, projection){
		this.map.setView(new ol.View2D({
		    center: ol.proj.transform([geoX, geoY], projection, this.mapProj),
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
})();