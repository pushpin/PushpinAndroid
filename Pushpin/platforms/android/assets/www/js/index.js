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
	
	mapView: null,
	
	positionHandler: null,
	
	
    // Application Constructor
    initialize: function() {
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
		$('#tap-instr').html(errorMessage);
	},
	
    load: function(){
    	app.map = new PushPin.Map();
    	app.map.loadMap();
    	
    	app.test = new PushPin.Geolocation.Test();
    	app.positionHandler = new PushPin.Geolocation.Handler(app.map, app.test);
    	
    	app.positionHandler.watchPosition();
    	
    	app.localStorage = new PushPin.LocalStorage();
    	
    	app.mapView = new PushPin.MapView(app.map, app.osmAuth,
    			app.localStorage, app.positionHandler);
    	
    	app.mapView.registerEvents(app.map);
    	
    	app.map.setVisibleLayerFromLocalStorage();
    },
    
    onAuthenticated: function(){
    	app.load();
    },
    
    authenticate: function(db){
    	app.osmAuth = new PushPin.OSMAuth(PushPin.Secrets.OAUTH.CONSUMER_KEY,
        		PushPin.Secrets.OAUTH.CONSUMER_SECRET, db);
        
        app.osmAuth.authenticate(function(){
        	
        	app.onAuthenticated();
        	
        }, function(e){
        	
        	console.log("Authentication Failed!: ", e);
        	
        	PushPin.reportException(e);
        });
    },
    
    onDeviceReady: function() {
        var db = PushPin.Database.getDb();
        
        var preferences = new PushPin.Preferences(db);
        
        preferences.getAccessToken(function(accessToken){
        	
        	if(!PushPin.existsAndNotNull(accessToken)){
        		app.authenticate(db);
        	}else{
        		console.log("Already authenticated!");
        		app.onAuthenticated();
        	}
        }, function(e){
        	
        	// TODO: Handle failed to get access token
        	
        });
    }
};
