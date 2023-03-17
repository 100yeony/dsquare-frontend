package com.ktds.dsquare;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private Context mContext;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContext = this;
        webView = (WebView) findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        webView.getSettings().setDomStorageEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            webView.getSettings().setDisplayZoomControls(true);
        }
        webView.addJavascriptInterface(new JavascriptObject(), "JavascriptActions");
        webView.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
//                view.loadUrl("javascript:receiveMessage.initInfo('called by  android ')");
            }
        });
        webView.loadUrl("http://192.168.132.222:8080/"); // @TODO webview에서 localhost 접근 바로 되지 않아, ip주소로 접근 중.
    }

    class JavascriptObject {
        @JavascriptInterface
        public void postMessage(String str){
        }
        @JavascriptInterface
        public int savePreference(){
            return 0;
        }
        @JavascriptInterface
        public void forceFinish(){
        }
        @JavascriptInterface
        public void checkPermission(){
        }
    }

}