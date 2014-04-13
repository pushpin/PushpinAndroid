(function(){
	
	PushPin.Classification.Builder = function(classificationsJSON){
		this.classificationsJSON = classificationsJSON;
		this.mapping = {};
		this.classificationSets = this.classificationsJSON['classification_sets'];
	};
	
	var prototype = PushPin.Classification.Builder.prototype;
	
	/*
	 * classification_sets: [
	 * 	{
	 * 		id: '1414',
	 * 		items: [
	 * 			{
	 * 				label: 'label',
	 * 				value: 'value'
	 * 			},
	 * 			{
	 * 				label: 'label',
	 * 				value: 'value',
	 * 				child_classifications: [
	 * 					{
	 * 						label: 'label',
	 * 						value: 'value'
	 * 						child_classifications: [
	 * 							...
	 * 						]
	 * 					}
	 * 				]
	 * 			}
	 * 		]
	 * 	},...
	 * ]
	 */
	
	prototype.build = function(){
		
		var item = null;
		
		for(var i = 0; i < this.classificationSets.length; i++){
			
			item = this.classificationSets[i];
			
			item.parent = this.classificationSets;
			
			// create a mapping for the set id
			this.mapping[item['id']] = {};
			
			this.buildItems(item['items'], item);
		}
		
		console.log("mapping", this.mapping);
	};
	
	prototype.buildItems = function(items, classificationSet){
		
		this.mapping[classificationSet['id']] = {
			parent: classificationSet
		};
			
		var item = null;
		
		for(var i = 0; i < items.length; i++){
			
			item = items[i];
			
			item.parent = classificationSet;
			
			this.buildItem(item, classificationSet);
		}
	};
	
	prototype.buildItem = function(item, classificationSet){
		
		var childClassifications = item['child_classifications'];
		
		// No children
		if(!PushPin.existsAndNotNull(childClassifications) 
				|| (PushPin.existsAndNotNull(childClassifications) 
						&& childClassifications.length === 0)){
			
			var value = item['value'];
			
			value = value.split('=');
			
			key = value[0];
			
			value = value[1];
			
			if(!PushPin.existsAndNotNull(this.mapping[classificationSet['id']][key])){
				this.mapping[classificationSet['id']][key] = {};
			}
			
			this.mapping[classificationSet['id']][key][value] = item;
			
			return;
		}
		
		var child = null;
		
		for(var i = 0; i < childClassifications.length; i++){
			
			child = childClassifications[i];
			
			child.parent = item;
			
			this.buildItem(childClassifications[i], classificationSet);
		}
	};
	
	prototype.tagPresentForId = function(classificationId, feature){
		
		if(PushPin.existsAndNotNull(this.mapping[classificationId])){
			
			var item = null;
			var value = null;
			
			for(var key in feature.properties){
				
				item = this.mapping[classificationId][key];
				value = feature.properties[key];
				
				if(PushPin.existsAndNotNull(value)){
					value = value.value;
				}
				
				if(PushPin.existsAndNotNull(item) && PushPin.existsAndNotNull(item[value])){
					
					return {
						displayString: this.getDisplayString(item[value]),
						value: key + '=' + value
					};
				}
			}
		}
		
		return false;
	};
	
	prototype.getDisplayString = function(item){
		
		var displayString = item['label'];
		
		var label = null;
		
		var parent = item.parent;
		
		while(PushPin.existsAndNotNull(parent)){
			
			if(PushPin.existsAndNotNull(parent['label'])){
				label = parent['label'];
			}else{
				return displayString;
			}
			
			displayString = label + ' &#x25b6; ' + displayString;
			
			parent = parent.parent;
		}
		
		return displayString;
	};
})();