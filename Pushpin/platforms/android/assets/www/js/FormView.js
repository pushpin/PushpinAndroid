(function(){
	PushPin.FormView = function(form, localStorage){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = JSON.parse(this.localStorage.getFeature());
		
		this.mainForm = $('#mainForm');
		this.classificationForm = $('#classificationForm');
		this.descriptionForm = $('#descriptionForm');
		
		this.cancelFormBtn = this.mainForm.find('#cancelFormBtn');
		this.saveFormBtn = this.mainForm.find('#saveFormBtn');
		this.movePointBtn = this.mainForm.find('#movePointBtn');		
		this.classificationCancelBtn = this.classificationForm.find('#cancelFormBtn');
		this.cancelDescriptionBtn = this.descriptionForm.find('#cancelDescriptionBtn');
		this.deletePOI = this.mainForm.find('#deletePOI');
		this.clearVal = this.classificationForm.find('#clearVal');
		this.searchInput = this.classificationForm.find('#searchInput');
		this.webView = this.mainForm.find('#webView');

		this.isSearching = false;
		this.search = new PushPin.Classification.Search(this.form, this.localStorage);
	};
	
	var prototype = PushPin.FormView.prototype;
	
	prototype.registerEvents = function() {
		var context = this;
		
		this.cancelFormBtn.click(function() {
    		return context.cancelForm();
    	});
    	
		this.classificationCancelBtn.click(function() {
			
			context.classificationForm.addClass('hide');
			context.mainForm.removeClass('hide');
		});
		
    	this.saveFormBtn.click(function() {
    		return context.saveForm();
    	});
    	
    	this.movePointBtn.click(function() {
    		return context.movePoint();
    	});
    	
    	this.cancelDescriptionBtn.click(function() {
    		context.descriptionForm.addClass('hide');
    		context.mainForm.removeClass('hide');
    	});

    	this.clearVal.click(function() {
            context.clearValue();
            this.isSearching = true;
            context.classificationForm.addClass('hide');
            context.mainForm.removeClass('hide');
    	});

    	this.deletePOI.click(function() {
    	    console.log('delete');
            return context.deleteForm();
    	});

    	this.webView.click(function() {
    	    var url = PushPin.getOSMUrl() + '/' + context.feature.element + '/' + context.feature.id;
    	    window.location.href = url;
    	});

    	this.searchInput.keyup(function(e) {

    	    if(!context.isSearching) {
    	        $('#typeList').addClass('hide');
    	        $('#searchResults').removeClass('hide');
    	        context.isSearching = true;
    	    }
    	    else if(context.searchInput[0].value == '') {
    	        $('#searchResults').addClass('hide');
                $('#typeList').removeClass('hide');
                context.isSearching = false;
    	    }

    	    if(context.isSearching) {
    	        var items = context.form.classificationsJSON.classification_sets[4].items;
                context.search.queryData(items, context.searchInput[0].value);
    	    }

        });
	};
	
	prototype.cancelForm = function(){
		this.localStorage.clearFeature();
    	window.location.href ='mapView.html';
    };

    prototype.deleteForm = function() {
        var feature = this.form.getFeatureWithUpdatedAttributes();

        var deletedFeature = function() {
            console.log('Feature deleted');
            window.location.href ='mapView.html';
        }

        var context = this;
        var failedDelete = function(err) {
            console.log('Failed to delete feature: ', err);
            context.cancelForm;
        }

        var uploader = new PushPin.Features.OSMDelete(feature, this.localStorage, deletedFeature, failedDelete);
        uploader.deleteFeature();
    };
    
    prototype.saveForm = function(){
    	var feature = this.form.getFeatureWithUpdatedAttributes();

    	var savedFeature = function() {
    	    console.log('Feature Saved');
            window.location.href ='mapView.html';
    	}

    	var context = this;
    	var failedSave = function(err) {
    	    console.log('Failed to save feature: ', err);
    	    context.cancelForm;
    	}

        console.log('Uploading data');
        var uploader = new PushPin.Features.OSMUploader(feature, this.localStorage, savedFeature, failedSave);
        uploader.upload();
    };
    
    prototype.movePoint = function(){
    	window.location.href = 'addPoint.html';
    };

    prototype.clearValue = function() {
        var feature = this.form.getFeatureWithUpdatedAttributes();

        var type = $('.pushpin-classification').attr('pushpin-current-value');

        type = type.split('=');
        var keyToRemove = type[0];

        delete feature.properties[keyToRemove];

        this.localStorage.saveFeature(feature);
        this.form.loadForm(feature);
    };

})();