PushPin = (function(){
	
	var osmUrl = null;
	
	var featureVersions = [];
	
	return{
		DEV_MODE: false,
		
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
		
		addVersionToOSMXMLFormat: function(){
			
			console.log("addVersionToOSMXMLFormat");
			
			ol.format.OSMXML.readNode_ = function(node, objectStack){
				 goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
				  goog.asserts.assert(node.localName == 'node');
				  var state = /** @type {Object} */ (objectStack[objectStack.length - 1]);
				  var id = node.getAttribute('id');
				  var coordinates = /** @type {Array.<number>} */ ([
				    parseFloat(node.getAttribute('lon')),
				    parseFloat(node.getAttribute('lat'))
				  ]);
				  var version = node.getAttribute('version');
				  
				  featureVersions.push(version);
				  
				  goog.object.set(state.nodes, id, coordinates);

				  var values = ol.xml.pushParseAndPop({
				    tags: {}
				  }, ol.format.OSMXML.NODE_PARSERS_, node, objectStack);
				  
				  if (!goog.object.isEmpty(values.tags)) {
				    var geometry = new ol.geom.Point(coordinates);
				    var feature = new ol.Feature(geometry);
				    feature.setId(id);
				    feature.version = version;
				    feature.setValues(values.tags);
				    state.features.push(feature);
				  }
			};
			
			ol.format.OSMXML.PARSERS_ = ol.xml.makeParsersNS(
				    ol.format.OSMXML.NAMESPACE_URIS_, {
				      'node': ol.format.OSMXML.readNode_,
				      'way': ol.format.OSMXML.readWay_
				    });
			
			ol.format.OSMXML.prototype.readFeaturesFromNode = function(node) {
				  goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT);
				  if(node.localName == "osm") {
				    var state = ol.xml.pushParseAndPop({nodes:{}, features:[]}, ol.format.OSMXML.PARSERS_, node, []);
				    if(goog.isDef(state.features)) {
				    	
				    	for(var i = 0; i < state.features.length; i++){
				    		state.features[i].version = featureVersions[i];
				    	}
				    	
				      return state.features;
				    }
				  }
				  return[]
				};
		},
		
		resetFeatureVersions: function(){
			featureVersions = [];
		}
	};
})();