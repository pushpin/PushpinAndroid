(function() {

    PushPin.Features.OSMChangeset = function(localStorage, feature, oldContext, onSuccess, onFailure) {
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;
        this.hostUrl = PushPin.getOSMUrl();
        this.localStorage = localStorage;
        this.feature = feature;
        this.oldContext = oldContext;
    };

    var prototype = PushPin.Features.OSMChangeset.prototype;

    prototype.openChangeset = function() {

		var context = this;

        var preferences = new PushPin.Preferences(PushPin.Database.getDb());
		preferences.getAccessToken(function(accessToken) {
            var url = context.hostUrl + "/api/0.6/changeset/create";

            var requestSignature = PushPin.createRequestSignature('PUT', url, accessToken);
            var xml = new PushPin.Features.OSMXML(context.feature, context.localStorage);

            $.ajax({
                headers: {
                    'Content-Type': 'text/plain',
                    'User-Agent': 'PushPin 1.1 rv:25',
                    'Accept-Encoding' : 'gzip',
                    'Connection' : 'close',
                    'Authorization': requestSignature
                },
                url: url,
                type: 'PUT',
                data: xml.getChangesetXML(),
                success: function(data, textStatus, jqXHR){
                    console.log("successfully created changeset", data);
                    context.localStorage.saveChangeset(data);
                    context.onSuccess.call(context.oldContext, data);
                },
                error: function(jqXHR, textStatus, err){
                    console.log("err:", err);
                    console.log("couldn't create changeset");
                    if(PushPin.existsAndNotNull(context.onFailure)){
                        context.onFailure.call(context.oldContext, err);
                    }
                }
            });
        });
    };

    prototype.closeChangeset = function(changeset){

        var context = this;

        if(PushPin.existsAndNotNull(changeset)){

            var url = this.hostUrl + "/api/0.6/changeset/" + changeset + "/close";

            var preferences = new PushPin.Preferences(PushPin.Database.getDb());
            preferences.getAccessToken(function(accessToken) {
                var requestSignature = PushPin.createRequestSignature('PUT', url, accessToken);

                $.ajax({
                    headers: {
                        'Content-Type': 'text/plain',
                        'User-Agent': 'PushPin 1.1 rv:25',
                        'Accept-Encoding' : 'gzip',
                        'Connection' : 'close',
                        'Authorization': requestSignature
                    },
                    url: url,
                    type: 'PUT',
                    success: function(data, textStatus, jqXHR){
                        console.log("Successfully closed changeset", data);

                        if(PushPin.existsAndNotNull(context.onSuccess)){
                            context.onSuccess.call(context.oldContext);
                        }
                    },
                    error: function(jqXHR, textStatus, err){
                        console.log("Failed to close changeset", err);

                        if(PushPin.existsAndNotNull(context.onFailure)){
                            context.onFailure.call(context.oldContext, err);
                        }
                    }
                });
            });
        }
    };

})();