(function(){
	
	PushPin.Features.OSMUploader = function(feature, accessToken, localStorage, onSuccess, onFailure){
		this.feature = feature;
		this.accessToken = accessToken;
		this.onSuccess = onSuccess;
		this.onFailure = onFailure;
		this.hostUrl = PushPin.getOSMUrl();
		//this.hostUrl = "http://api.openstreetmap.org";
		this.changeset = null;
		this.localStorage = localStorage;
	};
	
	var prototype = PushPin.Features.OSMUploader.prototype;
	
	prototype.onChangesetCompleted = function(){
		console.log("on changeset completed");
		
		this.closeChangeset(this.onSuccess);
	};
	
	prototype.closeChangeset = function(onSuccess, onFailure){
		
		if(PushPin.existsAndNotNull(this.changeset)){
			
			var url = this.hostUrl + "/api/0.6/changset/" + this.changeset.id + "/close";

			var requestSignature = this.createRequestSignature(url);
			
			$.ajax({
			    headers: {
                    'Content-Type': 'text/plain',
                    'User-Agent': 'PushPin 1.1 rv:25',
                    'Accept-Encoding' : 'gzip',
                    'Connection' : 'close',
                    'Authorization': requestSignature
			    },
				url: url,
				type: 'PUT',
				success: function(data, textStatus, jqXHR){
					console.log("Successfully closed changeset", data);
					
					if(PushPin.existsAndNotNull(onSuccess)){
						onSuccess();
					}
				},
				error: function(jqXHR, textStatus, err){
					console.log("Failed to close changeset", err);
					
					if(PushPin.existsAndNotNull(onFailure)){
						onFailure(err);
					}
				}
			});
		}
	};
	
	prototype.upload = function(){
		this.createChangeset();
	};

	prototype.createRequestSignature = function(url) {
        var o = {
    	    version: '1.0',
    		consumer_key: PushPin.Secrets.OAUTH.CONSUMER_KEY,
    		consumer_secret: PushPin.Secrets.OAUTH.CONSUMER_SECRET,
    		token: this.accessToken.oauth_token,
    		token_secret: this.accessToken.oauth_token_secret,
    		signature_method: 'HMAC-SHA1'
        };

//        var sig_baseString = ohauth.baseString('PUT', url, o);
//        var oauth_signature = ohauth.signature(PushPin.Secrets.OAUTH.CONSUMER_SECRET, o.token_secret, sig_baseString);
//
//        this.requestSignature = 'OAuth oauth_consumer_key="' +  PushPin.Secrets.OAUTH.CONSUMER_KEY
//                    + '",oauth_nonce="' + ohauth.nonce() + '",oauth_signature_method="' + o.signature_method
//                    + '",oauth_token="' + o.token + '",oauth_timestamp="' + ohauth.timestamp()
//                    + '",oauth_version="1.0"' + ',oauth_signature="' + oauth_signature;

        //this.requestSignature = encodeURI(this.requestSignature);

        var requestSignature = ohauth.headerGenerator(o)('PUT', url);

        console.log('requestSignature:', this.requestSignature);

        return requestSignature;
	}

	prototype.createChangesetXml = function(comment) {
        return '<?xml version="1.0" encoding="UTF-8"?><osm><changeset><tag k="created_by" v="PushPin"/><tag k="version" v="1.1"/><tag k="build" v="25"/><tag k="comment" v="' + comment + '"/></changeset></osm>';
	}

	prototype.createChangeset = function(){

		var context = this;
		
		var url = this.hostUrl + "/api/0.6/changeset/create";

		var requestSignature = this.createRequestSignature(url);
		var data = this.createChangesetXml('Edited ' + this.feature.properties.name.value);

		$.ajax({
		    headers: {
		        'Content-Type': 'text/plain',
		        'User-Agent': 'PushPin 1.1 rv:25',
		        'Accept-Encoding' : 'gzip',
		        'Connection' : 'close',
		        'Authorization': requestSignature
		    },
		    url: url,
			type: 'PUT',
		    data: data,
			success: function(data, textStatus, jqXHR){
				console.log("successfully created changeset", data);
				context.changeset = data;
				context.startUpload.call(context);
			},
			error: function(jqXHR, textStatus, err){
			    console.log("err:", err);
				console.log("couldn't create changeset");
				if(PushPin.existsAndNotNull(context.onFailure)){
					context.onFailure(err);
				}
			}
		});
	};
	
	prototype.startUpload = function(){
		
		var context = this;
		
		var url = this.hostUrl + "/api/0.6"
		
		var change = new PushPin.Features.OSMChange(this.feature, this.localStorage);
		
		if(PushPin.existsAndNotNull(change.osmId)){
			// If the id exists, then this is an update
			if(change.type === "way"){
				url += "/way";
			}else if(change.type === "relation"){
				url += "/relation";
			}else{
				url += "/node";
			}
			
			url += "/" + change.osmId;
		}else{
			// No id, so this is a create
			url += "/node/create";
		}
		
		var changeXML = change.getXML(context.changeset.id);
		var requestSig = this.createRequestSignature(url);

		$.ajax({
		    headers: {
		        'Content-Type': 'text/plain',
		        'User-Agent': 'PushPin 1.1 rv:25',
		        'Accept-Encoding' : 'gzip',
		        'Connection' : 'close',
		        'Authorization': requestSig
		    },
			url: url,
			type: "PUT",
			data: changeXML,
			contentType: 'text/xml',
			success: function(data, textStatus, jqXHR){
				console.log("Successfully uploaded change", change, data);
				context.startUpload.call(context);
			},
			error: function(jqXHR, textStatus, err){
				console.log("Couldn't upload change", change, jqXHR, textStatus, err);
				context.onFailure(err);
			}
		});
	};
})();