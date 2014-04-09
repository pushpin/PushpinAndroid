(function(){
	PushPin.FormView = function(form, localStorage){
		this.form = form;
		this.localStorage = localStorage;
		this.feature = null;
		
		this.cancelFormBtn = $('#cancelFormBtn');
		this.saveFormBtn = $('#saveFormBtn');
		this.movePointBtn = $('#movePointBtn');
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