(function(){
	
	PushPin.Features.OSMChange = function(type, tags, osmId, version){
		this.type = type;
		this.tags = tags;
		this.osmId = osmId;
		this.version = version;
	};
	
	var prototype = PushPin.Features.OSMChange.prototype;
	
	prototype.getXML = function(changesetId){
		
		var xml = '';
		
		switch(type){
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
		
		var xml = '<node';
		
		// If the element has an osmId, add it to the tag
		if(PushPin.existsAndNotNull(this.osmId)){
			xml += ' id="' + this.osmId + '"';
		}
		
		xml += ' changeset="' + changesetId + '" lat="' + lat + '" lon="' + lon + '">';
			
		// If the change has tags, add them to the xml
		if(PushPin.existsAndNotNull(this.tags)){
			for(var key in this.tags){
				xml += '<tag k="' + key + '" v="' + this.tags[key] + '" />';
			}
		}
		
		xml += '</node>';
		
		return xml;
	};
	
})();