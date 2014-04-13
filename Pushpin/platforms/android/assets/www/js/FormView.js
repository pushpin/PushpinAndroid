(function(){
	PushPin.FormView = function(form, localStorage){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = null;
		
		this.mainForm = $('#mainForm');
		
		this.cancelFormBtn = this.mainForm.find('#cancelFormBtn');
		this.saveFormBtn = this.mainForm.find('#saveFormBtn');
		this.movePointBtn = this.mainForm.find('#movePointBtn');
		
		this.classificationForm = $('#classificationForm');
		
		this.classificationCancelBtn = this.classificationForm.find('#cancelFormBtn');
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
	};
	
	prototype.cancelForm = function(){	
		this.localStorage.clearFeature();
    	window.location.href ='mapView.html';
    };
    
    prototype.saveForm = function(){
    	//TODO
    };
    
    prototype.movePoint = function(){
    	window.location.href = 'addPoint.html';
    };

})();