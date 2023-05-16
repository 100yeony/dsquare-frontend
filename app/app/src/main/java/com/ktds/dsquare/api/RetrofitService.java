package com.ktds.dsquare.api;

import com.ktds.dsquare.api.dto.RTokenInfo;
import com.ktds.dsquare.common.AppDataPreference;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface RetrofitService {
    @POST("notification/registration-tokens")
    Call<Void> postRegistrationToken(@Header("Authorization") String authorization, @Body RTokenInfo rToken);
}
