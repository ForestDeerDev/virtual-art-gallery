package com.artgallery.oauth;

/**
 * OAuth Provider Interface
 * Defines standard OAuth capabilities for third-party login providers
 * 
 * Strategy Pattern: Each OAuth provider implements this interface
 * 
 * @author Art Gallery Team
 */
public interface OAuthProvider {

    /**
     * Exchange authorization code for access token
     * 
     * @param code Authorization code from OAuth provider
     * @return Access token string
     * @throws OAuthException if token exchange fails
     */
    String exchangeCodeForToken(String code) throws OAuthException;

    /**
     * Get user information using access token
     * 
     * @param accessToken Access token from OAuth provider
     * @return OAuth user information
     * @throws OAuthException if user info retrieval fails
     */
    OAuthUserInfo getUserInfo(String accessToken) throws OAuthException;

    /**
     * Get provider name (e.g., "github", "google", "wechat")
     * 
     * @return Provider name
     */
    String getProviderName();
}
