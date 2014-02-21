package com.lmn.Pushpin.Database;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.provider.BaseColumns;

public class Preferences implements BaseColumns{
	public static final String TABLE_NAME = "preferences";
	public static final String KEY = "key";
	public static final String VALUE = "value";
	
	public static final String ACCESS_TOKEN = "access_token";
	
	private SQLiteDatabase db;
	
	public Preferences(SQLiteDatabase db){
		this.db = db;
	}
	
	public void createTable(){
		String sql = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (" +
				_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
				KEY + " TEXT, " +
				VALUE + " TEXT, " +
				"UNIQUE(" + KEY + "));";
		
		this.db.execSQL(sql);
	}
	
	public String getAccessToken(){
		
		return this.get(ACCESS_TOKEN);
	}
	
	public String get(String key){
		String result = null;

		String[] columns = {
				VALUE
		};

		String where = KEY + "=?";
		String[] whereArgs = {
			key
		};

		Cursor cursor = db.query(TABLE_NAME, columns, where, whereArgs, null, null, null);

		boolean hasResult = cursor.moveToFirst();

		if(hasResult){
			result = cursor.getString(0);
		}

		cursor.close();

		return result;
	}
}
