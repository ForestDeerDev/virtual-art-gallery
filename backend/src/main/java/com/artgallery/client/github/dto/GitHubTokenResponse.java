package com.artgallery.client.github.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * GitHub Token Response DTO
 * Represents token exchange response from GitHub API
 * 
 * @author Art Gallery Team
 */
@Data
public class GitHubTokenResponse {
    @JsonProperty("access_token")
    private String accessToken;
    
    @JsonProperty("token_type")
    private String tokenType;
    
    @JsonProperty("scope")
    private String scope;
}
