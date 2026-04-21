package com.artgallery.oauth.impl;

import com.artgallery.client.github.GitHubClient;
import com.artgallery.client.github.dto.GitHubEmail;
import com.artgallery.client.github.dto.GitHubUser;
import com.artgallery.mapper.github.GitHubUserMapper;
import com.artgallery.oauth.OAuthException;
import com.artgallery.oauth.OAuthProvider;
import com.artgallery.oauth.OAuthUserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * GitHub OAuth Provider Implementation
 * Orchestrates GitHub OAuth authentication flow using Client layer
 * 
 * @author Art Gallery Team
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GitHubOAuthProvider implements OAuthProvider {

    private final GitHubClient gitHubClient;
    private final GitHubUserMapper userMapper;

    @Override
    public String exchangeCodeForToken(String code) throws OAuthException {
        try {
            return gitHubClient.exchangeCodeForToken(code);
        } catch (Exception e) {
            log.error("Failed to exchange code for token", e);
            throw new OAuthException("TOKEN_EXCHANGE_FAILED", 
                "Failed to exchange code for token: " + e.getMessage(), e);
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(String accessToken) throws OAuthException {
        try {
            GitHubUser githubUser = gitHubClient.getUserInfo(accessToken);
            
            String email = githubUser.getEmail();
            if (email == null || email.isEmpty()) {
                GitHubEmail[] emails = gitHubClient.getUserEmails(accessToken);
                email = userMapper.findPrimaryEmail(emails);
            }
            
            return userMapper.toOAuthUserInfo(githubUser, email);
        } catch (Exception e) {
            log.error("Failed to get user info", e);
            throw new OAuthException("USER_INFO_FAILED", 
                "Failed to get user info: " + e.getMessage(), e);
        }
    }

    @Override
    public String getProviderName() {
        return "github";
    }
}
