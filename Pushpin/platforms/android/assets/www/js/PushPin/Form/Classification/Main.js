(function(){
	
	PushPin.Classification.Main = function(classificationId, onFinishSelecting){
		this.classificationId = classificationId;
		this.resourceUrl = 'resources/classifications.json';
		this.classifications = null;
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
		this.getClassification();
	};
	
	prototype.getForm = function(){
		return this.classificationForm;
	};
	
	prototype.getClassification = function(){
		
		var context = this;
		
		$.getJSON(this.resourceUrl, function(data, textStatus, jqXHR){
			
			context.getClassificationById(data['classification_sets']);
		}).fail(function(jqXHR, textStatus, err){
			console.log("Couldn't load classification - " + context.classificationId, err);
		});
	};
	
	prototype.getClassificationById = function(classificationSets){
		
		for(var i = 0; i < classificationSets.length; i++){
			
			if(classificationSets[i].id === this.classificationId){
				
				this.classifications = classificationSets[i];
				
				break;
			}
		}
		
		if(!PushPin.existsAndNotNull(this.classifications)){
			throw {
				message: "Could not find classification matching id = " + this.classificationId
			};
		}
		
		this.populateList();
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