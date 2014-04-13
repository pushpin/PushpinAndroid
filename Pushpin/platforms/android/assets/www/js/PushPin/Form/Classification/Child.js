(function(){
	
	PushPin.Classification.Child = function(parent, classifications, classificationValues, onFinishSelecting){
		
		this.form = $('#classificationForm').clone();
		
		this.form.addClass('hide');
		
		this.parent = parent;
		
		this.parentForm = null;
		
		if(!PushPin.existsAndNotNull(this.parent.getForm)){
			throw {
				message: "Parent must implement getForm()"
			};
		}else{
			
			this.parentForm = this.parent.getForm();
			
			this.parentForm.after(this.form);
		}
		
		if(this.parent instanceof PushPin.Classification.Main){
			this.id = 0;
		}else{
			this.id = parent.id + 1;
		}
		
		this.form.attr('id', 'child-classification-' + this.id);
		
		this.form.addClass('child-classification');
		
		this.classifications = classifications;
		
		this.childClassificationsName = "child_classifications";
		
		this.classificationList = this.form.find('.list-group');
		
		this.classificationName = this.form.find('h4');
		
		this.nameProperty = "label";
		
		this.classificationValues = classificationValues;
		
		this.onFinishSelecting = onFinishSelecting;
	};
	
	PushPin.Classification.Child.prototype = new PushPin.Classification();
	
	PushPin.Classification.Child.prototype.constructor = PushPin.Classification.Child;
	
	var prototype = PushPin.Classification.Child.prototype;
	
	prototype.getForm = function(){
		return this.form;
	};
	
	prototype.hide = function(){
		
		this.form.addClass('hide');
		this.parentForm.removeClass('hide');
	};
	
	prototype.show = function(){
		
		this.parentForm.addClass('hide');
		this.form.removeClass('hide');
	};
	
	prototype.load = function(){
		
		this.initForm();
		
		this.populateList();
	};
	
	prototype.initForm = function(){
		
		var context = this;
		
		// Change the cancel btn to a back btn
		var backBtn = this.form.find('#cancelFormBtn');
		
		backBtn.html('Back');
		
		backBtn.click(function(){
			context.pop();
		});
	};
	
	prototype.pop = function(){
		
		this.hide();
		
		this.form.remove();
		
		this.classificationValues.splice(this.classificationValues.length - 1, 1);
	};
})();