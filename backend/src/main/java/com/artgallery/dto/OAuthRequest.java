package com.artgallery.dto;

/**
 * 第三方登录请求DTO
 */
public class OAuthRequest {
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
