PushPin.Preferences = function(db){
	this.db = db;
};

PushPin.Preferences.prototype.TABLE_NAME = "preferences";
PushPin.Preferences.prototype.ACCESS_TOKEN = "access_token";
PushPin.Preferences.prototype.KEY = "key";
PushPin.Preferences.prototype.VALUE = "value";

PushPin.Preferences.prototype.onError = function(e, onFailure){
	PushPin.reportException(e);
	
	if(PushPin.existsAndNotNull(onFailure)){
		onFailure(e);
	}
};

PushPin.Preferences.prototype.getAccessToken = function(onSuccess, onFailure){
	var context = this;
	
	this.db.transaction(function(tx){
		
		var sql = "select " + context.VALUE + " from " + context.TABLE_NAME + " WHERE " + context.KEY + "=?";
		
		tx.executeSql(sql, [context.ACCESS_TOKEN], function(tx, res){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess(res.rows.item(0));
			}
		}, function(tx, e){
			
			context.onError(e, onFailure);
		});
	}, function(e){
		
		context.onError(e, onFailure);
	});
};

PushPin.Preferences.prototype.saveAccessToken = function(accessToken, onSuccess, onFailure){
	
	this.put(this.ACCESS_TOKEN, accessToken, onSuccess, onFailure);
};

PushPin.Preferences.prototype.removeAccessToken = function(onSuccess, onFailure){
	this.remove(this.ACCESS_TOKEN, onSuccess, onFailure);
};

PushPin.Preferences.prototype.get = function(key, onSuccess, onFailure){
	
	var context = this;
	
	this.db.transaction(function(tx){
		var sql = "select " + context.VALUE + " from " 
			+ context.TABLE_NAME + " where " + context.KEY + "=?";

		tx.executeSql(sql, [key], function(tx, res){

			if(Arbiter.Util.funcExists(onSuccess)){
				if(res.rows.length > 0){
					onSuccess.call(context, res.rows.item(0)[VALUE]);
				}else{
					console.log("There is no preference with key = " + key);
					onSuccess.call(context, null);
				}
			}
		}, function(tx, e){
			console.log("ERROR: Arbiter.PreferencesHelper.get inner", e);

			if(Arbiter.Util.funcExists(onFailure)){
				onFailure.call(context, e);
			}
		});
	}, function(e){
		console.log("ERROR: Arbiter.PreferencesHelper.get outer", e);

		if(Arbiter.Util.funcExists(onFailure)){
			onFailure.call(context, e);
		}
	});
};

PushPin.Preferences.prototype.put = function(key, value, onSuccess, onFailure){
	
	var context = this;
	
	this.db.transaction(function(tx){
		
		var sql = "INSERT OR REPLACE INTO " + context.TABLE_NAME + "(" 
			+ context.KEY + "," + context.VALUE + ") VALUES (?,?);";
		
		tx.executeSql(sql, [key, value], function(tx, res){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess();
			}
		}, function(tx, e){
			
			context.onError(e, onFailure);
		});
	}, function(e){
		
		context.onError(e, onFailure);
	});
};

PushPin.Preferences.prototype.remove = function(key, onSuccess, onFailure){
	
	var context = this;
	
	this.db.transaction(function(tx){
		
		var sql = "DELETE FROM " + context.TABLE_NAME + " WHERE " + key + "=?";
		
		tx.executeSql(sql, [key], function(tx, res){
			
			if(PushPin.existsAndNotNull(onSuccess)){
				onSuccess();
			}
		}, function(tx, e){
			
			context.onError(e, onFailure);
		});
	}, function(e){
		
		context.onError(e, onFailure);
	});
};