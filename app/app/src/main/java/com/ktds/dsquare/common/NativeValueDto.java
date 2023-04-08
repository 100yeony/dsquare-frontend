package com.ktds.dsquare.common;

/**
 * @author kkw
 * @do data native-> web 시 전달 기초 구조.
 */
public class NativeValueDto {
    private String key;
    private String value;
    private String type;
    private String preference;

    public NativeValueDto(String key, String value, String type, String preference) {
        this.key = key;
        this.value = value;
        this.type = type;
        this.preference = preference;
    }

    // C : CConstants
    // P : Preference
    public NativeValueDto(String key, String value) {
        this(key, value, "C", "");
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPreference() {
        return preference;
    }

    public void setPreference(String preference) {
        this.preference = preference;
    }

}
