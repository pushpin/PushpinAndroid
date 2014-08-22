/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	
	map: null,
	
	view: null,
	
	positionHandler: null,
	
	viewType: null,	
	
	form: null,
	
    // Application Constructor
    initialize: function(view) {
    	viewType = view;
        app.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    
    reportError: function(errorMessage){
		alert(errorMessage);
	},
	
    load: function(){
    	
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
    		
    		if(!PushPin.existsAndNotNull(app.osmAuth)){
        		app.initAuth();
        	}

        	app.localStorage = new PushPin.LocalStorage();
        	
        	app.map = new PushPin.Map(app.localStorage);
        	
            //app.test = new PushPin.Geolocation.Test();
        	// Enable app.test if you need to mock gps
        	app.positionHandler = new PushPin.Geolocation.Handler(app.map/*, app.test*/);

        	var savedMapCenter = app.localStorage.getMapCenter();
            var savedMapZoom = app.localStorage.getMapZoom();
        	if(!PushPin.existsAndNotNull(savedMapCenter)) {
                $('#tap-instr').html('Acquiring GPS Signal');
		        $('#tap-instr').css('margin-left', '-100px');
                app.positionHandler.getCurrentPosition(function(pos) {
                       app.map.loadMap();
                       app.map.setOnClickGrabFeature();

                       if(PushPin.existsAndNotNull(pos)) {
                           var coord = [app.positionHandler.geoX, app.positionHandler.geoY];
                           app.map.setCenter(coord, 17, 'EPSG:4326');
                       }

                       app.setView(viewType, fileSystem);
                       app.map.setVisibleLayerFromLocalStorage();
                });
            }
            else {
               app.map.loadMap();
               app.map.setOnClickGrabFeature();
               app.setView(viewType, fileSystem);
               app.map.setVisibleLayerFromLocalStorage();

               var zoom = PushPin.existsAndNotNull(savedMapZoom) ? savedMapZoom : 17;
               app.map.setCenter(savedMapCenter, savedMapZoom, 'EPSG:3857');
            }

        	app.positionHandler.watchPosition();

    	}, function(e){
    		console.log("Could not get file system", e);
    	});
    },
    
    initAuth: function(){
    	app.osmAuth = new PushPin.OSMAuth(PushPin.Secrets.OAUTH.CONSUMER_KEY,
        		PushPin.Secrets.OAUTH.CONSUMER_SECRET, app.db);
    },
    
    onAuthenticated: function(){
    	app.load();
    },
    
    authenticate: function(){
    	app.initAuth();
        
        app.osmAuth.authenticate(function(accessToken){
        	app.onAuthenticated();
        }, function(e){
        	console.log("Authentication Failed!: ", e);
        	PushPin.reportException(e);
        });
    },
    
    onDeviceReady: function() {
        app.db = PushPin.Database.getDb();

        var preferences = new PushPin.Preferences(app.db);
        
        preferences.getAccessToken(function(accessToken){
        	
        	if(!PushPin.existsAndNotNull(accessToken)){
        		app.authenticate();
        	}else{
        		app.onAuthenticated();
        	}

        }, function(e){
        	
        	console.log("Error: Could not authenticate", e);
        	
        	PushPin.reportException(e);
        });
    },
    setView: function(viewType, fileSystem) {

    	switch(viewType){    		
    		case 'mapView':

    			app.view = new PushPin.MapView(app.map, app.osmAuth,
    					app.localStorage, app.positionHandler, fileSystem);

    			app.view.registerEvents(app.map);
    			app.view.initializeLayerSelection();

                app.view.fetchPoints();
    			
				break;

			case 'addPointView':
				app.view = new PushPin.AddPointView(app.map, app.localStorage);
				app.view.addCrosshair();
				app.view.registerEvents();
				var pinPosition = app.localStorage.getPinPosition();

				if(!(isNaN(pinPosition[0]) && isNaN(pinPosition[1]))){
					app.view.addPinForSelectedPoint();
				}
				break;

			case 'formView':
			    var context = this;
				$.getJSON('resources/form.json', function(formJSON, textStatus, jqXHR){
					
					$.getJSON('resources/classifications.json', function(classificationsJSON, textStatus, jqXHR){
						
						app.form = new PushPin.Form(formJSON, context.localStorage, classificationsJSON);
				    	app.form.populateForm(app.localStorage.getFeature());
				    	app.form.loadForm();
                        app.view = new PushPin.FormView(app.form, app.localStorage);
                        app.view.registerEvents();

					}).fail(function(jqXHR, textStatus, err){
						console.log("Couldn't load form view", err);
					});
				}).fail(function(jqXHR, textStatus, err){
					console.log("Couldn't load form view", err);
				});
		    	
				break;

			case 'nominatimView':

			    app.view = new PushPin.nominatimView(app.positionHandler, app.localStorage);
			    app.view.registerEvents();

			    break;

			default:
				console.log("Error: Could not assign view");
    	}
    }
};
