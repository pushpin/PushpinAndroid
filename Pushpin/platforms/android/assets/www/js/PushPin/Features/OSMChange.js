(function(){
	
	PushPin.Features.OSMChange = function(feature, localStorage){
		this.type = feature.element;
		this.tags = feature.properties;
		this.osmId = feature.id;
		this.version = feature.version;
		this.lon = ol.proj.transform(localStorage.getPinPosition(),'EPSG:3857','EPSG:4326')[0];
		this.lat = ol.proj.transform(localStorage.getPinPosition(),'EPSG:3857','EPSG:4326')[1];
	};
	
	var prototype = PushPin.Features.OSMChange.prototype;
	
	prototype.getXML = function(changesetId){
		
		var xml = '';
		
		switch(this.type){
			case "way": 
			
				xml = this.getWayXML(changesetId);
				
				break;
				
			case "relation":
				
				xml = this.getRelationXML(changesetId);
				
				break;
				
			case "node":
				
				xml = this.getNodeXML(changesetId);
				
				break;
				
			default:
				
				throw {
					message: "Invalid type"
				};
		}
		
		return "<osm>" + xml + "</osm>";
	};
	
	prototype.getWayXML = function(changesetId){
		
		// TODO: Don't support ways yet.
		console.log("Way's are not supported yet.");
		return "";
	};
	
	prototype.getRelationXML = function(changesetId){
		
		// TODO: Don't support relations yet.
		console.log("Relation's are not supported yet.");
		return "";
	};
	
	prototype.getNodeXML = function(changesetId){
		
		var version = parseFloat(this.version) + 1;
		
		var xml = '<node';
		
		// If the element has an osmId, add it to the tag
		if(PushPin.existsAndNotNull(this.osmId)){
			xml += ' id="' + this.osmId + '"';
		}
		
		xml += ' version="' + version + '" changeset="' + changesetId + '" lat="' + this.lat + '" lon="' + this.lon + '">';
			
		// If the change has tags, add them to the xml
		if(PushPin.existsAndNotNull(this.tags)){
			for(var key in this.tags){
				xml += '<tag k="' + key + '" v="' + this.tags[key].value + '" />';
			}
		}
		
		xml += '</node>';
		
		return xml;
	};
	
})();