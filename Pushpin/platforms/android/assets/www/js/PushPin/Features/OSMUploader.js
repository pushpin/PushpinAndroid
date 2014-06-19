(function(){
	
	PushPin.Features.OSMUploader = function(feature, localStorage, onSuccess, onFailure){
		this.feature = feature;
		this.onSuccess = onSuccess;
		this.onFailure = onFailure;
		this.hostUrl = PushPin.getOSMUrl();
		this.localStorage = localStorage;
		this.changeset = null;
	};
	
	var prototype = PushPin.Features.OSMUploader.prototype;
	
	prototype.onChangesetCompleted = function(){
		console.log("on changeset completed");
		this.closeChangeset(this.onSuccess);
	};

	prototype.upload = function(){
		var osmChangeset = new PushPin.Features.OSMChangeset(this.localStorage, this.feature, this, this.onCreateChangeset, this.onFailure);
		osmChangeset.openChangeset();
	};

	prototype.onCreateChangeset = function(changeset) {
	    console.log('starting upload');
	    this.changeset = changeset;
	    this.startUpload();
	}
	
	prototype.startUpload = function(){
		
		var context = this;
		
		var url = this.hostUrl + "/api/0.6"
		
		var xml = new PushPin.Features.OSMXML(this.feature, this.localStorage);

        if(xml.type === "way"){
            url += "/way";
        }else if(xml.type === "relation"){
            url += "/relation";
        }else{
            url += "/node";
        }
		
		if(PushPin.existsAndNotNull(xml.osmId)){
			// If the id exists, then this is an update
			url += "/" + xml.osmId;
		}else{
			// No id, so this is a create
			url += "/create";
		}
        var preferences = new PushPin.Preferences(PushPin.Database.getDb());
        preferences.getAccessToken(function(accessToken) {
            var requestSignature = PushPin.createRequestSignature('PUT', url, accessToken);
            var xml = new PushPin.Features.OSMXML(context.feature, context.localStorage);

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
             data: xml.getUploadXML(context.changeset),
             success: function(data, textStatus, jqXHR) {
                 console.log('successfully uploaded feature', data);
                 var osmChangeset = new PushPin.Features.OSMChangeset(context.localStorage, context.feature, context, context.onSuccess, context.onSuccess);
                 osmChangeset.closeChangeset(context.changeset);
             },
             error: function(jqXHR, textStatus, err) {
                 console.log('error uploading feature', err);
                 var osmChangeset = new PushPin.Features.OSMChangeset(context.localStorage, context.feature, context, context.onFailure, context.onFailure);
                 osmChangeset.closeChangeset(context.changeset);
             }
            });
		});
	};
})();