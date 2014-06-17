(function() {

    PushPin.Features.OSMDelete = function(feature, localStorage, onSuccess, onFailure) {
        this.localStorage = localStorage;
        this.hostUrl = PushPin.getOSMUrl();
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;
        this.feature = feature;
        this.changeset = null;
    };

    var prototype = PushPin.Features.OSMDelete.prototype;

    prototype.deleteFeature = function() {
        console.log('Creating changeset');
        var osmChangeset = new PushPin.Features.OSMChangeset(this.localStorage, this.feature, this, this.onCreateChangeset, this.onFailure);
        osmChangeset.openChangeset();
    };

    prototype.onCreateChangeset = function(changeset) {
        console.log('deleting feature');
        this.changeset = changeset;
        this.startDelete();
    }

    prototype.startDelete = function() {
        var context = this;

        var preferences = new PushPin.Preferences(PushPin.Database.getDb());
        preferences.getAccessToken(function(accessToken) {
            var url = context.hostUrl + "/api/0.6/node/" + context.feature.id;

            var requestSignature = PushPin.createRequestSignature('DELETE', url, accessToken);
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
                type: 'DELETE',
                data: xml.getDeletionXML(context.changeset),
                success: function(data, textStatus, jqXHR) {
                    console.log('successfully created feature', data);
                    context.localStorage.saveFeature(data);
                    var osmChangeset = new PushPin.Features.OSMChangeset(context.localStorage, context.feature, context, context.onSuccess, context.onSuccess);
                    osmChangeset.closeChangeset(context.changeset);
                },
                error: function(jqXHR, textStatus, err) {
                    console.log('error creating feature', err);
                    var osmChangeset = new PushPin.Features.OSMChangeset(context.localStorage, context.feature, context, context.onFailure, context.onFailure);
                    osmChangeset.closeChangeset(context.changeset);
                }
            })
        });
    }

})();