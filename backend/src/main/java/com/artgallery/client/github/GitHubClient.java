package com.artgallery.client.github;

import com.artgallery.client.github.dto.GitHubEmail;
import com.artgallery.client.github.dto.GitHubUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * GitHub API Client
 * Handles HTTP calls to GitHub OAuth API
 * 
 * @author Art Gallery Team
 */
@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings("nullness")
public class GitHubClient {

    private final WebClient webClient;
    private final GitHubProperties properties;

    /**
     * Exchange authorization code for access token
     * 
     * @param code Authorization code from GitHub
     * @return Access token
     */
    public String exchangeCodeForToken(String code) {
        log.info("Exchanging code for token from GitHub");
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", properties.getClientId());
        params.add("client_secret", properties.getClientSecret());
        params.add("code", code);

        String responseBody = webClient.post()
            .uri(properties.getTokenUri())
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue(params)
            .retrieve()
            .bodyToMono(String.class)
            .doOnError(e -> log.error("Failed to exchange code for token", e))
            .block();

        return extractAccessToken(responseBody);
    }

    /**
     * Extract access token from GitHub's form-urlencoded response
     * Format: access_token=xxx&token_type=bearer&scope=...
     * 
     * @param tokenResponse Form-urlencoded response body
     * @return Access token
     */
    private String extractAccessToken(String tokenResponse) {
        if (tokenResponse == null || tokenResponse.isEmpty()) {
            log.error("Empty token response from GitHub");
            return null;
        }

        String[] pairs = tokenResponse.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2 && "access_token".equals(keyValue[0])) {
                return keyValue[1];
            }
        }

        log.error("Cannot extract access token from GitHub response: {}", tokenResponse);
        return null;
    }

    /**
     * Get user information from GitHub
     * 
     * @param accessToken GitHub access token
     * @return GitHub user information
     */
    public GitHubUser getUserInfo(String accessToken) {
        log.info("Fetching user info from GitHub");
        
        return webClient.get()
            .uri(properties.getUserInfoUri())
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(GitHubUser.class)
            .doOnError(e -> log.error("Failed to fetch user info", e))
            .block();
    }

    /**
     * Get user emails from GitHub
     * 
     * @param accessToken GitHub access token
     * @return Array of user emails
     */
    public GitHubEmail[] getUserEmails(String accessToken) {
        log.info("Fetching user emails from GitHub");
        
        return webClient.get()
            .uri(properties.getEmailsApiUrl())
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(GitHubEmail[].class)
            .doOnError(e -> log.error("Failed to fetch user emails", e))
            .block();
    }
}
