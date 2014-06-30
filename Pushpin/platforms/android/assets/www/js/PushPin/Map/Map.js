(function(){
	
	PushPin.Map = function(localStorage){
		this.localStorage = localStorage;
		this.layers = null;
		this.map = null;
		this.mapProj = 'EPSG:3857';
		this.locationProj = 'EPSG:4326';
		this.locationMarker = null;
		this.geomLayer = null;
		this.overlay = null;
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
	        zoom: 16,
	        maxZoom: 18,
            enableRotation: false
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
	
	prototype.setCenter = function(center, zoom, projection){
		this.map.setView(new ol.View2D({
		    center: ol.proj.transform(center, projection, this.mapProj),
		    zoom: zoom,
            maxZoom: 18,
            enableRotation: false
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

	prototype.getZoom = function() {
	    return this.map.getView().getZoom();
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
	    var context = this;
	    this.map.on('singleclick', function(evt) {	    	
	    	//Clean Popup Overlay
			if(PushPin.existsAndNotNull(context.overlay)){
			    var overlays = map.getOverlays();
			    var index = overlays.array_.indexOf(context.overlay);

			    if(index != -1) {
			        overlays.removeAt(index);
			        context.overlay = null;
			    }
			}

            if(PushPin.existsAndNotNull(context.geomLayer)) {

                var layer = context.getLayers();
                var index = layer.array_.indexOf(context.geomLayer);

                if(layer.array_[index]) {
                    layer.array_[index].set('visible', false)
                    if(index != -1) {
                        layer.array_.splice(index, 1);
                    }
                    context.geomLayer = null;
                }
            }
			
		  	map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {

                if(PushPin.existsAndNotNull(context.overlay)) {
                    return;
                }
	  	
			  	var pos = null;
			  	if(feature.getGeometry().getType() == 'Point'){
			  		pos = feature.getGeometry().getCoordinates();
			  	}
			  	else {
			  		pos = feature.getGeometry().getInteriorPoint().getCoordinates();
			  	}

			  	var name = feature.get('name');

			  	if(!PushPin.existsAndNotNull(name)) {
			  	    var keys = PushPin.typeKeys;

			  	    var tmpName = null, key = null;
                    for (var i in keys){
                        key = keys[i];
                        tmpName = feature.get(key);
                        if (tmpName != undefined && tmpName != null){
                            name = tmpName;
                            break;
                        }
                    }
                    name = _.str.humanize(name);
			  	}

			  	var mapCenter = context.getCenter();
			  	var mapZoom = context.getZoom();

			  	context.localStorage.saveMapCenter(mapCenter);
			  	context.localStorage.saveMapZoom(mapZoom);

			  	var isNode = true;
                var polygon = feature.get('polygon');
			  	if(PushPin.existsAndNotNull(polygon)) {
			  	    isNode = false;

                    // Checking to see if its a building and if it is specified or not.
                    var building = feature.get('building');
			  	    if(!name && building) {
                        if(building == 'yes')
                            name = 'Building';
                        else
                            name = building;
			  	    }

			  	    context.displayPolygon(polygon);
			  	}

			  	var user = feature.get('user');

                // If for some reason a ghost added a point and no username is available.
			  	var htmlUserString = (PushPin.existsAndNotNull(user)) ? '<p style="font-size:small; color:white;">\n' + user + '</p></a>' : '</a>';
			  	
			  	context.overlay = new ol.Overlay({
				  	position: pos,
				  	element: $('<div class="popup">').html('<a href="formView.html" >'
				  	     + '<font color="FFFFFF">' + name
				  	     + '</font><img style="height:1em; margin-left: 5px;" src="resources/images/disclosure.png"/>'
				  	     + htmlUserString)
				});
				
		     	map.addOverlay(context.overlay);
		     	
		     	var properties = feature.getProperties();
		     	
		     	var poi = {};
		     	
		     	poi['id'] = feature.getId();
		     	poi['element'] = isNode ? 'node' : 'way';
		     	poi['version'] = feature.get('version');
		     	poi['properties'] = {};
		     	
		     	for(var key in properties){
		     		
		     		if(key !== "geometry" && key !== 'version' && key !== 'polygon') {
		     			poi['properties'][key] = {
		     				value: properties[key],
		     				updated: false
		     			};
		     		}
		     	}
		     	
		     	context.localStorage.saveFeature(JSON.stringify(poi));
		     	context.localStorage.setPinPosition(pos);
		     			    
		  	});
		});
	};

	prototype.displayPolygon = function(polygon) {

        var styleFunction = function(feature, resolution) {
            var fill = new ol.style.Fill({
                color: 'red'
            });

            var stroke = new ol.style.Stroke({
                color: 'orange',
                width: 2
            });

            // cause reasons
            var style = new ol.style.Style({
                fill: fill,
                stroke: stroke
            });

            return [ style ] ;
        }

        var feature = new ol.Feature(polygon);
        feature.setId(1);

        var vectorSource = new ol.source.Vector({
            parser: null
        });

        vectorSource.addFeatures([feature]);

        this.geomLayer = new ol.layer.Vector({
          source: vectorSource,
          style: styleFunction,
          opacity: 0.3
        });

        this.addLayer(this.geomLayer);

        // Reordering the layers so that the pins are on top.
        var layer = this.getLayers();
        var temp = layer.array_[3];
        layer.array_[3] = layer.array_[2];
        layer.array_[2] = temp;
	};

})();