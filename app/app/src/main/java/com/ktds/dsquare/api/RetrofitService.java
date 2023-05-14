package com.ktds.dsquare.api;

import com.ktds.dsquare.api.dto.RToken;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface RetrofitService {
//    @Headers({
//        "Authorization: --"
//            })
    @POST("")
    Call<Void> postRegistrationToken(@Body RToken rToken);
}
