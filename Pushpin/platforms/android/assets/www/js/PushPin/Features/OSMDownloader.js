(function(){
	
	PushPin.Features.OSMDownloader = function(bbox, onSuccess, onFailure){
		
		this.bbox = bbox;
		
    	this.poiURL =  PushPin.getOSMUrl() + '/api/0.6/map?bbox=' + this.bbox;
    	this.onSuccess = onSuccess;
    	this.onFailure = onFailure;
    	this.osmXMl = null;
	};
	
	var prototype = PushPin.Features.OSMDownloader.prototype;
	
	prototype.onDownloadSuccess = function(){
		
		if(PushPin.existsAndNotNull(this.onSuccess)){
			this.onSuccess(this.osmXML);
		}
	};
	
	prototype.onDownloadFailure = function(e){
		
		if(PushPin.existsAndNotNull(this.onFailure)){
			this.onFailure(e);
		}
	};
	
	prototype.download = function(){
		
		var context = this;
		
		var request = $.ajax({
			url: context.poiURL,
			type: 'GET',
			dataType: 'text',
			timeout: 30000,
			success: function(data, textStatus, jqXHR){
				context.osmXML = data;
				
				context.onDownloadSuccess();
			},
			error: function(jqXHR, textStatus, err){
				console.log("request failed", err);
				
				context.onDownloadFailure(err);
			}
		});
	};
})();