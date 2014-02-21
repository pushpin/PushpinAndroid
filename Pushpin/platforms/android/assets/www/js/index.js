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
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    authenticate: function(db){
    	var osmAuth = new PushPin.OSMAuth(PushPin.Secrets.OAUTH.CONSUMER_KEY,
        		PushPin.Secrets.OAUTH.CONSUMER_SECRET, db);
        
        osmAuth.getRequestToken();
    },
    
    onDeviceReady: function() {
        var db = PushPin.Database.getDb();
        
        var preferences = new PushPin.Preferences(db);
        
        preferences.getAccessToken(function(accessToken){
        	
        	if(!PushPin.existsAndNotNull(accessToken)){
        		app.authenticate(db);
        	}else{
        		console.log("Already authenticated!");
        	}
        }, function(e){
        	
        	// TODO: Handle failed to get access token
        });
    }
};
