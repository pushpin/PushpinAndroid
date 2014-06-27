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
		if(!PushPin.existsAndNotNull(this.classificationValues)){
			throw{
				message: "classificationValues has not been set."
			};
		}
		
		this.classificationName.html(this.classifications[this.nameProperty]);
		
		var html = '';
		
		var items = this.classifications[this.childClassificationsName];
		
		var grandchildren = null;
		
		for(var i = 0; i < items.length; i++){
			
			grandchildren = items[i]['child_classifications'];
			
			html += '<li class="list-group-item" pushpin-classification-index="' + i +'">';
			
			if(PushPin.existsAndNotNull(grandchildren) && grandchildren.length > 0){
				html += '<span class="badge"><span class="glyphicon glyphicon-chevron-right"></span></span>';
			}
				
			html += this.classifications[this.childClassificationsName][i].label + '</li>';
		}
		
		this.classificationList.html(html);
		
        this.addClick();
		
		if(!PushPin.existsAndNotNull(this.show)){
			throw {
				message: "Class must implement 'show'"
			};
		}else{
			this.show();
		}
	};
	
	prototype.showMainForm = function(){
		$('#mainForm').removeClass('hide');
	};
	
	prototype.removeAllChildClassificationForms = function(){
		$('#classificationForm .child-classification').remove();
	};
	
	prototype.finish = function(){
		
		if(!PushPin.existsAndNotNull(this.getForm)){
			throw {
				message: "Class must implement 'getForm'"
			};
		}else{
			this.getForm().addClass('hide');
		}
		
		this.removeAllChildClassificationForms();
		
		this.showMainForm();
		
		if(PushPin.existsAndNotNull(this.onFinishSelecting)){
			this.onFinishSelecting(this.classificationValues);
		}
	};

	prototype.addClick = function() {
        var context = this;

        this.classificationList.find('.list-group-item').click(function(){

            var index = $(this).attr('pushpin-classification-index');

            var classification = context.classifications[context.childClassificationsName][index];

            if($.inArray(classification.value, context.classificationValues) === -1){
                context.classificationValues.push({
                    label: classification.label,
                    value: classification.value
                });
            }

            var childClassifications = classification['child_classifications'];

            if(PushPin.existsAndNotNull(childClassifications) && childClassifications.length > 0){
                var childClassification = new PushPin.Classification.Child(context, classification,
                        context.classificationValues, context.onFinishSelecting);

                childClassification.load();
            }else{
                context.finish();
            }
        });
	}
})();