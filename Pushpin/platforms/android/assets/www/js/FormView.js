(function(){
	PushPin.FormView = function(form, localStorage){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = null;
		
		this.cancelFormBtn = $('#cancelFormBtn');
		this.saveFormBtn = $('#saveFormBtn');
	};
	
	var prototype = PushPin.FormView.prototype;
	
	prototype.registerEvents = function(){
		var context = this;
		
		this.cancelFormBtn.click(function(){
    		return context.cancelForm();
    	});
    	
    	this.saveFormBtn.click(function(){
    		return context.saveForm();
    	});
	};
	
	prototype.cancelForm = function(){	
		this.localStorage.clearFeature();
    	window.location.href ='mapView.html';
    };
    
    prototype.saveForm = function(){
    	alert($('#form-name').val());
    	alert(this.form.name);
    };

})();