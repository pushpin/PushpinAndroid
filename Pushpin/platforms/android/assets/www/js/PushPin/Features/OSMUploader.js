(function(){
	
	PushPin.Features.OSMUploader = function(feature, requestSignature, localStorage, onSuccess, onFailure){
		this.feature = feature;
		this.requestSignature = requestSignature;
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
			
			$.ajax({
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
	
	prototype.createChangeset = function(){
		
		var context = this;
		
		var url = this.hostUrl + "/api/0.6/changeset/create";
		
		$.ajax({
			url: url,
			type: 'PUT',
			headers: {
				authorization: this.requestSignature
			},
			success: function(data, textStatus, jqXHR){
				console.log("successfully created changeset", data);
				context.changeset = data;
				context.startUpload.call(context);
			},
			error: function(jqXHR, textStatus, err){
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
		
		var change = new PushPin.OSMChange(this.feature, this.localStorage);
		
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
		
		$.ajax({
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