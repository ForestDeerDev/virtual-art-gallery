package com.artgallery.service.impl;

import com.artgallery.dto.AuthResponse;
import com.artgallery.oauth.OAuthException;
import com.artgallery.oauth.OAuthProvider;
import com.artgallery.oauth.OAuthProviderRegistry;
import com.artgallery.oauth.OAuthUserInfo;
import com.artgallery.service.OAuthService;
import com.artgallery.service.UserService;
import org.springframework.stereotype.Service;

/**
 * OAuth 服务实现类
 * 协调 OAuth 登录流程
 * 
 * 职责:
 * - 仅流程协调 (code → provider → userInfo → userService → AuthResponse)
 * - 不进行 HTTP 调用
 * - 不包含特定提供商的逻辑
 * 
 * @author Art Gallery Team
 */
@Service
public class OAuthServiceImpl implements OAuthService {

    private final OAuthProviderRegistry providerRegistry;
    private final UserService userService;

    public OAuthServiceImpl(OAuthProviderRegistry providerRegistry, UserService userService) {
        this.providerRegistry = providerRegistry;
        this.userService = userService;
    }

    /**
     * 处理 OAuth 登录
     * 
     * @param provider OAuth 提供商名称（如 "github", "google"）
     * @param code 来自 OAuth 提供商的授权码
     * @return 包含 JWT 令牌和用户信息的认证响应
     * @throws OAuthException 如果 OAuth 流程失败
     */
    public AuthResponse oauthLogin(String provider, String code) throws OAuthException {
        // 获取对应的 OAuth 提供商
        OAuthProvider oauthProvider = providerRegistry.getProvider(provider);

        // 用授权码换取访问令牌
        String accessToken = oauthProvider.exchangeCodeForToken(code);

        // 使用访问令牌获取用户信息
        OAuthUserInfo userInfo = oauthProvider.getUserInfo(accessToken);

        // 委托给 UserService 进行用户登录/注册和 JWT 生成
        AuthResponse authResponse = userService.oauthLogin(userInfo);

        return authResponse;
    }
}
