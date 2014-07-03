(function(){
	
	PushPin.Format.OSMXML = function() {
		this.features = [];
		this.x2js = new X2JS();
		this.nodesToExclude = [];
		this.waysToExclude = [];
	};
	
	var prototype = PushPin.Format.OSMXML.prototype;
	
	prototype.readFeatures = function(src) {
		var context = this;
	
		var source = context.x2js.xml_str2json(src);
		
		if(PushPin.existsAndNotNull(source)) {
			var osm = source.osm;
			
			var osmNodes = context.checkArray(osm.node);
			var osmWays = context.checkArray(osm.way);
			var osmRelations = context.checkArray(osm.relation);

			var collectedNodes;
			var collectedWays;
			var collectedRelations;

			if(PushPin.existsAndNotNull(osmRelations)) {
			    collectedRelations = context.collectRelations(osmRelations);
			}

			if(PushPin.existsAndNotNull(osmWays)) {
			    collectedWays = context.collectWays(osmWays);
			}

			if(PushPin.existsAndNotNull(osmNodes)) {
			    collectedNodes = context.collectNodes(osmNodes);
			}

            var nodes = context.createFeatureNodes(collectedNodes);
            if(PushPin.existsAndNotNull(nodes) && nodes.length > 0)
                context.features = nodes;

            var ways = context.createFeatureWays(collectedWays, collectedNodes);
            if(PushPin.existsAndNotNull(ways) && ways.length > 0)
                context.features = context.features.concat.apply(context.features, ways)

            var relations = context.createFeatureRelations(collectedRelations, collectedWays, collectedNodes);
            if(PushPin.existsAndNotNull(relations) && relations.length > 0)
                context.features = context.features.concat.apply(context.features, relations)

		}

		return context.features;
	};

	/*
	    relation = {
	        listOfWays: [],
	        members: [{ element: string, ref: string }],
	        tags: [{key, value}],
            user: string,
            version: string,
            id: string
	    }
	*/

	prototype.collectRelations = function(osmRelations) {
	    var context = this;
	    var collectedRelations = [];

	    if(PushPin.existsAndNotNull(osmRelations)) {
	        var show = true;
	        osmRelations.forEach(function(relation) {
	            var foundTags = [];
	            var wayRefs = [];
	            var members = [];

	            if(PushPin.existsAndNotNull(relation.member)) {

	                if(PushPin.existsAndNotNull(relation.tag)) {
	                    var tags = context.checkArray(relation.tag);
	                    tags.forEach(function(tag) {
	                        foundTags.push({ key: tag._k, value: tag._v });

	                        if(!context.shouldFilterKeyValue(tag._k, tag._v, PushPin.waysToShow)) {
	                            if(!context.shouldFilterKeyValue(tag._k, tag._v, PushPin.relationsToShow))
	                                show = false;
                            }
	                    });
	                }

	                if(show) {
	                    show = false;
                        var members = context.checkArray(relation.member);
                        members.forEach(function(member) {
                            if(member._type == 'way') {
                                show = true;
                                wayRefs.push(member._ref);
                                context.waysToExclude.push(member._ref);
                            }
                            members.push({ element: member._type, ref: member._ref });
                        });

                        if(show) {
                            collectedRelations.push({
                                listOfWays: wayRefs,
                                members: members,
                                tags: foundTags,
                                user: relation._user,
                                version: relation._version,
                                id: relation._id
                            });
	                    }
	                }
	            }
	        });

	        return collectedRelations
	    }
	};

	/*
	    way = {
	        listOfNodes: [],
	        tags: [{key, value}],
            user: string,
            version: string,
            id: string
	    }
	*/

	prototype.collectWays = function(osmWays) {
        var context = this;
        var collectedWays = [];
	    if(PushPin.existsAndNotNull(osmWays)) {
            osmWays.forEach(function(way) {

	            var show = false;
                var foundTags = [];
                var nodeRefs = [];

                if(PushPin.existsAndNotNull(way.nd)) {
                    var nodes = context.checkArray(way.nd);
                    nodes.forEach(function(node) {
                        nodeRefs.push(node._ref);
                        context.nodesToExclude.push(node._ref);
                    });
                }

                if(PushPin.existsAndNotNull(way.tag)) {
                    var tags = context.checkArray(way.tag);

                    tags.forEach(function(tag) {
                        if(PushPin.existsAndNotNull(tag._k) && PushPin.existsAndNotNull(tag._v)) {
                            foundTags.push({ key: tag._k, value: tag._v });

                            // only shows certain types of ways need to figure out if there are more.
                            if(!context.shouldFilterKeyValue(tag._k, tag._v, PushPin.waysToShow)) {
                                show = true;
                            }
                        }
                    });
                }

                if(show) {
                    collectedWays.push({
                        listOfNodes: nodeRefs,
                        tags: foundTags,
                        user: way._user,
                        version: way._version,
                        id: way._id
                    });
                }
            });

            return collectedWays;
        }
	};

	/*
	    node = {
	        tags: [{ key, value }],
	        coord: [lon, lat],
	        isPower: boolean,
	        user: string,
	        version: string,
	        id: string
	    }
	*/

	prototype.collectNodes = function(osmNodes) {
	    var context = this;
	    var collectedNodes = [];
        if(PushPin.existsAndNotNull(osmNodes)) {
            osmNodes.forEach(function(node) {
                var foundTags = [];
                var isPower = false;
                if(PushPin.existsAndNotNull(node.tag)) {
                    var tags = context.checkArray(node.tag);

                    tags.forEach(function(obj){
                        if(PushPin.existsAndNotNull(obj._k) && PushPin.existsAndNotNull(obj._v)) {
                            foundTags.push({ key: obj._k, value: obj._v });

                            if(obj._k == 'power') {
                                isPower = true;
                            }
                        }
                    });
                }

                collectedNodes.push({
                    tags: foundTags,
                    coord: [parseFloat(node._lon), parseFloat(node._lat)],
                    isPower: isPower,
                    user: node._user,
                    version: node._version,
                    id: node._id
                });
            });

            return collectedNodes;
        }
	};

	prototype.checkArray = function(array) {
	    if(PushPin.existsAndNotNull(array)) {
            if(PushPin.existsAndNotNull(array.length))
                return array;

            return [array];
        }

        return [];
	};

	prototype.shouldFilterKeyValue = function(key, value, arr) {
        var filter = true;
        $.each(arr, function(index, str) {
            var keyVal = str.split('=');

            if(key == keyVal[0] && (value == keyVal[1] || '*' == keyVal[1])) {
                filter = false;
            }
        });

        return filter;
	};

	prototype.createBaseFeature = function(element, coord) {
        var feature = new ol.Feature();

        element.tags.forEach(function(tag) {
            feature.set(tag.key, tag.value);
        })

        feature.set('version', element.version);
        feature.set('user', element.user);
        feature.setId(element.id);

        var geom = new ol.geom.Point(coord);
        geom.transform('EPSG:4326', 'EPSG:3857');
        feature.setGeometry(geom);
        return feature;
	};

	prototype.mapIds = function(arr) {
        var ids = arr.map(function(entry) {
            return entry.id;
        });

        return ids;
	};

	prototype.createFeatureNodes = function(collectedNodes) {
	    var newFeatures = [];
	    var context = this;
	    collectedNodes.forEach(function(node) {
	        if(context.nodesToExclude.indexOf(node.id) == -1 || node.isPower) {
	            var feature = context.createBaseFeature(node, node.coord);
	            newFeatures.push(feature);
	        }
	    });

	    return newFeatures;
	};

	prototype.createFeatureWays = function(collectedWays, collectedNodes) {
	    var newFeatures = [];
	    var context = this;

	    var nodeIds = context.mapIds(collectedNodes);

	    collectedWays.forEach(function(way) {
	        if(context.waysToExclude.indexOf(way.id) == -1) {
	            var polygon = context.createPolygon(way, collectedNodes, nodeIds);
                var feature = context.createBaseFeature(way, polygon.getInteriorPoint().flatCoordinates);
	            feature.set('polygon', polygon.transform('EPSG:4326', 'EPSG:3857'));
	            feature.set('nodeRefs', way.listOfNodes);
	            newFeatures.push(feature);
	        }
	    });

	    return newFeatures;
	};

	prototype.createPolygon = function(way, collectedNodes, nodeIds) {
        var points = [];
        way.listOfNodes.forEach(function(nodeId) {
            var index = nodeIds.indexOf(nodeId);
            points.push(collectedNodes[index].coord);
        });

        var polygon = new ol.geom.Polygon([points]);
        return polygon;
	};

	prototype.createMultiPolygon = function(relation, collectedWays, collectedNodes, wayIds, nodeIds) {
	    var context = this;
	    var polygons = [];
	    relation.listOfWays.forEach(function(wayId) {
	        var wayIndex = wayIds.indexOf(wayId);
	        if(wayIndex != -1) {
                var way = collectedWays[wayIndex];
                var points = [];
                way.listOfNodes.forEach(function(nodeId) {
                    var index = nodeIds.indexOf(nodeId);
                    points.push(collectedNodes[index].coord);
                });

                polygons.push(points);
	        }
	    });

        if(polygons.length > 0) {
            var multiPolygon = new ol.geom.MultiPolygon([polygons]);
            return multiPolygon;
        }
	};

	prototype.createFeatureRelations = function(collectedRelations, collectedWays, collectedNodes) {
	    var newFeatures = [];
	    var context = this;

	    var wayIds = context.mapIds(collectedWays);
	    var nodeIds = context.mapIds(collectedNodes);

	    collectedRelations.forEach(function(relation) {
	        var multiPoly = context.createMultiPolygon(relation, collectedWays, collectedNodes, wayIds, nodeIds);
	        if(PushPin.existsAndNotNull(multiPoly)) {
                var feature = context.createBaseFeature(relation, multiPoly.getInteriorPoints().flatCoordinates);
                feature.set('multipolygon', multiPoly.transform('EPSG:4326', 'EPSG:3857'));
                feature.set('members', relation.members);
                newFeatures.push(feature);
	        }
	    });

	    return newFeatures;
	};

})();