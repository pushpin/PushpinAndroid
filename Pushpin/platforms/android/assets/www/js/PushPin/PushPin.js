PushPin = (function(){
	
	var osmUrl = null;
	
	return{
		DEV_MODE: true,
		
		existsAndNotNull: function(value){
			if(value !== null && value !== undefined){
				return true;
			}
			
			return false;
		},
		
		reportException: function(e){
			console.log(e.stack);
		},
		
		getOSMUrl: function(){
			
			if(osmUrl === null){
				
				if(PushPin.DEV_MODE){
					osmUrl = 'http://api06.dev.openstreetmap.org';
				}else{
					osmUrl = 'http://www.openstreetmap.org';
				}
			}
			
			return osmUrl;
		},

		createRequestSignature: function(method, url, accessToken) {

            if(accessToken.value)
                accessToken = JSON.parse(accessToken.value);

            var o = {
                version: '1.0',
                consumer_key: PushPin.Secrets.OAUTH.CONSUMER_KEY,
                consumer_secret: PushPin.Secrets.OAUTH.CONSUMER_SECRET,
                token: accessToken.oauth_token,
                token_secret: accessToken.oauth_token_secret,
                signature_method: 'HMAC-SHA1'
            };

            var requestSignature = ohauth.headerGenerator(o)(method, url);

            //console.log('requestSignature:', requestSignature);

            return requestSignature;
        }
	};
})();