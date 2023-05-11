package com.ktds.dsquare;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
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
    HashSet<NativeValueDto> initHash = null;
    public static final int FILE_SELECTOR_REQ = 1;
    private ValueCallback mFilePathCallback;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mContext = this;
        serverUrl = "http://dsquare.kro.kr"; // front 서버

        mAppDataPreference = new AppDataPreference(this);
        String accessToken = mAppDataPreference.getAccessToken();
        String refreshToken = mAppDataPreference.getRefreshToken();
        // @TODO false 인경우도 제작하세요.
        Permission permission = new Permission(this);
        permission.requestSystemPermissions(Permission.sCheckPermissions);
        // init 시 전달 값(토큰)

        if (!accessToken.equals("") && !refreshToken.equals("")){
            initHash = new HashSet<NativeValueDto>();
            initHash.add(new NativeValueDto("accessToken", accessToken, "P", CConstants.PREF_KEY_ACCESS_TOKEN));
            initHash.add(new NativeValueDto("refreshToken", refreshToken, "P", CConstants.PREF_KEY_REFRESH_TOKEN));
        }

        webView = (WebView) findViewById(R.id.web_view);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        webView.getSettings().setDomStorageEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            webView.getSettings().setDisplayZoomControls(true);
        }
        webView.addJavascriptInterface(new JavascriptObject(), "JavascriptActions");
        webView.setWebChromeClient(new WebChromeClient(){
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                Log.d("onShowFileChooser","onShowFileChooser");
                Log.d("fileChooserParams", String.join(", ", fileChooserParams.getAcceptTypes()));

                mFilePathCallback = filePathCallback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);

                // 여러장의 사진을 선택하는 경우
                // intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);

                String[] acceptTypes = fileChooserParams.getAcceptTypes();
                intent.addCategory(Intent.CATEGORY_OPENABLE);

                for (String type : acceptTypes) {
                    intent.setType((type.length()==0) ? "*/*" : type);
                }

                startActivityForResult(Intent.createChooser(intent, "Select file"), FILE_SELECTOR_REQ);
                return true;
            }
        });
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
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent,
                                        String contentDisposition, String mimetype,
                                        long contentLength) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                startActivity(intent);
            }
        });
        webView.loadUrl(serverUrl); // @TODO webview에서 localhost 접근 바로 되지 않아, ip주소로 접근 중.

        boolean isFCM = getIntent().getBooleanExtra("isFCM", false);
        if (isFCM){
            loadNotificationPage();
        }
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

    // @TODO registerForActivityResult 로 변경
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_SELECTOR_REQ) {
            if (resultCode == Activity.RESULT_OK) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    Uri[] uris = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        uris[i] = data.getClipData().getItemAt(i).getUri();
                    }
                    mFilePathCallback.onReceiveValue(uris);
                }
                else if (data.getData() != null) {
                    mFilePathCallback.onReceiveValue((new Uri[]{data.getData()}));
                }
            } else {
                mFilePathCallback.onReceiveValue(null);
            }
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d("FirebaseMessagingService", "onNewIntent");
        if (intent.getBooleanExtra("isFCM", false)){
            loadNotificationPage();
        }
    }

    private void loadNotificationPage() {
        webView.loadUrl(serverUrl + "/notifications");
    }


}