(function(){
	
	PushPin.Format.OSMXML = function(){
		this.features = [];
		this.x2js = new X2JS();
	};
	
	var prototype = PushPin.Format.OSMXML.prototype;
	
	prototype.readFeatures = function(src){
		var context = this;
	
		var source = context.x2js.xml_str2json(src);
		
		if(PushPin.existsAndNotNull(source)){
			
			var osm = source.osm;
			
			var nodes = osm.node;
			
			var ways = osm.way;
			
			var nodesInWays = [];
			
			$.each(ways, function(index, way){
				$.each(way.nd, function(i, node){
					nodesInWays.push(node._ref);
				});
			});
			
			var feature = null;
			var coord = null;
			$.each(nodes, function(index, node){
				if(nodesInWays.indexOf(node._id) === -1){
					//context.features.push(node);
					
					feature = new ol.Feature();
					
					try{
						$.each(node.tag, function(i, obj){
							feature.set(obj._k,obj._v);
						});	
									
					} catch(e){
						console.log(e);
					}
					//feature.set('tags', node.tag);
					feature.set('version',node._version);
					feature.setId(node._id);
					coord = [parseFloat(node._lon), parseFloat(node._lat)];
					feature.setGeometry(new ol.geom.Point(coord));
					context.features.push(feature);
				}
			});
		}
		
		return context.features;
	};
})();