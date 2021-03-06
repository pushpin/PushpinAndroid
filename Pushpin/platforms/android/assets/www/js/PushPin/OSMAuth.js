PushPin.OSMAuth = function(consumerKey, consumerSecret, db){
	this.consumerKey = consumerKey;
	this.oauth_secret = consumerSecret;
	this.db = db;
	this.hostUrl = PushPin.getOSMUrl();
	
	this.token = null;
	this.accessToken = null;
	
	this.preferences = new PushPin.Preferences(this.db);
	
	var context = this;
	
	this.o = {
		oauth_consumer_key: context.consumerKey,
		oauth_signature_method: 'HMAC-SHA1'
	};
	
	this.authenticatedSuccessCallback = null;
	this.authenticatedFailureCallback = null;
};

PushPin.OSMAuth.prototype.onAuthenticated = function(accessToken){
	
	if(PushPin.existsAndNotNull(this.authenticatedSuccessCallback)){
		this.authenticatedSuccessCallback(accessToken);
	}
};

PushPin.OSMAuth.prototype.onAuthenticationFailed = function(e){
	if(PushPin.existsAndNotNull(this.authenticatedFailureCallback)){
		this.authenticatedFailureCallback(e);
	}
};

PushPin.OSMAuth.prototype.authenticate = function(onSuccess, onFailure){
	
	this.authenticatedSuccessCallback = onSuccess;
	this.authenticatedFailureCallback = onFailure;
	
	this.getRequestToken();
};

PushPin.OSMAuth.prototype.getRequestToken = function(){
	var context = this;
	
	this.o.oauth_timestamp = ohauth.timestamp();
	this.o.oauth_nonce = ohauth.nonce();
	
	var url = this.hostUrl + '/oauth/request_token';
	
	this.o.oauth_signature = ohauth.signature(this.oauth_secret,
			'', ohauth.baseString('POST', url, this.o));
	
	var request = $.ajax({
		url: url,
		type: 'POST',
		data: context.o
	});
	
	request.done(function(response, textStatus, jqXHR){
		
		context.token = ohauth.stringQs(response);
		
		context.getUserAuthorization();
	});
	
	request.fail(function(jqXHR, textStatus, errorThrown){
		console.log('request token error', errorThrown);
		
		context.onAuthenticationFailed(errorThrown);
	});
	
	request.always(function(){
		console.log('request token finished');
	});
};

PushPin.OSMAuth.prototype.getUserAuthorization = function(){

	if(!PushPin.existsAndNotNull(this.token)){
		throw "Could not get user authorization because token doesn't exist";
	}
	
	if(!PushPin.existsAndNotNull(this.token.oauth_token)){
		throw "Could not get user authorization because oauth_token is not set";
	}
	
	var context = this;
	
	var url = this.hostUrl + '/oauth/authorize?';
	
	url += ohauth.qsString({
		oauth_token: context.token.oauth_token,
		oauth_callback: 'http://localhost'
	});
	
	var authWindow = window.open(url, '_blank', 'location=no');
	authWindow.addEventListener('loadstart', function(event){
		var url = event.url;
		
		if(url.indexOf('http://localhost') !== -1){
			context.getAccessToken();
			authWindow.close();
		}
	});
	
	authWindow.addEventListener('loaderror', function(event){
		context.onAuthenticationFailed(event);
		authWindow.close();
	});
};

PushPin.OSMAuth.prototype.getAccessToken = function(){
    var context = this;
    
	this.o.oauth_timestamp = ohauth.timestamp();
    this.o.oauth_nonce = ohauth.nonce();
    this.o.oauth_token = this.token.oauth_token;
     
    var url = this.hostUrl + '/oauth/access_token';
     
    this.o.oauth_signature = ohauth.signature(
    	context.oauth_secret,
		context.token.oauth_token_secret,
		ohauth.baseString('POST', url, context.o)
    );
    
    var request = $.ajax({
		url: url,
		type: 'POST',
		data: context.o
	});
	
	request.done(function(response, textStatus, jqXHR){
		
		context.accessToken = ohauth.stringQs(response);
		
		context.saveAccessToken();
	});
	
	request.fail(function(jqXHR, textStatus, errorThrown){
		console.log('request token error', errorThrown);
		
		context.onAuthenticationFailed(errorThrown);
	});
	
	request.always(function(){
		console.log('request token finished');
	});
};

PushPin.OSMAuth.prototype.saveAccessToken = function(){
	
	var context = this;
	
	if(!PushPin.existsAndNotNull(this.accessToken)){
		throw "Access token must exist.";
	}
	
	if(!PushPin.existsAndNotNull(this.accessToken.oauth_token)){
		throw "Access token oauth_token must exist.";
	}
	
	if(!PushPin.existsAndNotNull(this.accessToken.oauth_token_secret)){
		throw "Access token oauth token secret must exist.";
	}
	
	console.log("Access token: " + JSON.stringify(this.accessToken));
	
	this.preferences.saveAccessToken(this.accessToken, function(){
		// Saved access token successfully
		context.onAuthenticated(context.accessToken);
	}, function(e){
		
		// Failed to save access token
		context.onAuthenticationFailed(e);
	});
};

PushPin.OSMAuth.prototype.logout = function(onSuccess, onFailure){
	
	this.preferences.removeAccessToken(onSuccess, onFailure);
};
