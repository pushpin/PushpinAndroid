PushPin = (function(){
	
	return{
		existsAndNotNull: function(value){
			if(value !== null && value !== undefined){
				return true;
			}
			
			return false;
		},
		
		reportException: function(e){
			console.log(e.stack);
		}
	};
})();