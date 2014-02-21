package com.lmn.Pushpin;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.lmn.Pushpin.Database.ApplicationDatabaseHelper;
import com.lmn.Pushpin.Database.Preferences;

import android.net.Uri;
import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.support.v4.content.IntentCompat;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.RelativeLayout;

public class Welcome extends Activity {
	private static final String osmSignUpUri = "https://www.openstreetmap.org/user/new";
	
	private final ExecutorService threadPool = Executors.newCachedThreadPool();
	private Button loginBtn;
	private Button signupBtn;
	private RelativeLayout loginButtonsContainer;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_welcome);
		
		
		this.loginBtn = (Button) findViewById(R.id.loginButton);
		this.signupBtn = (Button) findViewById(R.id.signUpButton);
		this.loginButtonsContainer = (RelativeLayout) findViewById(R.id.loginButtonsContainer);
		
		Runnable loggedIn = new Runnable(){
			@Override
			public void run(){
				
				switchToMapActivity();
			}
		};
		
		Runnable notLoggedIn = new Runnable(){
			@Override
			public void run(){
				setLoginButtonsVisibility(View.VISIBLE);
			}
		};
		
		checkLoginStatus(loggedIn, notLoggedIn);
		
		registerButtons();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.welcome, menu);
		return true;
	}
	
	private void switchToMapActivity(){
		
		Intent intent = new Intent(this, PushPin.class);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | IntentCompat.FLAG_ACTIVITY_CLEAR_TASK);
		
		this.startActivity(intent);
	}
	
	private void setLoginButtonsVisibility(int visibility){
		loginButtonsContainer.setVisibility(visibility);
	}
	
	private void checkLoginStatus(final Runnable loggedIn, final Runnable notLoggedIn){
		
		String title = getResources().getString(R.string.loading);
		String message = getResources().getString(R.string.please_wait);
		
		final ProgressDialog dialog = ProgressDialog.show(this, title, message, true);
		
		threadPool.execute(new Runnable(){
			@Override
			public void run(){
				
				ApplicationDatabaseHelper dbHelper = new ApplicationDatabaseHelper(getApplicationContext());
				
				SQLiteDatabase db = dbHelper.getWritableDatabase();
				
				Preferences preferences = new Preferences(db);
				
				final String accessToken = preferences.getAccessToken();
				
				dbHelper.close();
				
				runOnUiThread(new Runnable(){
					@Override
					public void run(){
						
						dialog.dismiss();
						
						if(accessToken == null){
							notLoggedIn.run();
						}else{
							loggedIn.run();
						}
					}
				});
			}
		});
	}
	
	private void openOpenStreetMap(){
		
		Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(osmSignUpUri));
		startActivity(browserIntent);
	}
	
	private void displaySignUpDialog(){
		
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		
		String title = getResources().getString(R.string.signup);
		String msg = getResources().getString(R.string.signup_message);
		
		builder.setTitle(title);
		builder.setMessage(msg);
		
		builder.setNegativeButton(android.R.string.cancel, null);
		builder.setPositiveButton(R.string.signup, new DialogInterface.OnClickListener(){

			@Override
			public void onClick(DialogInterface dialog, int which) {
				
				openOpenStreetMap();
			}
		});
		
		builder.create().show();
	}
	
	private void registerButtons(){
		
		this.loginBtn.setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View v) {
				switchToMapActivity();
			}
		});
		
		this.signupBtn.setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View v) {
				displaySignUpDialog();
			}
		});
	}

}
