(function(){
	
	PushPin.Form = function(formJSON, classificationsJSON){
		
		this.feature = null;
		this.formJSON = formJSON;
		this.classificationsJSON = classificationsJSON;
		
		this.poiForm = $('#poi-form');
		
		this.classificationsBuilder = new PushPin.Classification.Builder(this.classificationsJSON);
		
		this.classificationsBuilder.build();
	};

	var prototype = PushPin.Form.prototype;
	
	prototype.loadForm = function(){

		var tmp = {name:this.name, brand:this.brand};
		
		var context = this;
		
		var form = this.formJSON.forms[0].elements;		

		var formTitle = function(obj){
			return '<a class="list-group-item active">' + obj.label + '</a>';
		};
	
		var formElement = function(obj, context){
			var item = null;
			
			var featureValue = context.feature.properties[obj.data_name];
			
			if(!PushPin.existsAndNotNull(featureValue)){
				featureValue = "";
			}
			
			if(obj.type === 'TextField'){
				item = '<a id="name-link" class="list-group-item">'+obj.label+'<img style="float: right; margin: -10px -15px;" src="resources/images/icon-info.png" class="img-circle"/><br>\
						<input value="'+ featureValue +'" id="form-'+obj.data_name+'" type="text" pushpin-original-value="'
						+ featureValue + '"/></a>';	
			}
			else if(obj.type === 'ChoiceField' && PushPin.existsAndNotNull(obj.choices)){
				var choices = '<option value="" pushpin-original-value="' + featureValue + '"></option>';
				$.each(obj.choices, function(i, choice){
					if(featureValue === choice.value.split('=')[1]){
						choices = choices + '<option value="'+choice.value+'" selected>'+choice.label+'</option>';
					}
					else{
						choices = choices + '<option value="'+choice.value+'">'+choice.label+'</option>';
					}					
				});
				
				item = '<a id="name-link" class="list-group-item">'+obj.label+'<img style="float: right; margin: -10px -15px;" src="resources/images/icon-info.png" class="img-circle"/><br>\
						<select>'+choices+'</select>';
			}else if(obj.type === 'ClassificationField'){
				
				var tag = context.classificationsBuilder.tagPresentForId(obj.classification_set_id, context.feature);
				
				var displayString = (tag !== false) ? tag.displayString : '';
				var originalValue = (tag !== false) ? tag.value : '';
				
				// Set the label of the field, the current value of the input, and set the form's id to the name of the field
				item = '<a id="name-link" class="list-group-item pushpin-classification" pushpin-classification="' 
					+ obj.classification_set_id + '" pushpin-original-value="' + originalValue + '">'
					+obj.label+'<img style="float: right; margin: -10px -15px;" src="resources/images/icon-info.png" class="img-circle"/><br>\
				<span id="form-' + obj.data_name + '">' + displayString + '</span></a>';
				//<input value="'+context[obj.data_name.replace(':','_')]+'" id="form-'+obj.data_name+'" type="text" readonly/></a>';
			}
			
			return item;
		};
	
		var items = [];

		$.each(form,function(key, value){
			var title = formTitle(value);
			
			items.push(title);
			$.each(value.elements, function(index, obj){
				items.push(formElement(obj, context));						
			});
		});

		context.poiForm.append(items.join(""));
		
		context.poiForm.find('.pushpin-classification').click(function(){
			var element = $(this);
			
			var classificationId = element.attr('pushpin-classification');
			
			var classification = context.getClassificationById(classificationId);
			
			var mainClassification = new PushPin.Classification.Main(classification, function(classificationValues){
				
				var displayString = '';
				
				for(var i = 0; i < classificationValues.length; i++){
					
					if(i > 0){
						displayString += ' &#x25b6; ';
					}
					
					displayString += classificationValues[i].label;
				}
				
				element.find('span').html(displayString);
			});
			
			mainClassification.load();
		});	
	};
	
	prototype.getClassificationById = function(id){
		var classifications = this.classificationsJSON.classification_sets;
		
		// Get the classification object corresponding to the classification_set_id
		for(var i = 0; i < classifications.length; i++){
			
			if(id === classifications[i].id){
				
				return classifications[i];
			}
		}
		
		throw {
			message: "Could not find classification matching id = " + id
		};
	};
	
	prototype.populateForm = function(feature){
		if (feature !== 'null' ){
			this.feature = JSON.parse(feature);
			
			console.log("feature", this.feature);
			
			if(PushPin.existsAndNotNull(this.feature['id'])){
				$('#mainForm h4').html('Edit POI');
			}else{
				$('#mainForm h4').html('Add POI');
			}
		}
	};
	
})();