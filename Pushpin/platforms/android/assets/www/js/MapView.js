(function(){
	PushPin.MapView = function(map, auth, localStorage, positionHandler, fileSystem){
		this.map = map;
		this.auth = auth;
		this.localStorage = localStorage;
		this.positionHandler = positionHandler;
		this.fileSystem = fileSystem;
		
		this.fetchPointsBtn = $('#fetchPointsBtn');
		this.addPointViewBtn = $('#addPointViewBtn');
		this.goToPositionBtn = $('#goToPositionBtn');
		this.selectMapBtn = $('#selectMapBtn');
		this.selectBingMapBtn = $('#selectBingMapBtn');
		this.selectOSMMapBtn = $('#selectOSMMapBtn');
		this.logoutBtn = $('#logoutBtn');
		this.sendMailBtn = $('#sendEmailBtn');
		this.showCreditsBtn = $('#showCreditsBtn');
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
    
    prototype.getSavedFeaturesFileEntry = function(onSuccess, onFailure){
    	
    	var fail = function(e){
    		if(PushPin.existsAndNotNull(onFailure)){
    			onFailure(e);
    		}
    	};
    	
    	this.fileSystem.root.getDirectory("PushPin", {create: true, exclusive: false}, function(dir){
    		
    		dir.getFile("savedOSMFeatures.xml", {create: true, exclusive: false}, function(fileEntry){
    			
    			if(PushPin.existsAndNotNull(onSuccess)){
    				onSuccess(fileEntry)
    			}
    		}, fail);
    	}, fail);
    };
    
    prototype.transformFeatures = function(features){
    	
    	for(var i = 0; i < features.length; i++){
    		
    		features[i].getGeometry().transform(this.map.locationProj, this.map.mapProj);
    	}
    	
    	return features;
    };
    
    prototype.addFeaturesToMap = function(features){

		//Remove Existing Vector Layer (Clear Previous Features)
    	var layers = this.map.getLayers();
    	if(layers.getLength() > 2){
    		layers.removeAt(2);
    	}
		
		//POI Pin Style
		var styleFunction = function(feature, resolution) {
			
			var keys = PushPin.typeKeys;
			
			var values = ['aboveground-rail','airfield','airport','archery','art-gallery','attraction','bar','barber','base',
						'baseball','basketball','battery','beach','beer','belowground-rail','bench','bicycle','binoculars','boat','bread',
						'bulb','bus','cafe','camera','campsite','canoe','car','cellphone','cemetery','chef','cinema','climbing','clothes',
						'college','commerical-building','commerical-building-sm','computer','court','credit-card','cricket',
						'cupcake','dog','drinking_fountain','dvd','embassy','fast-food','ferry','fire-hydrant','fire-station','fish',
						'football','fountain','fuel','garden','gate','giraffe','glasses','golf','grocery-store','hammer','hanger','harbor',
						'heliport','horse','hospital','icecream','industrial-building','information','laundry','leaf','library',
						'lighthouse','lodging','london-underground','market','minefield','money','monument','motorcycle','multipolygon',
						'museum','music','news','office','outlet','park','parking','pharmacy','phone','pin','pitch','playground','police',
						'polygon','post','power','prison','rail','realestate','recycle','religious-christian','religious-islam',
						'religious-jewish','restaurant','roadblock','runner','school','scissors','scuba','shelter','shoe','shooting',
						'shop','skateboard','skiing','soccer','social','sofa','supermarket','surveillance','swimming','taxi','tennis',
						'theatre','toilet','toilet2','tool','tooth','tower','town-hall','training','trash','tree-1','tree-2','tree-sm',
						'veterinary','walk','warehouse','water','wrench'];
			
			var value = null, tmpValue = null, key = null;
			for (var i in keys){
				key = keys[i];
				tmpValue = feature.get(key);
				if (tmpValue != undefined && tmpValue != null){
					value = tmpValue;
					break;
				}
			}
			
			var iconReassignment = {'household':'shop','copyshop':'shop','boutique':'shop','wine':'bar','fast_food':'fast-food','toilets':'toilet',
								'ice_cream':'icecream','optician':'glasses','shoes':'shoe','accountant':'shop','hotel':'lodging','electronics':'battery',
								'mobile_phone':'cellphone','company':'office','art':'art-gallery','dry_cleaning':'clothes','bank':'money',
								'confectionery':'restaurant','running':'runner','beauty':'shop','barber':'shop', 'doityourself':'wrench',
								'car_repair':'car','department_store':'shop', 'bus_stop':'bus', 'town':'town-hall', 'post_office':'post',
								'station':'fire-station', 'helipad':'heliport', 'nursing_home': 'pin', 'public_building':'commerical-building',
								'hifi':'shop', 'government':'office', 'hairdresser': 'barber', 'video':'dvd', 'sports_centre':'runner'};
				
			if(iconReassignment[value]){
				value = iconReassignment[value];
			}

            var iconPath;

            if(PushPin.existsAndNotNull(value)) {
                iconPath = 'resources/icons/'+ value +'-icon.png';
            }
            else {
                iconPath = 'resources/images/icon-pin.png';
            }

            var pinStyle = [
                        new ol.style.Style({
                            image: new ol.style.Icon( {
                            anchor: [0.32, 35],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            src: iconPath
                          })
                        })

                    ];

            return pinStyle;
		};
		
		var vectorSource = new ol.source.Vector({
			parser: null
		});
		
		features = this.transformFeatures(features);
		
		vectorSource.addFeatures(features);
		
		//SET VECTOR LAYER
		var vector = new ol.layer.Vector({
		  source: vectorSource,
		  style: styleFunction
		});
    	
    	this.map.addLayer(vector);
	};
	
    prototype.fetchPoints = function(){
    	
    	var context = this;
    	
    	var fail = function(e){
    		console.log("error fetching points", e);
    	};
    	
    	console.log("getting features");
    	
    	this.getSavedFeaturesFileEntry(function(fileEntry){
    		
    		console.log("successfully got saveFeaturesOSMxml file");
    		
    		var osmDownloader = new PushPin.Features.OSMDownloader(context.map.getBoundingBox(), function(data) {
        		
        		var saver = new PushPin.Features.Save(fileEntry);
        		
        		console.log("successfully downloaded data:");
        		
        		saver.save(data, function(){
        			
        			console.log("saved downloaded osm xml successully");
        			context.loadPoints();

        		}, fail);
        	}, fail);
    		
    		osmDownloader.download();
    		
    	}, fail);
    };

    prototype.loadPoints = function() {
       app.view.getSavedFeaturesFileEntry(function(fileEntry){
            var loader = new PushPin.Features.Loader(fileEntry, new FileReader(), new PushPin.Format.OSMXML());
            loader.load(function(features) {
                app.view.addFeaturesToMap(features);
            }, function(e) {

                console.log("couldn't load saved features from file", e);
            });
        }, function(e) {
            console.log("couldn't load saved features from file", e);
        });
    };
    
    prototype.addPointView = function(){

    	//Store most recent Map View Center		
		var mapViewCenter = this.map.getCenter();
		var mapZoomLevel = this.map.getZoom();

		console.log('mapZoomLevel:', mapZoomLevel);

		this.localStorage.saveMapZoom(mapZoomLevel);
		this.localStorage.saveMapCenter(mapViewCenter);
		this.localStorage.clearPinPosition();
		this.localStorage.clearFeature();
		
		window.location.href = 'addPoint.html';
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
    
    prototype.initializeLayerSelection = function(){
    	var initLayer = this.localStorage.getMapLayer();
    	if (initLayer === this.localStorage.layerOptions.BING){
    		this.bingMapOption.attr('src','resources/images/icon-selected.png');
    		this.osmMapOption.attr('src','resources/images/icon-not-selected.png');
    	}
    	else{
    		this.osmMapOption.attr('src','resources/images/icon-selected.png');
    		this.bingMapOption.attr('src','resources/images/icon-not-selected.png');
    	}
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