(function(){
	PushPin.FormView = function(form, localStorage){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = null;
		
		this.mainForm = $('#mainForm');
		this.classificationForm = $('#classificationForm');
		this.descriptionForm = $('#descriptionForm');
		
		this.cancelFormBtn = this.mainForm.find('#cancelFormBtn');
		this.saveFormBtn = this.mainForm.find('#saveFormBtn');
		this.movePointBtn = this.mainForm.find('#movePointBtn');		
		this.classificationCancelBtn = this.classificationForm.find('#cancelFormBtn');
		this.cancelDescriptionBtn = this.descriptionForm.find('#cancelDescriptionBtn');
		this.deletePOI = this.mainForm.find('#deletePOI');
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

    	this.deletePOI.click(function() {
    	    console.log('delete');
            return context.deleteForm();
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

        console.log('feature:', feature);

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
  	
    	console.log("saveForm", feature);
    };
    
    prototype.movePoint = function(){
    	window.location.href = 'addPoint.html';
    };

})();