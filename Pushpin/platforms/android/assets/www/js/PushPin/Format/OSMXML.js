(function(){
	
	PushPin.Format.OSMXML = function(){
		this.features = [];
		this.x2js = new X2JS();
	};
	
	var prototype = PushPin.Format.OSMXML.prototype;
	
	prototype.readFeatures = function(src){
		var context = this;

		//console.log('src:', src);
	
		var source = context.x2js.xml_str2json(src);
		
		if(PushPin.existsAndNotNull(source)){
			
			var osm = source.osm;
			
			var nodes = osm.node;

            if(nodes.length == undefined) {
                nodes = [nodes];
            }

            var nodeIds;
            if(PushPin.existsAndNotNull(nodes)) {
                nodeIds = nodes.map(function(node) {
                    return node._id;
                });
		    }
		    else
		        nodeIds = [];

			var ways = osm.way;

			var nodesInWays = [];

			var feature = null;
            if(PushPin.existsAndNotNull(ways)) {
                $.each(ways, function(index, way){

                    feature = new ol.Feature();

                    var points = [];
                    var nodeRefs = [];

                    if(PushPin.existsAndNotNull(way.nd)) {
                        $.each(way.nd, function(i, node) {
                            nodesInWays.push(node._ref);
                            nodeRefs.push(node._ref);

                            var index = nodeIds.indexOf(node._ref);
                            var foundNode = nodes[index];
                            points.push([parseFloat(foundNode._lon), parseFloat(foundNode._lat)]);
                        });
                    }

                    var showGeom = false;

                    if(PushPin.existsAndNotNull(way.tag)) {
                        var tag = way.tag;
                        if(tag.length == undefined)
                            tag = [tag];

                        $.each(tag, function(i, obj) {
                            if(PushPin.existsAndNotNull(obj._k) && PushPin.existsAndNotNull(obj._v)) {
                                feature.set(obj._k, obj._v);

                                // only shows certain types of ways need to figure out if there are more.
                                if(obj._k == 'natural' || (obj._k == 'building') ||
                                    (obj._k == 'amenity' && obj._v == 'parking') || obj._k == 'leisure')
                                    showGeom = true;
                            }
                        });
                    }

                    if(showGeom) {

                        var poly = new ol.geom.Polygon([points]);
                        poly.transform('EPSG:4326', 'EPSG:3857');

                        feature.set('polygon', poly);

                        var centroid = points.reduce(function(previousValue, currentValue, array, index) {
                            if(array.length - 1 != index) {
                                var newVal = [0,0];
                                newVal[0] = previousValue[0] + currentValue[0];
                                newVal[1] = previousValue[1] + currentValue[1];
                                return newVal;
                            }

                            return previousValue;
                        }, [0,0]);

                        centroid[0] = centroid[0] / points.length;
                        centroid[1] = centroid[1] / points.length;

                        feature.setGeometry(new ol.geom.Point(centroid));
                        feature.set('version', way._version);
                        feature.set('nodeRefs', nodeRefs);
                        feature.setId(way._id);

                        context.features.push(feature);
                    }
                });
			}

			var coord = null;
			if(PushPin.existsAndNotNull(nodes)) {

                $.each(nodes, function(index, node) {
                    if(nodesInWays.indexOf(node._id) == -1) {

                        feature = new ol.Feature();

                        if(PushPin.existsAndNotNull(node.tag)) {

                            var tag = node.tag;
                            if(tag.length == undefined) {
                                tag = [tag];
                            }

                            $.each(tag, function(i, obj){
                                if(PushPin.existsAndNotNull(obj._k) && PushPin.existsAndNotNull(obj._v)) {
                                    feature.set(obj._k, obj._v);
                                }
                            });
                        }

                        feature.set('version', node._version);
                        feature.set('user', node._user);
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