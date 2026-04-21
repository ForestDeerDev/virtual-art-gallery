package com.artgallery.mapper.github;

import com.artgallery.client.github.dto.GitHubEmail;
import com.artgallery.client.github.dto.GitHubUser;
import com.artgallery.oauth.OAuthUserInfo;
import org.springframework.stereotype.Component;

/**
 * GitHub User Mapper
 * Handles data transformation between GitHub DTOs and OAuthUserInfo
 * 
 * @author Art Gallery Team
 */
@Component
public class GitHubUserMapper {

    /**
     * Convert GitHub user data to unified OAuthUserInfo
     * 
     * @param githubUser GitHub user data
     * @param email User email (may be from separate email API call)
     * @return Unified OAuth user information
     */
    public OAuthUserInfo toOAuthUserInfo(GitHubUser githubUser, String email) {
        OAuthUserInfo userInfo = new OAuthUserInfo();
        userInfo.setProvider("github");
        userInfo.setProviderUserId(String.valueOf(githubUser.getId()));
        userInfo.setUsername(githubUser.getLogin());
        userInfo.setEmail(email);
        userInfo.setAvatarUrl(githubUser.getAvatarUrl());
        return userInfo;
    }

    /**
     * Find primary email from GitHub email list
     * Priority: primary & verified > verified > first email
     * 
     * @param emails Array of GitHub emails
     * @return Best available email, or null if no emails
     */
    public String findPrimaryEmail(GitHubEmail[] emails) {
        if (emails == null || emails.length == 0) {
            return null;
        }
        
        // First, try to find primary and verified email
        for (GitHubEmail email : emails) {
            if (email.isPrimary() && email.isVerified()) {
                return email.getEmail();
            }
        }
        
        // Second, try to find any verified email
        for (GitHubEmail email : emails) {
            if (email.isVerified()) {
                return email.getEmail();
            }
        }
        
        // Fallback to first email
        return emails[0].getEmail();
    }
}
