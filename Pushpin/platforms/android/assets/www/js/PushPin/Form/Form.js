(function(){
	
	PushPin.Form = function(){
		this.name = '';
		this.type = '';
		this.building = '';
		this.landuse = '';
		this.parking = '';
		this.surface = '';
		this.park_and_ride = '';
		this.bicycle_parking = '';
		this.shelter_type = '';
		this.building_height_in_meters = '';
		this.number_of_floors_levels = '';
		this.fee = '';
		this.network = '';
		this.prescription_drugs = '';
		this.food = '';
		this.capacity = '';
		this.brand = '';
		this.fuel_types = '';
		this.car_wash = '';
		this.internet_access = '';
		this.access = '';
		this.drive_through = '';
		this.delivery = '';
		this.covered = '';
		this.atm = '';
		this.religion = '';
		this.religious_denomination = '';
		this.collection_time = '';
		this.vending = '';
		this.sport = '';
		this.cuisine = '';
		this.takeaway = '';
		this.outdoor_seating = '';
		this.smoking = '';
		this.addr_housenumber = '';
		this.addr_street = '';
		this.addr_city = '';
		this.addr_state = '';
		this.addr_postcode = '';
		this.addr_country = '';
		this.unit_suite = '';
		this.operator = '';
		this.wheelchair = '';
		this.opening_hours = '';
		this.contact_phone = '';
		this.contact_fax = '';
		this.contact_website = '';
		this.contact_email = '';
		this.description = '';
		this.attribution = '';
		this.source = '';
		this.fixme = '';
		this.notes = '';
		this.tags = '';
		this.object_type = '';
		this.change_comment = '';
	};

	var prototype = PushPin.Form.prototype;
	
	prototype.loadForm = function(sourceURL){

		var tmp = {name:this.name, brand:this.brand};
		
		var context = this;
		$.getJSON(sourceURL, function(data){
		
			var form = data.forms[0].elements;		
			var items = [];
	
			$.each(form,function(key, value){
				items.push(formTitle(value));
				$.each(value.elements, function(index, obj){
					items.push(formElement(obj, context));						
				});
			});
	
			$('#poi-form').append(items.join(""));
		
		});
	
		var formTitle = function(obj){
				return '<a class="list-group-item active">' + obj.label + '</a>';
			};
		
		var formElement = function(obj, context){
			var item = null;
			if(obj.type === 'TextField'){
				item = '<a id="name-link" class="list-group-item">'+obj.label+'<img style="float: right; margin: -10px -15px;" src="resources/images/icon-info.png" class="img-circle"/><br>\
						<input value="'+context[obj.data_name.replace(':','_')]+'" id="form-'+obj.data_name+'" type="text"/></a>';	
			}
			else if(obj.type === 'ChoiceField' && PushPin.existsAndNotNull(obj.choices)){
				var choices = '<option value=""></option>';
				$.each(obj.choices, function(i, choice){
					if(context[obj.data_name] === choice.value.split('=')[1]){
						choices = choices + '<option value="'+choice.value+'" selected>'+choice.label+'</option>';
					}
					else{
						choices = choices + '<option value="'+choice.value+'">'+choice.label+'</option>';
					}					
				});
				
				item = '<a id="name-link" class="list-group-item">'+obj.label+'<img style="float: right; margin: -10px -15px;" src="resources/images/icon-info.png" class="img-circle"/><br>\
						<select>'+choices+'</select>';
			}
			
			return item;
		};	
	};
	
	prototype.populateForm = function(feature){
		if (feature !== 'null' ){
			var poi = JSON.parse(feature);
			console.log(feature);
			var context = this;
			var items = ['name','type','building','landuse','parking','surface','park_and_ride','bicycle_parking','shelter_type',
						'building_height_in_meters','number_of_floors_levels','fee','network','prescription_drugs','food','capacity',
						'brand','fuel_types','car_wash','internet_access','access','drive_through','delivery','covered','atm',
						'religion','religious_denomination','collection_time','vending','sport','cuisine','takeaway','outdoor_seating',
						'smoking','addr_housenumber','addr_street','addr_city','addr_state','addr_postcode','addr_country','unit_suite',
						'operator','wheelchair','opening_hours','contact_phone','contact_fax','contact_website','contact_email',
						'description','attribution','source','fixme','notes','tags','object_type','change_comment'];
			$.each(items, function(i,val){
		     		if(poi[val] !== undefined){
		     			context[val] = poi[val]; 
		     		}
		    });
		}
	};
	
})();