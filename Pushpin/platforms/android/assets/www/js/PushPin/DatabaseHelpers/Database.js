PushPin.Database = (function(){
	var dbName = "pushpin";
	
	var db = null;
	
	return {
		
		getDb: function(){
			if(!PushPin.existsAndNotNull(db)){
				db = window.sqlitePlugin.openDatabase({name: dbName});
			}
			
			return db;
		}
	};
})();