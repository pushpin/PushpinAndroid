(function(){
	
	PushPin.Features.OSMXML = function(feature, localStorage, changesetId){
	    console.log('feature', feature);
        this.type = feature.element;
        this.tags = feature.properties;
        this.nodeRefs = feature.properties.nodeRefs ? feature.properties.nodeRefs.value : null;
        this.osmId = feature.id;
        this.version = feature.version;
        this.user = feature.properties.user ? feature.properties.user.value : null;
        this.name = feature.properties.name ? feature.properties.name.value : null;
        this.changesetId = changesetId;
		this.lon = ol.proj.transform(localStorage.getPinPosition(),'EPSG:3857','EPSG:4326')[0];
		this.lat = ol.proj.transform(localStorage.getPinPosition(),'EPSG:3857','EPSG:4326')[1];
	};
	
	var prototype = PushPin.Features.OSMXML.prototype;

	prototype.getChangesetXML = function() {

	    var comment = this.osmId ? 'Edited ' : 'Added ';
	    comment += _.escape(this.name);

        var version = this.version;
        if(typeof this.version != 'string')
            version = parseFloat(this.version) + 1;

	    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<osm>\n<changeset>\n'
	        + '<tag k="created_by" v="PushPin Android"/>\n'
	        + '<tag k="comment" v="' + comment + '"/>\n'
	        + '<tag k="version" v="' + version + '"/>\n<tag k="build" v="25"/>\n'
	        + '</changeset>\n</osm>';

	    return xml;
	};

	prototype.getDeletionXML = function(changesetId) {
	    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<osm>\n<node id="' + this.osmId;
	    xml += '" version="' + this.version + '" changeset="' + changesetId;
        xml += '" lat="' + this.lat + '" lon="' + this.lon + '"/>\n</osm>';

	    return xml;
	};

	prototype.getUploadXML = function(changesetId){
		
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

		return '<?xml version="1.0" encoding="UTF-8"?><osm>' + xml + "</osm>";
	};
	
	prototype.getWayXML = function(changesetId){

		var version;
		if(this.version)
		    version = parseInt(this.version);

		var xml = '<way';
		// If the element has an osmId, add it to the tag
        if(PushPin.existsAndNotNull(this.osmId)){
            xml += ' id="' + this.osmId + '"';
        }

        if(PushPin.existsAndNotNull(version)) {
            xml += ' version="' + version + '"';
        }

        xml += ' changeset="' + changesetId + '" user="' + this.user + '">';

        if(PushPin.existsAndNotNull(this.nodeRefs)) {
            this.nodeRefs.forEach(function(ref) {
                xml += '<nd ref="' + ref + '"/>';
            });
        }

        if(PushPin.existsAndNotNull(this.tags)){
            for(var key in this.tags){
                if(key != 'nodeRefs' && key != 'user')
                    xml += '<tag k="' + key + '" v="' + _.escape(this.tags[key].value) + '"/>';
            }
        }

        xml += '</way>';

		return xml;
	};
	
	prototype.getRelationXML = function(changesetId){

	    console.log('Relation Saving Not Yet Implemented');
	    return "";

		var version;
		if(this.version)
		    version = parseInt(this.version);

		var xml = '<relation';
		// If the element has an osmId, add it to the tag
        if(PushPin.existsAndNotNull(this.osmId)){
            xml += ' id="' + this.osmId + '"';
        }

        if(PushPin.existsAndNotNull(version)) {
            xml += ' version="' + version + '"';
        }

        xml += ' changeset="' + changesetId + '" user="' + this.user + '">';

        if(PushPin.existsAndNotNull(this.members)) {
            this.members.forEach(function(member) {
                xml += '<member type="' + member.element + '" ref="' + member.ref + '"/>';
            });
        }

        if(PushPin.existsAndNotNull(this.tags)){
            for(var key in this.tags){
                if(key != 'member' && key != 'user')
                    xml += '<tag k="' + key + '" v="' + _.escape(this.tags[key].value) + '"/>';
            }
        }

        xml += '</relation>';

		return xml;
	};
	
	prototype.getNodeXML = function(changesetId){

	    console.log('version:', this.version);

	    var version;
	    if(this.version)
	        version = parseInt(this.version);
		
		var xml = '<node';
		
		// If the element has an osmId, add it to the tag
		if(PushPin.existsAndNotNull(this.osmId)){
			xml += ' id="' + this.osmId + '"';
		}

		if(PushPin.existsAndNotNull(version)) {
		    xml += ' version="' + version + '"';
		}
		
		xml += ' changeset="' + changesetId + '" user="' + this.user + '" lat="' + this.lat + '" lon="' + this.lon + '">';

		// If the change has tags, add them to the xml
		if(PushPin.existsAndNotNull(this.tags)){
			for(var key in this.tags){
			    // Probably is a better way to do this but it's fine for now.
			    if(key != 'user')
				    xml += '<tag k="' + key + '" v="' + _.escape(this.tags[key].value) + '"/>';
			}
		}
		
		xml += '</node>';
		
		return xml;
	};
	
})();