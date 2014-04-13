PushPin = (function(){
	
	var osmUrl = null;
	
	return{
		DEV_MODE: false,
		
		existsAndNotNull: function(value){
			if(value !== null && value !== undefined){
				return true;
			}
			
			return false;
		},
		
		reportException: function(e){
			console.log(e.stack);
		},
		
		getOSMUrl: function(){
			
			if(osmUrl === null){
				
				if(PushPin.DEV_MODE){
					osmUrl = 'http://api06.dev.openstreetmap.org';
				}else{
					osmUrl = 'http://www.openstreetmap.org';
				}
			}
			
			return osmUrl;
		}
	};
})();