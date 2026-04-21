package com.artgallery.oauth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Unified OAuth User Information DTO
 * Standardizes user information across different OAuth providers
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthUserInfo {

    /**
     * OAuth provider name (e.g., "github", "google", "wechat")
     */
    private String provider;

    /**
     * User ID from the OAuth provider
     */
    private String providerUserId;

    /**
     * Username from the OAuth provider
     */
    private String username;

    /**
     * User email from the OAuth provider
     */
    private String email;

    /**
     * User avatar URL from the OAuth provider
     */
    private String avatarUrl;
}
