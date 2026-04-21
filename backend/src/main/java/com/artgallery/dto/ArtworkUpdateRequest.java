package com.artgallery.dto;

import lombok.Data;

import java.util.List;

/**
 * 更新艺术作品请求DTO
 * 
 * @author Art Gallery Team
 */
@Data
public class ArtworkUpdateRequest {

    private String title;
    private String category;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private List<String> tags;
    private String dimensions;
    private String material;
    private Boolean featured;
    private Boolean enabled;
}

