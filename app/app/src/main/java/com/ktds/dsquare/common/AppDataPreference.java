package com.ktds.dsquare.common;

import android.content.Context;
import android.content.SharedPreferences;

public class AppDataPreference {

    private static AppDataPreference mAppDataPreference = null;
    private Context mContext = null;
    private SharedPreferences mPreferenceUserIdInfo = null;

    private SharedPreferences mSpToken = null;

    private SharedPreferences.Editor editor = null;

    @SuppressWarnings("static-access")
    public AppDataPreference(Context context) {
        this.mContext = context;
        this.mSpToken = context.getSharedPreferences(CConstants.PREF_KEY_TOKEN, context.MODE_PRIVATE);
    }

    public String getAccessToken() {
        return mSpToken.getString(CConstants.PREF_KEY_ACCESS_TOKEN, "");
    }
    public boolean setAccessToken(String strTokenInput) {
        editor = mSpToken.edit();
        if (editor != null) {
            editor.putString(CConstants.PREF_KEY_ACCESS_TOKEN, strTokenInput);
            editor.commit();
            return true;
        }
        return false;
    }
    public void removeAccessToken(){
        editor = mSpToken.edit();
        if (editor != null) {
            editor.putString(CConstants.PREF_KEY_TOKEN, "");
            editor.commit();
        }
    }
    public String getRefreshToken() {
        return mSpToken.getString(CConstants.PREF_KEY_REFRESH_TOKEN, "");
    }
    public boolean setRefreshToken(String strTokenInput) {
        editor = mSpToken.edit();
        if (editor != null) {
            editor.putString(CConstants.PREF_KEY_REFRESH_TOKEN, strTokenInput);
            editor.commit();
            return true;
        }
        return false;
    }
    public void removeRefreshToken(){
        editor = mSpToken.edit();
        if (editor != null) {
            editor.putString(CConstants.PREF_KEY_REFRESH_TOKEN, "");
            editor.commit();
        }
    }



}
