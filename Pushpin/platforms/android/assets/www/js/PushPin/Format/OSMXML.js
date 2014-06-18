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


            if(PushPin.existsAndNotNull(ways)) {
                $.each(ways, function(index, way){
                    if(PushPin.existsAndNotNull(way.nd)) {
                        $.each(way.nd, function(i, node){
                            nodesInWays.push(node._ref);
                        });
                    }
                });
			}

			var feature = null;
			var coord = null;
			if(PushPin.existsAndNotNull(nodes)) {
                $.each(nodes, function(index, node) {
                    if(nodesInWays.indexOf(node._id) == -1) {

                        feature = new ol.Feature();

                        if(PushPin.existsAndNotNull(node.tag)) {
                            $.each(node.tag, function(i, obj){
                                if(PushPin.existsAndNotNull(obj._k) && PushPin.existsAndNotNull(obj._v)) {
                                    feature.set(obj._k, obj._v);
                                }
                            });
                        }

                        feature.set('version', node._version);
                        feature.setId(node._id);
                        coord = [parseFloat(node._lon), parseFloat(node._lat)];
                        feature.setGeometry(new ol.geom.Point(coord));

                        context.features.push(feature);
                    }
                });
			}
		}
		
		return context.features;
	};
})();