(function(){
	
	PushPin.Features.Save = function(fileEntry){
		this.fileEntry = fileEntry;
	};
	
	var prototype = PushPin.Features.Save.prototype;
	
	prototype.getFileWriter = function(onSuccess, onFailure){
		
		this.fileEntry.createWriter(function(writer){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess(writer);
			}
		}, function(e){
			if(PushPin.existsAndNotNull(onFailure)){
				onFailure(e);
			}
		});
	};
	
	prototype.save = function(osmXML, onSuccess, onFailure){
		var context = this;
		
		var fail = function(e){
			if(PushPin.existsAndNotNull(onFailure)){
				onFailure(e);
			}
		};
		
		this.getFileWriter(function(writer){
			
			writer.onwrite = function(){
				
				if(PushPin.existsAndNotNull(onSuccess)){
					onSuccess();
				}
			};
			
			writer.onerror = fail;
			
			writer.write(osmXML);
		}, fail);
	};
})();