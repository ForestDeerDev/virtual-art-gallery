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
     * Handle OAuth login
     * 
     * @param provider OAuth provider name (e.g., "github", "google")
     * @param code Authorization code from OAuth provider
     * @return Authentication response with JWT token and user info
     * @throws OAuthException if OAuth flow fails
     */
    public AuthResponse oauthLogin(String provider, String code) throws OAuthException {
        // Get the appropriate OAuth provider
        OAuthProvider oauthProvider = providerRegistry.getProvider(provider);

        // Exchange code for access token
        String accessToken = oauthProvider.exchangeCodeForToken(code);

        // Get user info using access token
        OAuthUserInfo userInfo = oauthProvider.getUserInfo(accessToken);

        // Delegate to UserService for user login/registration and JWT generation
        AuthResponse authResponse = userService.oauthLogin(userInfo);

        return authResponse;
    }
}
