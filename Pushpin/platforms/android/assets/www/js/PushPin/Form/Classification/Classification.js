(function(){
	
	PushPin.Classification = function(){
		
	};
	
	var prototype = PushPin.Classification.prototype;
	
	prototype.populateList = function(){
		
		if(!PushPin.existsAndNotNull(this.classificationName)){
			throw {
				message: "classificationName has not been set."
			};
		}
		if(!PushPin.existsAndNotNull(this.nameProperty)){
			throw {
				message: "nameProperty has not been set."
			};
		}
		if(!PushPin.existsAndNotNull(this.classifications)){
			throw {
				message: "classifications has not been set."
			};
		}
		if(!PushPin.existsAndNotNull(this.childClassificationsName)){
			throw {
				message: "childClassificationsName has not been set."
			};
		}
		if(!PushPin.existsAndNotNull(this.classificationList)){
			throw {
				message: "classificationList has not been set."
			};
		}
		
		this.classificationName.html(this.classifications[this.nameProperty]);
		
		var html = '';
		
		for(var i = 0; i < this.classifications[this.childClassificationsName].length; i++){
			
			html += '<li class="list-group-item" pushpin-classification-index="' 
				+ i +'"><span class="badge"><span class="glyphicon glyphicon-chevron-right"></span></span>'
				+ this.classifications[this.childClassificationsName][i].label + '</li>';
		}
		
		this.classificationList.html(html);
		
		var context = this;
		
		this.classificationList.find('.list-group-item').click(function(){
			
			var index = $(this).attr('pushpin-classification-index');
			
			var classification = context.classifications[context.childClassificationsName][index];
			
			var childClassifications = classification['child_classifications'];
			
			if(PushPin.existsAndNotNull(childClassifications) && childClassifications.length > 0){
				var childClassification = new PushPin.Classification.Child(context, classification);
				
				childClassification.load();
			}
		});
		
		if(!PushPin.existsAndNotNull(this.show)){
			throw {
				message: "Class must implement 'show'"
			};
		}else{
			this.show();
		}
	};
})();