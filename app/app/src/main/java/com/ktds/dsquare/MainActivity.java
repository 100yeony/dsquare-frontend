package com.ktds.dsquare;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.ktds.dsquare.common.AppDataPreference;
import com.ktds.dsquare.common.CConstants;
import com.ktds.dsquare.common.NativeValueDto;
import com.ktds.dsquare.common.Permission;

import java.util.HashSet;

public class MainActivity extends AppCompatActivity {
    private String TAG = "[MainActivity]";
    private WebView webView;
    private Context mContext;
    String serverUrl;
    private boolean initWebview = false;
    private AppDataPreference mAppDataPreference = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = this;
        serverUrl = "http://10.0.2.2:8080"; // front 서버

        mAppDataPreference = new AppDataPreference(this);
        String accessToken = mAppDataPreference.getAccessToken();
        String refreshToken = mAppDataPreference.getRefreshToken();
        // @TODO false 인경우도 제작하세요.
        Permission permission = new Permission(this);
        permission.requestSystemPermissions(Permission.sCheckPermissions);

        HashSet<NativeValueDto> initHash = new HashSet<NativeValueDto>();
        // init 시 전달 값(토큰)
        initHash.add(new NativeValueDto("accessToken", accessToken, "P", CConstants.PREF_KEY_ACCESS_TOKEN));
        initHash.add(new NativeValueDto("refreshToken", refreshToken, "P", CConstants.PREF_KEY_REFRESH_TOKEN));

        webView = (WebView) findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        webView.getSettings().setDomStorageEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            webView.getSettings().setDisplayZoomControls(true);
        }
        webView.addJavascriptInterface(new JavascriptObject(), "JavascriptActions");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                if (!initWebview) {
                    if (initHash != null) {
                        receiveMessage(initHash);
                    }
                    initWebview = true;
                }
                super.onPageFinished(view, url);
            }
        });
        webView.loadUrl(serverUrl); // @TODO webview에서 localhost 접근 바로 되지 않아, ip주소로 접근 중.
    }

    private void receiveMessage(HashSet<NativeValueDto> hash) {
        for (NativeValueDto nativeValueDto : hash) {
            String command = "javascript:receiveMessage.getNativeValueDto('" + nativeValueDto.getKey() + "','"
                    + nativeValueDto.getValue() + "','" + nativeValueDto.getType() + "','" + nativeValueDto.getPreference() + "');";
            Log.d(TAG, "[receiveMessage] : " + command);
            webView.loadUrl(command);
        }
    }

    class JavascriptObject {
        @JavascriptInterface
        public void postMessage(String str) {
        }

        @JavascriptInterface
        public int savePreference() {
            return 0;
        }

        @JavascriptInterface
        public void forceFinish() {
        }

        @JavascriptInterface
        public void checkPermission() {
        }

        @JavascriptInterface
        public void saveAccessToken(String token) {
            Log.d(TAG, "[saveAccessToken] : " + token);
            mAppDataPreference.setAccessToken(token);
        }

        @JavascriptInterface
        public void saveRefreshToken(String token) {
            Log.d(TAG, "[saveRefreshToken] : " + token);
            mAppDataPreference.setRefreshToken(token);
        }
    }

}