(function() {

    PushPin.Classification.Search = function(form, localStorage) {
        this.form = form;
        this.localStorage = localStorage;
        this.mainForm = $('#mainForm');
        this.classificationForm = $('#classificationForm');
    };

    var prototype = PushPin.Classification.Search.prototype;

    prototype.queryData = function(items, query) {
        $('#searchResults').empty();
        var totalFound = 0;

        //loop through items
        $.each(items, function(outerIndex, item) {
            $.each(item.child_classifications, function(innerIndex, classification) {
                var label = classification.label.toLowerCase();
                if( label.search(query.toLowerCase()) != -1 ) {

                    var html = '<li class="list-group-item" pushpin-classification-index="' + outerIndex +
                                '"  pushpin-child-classification-index="' + innerIndex + '">' + label + '</li>';
                    $('#searchResults').append(html);

                    if( ++totalFound >= 10 ) {
                        return false;
                    }
                }
            });

            if(totalFound >= 10) {
                return false;
            }
        });

        this.addClickToSearch(items);
    };

    prototype.addClickToSearch = function(items) {
        var context = this;

        $('#searchResults').find('.list-group-item').click(function(){

            var innerIndex = $(this).attr('pushpin-child-classification-index')
            var outerIndex = $(this).attr('pushpin-classification-index');

            var classification = items[outerIndex].child_classifications[innerIndex];

            var feature = context.form.getFeatureWithUpdatedAttributes();

            var type = $('.pushpin-classification').attr('pushpin-current-value');

            type = type.split('=');
            var keyToRemove = type[0];

            delete feature.properties[keyToRemove];

            var newVal = classification.value.split('=');

            feature.properties[newVal[0]] = {
                value: newVal[1],
                updated: true
            };

            context.localStorage.saveFeature(feature);
            context.form.loadForm(feature);

            context.classificationForm.addClass('hide');
            context.mainForm.removeClass('hide');
        });
    }

})();