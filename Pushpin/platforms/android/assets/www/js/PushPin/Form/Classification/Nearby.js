(function() {

    PushPin.Classification.Nearby = function(nearbyData, type, form, localStorage) {
        this.nearbyData = nearbyData;
        this.form = form;
        this.localStorage = localStorage;
        this.list = null;
        this.key = null;

        switch(type) {

            case 'street':
                this.key = 'addr:street';
                this.list = $('#streetList');
                break;

            case 'city':
                this.key = 'addr:city';
                this.list = $('#cityList');
                break;

            case 'postcode':
                this.key = 'addr:postcode';
                this.list = $('#postcodeList');
                break;

            default:
                console.log('ERROR: sent wrong type to Nearby');
        }

        this.search = $('#nearbySearch');
        var context = this;
        this.search.keyup(function() {
            context.fillOutList();
        });

        $('#cancelNearby-btn').click(function() {
            context.hideNearby();
        });
    }

    var prototype = PushPin.Classification.Nearby.prototype;

    prototype.fillOutList = function() {
        var context = this;
        context.list.empty();
        var query = context.search[0].value;
        this.nearbyData.forEach(function(entry, index) {
            var index = entry.toLowerCase().search(query.toLowerCase());
            if(query == '' || index != -1) {
                var html = '<li class="list-group-item">' + entry + '</li>';

                context.list.append(html);
            }
        });

        if(this.nearbyData.length == 0) {
            this.list.append('<li class="list-group-item" id="badSearch">No Results Found</li>')
        }

        this.addClick();
    };

    prototype.addClick = function() {
        var context = this;

        context.list.find('.list-group-item').click(function() {

            if(PushPin.existsAndNotNull(this.id) && this.id == 'badSearch') {
                return;
            }

            var feature = context.form.getFeatureWithUpdatedAttributes();

            feature.properties[context.key] = {
                updated: true,
                value: this.innerText
            }

            context.localStorage.saveFeature(feature);
            context.form.loadForm(feature);

            context.hideNearby();
        });
    };

    prototype.hideNearby = function() {
        this.list.addClass('hide');
        $('#nearbyForm').addClass('hide');
        $('#mainForm').removeClass('hide');
    };

})();