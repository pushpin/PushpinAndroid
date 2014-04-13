(function(){
	
	PushPin.Features.Loader = function(fileEntry, fileReader, format){
		this.fileEntry = fileEntry;
		this.fileReader = fileReader;
		this.format = format;
		this.features = null;
	};
	
	var prototype = PushPin.Features.Loader.prototype;
	
	prototype.load = function(onSuccess, onFailure){
		
		var context = this;
		
		var fail = function(e){
			if(PushPin.existsAndNotNull(onFailure)){
				onFailure(e);
			}
		};
		
		this.fileReader.onload = function(evt){
			PushPin.resetFeatureVersions();
			context.features = context.format.readFeatures(evt.target.result);
			
			console.log("successfully loaded features");
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess(context.features);
			}
		};
		
		this.fileReader.onerror = fail;
		
		this.fileEntry.file(function(file){
			context.fileReader.readAsText(file);
		}, fail);
	};
})();