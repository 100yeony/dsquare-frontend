package com.ktds.dsquare.common;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Permission {
    private String TAG = "[Permission]";
    private Context context;
    private Activity activity;
    public static final String[] sCheckPermissions = new String[]{Manifest.permission.INTERNET
            , Manifest.permission.WRITE_EXTERNAL_STORAGE
            , Manifest.permission.POST_NOTIFICATIONS
            , Manifest.permission.WAKE_LOCK};

    public Permission(Context context) {
        this.context = context;
        this.activity = (Activity) context;
    }

    /**
     * Permission check
     */
    public boolean checkPermissions() {
        // 안드로이드 M 이상 체크
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Log.d(TAG, "checkPermission Start");
            List<String> listPermission = new ArrayList<String>();
            Collections.addAll(listPermission, sCheckPermissions);
            for (int i = 0; i < sCheckPermissions.length; i++) {
                // 권한 여부 확인
                if (ActivityCompat.checkSelfPermission(context, sCheckPermissions[i]) != PackageManager.PERMISSION_GRANTED) {
                    Log.d(TAG, "권한이 없습니다." + sCheckPermissions[i]);
                    AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);
                    alertDialog.setTitle("안내");
                    alertDialog.setMessage("앱을 사용하기 위한 일부 권한이 없습니다. 권한을 획득하시겠습니까?");
                    String[] sRequestPermissions = new String[listPermission.size()];
                    sRequestPermissions = listPermission.toArray(sRequestPermissions);
                    final String[] sFinal = sRequestPermissions;
                    alertDialog.setNegativeButton("취소", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int whichButton) {
                            dialog.dismiss();
                        }
                    });
                    alertDialog.setPositiveButton("확인", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int whichButton) {
                            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + context.getPackageName()));
                            intent.addCategory(Intent.CATEGORY_DEFAULT);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            context.startActivity(intent);
                            activity.finish();
                        }
                    });
                    alertDialog.setCancelable(false);
                    alertDialog.show();
                    return false;
                }
            }
        }
        return true;
    }

    public boolean checkPermissions(String permission) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Log.d(TAG, "checkPermission Start");
            if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }


    @SuppressWarnings("unchecked")
    public boolean requestSystemPermissions(String[] permissions) {
        // ArrayList<String> tmpPermissions =
        List<String> tmpPermissions = new ArrayList<String>();
        for (int i = 0; i < permissions.length; i++) {
            if (!checkPermissions(permissions[i])) {
                tmpPermissions.add(permissions[i]);
            }
        }
        if (tmpPermissions.size() != 0) {
            return true;
        } else {
            String[] requestPermissions;
            requestPermissions = (String[]) tmpPermissions.toArray();

            AlertDialog.Builder alertDialog = new AlertDialog.Builder(context);
            alertDialog.setTitle("OS 권한동의 안내");
            alertDialog.setMessage("문자정보를 가져오기 위해 SMS 권한이 필요합니다. 권한을 요청 하시겠습니까?");
            alertDialog.setNegativeButton("취소", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    Toast.makeText(context, "권한이 취소 되었습니다.", Toast.LENGTH_LONG).show();
                    dialog.cancel();
                }
            });
            alertDialog.setPositiveButton("확인", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            ActivityCompat.requestPermissions(activity, (String[]) tmpPermissions.toArray(), 0x0000001);
                            dialog.cancel();
                        }
                    }
            );

            alertDialog.setCancelable(false);
            if (context != null) {
                alertDialog.show();
            }
        }
        return true;
    }
}