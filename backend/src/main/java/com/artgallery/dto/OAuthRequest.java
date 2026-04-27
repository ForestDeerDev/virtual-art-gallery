package com.artgallery.dto;

import lombok.Data;

/**
 * 第三方登录请求DTO
 */
@Data
public class OAuthRequest {
    private String code;
}
