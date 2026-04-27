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
 * GitHub API 客户端
 * 处理 GitHub OAuth API 的 HTTP 调用
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
     * 用授权码换取访问令牌
     * 
     * @param code GitHub 返回的授权码
     * @return 访问令牌
     */
    public String exchangeCodeForToken(String code) {
        log.info("Exchanging code for token from GitHub");
        
        // 准备一个表，把登录需要的参数（client_id、client_secret、code）装进去，等会发给 OAuth 服务器。
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", properties.getClientId());
        params.add("client_secret", properties.getClientSecret());
        params.add("code", code);

        // 发一个 POST 请求，把参数发过去，等服务器返回 token，然后把结果当字符串拿回来
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
     * 从 GitHub 的表单编码响应中提取访问令牌
     * 格式: access_token=xxx&token_type=bearer&scope=...
     * 
     * @param tokenResponse 表单编码的响应体
     * @return 访问令牌
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
     * 从 GitHub 获取用户信息
     * 
     * @param accessToken GitHub 访问令牌
     * @return GitHub 用户信息
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
     * 从 GitHub 获取用户邮箱
     * 
     * @param accessToken GitHub 访问令牌
     * @return 用户邮箱数组
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
