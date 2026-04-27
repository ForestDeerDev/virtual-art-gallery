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
 * GitHub OAuth 提供者实现
 * 使用 Client 层协调 GitHub OAuth 认证流程
 * 
 * @author Art Gallery Team
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GitHubOAuthProvider implements OAuthProvider {

    private final GitHubClient gitHubClient; // GitHub API 客户端
    private final GitHubUserMapper userMapper; // GitHub 用户信息映射器

    @Override
    public String exchangeCodeForToken(String code) throws OAuthException {
        // 使用授权码换取访问令牌
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
        // 使用访问令牌获取用户信息
        try {
            GitHubUser githubUser = gitHubClient.getUserInfo(accessToken);
            
            String email = githubUser.getEmail();
            // 如果用户信息中没有邮箱，则从邮箱列表中获取主邮箱
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
        // 返回 OAuth 提供者名称
        return "github";
    }
}
