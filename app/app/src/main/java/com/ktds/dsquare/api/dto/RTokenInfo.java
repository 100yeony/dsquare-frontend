package com.ktds.dsquare.api.dto;

public class RTokenInfo {
    private int userId;
    private String registrationToken;

    public RTokenInfo(String registrationToken, int userId) {
        this.registrationToken = registrationToken;
        this.userId = userId;
    }

}
