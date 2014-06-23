(function() {

    PushPin.nominatimView = function(positionHandler, localStorage) {

        this.searchResults = null;
        this.positionHandler = positionHandler;
        this.localStorage = localStorage;

        this.searchList = $('#searchResults');
        this.searchForm = $('#searchForm');
        this.cancel = $('#cancelSearchBtn');
    };

    var prototype = PushPin.nominatimView.prototype;

    prototype.registerEvents = function() {
        var context = this;

        this.cancel.click(function() {
            window.location.href = 'mapView.html';
        });

        this.searchForm.submit(function() {
            context.nominatimSearch();
            return false;
        });
    };

    prototype.nominatimSearch = function() {

        var context = this;
        var text = $('#searchInput')[0].value;

        // Will only work on live api since the uri is different for nominatim searches.
        var url = 'http://nominatim.openstreetmap.org/search?q=';
        url += text + '&format=json&addressdetails=0';

        $.ajax({
            url: url,
            type: 'GET',
            success: function(data, textStatus, jqXHR) {
                context.searchResults = data;
                context.showSearchResults();
            }
        });
    };

    prototype.showSearchResults = function() {
        var context = this;
        if(PushPin.existsAndNotNull(this.searchResults)) {
            var html = '';
            $.each(this.searchResults, function(index, result) {

                context.positionHandler.getCurrentPosition();
                var distance = 0;
                if(PushPin.existsAndNotNull(context.positionHandler.geoY) &&
                   PushPin.existsAndNotNull(context.positionHandler.geoX)) {

                   distance = PushPin.getDistance(context.positionHandler.geoY, context.positionHandler.geoX, result.lat, result.lon);
                }

                html += '<a id="result-' + index + '" class="list-group-item" href="#">' + result.display_name;
                html += '<p style="color: gray;">\n' + distance + ' km</p></a>';
            });

            context.searchList.html(html);

            //for(var index = 0; index < this.searchResults.length; ++index)
            this.searchResults.forEach(function(result, index) {

                var resultHtml = $('#result-' + index);

                resultHtml.click(function() {
                    var result = context.searchResults[index];
                    var center = [parseFloat(result.lon), parseFloat(result.lat)];

                    context.localStorage.saveMapCenter(ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'));

                    window.location.href = 'mapView.html';
                });
            });
        }
    };

})();