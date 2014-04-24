(function(){
	PushPin.FormView = function(form, localStorage, requestSignature){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = null;
		this.requestSignature = requestSignature;
		
		this.mainForm = $('#mainForm');
		this.classificationForm = $('#classificationForm');
		this.descriptionForm = $('#descriptionForm');
		
		this.cancelFormBtn = this.mainForm.find('#cancelFormBtn');
		this.saveFormBtn = this.mainForm.find('#saveFormBtn');
		this.movePointBtn = this.mainForm.find('#movePointBtn');		
		this.classificationCancelBtn = this.classificationForm.find('#cancelFormBtn');
		this.cancelDescriptionBtn = this.descriptionForm.find('#cancelDescriptionBtn');
	};
	
	var prototype = PushPin.FormView.prototype;
	
	prototype.registerEvents = function(){
		var context = this;
		
		this.cancelFormBtn.click(function(){
    		return context.cancelForm();
    	});
    	
		this.classificationCancelBtn.click(function(){
			
			context.classificationForm.addClass('hide');
			context.mainForm.removeClass('hide');
		});
		
    	this.saveFormBtn.click(function(){
    		return context.saveForm();
    	});
    	
    	this.movePointBtn.click(function(){
    		return context.movePoint();
    	});
    	
    	this.cancelDescriptionBtn.click(function(){
    		
    		context.descriptionForm.addClass('hide');
    		context.mainForm.removeClass('hide');
    	});
	};
	
	prototype.cancelForm = function(){	
		this.localStorage.clearFeature();
    	window.location.href ='mapView.html';
    };
    
    prototype.saveForm = function(){
    	//TODO
    	var feature = this.form.getFeatureWithUpdatedAttributes();
    	
    	var uploader = new PushPin.Features.OSMUploader(feature, this.requestSignature, this.localStorage);
    	uploader.upload();
  	
    	console.log("saveForm", feature);
    };
    
    prototype.movePoint = function(){
    	window.location.href = 'addPoint.html';
    };

})();