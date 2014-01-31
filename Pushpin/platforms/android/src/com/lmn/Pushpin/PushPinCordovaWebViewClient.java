package com.lmn.Pushpin;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewClient;

import android.util.Log;
import android.webkit.WebView;

public class PushPinCordovaWebViewClient extends CordovaWebViewClient {

	private static final String TAG = "PushPinCordovaWebViewClient";
	
	/**
     * Constructor.
     *
     * @param cordova
     */
    public PushPinCordovaWebViewClient(CordovaInterface cordova) {
        super(cordova);
    }

    /**
     * Constructor.
     *
     * @param cordova
     * @param view
     */
    public PushPinCordovaWebViewClient(CordovaInterface cordova, CordovaWebView view) {
        super(cordova, view);
    }
    
    /**
     * Report an error to the host application. These errors are unrecoverable (i.e. the main resource is unavailable).
     * The errorCode parameter corresponds to one of the ERROR_* constants.
     *
     * @param view          The WebView that is initiating the callback.
     * @param errorCode     The error code corresponding to an ERROR_* value.
     * @param description   A String describing the error.
     * @param failingUrl    The url that failed to load.
     */
    @Override
    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        if(failingUrl.contains("http://localhost")){
        	Log.w(TAG, TAG + ".onReceivedError: " + failingUrl);
        	
        	return;
        }
        
        super.onReceivedError(view, errorCode, description, failingUrl);
    }
}
