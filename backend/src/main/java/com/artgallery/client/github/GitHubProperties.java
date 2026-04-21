package com.artgallery.client.github;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * GitHub API Configuration Properties
 * Maps configuration from application.yml under github.api prefix
 * 
 * @author Art Gallery Team
 */
@Data
@Component
@ConfigurationProperties(prefix = "github.api")
public class GitHubProperties {
    private String clientId;
    private String clientSecret;
    private String tokenUri;
    private String userInfoUri;
    private String emailsApiUrl;
}
