package com.ktds.dsquare.api;

import com.ktds.dsquare.api.dto.RTokenInfo;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface RetrofitService {
//    @Headers({
//        "Authorization: --"
//            })
    @POST("notification/registration-tokens")
    Call<Void> postRegistrationToken(@Body RTokenInfo rToken);
}
