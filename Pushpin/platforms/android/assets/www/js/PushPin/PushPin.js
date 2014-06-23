PushPin = (function(){
	
	var osmUrl = null;
	
	return{
		DEV_MODE: false,

		typeKeys: [
		    'aerialway','aeroway','amenity', 'barrier','boundary','craft','emergency', 'geological',
            'highway','historic','landuse','leisure','man_made', 'military','natural', 'office','place',
            'power','public_transport','railway','route','shop', 'sport', 'tourism','waterway'
        ],
		
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
        },

        getDistance: function(lat1, lon1, lat2, lon2) {

            var toRadians = function(num) {
                return num * Math.PI / 180;
            }

            var R = 6371;
            var rLat1 = toRadians(lat1);
            var rLat2 = toRadians(lat2);
            var deltaLat = toRadians(lat2-lat1);
            var deltaLon = toRadians(lon2-lon1);

            var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                    Math.cos(rLat1) * Math.cos(rLat2) *
                    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            return parseInt(R * c);
        }
	};
})();