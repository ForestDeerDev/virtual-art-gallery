package com.artgallery.service;

import com.artgallery.dto.AuthResponse;
import com.artgallery.oauth.OAuthException;

/**
 * OAuth 服务接口
 * 定义 OAuth 登录相关的所有业务操作
 * 
 * @author Art Gallery Team
 */
public interface OAuthService {

    /**
     * 处理 OAuth 登录
     * 
     * @param provider OAuth 提供商名称（如 "github", "google"）
     * @param code 来自 OAuth 提供商的授权码
     * @return 认证响应，包含 JWT token 和用户信息
     * @throws OAuthException 如果 OAuth 流程失败
     */
    AuthResponse oauthLogin(String provider, String code) throws OAuthException;
}
