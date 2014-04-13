(function(){
	
	PushPin.Classification.Main = function(classifications, onFinishSelecting){
		this.classifications = classifications;
		this.childClassificationsName = 'items';
		this.mainForm = $('#mainForm');
		this.classificationForm = $('#classificationForm');
		this.classificationList = this.classificationForm.find('.list-group');
		this.classificationName = this.classificationForm.find('h4');
		this.nameProperty = "name";
		this.classificationValues = [];
		this.onFinishSelecting = onFinishSelecting;
	};
	
	PushPin.Classification.Main.prototype = new PushPin.Classification();
	
	PushPin.Classification.Main.prototype.constructor = PushPin.Classification.Main;
	
	var prototype = PushPin.Classification.Main.prototype;
	
	prototype.load = function(){
		this.populateList();
	};
	
	prototype.getForm = function(){
		return this.classificationForm;
	};
	
	prototype.hide = function(){
		
		this.classificationForm.addClass('hide');
		this.mainForm.removeClass('hide');
	};
	
	prototype.show = function(){
		
		this.mainForm.addClass('hide');
		this.classificationForm.removeClass('hide');
	};
})();