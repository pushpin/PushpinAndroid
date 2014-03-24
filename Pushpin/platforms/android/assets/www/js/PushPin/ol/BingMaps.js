(function(){
	
	PushPin.ol.BingMaps = function(options) {
		goog.base(this, {crossOrigin:"anonymous", opaque:true, projection:ol.proj.get("EPSG:3857")});
		this.culture_ = goog.isDef(options.culture) ? options.culture : "en-us";
		this.ready_ = false;
		var uri = new goog.Uri("http://dev.virtualearth.net/REST/v1/Imagery/Metadata/" + options.style);
		var jsonp = new goog.net.Jsonp(uri, "jsonp");
		jsonp.send({"include":"ImageryProviders", "key":options.key}, goog.bind(this.handleImageryMetadataResponse, this))
	};
	
	goog.inherits(PushPin.ol.BingMaps, ol.source.BingMaps);
})();