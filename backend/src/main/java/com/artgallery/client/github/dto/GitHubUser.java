package com.artgallery.client.github.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * GitHub User DTO
 * Represents user information from GitHub API
 * 
 * @author Art Gallery Team
 */
@Data
public class GitHubUser {
    private Long id;
    private String login;
    private String email;
    
    @JsonProperty("avatar_url")
    private String avatarUrl;
}
