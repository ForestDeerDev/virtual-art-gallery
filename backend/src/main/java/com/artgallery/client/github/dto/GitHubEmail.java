package com.artgallery.client.github.dto;

import lombok.Data;

/**
 * GitHub Email DTO
 * Represents email information from GitHub API
 * 
 * @author Art Gallery Team
 */
@Data
public class GitHubEmail {
    private String email;
    private boolean verified;
    private boolean primary;
}
